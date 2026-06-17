from __future__ import annotations

import hashlib
import string
from datetime import timedelta
from decimal import Decimal
from typing import Any

from django.db import IntegrityError
from django.utils import timezone

from .models import Referral

FREE_PLAN_SLUG = "free"
JAPAN_COUNTRY_CODES = {"JP", "JPN", "JAPAN", "日本"}
JAPAN_REBATE_PERCENT = Decimal("10")
GLOBAL_REBATE_PERCENT = Decimal("15")
REFERRAL_REWARD_DELAY_DAYS = 90
MAX_REFERRAL_CODE_ATTEMPTS = 8


def is_paid_member(user: Any) -> bool:
    plan = (getattr(user, "subscription_plan", None) or getattr(user, "subscription", "") or "").strip().lower()
    return bool(plan) and plan != FREE_PLAN_SLUG


def country_rebate_percent(country_code: str | None) -> Decimal:
    normalized = (country_code or "").strip().upper()
    if normalized in JAPAN_COUNTRY_CODES:
        return JAPAN_REBATE_PERCENT
    return GLOBAL_REBATE_PERCENT


def reward_available_at(joined_at) -> Any:
    base = joined_at or timezone.now()
    return base + timedelta(days=REFERRAL_REWARD_DELAY_DAYS)


def generate_referral_code(user: Any, *, attempt: int = 0) -> str:
    seed = f"{user.pk}:{getattr(user, 'external_id', '')}:{getattr(user, 'email', '')}:{attempt}"
    digest = hashlib.sha256(seed.encode("utf-8")).hexdigest().upper()
    alphabet = string.ascii_uppercase + string.digits
    code = "".join(alphabet[int(digest[i : i + 2], 16) % len(alphabet)] for i in range(0, 16, 2))
    return f"ENX-{code}"


def ensure_referral_code(user: Any, *, country_code: str | None = None) -> Referral | None:
    if not is_paid_member(user):
        return None

    defaults = {
        "status": "active",
        "country_code": (country_code or "").upper() or None,
        "rebate_percent": country_rebate_percent(country_code),
        "reward_available_at": reward_available_at(getattr(user, "date_joined", None)),
    }
    existing = Referral.objects.filter(referrer=user, referred_user__isnull=True).first()
    if existing:
        for field, value in defaults.items():
            setattr(existing, field, value)
        existing.save(update_fields=list(defaults))
        return existing

    for attempt in range(MAX_REFERRAL_CODE_ATTEMPTS):
        code = generate_referral_code(user, attempt=attempt)
        if Referral.objects.filter(referral_code=code).exists():
            continue
        try:
            return Referral.objects.create(referrer=user, referral_code=code, **defaults)
        except IntegrityError:
            continue

    raise IntegrityError("Could not generate a unique referral code.")


def attach_referral_code(referred_user: Any, referral_code: str, *, country_code: str | None = None) -> Referral | None:
    referral = Referral.objects.filter(referral_code=referral_code, status="active").first()
    if not referral or referral.referrer_id == referred_user.pk:
        return None

    referred_user.referred_by_user = referral.referrer
    referred_user.referral_code_used = referral.referral_code
    referred_user.save(update_fields=["referred_by_user", "referral_code_used"])

    if referral.referred_user_id is None:
        referral.referred_user = referred_user
        referral.country_code = (country_code or "").upper() or referral.country_code
        referral.rebate_percent = country_rebate_percent(country_code or referral.country_code)
        referral.reward_available_at = reward_available_at(getattr(referred_user, "date_joined", None))
        referral.save(
            update_fields=[
                "referred_user",
                "country_code",
                "rebate_percent",
                "reward_available_at",
            ]
        )

    return referral
