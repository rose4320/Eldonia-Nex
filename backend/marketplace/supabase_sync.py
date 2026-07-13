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


def _normalize_subscription_plan(raw: str | None) -> str:
    plan = (raw or "free").strip().lower() or "free"
    if plan == "pro":
        return "premium"
    return plan


def _refresh_user_from_profile(user: Any, profile: dict[str, Any]) -> bool:
    """既存 Django User に Supabase profile の内容を反映する。"""
    changed = False
    profile_id = _parse_uuid(profile.get("id"))
    if profile_id and user.external_id != profile_id:
        user.external_id = profile_id
        changed = True

    display_name = (profile.get("display_name") or "").strip()
    if display_name and user.display_name != display_name:
        user.display_name = display_name
        changed = True

    avatar_url = (profile.get("avatar_url") or "").strip()
    if avatar_url and getattr(user, "avatar_url", None) != avatar_url:
        user.avatar_url = avatar_url
        changed = True

    plan = _normalize_subscription_plan(profile.get("subscription_plan"))
    if plan and user.subscription_plan != plan:
        user.subscription_plan = plan
        changed = True

    username = (profile.get("username") or "").strip()
    if username and user.username != username:
        User = get_user_model()
        if not User.objects.filter(username__iexact=username).exclude(pk=user.pk).exists():
            user.username = username
            changed = True

    if changed:
        user.save(update_fields=None)
    return changed


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
        subscription_plan=_normalize_subscription_plan(profile.get("subscription_plan")),
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
            "gallery_category": (row.get("category") or "")[:30],
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
    unchanged = 0
    for profile in profiles:
        user = _resolve_django_user(profile)
        if user:
            if _refresh_user_from_profile(user, profile):
                updated += 1
            else:
                unchanged += 1
            continue
        if _ensure_user_from_profile(profile):
            created += 1
    return {
        "profiles": len(profiles),
        "created": created,
        "updated": updated,
        "unchanged": unchanged,
    }


def set_supabase_artwork_visibility(supabase_id: uuid.UUID, is_public: bool) -> None:
    """Supabase public.artworks.is_public を更新する（GALLERY 反映用）。"""
    url, key = _supabase_config()
    response = requests.patch(
        f"{url}/rest/v1/artworks",
        headers={**_headers(key), "Prefer": "return=representation"},
        params={"id": f"eq.{supabase_id}"},
        json={"is_public": is_public},
        timeout=30,
    )
    if not response.ok:
        raise SupabaseSyncError(
            f"Supabase artwork visibility update failed: "
            f"{response.status_code} {response.text[:300]}"
        )

    rows = response.json()
    if not isinstance(rows, list) or len(rows) == 0:
        raise SupabaseSyncError(
            f"Supabase に作品 {supabase_id} がありません。"
            "Django Admin の「Supabase カタログ同期」を実行してから再度お試しください。"
        )


def set_supabase_artworks_visibility(
    supabase_ids: list[uuid.UUID],
    is_public: bool,
) -> tuple[int, list[str]]:
    """複数作品の公開状態を Supabase に反映する。成功件数とエラー文言を返す。"""
    synced = 0
    errors: list[str] = []
    for supabase_id in supabase_ids:
        try:
            set_supabase_artwork_visibility(supabase_id, is_public)
            synced += 1
        except SupabaseSyncError as exc:
            errors.append(f"{supabase_id}: {exc}")
    return synced, errors


def find_supabase_artwork_id_by_title(title: str) -> uuid.UUID | None:
    """Supabase artworks をタイトル完全一致で検索（Django 側 supabase_id 欠落時の救済）。"""
    normalized = title.strip()
    if not normalized:
        return None

    url, key = _supabase_config()
    response = requests.get(
        f"{url}/rest/v1/artworks",
        headers=_headers(key),
        params={
            "select": "id",
            "title": f"eq.{normalized}",
            "limit": "1",
        },
        timeout=30,
    )
    if not response.ok:
        return None

    rows = response.json()
    if not isinstance(rows, list) or not rows:
        return None

    return _parse_uuid(rows[0].get("id"))


def hide_supabase_artworks_by_title_prefix(prefix: str) -> int:
    """タイトル prefix に一致する Supabase 作品を一括非公開（verify テスト作品向け）。"""
    url, key = _supabase_config()
    response = requests.patch(
        f"{url}/rest/v1/artworks",
        headers={**_headers(key), "Prefer": "return=representation"},
        params={"title": f"ilike.{prefix}"},
        json={"is_public": False},
        timeout=30,
    )
    if not response.ok:
        raise SupabaseSyncError(
            f"Supabase bulk hide failed: {response.status_code} {response.text[:300]}"
        )

    rows = response.json()
    return len(rows) if isinstance(rows, list) else 0


def resolve_artwork_supabase_ids(queryset) -> tuple[list[uuid.UUID], int, int]:
    """
    Django Artwork から Supabase ID を解決する。
    戻り値: (supabase_ids, title で補完した件数, 未解決件数)
    """
    supabase_ids: list[uuid.UUID] = []
    resolved_from_title = 0
    still_missing = 0

    for artwork in queryset:
        if artwork.supabase_id:
            supabase_ids.append(artwork.supabase_id)
            continue

        found = find_supabase_artwork_id_by_title(artwork.title)
        if not found:
            still_missing += 1
            continue

        artwork.supabase_id = found
        artwork.save(update_fields=["supabase_id"])
        supabase_ids.append(found)
        resolved_from_title += 1

    return supabase_ids, resolved_from_title, still_missing


def _parse_supabase_datetime(value: str | None):
    from django.utils.dateparse import parse_datetime

    if not value:
        return None
    parsed = parse_datetime(str(value).replace("Z", "+00:00"))
    if parsed is None:
        raise SupabaseSyncError(f"Invalid datetime from Supabase: {value!r}")
    return parsed


def _shop_product_defaults(row: dict[str, Any], seller: Any | None) -> dict[str, Any]:
    seller_uuid = _parse_uuid(row.get("seller_id"))
    created_at = _parse_supabase_datetime(row.get("created_at"))
    updated_at = _parse_supabase_datetime(row.get("updated_at"))
    if created_at is None or updated_at is None:
        raise SupabaseSyncError("shop_products row missing created_at/updated_at")

    return {
        "seller": seller,
        "seller_external_id": seller_uuid,
        "title": (row.get("title") or "").strip() or "Untitled",
        "description": (row.get("description") or "").strip(),
        "category": (row.get("category") or "goods").strip() or "goods",
        "product_type": (row.get("product_type") or "physical").strip() or "physical",
        "price": int(row.get("price") or 0),
        "compare_at_price": row.get("compare_at_price"),
        "image_url": (row.get("image_url") or "").strip(),
        "download_url": (row.get("download_url") or "").strip(),
        "source_artwork_id": _parse_uuid(row.get("source_artwork_id")),
        "gallery_urls": row.get("gallery_urls") or [],
        "tags": row.get("tags") or [],
        "rating": row.get("rating") or 0,
        "review_count": int(row.get("review_count") or 0),
        "stock_quantity": row.get("stock_quantity"),
        "is_nexus_prime": bool(row.get("is_nexus_prime")),
        "is_nexus_choice": bool(row.get("is_nexus_choice")),
        "is_bestseller": bool(row.get("is_bestseller")),
        "is_active": bool(row.get("is_active", True)),
        "created_at": created_at,
        "updated_at": updated_at,
    }


@transaction.atomic
def sync_supabase_shop_products(*, seller_id: str | None = None) -> dict[str, int]:
    """Supabase shop_products → Django ShopProduct に upsert する。"""
    from marketplace.models import ShopProduct

    url, key = _supabase_config()
    select = (
        "id,seller_id,title,description,category,product_type,price,compare_at_price,"
        "image_url,download_url,source_artwork_id,gallery_urls,tags,rating,review_count,"
        "stock_quantity,is_nexus_prime,is_nexus_choice,is_bestseller,is_active,"
        "created_at,updated_at,"
        "profiles:seller_id(username,display_name,avatar_url,subscription_plan)"
    )
    params_extra: dict[str, str] = {}
    if seller_id:
        params_extra["seller_id"] = f"eq.{seller_id}"

    rows: list[dict[str, Any]] = []
    offset = 0
    page_size = 200
    while True:
        response = requests.get(
            f"{url}/rest/v1/shop_products",
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
                f"Supabase shop_products fetch failed: {response.status_code} {response.text[:300]}"
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
        if not supabase_id:
            skipped_count += 1
            continue

        seller_uuid = _parse_uuid(row.get("seller_id"))
        seller = None
        if seller_uuid:
            profile = row.get("profiles") or {
                "id": str(seller_uuid),
                "username": None,
                "display_name": None,
                "avatar_url": None,
                "subscription_plan": "free",
            }
            profile["id"] = str(seller_uuid)
            seller = _ensure_user_from_profile(profile)

        try:
            defaults = _shop_product_defaults(row, seller)
        except SupabaseSyncError:
            skipped_count += 1
            continue

        _obj, created = ShopProduct.objects.update_or_create(
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


def set_supabase_shop_product_active(supabase_id: uuid.UUID, is_active: bool) -> None:
    """Supabase public.shop_products.is_active を更新する（Shop FE 反映用）。"""
    url, key = _supabase_config()
    response = requests.patch(
        f"{url}/rest/v1/shop_products",
        headers={**_headers(key), "Prefer": "return=representation"},
        params={"id": f"eq.{supabase_id}"},
        json={"is_active": is_active},
        timeout=30,
    )
    if not response.ok:
        raise SupabaseSyncError(
            f"Supabase shop product visibility update failed: "
            f"{response.status_code} {response.text[:300]}"
        )

    rows = response.json()
    if not isinstance(rows, list) or len(rows) == 0:
        raise SupabaseSyncError(
            f"Supabase に商品 {supabase_id} がありません。"
            "「Supabase カタログ同期」を実行してから再度お試しください。"
        )


def set_supabase_shop_products_active(
    supabase_ids: list[uuid.UUID],
    is_active: bool,
) -> tuple[int, list[str]]:
    """複数商品の公開状態を Supabase に反映する。"""
    synced = 0
    errors: list[str] = []
    for supabase_id in supabase_ids:
        try:
            set_supabase_shop_product_active(supabase_id, is_active)
            synced += 1
        except SupabaseSyncError as exc:
            errors.append(f"{supabase_id}: {exc}")
    return synced, errors
