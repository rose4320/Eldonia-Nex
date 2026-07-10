"""Django Plan ↔ Supabase subscription_plans 双方向同期。

方針:
- 新しいデータ（updated_at / synced_at / version）を優先
- 上書きされる側の旧定義は subscription_plan_archives に格納（物理削除しない）
"""

from __future__ import annotations

import os
from datetime import datetime, timezone
from decimal import Decimal
from typing import Any

import requests
from django.db import transaction
from django.utils.dateparse import parse_datetime

from users.models import Plan
from users.plan_catalog import LP_PLAN_CATALOG, plan_defaults, plan_features_payload


class PlanSyncError(Exception):
    pass


def _supabase_config() -> tuple[str, str]:
    url = (
        os.getenv("NEXT_PUBLIC_SUPABASE_URL")
        or os.getenv("SUPABASE_URL")
        or ""
    ).rstrip("/")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_SECRET_KEY") or ""
    if not url or not key:
        raise PlanSyncError(
            "Supabase が未設定です。NEXT_PUBLIC_SUPABASE_URL と "
            "SUPABASE_SERVICE_ROLE_KEY を設定してください。"
        )
    return url, key


def _headers(key: str) -> dict[str, str]:
    return {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }


def _aware(dt: datetime | None) -> datetime:
    if dt is None:
        return datetime.min.replace(tzinfo=timezone.utc)
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def _parse_ts(value: str | None) -> datetime:
    if not value:
        return datetime.min.replace(tzinfo=timezone.utc)
    parsed = parse_datetime(value)
    return _aware(parsed)


def _django_snapshot(plan: Plan) -> dict[str, Any]:
    return {
        "slug": plan.slug,
        "name": plan.name,
        "price": str(plan.price),
        "currency": plan.currency,
        "billing_cycle": plan.billing_cycle,
        "features": plan.features,
        "trial_days": plan.trial_days,
        "is_active": plan.is_active,
        "sort_order": plan.sort_order,
        "source": "django",
    }


def _supabase_row_from_plan(plan: Plan, *, version: int, source: str) -> dict[str, Any]:
    features = plan.features if isinstance(plan.features, dict) else {}
    shop_fee = features.get("shop_fee_percent")
    return {
        "slug": plan.slug,
        "name": plan.name,
        "price_yen": int(plan.price),
        "currency": plan.currency or "JPY",
        "billing_cycle": plan.billing_cycle or "monthly",
        "shop_fee_percent": shop_fee,
        "features": features or {},
        "trial_days": plan.trial_days or 0,
        "is_active": bool(plan.is_active),
        "sort_order": plan.sort_order or 0,
        "version": version,
        "source": source,
        "synced_at": datetime.now(timezone.utc).isoformat(),
    }


def _ensure_django_catalog() -> None:
    """カタログに無い slug だけ作成。既存 Plan の料金は上書きしない（Admin 変更を守る）。"""
    for slot in LP_PLAN_CATALOG:
        Plan.objects.get_or_create(slug=slot["slug"], defaults=plan_defaults(slot))
    Plan.objects.filter(slug="pro").update(is_active=False)


def _archive_supabase_plan(url: str, key: str, row: dict[str, Any], reason: str) -> None:
    slug = row["slug"]
    version = int(row.get("version") or 1)
    payload = {
        "slug": slug,
        "version": version,
        "snapshot": row,
        "archived_reason": reason,
        "archived_by": "django_plan_sync",
    }
    response = requests.post(
        f"{url}/rest/v1/subscription_plan_archives",
        headers={**_headers(key), "Prefer": "resolution=ignore-duplicates,return=minimal"},
        json=payload,
        timeout=30,
    )
    if response.status_code not in (200, 201, 409):
        # unique conflict is fine (already archived)
        if response.status_code != 409:
            raise PlanSyncError(
                f"archive failed: {response.status_code} {response.text[:200]}"
            )


def _fetch_supabase_plans(url: str, key: str) -> list[dict[str, Any]]:
    response = requests.get(
        f"{url}/rest/v1/subscription_plans",
        headers=_headers(key),
        params={"select": "*", "order": "sort_order.asc"},
        timeout=30,
    )
    if not response.ok:
        raise PlanSyncError(
            f"fetch subscription_plans failed: {response.status_code} {response.text[:200]}"
        )
    return response.json()


def _upsert_supabase_plan(url: str, key: str, row: dict[str, Any]) -> None:
    response = requests.post(
        f"{url}/rest/v1/subscription_plans",
        headers={
            **_headers(key),
            "Prefer": "resolution=merge-duplicates,return=minimal",
        },
        json=row,
        timeout=30,
    )
    if not response.ok:
        raise PlanSyncError(
            f"upsert subscription_plans failed: {response.status_code} {response.text[:200]}"
        )


@transaction.atomic
def sync_plans_bidirectional(*, prefer: str = "newest") -> dict[str, Any]:
    """Django ↔ Supabase を双方向同期。prefer=newest で新しい側を採用。"""
    _ensure_django_catalog()
    url, key = _supabase_config()

    django_plans = {p.slug: p for p in Plan.objects.exclude(slug="pro")}
    supabase_rows = {r["slug"]: r for r in _fetch_supabase_plans(url, key)}

    pushed = 0
    pulled = 0
    archived = 0

    all_slugs = set(django_plans) | set(supabase_rows) | {s["slug"] for s in LP_PLAN_CATALOG}

    for slug in sorted(all_slugs):
        d_plan = django_plans.get(slug)
        s_row = supabase_rows.get(slug)

        if d_plan and not s_row:
            _upsert_supabase_plan(
                url,
                key,
                _supabase_row_from_plan(d_plan, version=1, source="django"),
            )
            pushed += 1
            continue

        if s_row and not d_plan:
            Plan.objects.update_or_create(
                slug=slug,
                defaults={
                    "name": s_row.get("name") or slug.title(),
                    "price": Decimal(s_row.get("price_yen") or 0),
                    "currency": s_row.get("currency") or "JPY",
                    "billing_cycle": s_row.get("billing_cycle") or "monthly",
                    "features": s_row.get("features") or {},
                    "trial_days": int(s_row.get("trial_days") or 0),
                    "is_active": bool(s_row.get("is_active", True)),
                    "sort_order": int(s_row.get("sort_order") or 0),
                },
            )
            pulled += 1
            continue

        if not d_plan or not s_row:
            continue

        d_ts = _aware(getattr(d_plan, "updated_at", None) or getattr(d_plan, "created_at", None))
        s_ts = _parse_ts(s_row.get("synced_at") or s_row.get("updated_at"))
        s_version = int(s_row.get("version") or 1)

        django_newer = d_ts >= s_ts if prefer == "newest" else True

        if django_newer:
            _archive_supabase_plan(url, key, s_row, "superseded_by_django")
            archived += 1
            _upsert_supabase_plan(
                url,
                key,
                _supabase_row_from_plan(d_plan, version=s_version + 1, source="django"),
            )
            pushed += 1
        else:
            # Supabase newer → archive conceptually by bumping django from remote
            # Keep previous django features by writing into features._previous if present
            previous = _django_snapshot(d_plan)
            features = s_row.get("features") or {}
            if isinstance(features, dict):
                features = {**features, "_archived_django": previous}
            d_plan.name = s_row.get("name") or d_plan.name
            d_plan.price = Decimal(s_row.get("price_yen") or 0)
            d_plan.currency = s_row.get("currency") or "JPY"
            d_plan.billing_cycle = s_row.get("billing_cycle") or "monthly"
            d_plan.features = features
            d_plan.trial_days = int(s_row.get("trial_days") or 0)
            d_plan.is_active = bool(s_row.get("is_active", True))
            d_plan.sort_order = int(s_row.get("sort_order") or 0)
            d_plan.save()
            pulled += 1

    return {
        "ok": True,
        "pushed": pushed,
        "pulled": pulled,
        "archived": archived,
        "slugs": sorted(all_slugs),
    }


def push_django_plans_to_supabase() -> dict[str, Any]:
    """Django を正として Supabase へ押し出し（旧は archive）。"""
    _ensure_django_catalog()
    url, key = _supabase_config()
    existing = {r["slug"]: r for r in _fetch_supabase_plans(url, key)}
    archived = 0
    pushed = 0
    for plan in Plan.objects.exclude(slug="pro").filter(is_active=True):
        prev = existing.get(plan.slug)
        version = 1
        if prev:
            _archive_supabase_plan(url, key, prev, "superseded_by_django_push")
            archived += 1
            version = int(prev.get("version") or 1) + 1
        _upsert_supabase_plan(
            url, key, _supabase_row_from_plan(plan, version=version, source="django")
        )
        pushed += 1
    return {"ok": True, "pushed": pushed, "archived": archived}
