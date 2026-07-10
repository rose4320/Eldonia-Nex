"""Supabase Auth ユーザーと Django User の同期"""

from __future__ import annotations

import re
import uuid
from typing import Any

from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction

USERNAME_MAX_LENGTH = 150
USERNAME_PATTERN = re.compile(r"[^a-z0-9_]+")


def normalize_username(raw: str | None, *, fallback: str) -> str:
    candidate = (raw or fallback or "user").strip().lower()
    candidate = USERNAME_PATTERN.sub("_", candidate).strip("_")
    if not candidate:
        candidate = "user"
    return candidate[:USERNAME_MAX_LENGTH]


def unique_username(base: str) -> str:
    User = get_user_model()
    if not User.objects.filter(username=base).exists():
        return base

    for index in range(2, 1000):
        suffix = f"_{index}"
        trimmed = base[: USERNAME_MAX_LENGTH - len(suffix)]
        candidate = f"{trimmed}{suffix}"
        if not User.objects.filter(username=candidate).exists():
            return candidate

    return f"user_{uuid.uuid4().hex[:8]}"


def _parse_supabase_uuid(value: str | None) -> uuid.UUID | None:
    if not value:
        return None
    try:
        return uuid.UUID(str(value))
    except (TypeError, ValueError):
        return None


def _find_existing_user(
    User: Any,
    *,
    supabase_user_id: str,
    email: str,
) -> Any | None:
    parsed_id = _parse_supabase_uuid(supabase_user_id)
    if parsed_id:
        by_external = User.objects.filter(external_id=parsed_id).first()
        if by_external:
            return by_external

    if email:
        return User.objects.filter(email__iexact=email).first()

    return None


@transaction.atomic
def sync_supabase_user(
    *,
    supabase_user_id: str,
    email: str,
    username: str | None = None,
    display_name: str | None = None,
    phone: str | None = None,
    subscription_plan: str | None = None,
    referral_code_used: str | None = None,
    is_email_verified: bool = False,
) -> tuple[Any, bool]:
    """Supabase ユーザーを Django User に upsert する。戻り値は (user, created)。"""
    User = get_user_model()

    normalized_email = (email or "").strip().lower()
    if not supabase_user_id or not normalized_email:
        raise ValueError("supabase_user_id and email are required")

    parsed_id = _parse_supabase_uuid(supabase_user_id)
    if not parsed_id:
        raise ValueError("supabase_user_id must be a valid UUID")

    desired_username = normalize_username(
        username,
        fallback=normalized_email.split("@")[0],
    )
    user = _find_existing_user(
        User,
        supabase_user_id=supabase_user_id,
        email=normalized_email,
    )
    created = user is None

    if created:
        username_to_use = unique_username(desired_username)
        user = User(username=username_to_use, email=normalized_email)
        user.set_unusable_password()
    elif user.username != desired_username and not User.objects.filter(
        username=desired_username
    ).exclude(pk=user.pk).exists():
        user.username = desired_username

    user.external_id = parsed_id
    user.email = normalized_email
    if display_name is not None:
        user.display_name = display_name.strip()
    if phone is not None:
        user.phone_number = phone.strip()
    if subscription_plan:
        plan = subscription_plan.strip().lower() or "free"
        if plan == "pro":
            plan = "premium"
        user.subscription_plan = plan
    user.is_email_verified = bool(is_email_verified)
    if referral_code_used and not user.referral_code_used:
        user.referral_code_used = referral_code_used.strip()

    try:
        user.save()
    except IntegrityError:
        user.username = unique_username(user.username)
        user.save()

    return user, created
