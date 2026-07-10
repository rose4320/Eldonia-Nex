"""運用設定の読み書き"""

from __future__ import annotations

import os
from decimal import Decimal, InvalidOperation

from django.db import transaction

from users.models import OpsSetting

from .settings_constants import FEE_SETTING_SLOTS, PLAN_DETAIL_SLOTS

FEE_SETTING_KEYS = {slot["key"] for slot in FEE_SETTING_SLOTS}


def get_fee_setting_slots() -> list[dict]:
    """標準手数料 + 運用画面で追加した手数料項目。"""
    slots = [dict(slot) for slot in FEE_SETTING_SLOTS]
    known = {slot["key"] for slot in slots}
    for row in OpsSetting.objects.filter(category="fees").exclude(key__in=known).order_by("key"):
        slots.append(
            {
                "key": row.key,
                "rate_key": row.key,
                "env": "",
                "default": row.value,
                "label": row.label or row.key,
                "help": "追加された手数料項目です。",
                "unit": "%",
                "custom": True,
            }
        )
    return slots


def get_plan_detail_slots() -> list[dict]:
    """標準プラン + 運用画面で追加したプラン。"""
    from users.models import Plan

    slots = [dict(slot) for slot in PLAN_DETAIL_SLOTS]
    known = {slot["slug"] for slot in slots}
    legacy = {legacy for slot in slots for legacy in slot.get("legacy_slugs", [])}
    for plan in Plan.objects.exclude(slug__in=known | legacy).order_by(
        "sort_order", "price", "slug"
    ):
        slots.append({"slug": plan.slug, "label": plan.name, "custom": True})
    return slots


def format_percent_value(raw: str | Decimal) -> str:
    """手数料率を 1E+1 などの指数表記なしで表示・保存する"""
    try:
        number = Decimal(str(raw).strip())
    except InvalidOperation:
        return str(raw)
    number = number.quantize(Decimal("0.1"))
    text = format(number, "f")
    if "." in text:
        text = text.rstrip("0").rstrip(".")
    return text or "0"


def _env_default(slot: dict) -> str:
    return os.getenv(slot.get("env", ""), slot["default"])


def get_setting(key: str, default: str = "") -> str:
    row = OpsSetting.objects.filter(key=key).first()
    if row:
        value = row.value
        if key in FEE_SETTING_KEYS:
            return format_percent_value(value)
        return value
    for slot in FEE_SETTING_SLOTS:
        if slot["key"] == key:
            return format_percent_value(_env_default(slot))
    return default


def get_current_fee_values() -> dict[str, str]:
    values: dict[str, str] = {}
    for slot in get_fee_setting_slots():
        values[slot["key"]] = get_setting(slot["key"], _env_default(slot))
    return values


def get_fee_rates() -> dict[str, Decimal]:
    rates: dict[str, Decimal] = {}
    for slot in get_fee_setting_slots():
        raw = get_setting(slot["key"], _env_default(slot))
        try:
            rates[slot["rate_key"]] = Decimal(raw)
        except InvalidOperation:
            rates[slot["rate_key"]] = Decimal(slot["default"])
    return rates


def get_referral_rebate_percent() -> Decimal:
    return get_fee_rates()["referral_rebate"]


def build_fee_preview(current: dict[str, str], new: dict[str, str]) -> list[dict]:
    rows = []
    for slot in get_fee_setting_slots():
        key = slot["key"]
        rows.append(
            {
                "label": slot["label"],
                "key": key,
                "before": current.get(key, slot["default"]),
                "after": new.get(key, slot["default"]),
                "unit": slot["unit"],
                "changed": current.get(key) != new.get(key),
            }
        )
    return rows


@transaction.atomic
def apply_fee_values(values: dict[str, str]) -> list[str]:
    updated: list[str] = []
    for slot in get_fee_setting_slots():
        key = slot["key"]
        raw = values.get(key, slot["default"]).strip()
        try:
            number = Decimal(raw)
        except InvalidOperation as exc:
            raise ValueError(f"{slot['label']} の値が正しくありません。") from exc
        if number < 0 or number > 100:
            raise ValueError(f"{slot['label']} は 0〜100 の範囲で入力してください。")

        normalized = format_percent_value(number)

        OpsSetting.objects.update_or_create(
            key=key,
            defaults={
                "value": normalized,
                "label": slot["label"],
                "category": "fees",
            },
        )
        updated.append(f"{slot['label']} = （{normalized}）{slot['unit']}")
    return updated


def seed_fee_settings() -> None:
    for slot in FEE_SETTING_SLOTS:
        OpsSetting.objects.get_or_create(
            key=slot["key"],
            defaults={
                "value": _env_default(slot),
                "label": slot["label"],
                "category": "fees",
            },
        )


def get_plan_details() -> dict[str, dict]:
    from users.models import Plan

    details: dict[str, dict] = {}
    for slot in get_plan_detail_slots():
        plan = Plan.objects.filter(slug=slot["slug"]).first()
        if not plan:
            for legacy in slot.get("legacy_slugs", []):
                plan = Plan.objects.filter(slug=legacy).first()
                if plan:
                    break
        details[slot["slug"]] = {
            "label": slot["label"],
            "trial_days": plan.trial_days if plan else 0,
            "is_active": plan.is_active if plan else True,
            "exists": plan is not None,
        }
    return details


def build_plan_details_preview(current: dict, new: dict) -> list[dict]:
    rows = []
    for slot in get_plan_detail_slots():
        slug = slot["slug"]
        before = current.get(slug, {})
        after = new.get(slug, {})
        rows.append(
            {
                "label": slot["label"],
                "slug": slug,
                "trial_before": before.get("trial_days", 0),
                "trial_after": after.get("trial_days", 0),
                "active_before": before.get("is_active", True),
                "active_after": after.get("is_active", True),
                "changed": (
                    before.get("trial_days") != after.get("trial_days")
                    or before.get("is_active") != after.get("is_active")
                ),
            }
        )
    return rows


@transaction.atomic
def apply_plan_details(values: dict[str, dict]) -> list[str]:
    from users.models import Plan
    from users.plan_catalog import LP_PLAN_CATALOG, plan_defaults

    catalog_by_slug = {slot["slug"]: slot for slot in LP_PLAN_CATALOG}
    updated: list[str] = []
    for slot in get_plan_detail_slots():
        slug = slot["slug"]
        data = values.get(slug, {})
        trial_days = int(data.get("trial_days", 0))
        is_active = bool(data.get("is_active", True))
        if trial_days < 0:
            raise ValueError(f"{slot['label']} の試用日数は 0 以上にしてください。")

        catalog = catalog_by_slug.get(slug)
        if catalog:
            defaults = plan_defaults(catalog)
            defaults["trial_days"] = trial_days
            defaults["is_active"] = is_active
        else:
            defaults = {
                "name": slot["label"],
                "trial_days": trial_days,
                "is_active": is_active,
                "currency": "JPY",
                "billing_cycle": "monthly",
            }

        Plan.objects.update_or_create(slug=slug, defaults=defaults)
        for legacy in slot.get("legacy_slugs", []):
            Plan.objects.filter(slug=legacy).update(
                trial_days=trial_days,
                is_active=is_active,
            )

        status = "公開" if is_active else "停止"
        updated.append(f"{slot['label']} 試用（{trial_days}）日 · {status}")

    from users.operations.plan_push import push_plans_after_admin_change

    sync_msg = push_plans_after_admin_change(reason="apply_plan_details")
    if sync_msg:
        updated.append(sync_msg)

    return updated


def get_quest_actions() -> list[dict]:
    try:
        from gamification.models import ExpAction
    except Exception:
        return []

    rows = []
    for action in ExpAction.objects.all().order_by("action_type"):
        rows.append(
            {
                "action_type": action.action_type,
                "description": action.description or action.action_type,
                "base_exp": action.base_exp,
                "max_daily_count": action.max_daily_count,
                "is_active": action.is_active,
            }
        )
    return rows


def ensure_quest_actions() -> None:
    """EXP付与項目が未作成の環境に、標準アクションを用意する。"""
    try:
        from gamification.models import ExpAction
        from gamification.services import ensure_default_exp_actions
    except ImportError:
        return

    if not ExpAction.objects.exists():
        ensure_default_exp_actions()


def build_quest_preview(current: list[dict], new: list[dict]) -> list[dict]:
    current_map = {row["action_type"]: row for row in current}
    preview = []
    for row in new:
        before = current_map.get(row["action_type"], {})
        preview.append(
            {
                "action_type": row["action_type"],
                "label": row.get("description") or row["action_type"],
                "exp_before": before.get("base_exp", 0),
                "exp_after": row["base_exp"],
                "daily_before": before.get("max_daily_count", 0),
                "daily_after": row["max_daily_count"],
                "active_before": before.get("is_active", True),
                "active_after": row["is_active"],
                "changed": (
                    before.get("base_exp") != row["base_exp"]
                    or before.get("max_daily_count") != row["max_daily_count"]
                    or before.get("is_active") != row["is_active"]
                ),
            }
        )
    return preview


@transaction.atomic
def apply_quest_actions(rows: list[dict]) -> list[str]:
    from gamification.models import ExpAction

    updated: list[str] = []
    for row in rows:
        action_type = row["action_type"]
        base_exp = int(row["base_exp"])
        max_daily = int(row["max_daily_count"])
        is_active = bool(row["is_active"])
        if base_exp < 0 or max_daily < 0:
            raise ValueError(f"{action_type} の数値は 0 以上にしてください。")

        ExpAction.objects.filter(action_type=action_type).update(
            base_exp=base_exp,
            max_daily_count=max_daily,
            is_active=is_active,
        )
        status = "有効" if is_active else "停止"
        updated.append(f"{action_type} = EXP（{base_exp}）· 1日（{max_daily}）回 · {status}")
    return updated
