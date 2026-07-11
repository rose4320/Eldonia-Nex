"""プラン別ショップ手数料の解決。"""

from __future__ import annotations

from decimal import Decimal

from users.operations.settings_service import get_fee_rates
from users.plan_catalog import LP_PLAN_CATALOG


def normalize_plan_slug(plan_slug: str | None) -> str:
    slug = (plan_slug or "free").strip().lower() or "free"
    if slug == "pro":
        return "premium"
    return slug


def resolve_shop_fee_percent(plan_slug: str | None) -> Decimal:
    """販売者プランに応じたショップ手数料率（%）を返す。"""
    slug = normalize_plan_slug(plan_slug)
    rates = get_fee_rates()

    if slug == "standard":
        return rates.get("shop_fee_standard", Decimal("5"))
    if slug in {"premium", "business"}:
        return rates.get("shop_fee_premium", Decimal("3"))

    # Free / unknown — カタログ既定 or マーケット既定
    for slot in LP_PLAN_CATALOG:
        if slot["slug"] == slug and slot.get("shop_fee_percent") is not None:
            return Decimal(slot["shop_fee_percent"])
    return rates.get("marketplace", Decimal("10"))
