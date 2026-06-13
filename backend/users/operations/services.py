from decimal import Decimal

from django.db import transaction

from users.models import Plan

# 括弧内の金額だけ編集 → slug 単位で Plan を更新
PLAN_PRICE_SLOTS = [
    {
        "slug": "free",
        "label": "Free",
        "display_name": "Free",
        "sort_order": 1,
        "default_yen": 0,
    },
    {
        "slug": "standard",
        "label": "Standard",
        "display_name": "Standard",
        "sort_order": 2,
        "default_yen": 800,
    },
    {
        "slug": "pro",
        "label": "Pro",
        "display_name": "Pro",
        "sort_order": 3,
        "default_yen": 1500,
        "legacy_slugs": ["premium"],
    },
]

SESSION_KEY = "pending_subscription_plan_prices"


def _find_plan(slug: str, legacy_slugs: list[str] | None = None) -> Plan | None:
    plan = Plan.objects.filter(slug=slug).first()
    if plan:
        return plan
    for legacy in legacy_slugs or []:
        plan = Plan.objects.filter(slug=legacy).first()
        if plan:
            return plan
    return None


def get_current_plan_prices() -> dict[str, int]:
    prices: dict[str, int] = {}
    for slot in PLAN_PRICE_SLOTS:
        plan = _find_plan(slot["slug"], slot.get("legacy_slugs"))
        if plan:
            prices[slot["slug"]] = int(plan.price)
        else:
            prices[slot["slug"]] = slot["default_yen"]
    return prices


def build_preview(current: dict[str, int], new: dict[str, int]) -> list[dict]:
    rows = []
    for slot in PLAN_PRICE_SLOTS:
        slug = slot["slug"]
        rows.append(
            {
                "label": slot["label"],
                "slug": slug,
                "before": current.get(slug, slot["default_yen"]),
                "after": new.get(slug, slot["default_yen"]),
                "changed": current.get(slug) != new.get(slug),
            }
        )
    return rows


@transaction.atomic
def apply_plan_prices(prices: dict[str, int]) -> list[str]:
    updated_labels: list[str] = []
    for slot in PLAN_PRICE_SLOTS:
        slug = slot["slug"]
        yen = int(prices.get(slug, slot["default_yen"]))
        if yen < 0:
            raise ValueError(f"{slot['label']} の金額は 0 以上にしてください。")

        Plan.objects.update_or_create(
            slug=slug,
            defaults={
                "name": slot["display_name"],
                "price": Decimal(yen),
                "currency": "JPY",
                "billing_cycle": "monthly",
                "is_active": True,
                "sort_order": slot["sort_order"],
            },
        )

        for legacy in slot.get("legacy_slugs", []):
            Plan.objects.filter(slug=legacy).update(
                price=Decimal(yen),
                name=slot["display_name"],
                currency="JPY",
            )

        updated_labels.append(f"{slot['label']} = （{yen}）円")

    return updated_labels
