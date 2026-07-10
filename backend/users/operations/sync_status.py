"""プラン同期・ヘルス状態を Admin ダッシュボード向けに集約する。"""

from __future__ import annotations

import os
from datetime import datetime, timezone
from typing import Any

import requests

from users.models import OpsSetting, Plan
from users.plan_catalog import LP_PLAN_CATALOG


def frontend_base_url() -> str:
    return (
        os.getenv("FRONTEND_URL")
        or os.getenv("NEXT_PUBLIC_SITE_URL")
        or "http://localhost:3000"
    ).rstrip("/")


def _record_sync_meta(*, ok: bool, message: str, result: dict[str, Any] | None = None) -> None:
    now = datetime.now(timezone.utc).isoformat()
    OpsSetting.objects.update_or_create(
        key="plan_sync_last_at",
        defaults={"value": now, "label": "プラン最終同期時刻", "category": "sync"},
    )
    OpsSetting.objects.update_or_create(
        key="plan_sync_last_ok",
        defaults={
            "value": "1" if ok else "0",
            "label": "プラン最終同期成功",
            "category": "sync",
        },
    )
    OpsSetting.objects.update_or_create(
        key="plan_sync_last_message",
        defaults={
            "value": (message or "")[:250],
            "label": "プラン最終同期メッセージ",
            "category": "sync",
        },
    )
    if result is not None:
        summary = (
            f"push={result.get('pushed', 0)},"
            f"archive={result.get('archived', 0)},"
            f"pulled={result.get('pulled', 0)}"
        )
        OpsSetting.objects.update_or_create(
            key="plan_sync_last_summary",
            defaults={
                "value": summary[:250],
                "label": "プラン最終同期サマリー",
                "category": "sync",
            },
        )


def get_plan_sync_status() -> dict[str, Any]:
    """Django Plan と Supabase subscription_plans の照合ステータス。"""
    from users.plan_sync import PlanSyncError, _fetch_supabase_plans, _supabase_config

    django_plans = list(
        Plan.objects.exclude(slug="pro").filter(is_active=True).order_by("sort_order", "slug")
    )
    catalog_slugs = {s["slug"] for s in LP_PLAN_CATALOG}
    django_slugs = {p.slug for p in django_plans}

    last_at = OpsSetting.objects.filter(key="plan_sync_last_at").values_list("value", flat=True).first()
    last_ok = OpsSetting.objects.filter(key="plan_sync_last_ok").values_list("value", flat=True).first()
    last_message = (
        OpsSetting.objects.filter(key="plan_sync_last_message").values_list("value", flat=True).first()
        or ""
    )
    last_summary = (
        OpsSetting.objects.filter(key="plan_sync_last_summary").values_list("value", flat=True).first()
        or ""
    )

    status: dict[str, Any] = {
        "level": "warn",
        "label": "未確認",
        "django_count": len(django_plans),
        "supabase_count": 0,
        "matched": False,
        "missing_in_supabase": [],
        "extra_in_supabase": [],
        "price_mismatches": [],
        "supabase_ok": False,
        "supabase_error": "",
        "last_at": last_at or "",
        "last_ok": last_ok == "1",
        "last_message": last_message,
        "last_summary": last_summary,
        "plans": [
            {
                "slug": p.slug,
                "name": p.name,
                "price": int(p.price),
                "is_active": p.is_active,
            }
            for p in django_plans
        ],
        "frontend_url": frontend_base_url(),
    }

    try:
        url, key = _supabase_config()
        rows = _fetch_supabase_plans(url, key)
        status["supabase_ok"] = True
        status["supabase_count"] = len(rows)
        sb = {r["slug"]: r for r in rows if r.get("slug") != "pro"}

        missing = sorted(django_slugs - set(sb))
        extra = sorted(set(sb) - django_slugs - {"pro"})
        mismatches: list[dict[str, Any]] = []
        for plan in django_plans:
            row = sb.get(plan.slug)
            if not row:
                continue
            sb_price = int(row.get("price_yen") or 0)
            if sb_price != int(plan.price):
                mismatches.append(
                    {
                        "slug": plan.slug,
                        "django": int(plan.price),
                        "supabase": sb_price,
                    }
                )

        status["missing_in_supabase"] = missing
        status["extra_in_supabase"] = extra
        status["price_mismatches"] = mismatches
        status["matched"] = not missing and not mismatches

        catalog_missing = sorted(catalog_slugs - django_slugs)
        if status["matched"] and not catalog_missing:
            status["level"] = "ok"
            status["label"] = "同期済み"
        elif status["supabase_ok"] and (missing or mismatches or catalog_missing):
            status["level"] = "warn"
            status["label"] = "差分あり"
        else:
            status["level"] = "warn"
            status["label"] = "要確認"
        if catalog_missing:
            status["missing_in_django"] = catalog_missing
    except PlanSyncError as exc:
        status["supabase_error"] = str(exc)
        status["level"] = "bad"
        status["label"] = "Supabase 未接続"
    except Exception as exc:  # noqa: BLE001
        status["supabase_error"] = str(exc)
        status["level"] = "bad"
        status["label"] = "同期チェック失敗"

    return status


def get_ops_health() -> dict[str, Any]:
    """簡易ヘルス（FE / Django API）。"""
    fe = frontend_base_url()
    health: dict[str, Any] = {
        "frontend_url": fe,
        "frontend_ok": False,
        "django_health_ok": False,
        "django_health_url": "/api/v1/health/",
    }
    try:
        r = requests.get(f"{fe}/", timeout=1.5)
        health["frontend_ok"] = r.status_code < 500
    except Exception:  # noqa: BLE001
        health["frontend_ok"] = False

    try:
        r = requests.get("http://127.0.0.1:8000/api/v1/health/", timeout=1.5)
        health["django_health_ok"] = r.status_code == 200
    except Exception:  # noqa: BLE001
        health["django_health_ok"] = False

    return health


def run_manual_plan_push(*, reason: str = "manual_admin") -> dict[str, Any]:
    from users.plan_sync import PlanSyncError, push_django_plans_to_supabase

    try:
        result = push_django_plans_to_supabase()
        msg = (
            f"Supabase へ同期完了（push={result.get('pushed')}, "
            f"archive={result.get('archived')}, reason={reason}）"
        )
        _record_sync_meta(ok=True, message=msg, result=result)
        return {"ok": True, "message": msg, "result": result}
    except PlanSyncError as exc:
        _record_sync_meta(ok=False, message=str(exc))
        return {"ok": False, "message": str(exc)}
    except Exception as exc:  # noqa: BLE001
        _record_sync_meta(ok=False, message=str(exc))
        return {"ok": False, "message": str(exc)}
