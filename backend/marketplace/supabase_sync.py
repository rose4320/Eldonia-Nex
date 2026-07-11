"""Supabase public テーブル → Django モデル同期（GALLERY 作品など）"""

from __future__ import annotations

import os
import uuid
from typing import Any

import requests
from django.contrib.auth import get_user_model
from django.db import transaction

from marketplace.models import Artwork
from users.sync_service import sync_supabase_user


class SupabaseSyncError(Exception):
    pass


def _supabase_config() -> tuple[str, str]:
    url = (
        os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        or os.getenv("SUPABASE_URL")
        or ""
    ).rstrip("/")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_SECRET_KEY") or ""
    if not url or not key:
        raise SupabaseSyncError(
            "Supabase が未設定です。ルート .env / .env.local に "
            "NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください。"
        )
    return url, key


def _headers(key: str) -> dict[str, str]:
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }


def _fetch_paginated(url: str, key: str, path: str, *, select: str) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    offset = 0
    page_size = 200
    while True:
        response = requests.get(
            f"{url}/rest/v1/{path}",
            headers=_headers(key),
            params={
                "select": select,
                "order": "created_at.asc",
                "offset": str(offset),
                "limit": str(page_size),
            },
            timeout=30,
        )
        if not response.ok:
            raise SupabaseSyncError(
                f"Supabase {path} fetch failed: {response.status_code} {response.text[:200]}"
            )
        batch = response.json()
        if not batch:
            break
        rows.extend(batch)
        if len(batch) < page_size:
            break
        offset += page_size
    return rows


def _parse_uuid(value: str | None) -> uuid.UUID | None:
    if not value:
        return None
    try:
        return uuid.UUID(str(value))
    except (TypeError, ValueError):
        return None


def _resolve_django_user(profile: dict[str, Any]) -> Any | None:
    User = get_user_model()
    profile_id = _parse_uuid(profile.get("id"))
    if profile_id:
        by_external = User.objects.filter(external_id=profile_id).first()
        if by_external:
            return by_external

    email = (profile.get("email") or "").strip()
    if email:
        by_email = User.objects.filter(email__iexact=email).first()
        if by_email:
            return by_email

    # profiles テーブルに email が無い場合は auth.users 経由ではなく username のみで照合
    username = (profile.get("username") or "").strip()
    if username:
        return User.objects.filter(username__iexact=username).first()

    return None


def _ensure_user_from_profile(profile: dict[str, Any]) -> Any | None:
    profile_id = str(profile.get("id") or "").strip()
    if not profile_id:
        return None

    existing = _resolve_django_user(profile)
    if existing:
        return existing

    # auth.users の email は profiles に無いため、仮メールで upsert
    username = (profile.get("username") or "user").strip()
    email = f"{username}+{profile_id[:8]}@supabase.local"
    user, _created = sync_supabase_user(
        supabase_user_id=profile_id,
        email=email,
        username=username,
        display_name=profile.get("display_name"),
        subscription_plan=profile.get("subscription_plan") or "free",
        is_email_verified=True,
    )
    return user


@transaction.atomic
def sync_supabase_artworks(*, creator_id: str | None = None) -> dict[str, int]:
    """Supabase artworks → Django Artwork に upsert する。"""
    url, key = _supabase_config()
    select = (
        "id,creator_id,title,description,media_type,media_url,thumbnail_url,"
        "category,tags,is_public,view_count,created_at,updated_at,"
        "profiles:creator_id(username,display_name,avatar_url,subscription_plan)"
    )
    params_extra: dict[str, str] = {}
    if creator_id:
        params_extra["creator_id"] = f"eq.{creator_id}"

    rows: list[dict[str, Any]] = []
    offset = 0
    page_size = 200
    while True:
        response = requests.get(
            f"{url}/rest/v1/artworks",
            headers=_headers(key),
            params={
                "select": select,
                "order": "created_at.asc",
                "offset": str(offset),
                "limit": str(page_size),
                **params_extra,
            },
            timeout=30,
        )
        if not response.ok:
            raise SupabaseSyncError(
                f"Supabase artworks fetch failed: {response.status_code} {response.text[:300]}"
            )
        batch = response.json()
        if not batch:
            break
        rows.extend(batch)
        if len(batch) < page_size:
            break
        offset += page_size

    created_count = 0
    updated_count = 0
    skipped_count = 0

    for row in rows:
        supabase_id = _parse_uuid(row.get("id"))
        creator_uuid = _parse_uuid(row.get("creator_id"))
        if not supabase_id or not creator_uuid:
            skipped_count += 1
            continue

        profile = row.get("profiles") or {
            "id": str(creator_uuid),
            "username": None,
            "display_name": None,
            "avatar_url": None,
            "subscription_plan": "free",
        }
        profile["id"] = str(creator_uuid)
        creator = _ensure_user_from_profile(profile)
        if not creator:
            skipped_count += 1
            continue

        defaults = {
            "creator": creator,
            "creator_external_id": creator_uuid,
            "creator_display_name": (
                profile.get("display_name")
                or profile.get("username")
                or creator.display_name
                or creator.username
            ),
            "creator_avatar_url": profile.get("avatar_url") or getattr(creator, "avatar_url", "") or "",
            "title": (row.get("title") or "Untitled")[:255],
            "description": row.get("description") or "",
            "file_url": row.get("media_url") or "",
            "thumbnail_url": row.get("thumbnail_url") or "",
            "file_type": row.get("media_type") or "",
            "view_count": int(row.get("view_count") or 0),
            "status": "published" if row.get("is_public", True) else "draft",
            "is_free": True,
            "price": 0,
        }

        if not defaults["file_url"]:
            skipped_count += 1
            continue

        artwork, created = Artwork.objects.update_or_create(
            supabase_id=supabase_id,
            defaults=defaults,
        )
        if created:
            created_count += 1
        else:
            updated_count += 1

    return {
        "fetched": len(rows),
        "created": created_count,
        "updated": updated_count,
        "skipped": skipped_count,
    }


def sync_supabase_profiles() -> dict[str, int]:
    """Supabase profiles → Django User に upsert（作品同期の前処理用）。"""
    url, key = _supabase_config()
    profiles = _fetch_paginated(
        url,
        key,
        "profiles",
        select="id,username,display_name,avatar_url,subscription_plan",
    )
    created = 0
    updated = 0
    for profile in profiles:
        user = _resolve_django_user(profile)
        if user:
            updated += 1
            continue
        if _ensure_user_from_profile(profile):
            created += 1
    return {"profiles": len(profiles), "created": created, "updated": updated}
