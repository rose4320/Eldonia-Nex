"""運用設定 — 定義済みスロット（表示ラベル・デフォルト値）"""

from users.plan_catalog import LP_PLAN_CATALOG

FEE_SETTING_SLOTS = [
    {
        "key": "marketplace_fee_percent",
        "rate_key": "marketplace",
        "env": "MARKETPLACE_FEE_PERCENT",
        "default": "10",
        "label": "マーケットプレイス手数料（既定）",
        "help": "プラン未設定時の既定手数料。Standard=5% / Premium・Business=3% を優先",
        "unit": "%",
    },
    {
        "key": "shop_fee_standard_percent",
        "rate_key": "shop_fee_standard",
        "env": "SHOP_FEE_STANDARD_PERCENT",
        "default": "5",
        "label": "ショップ手数料（Standard）",
        "help": "Standard プランのショップ販売手数料",
        "unit": "%",
    },
    {
        "key": "shop_fee_premium_percent",
        "rate_key": "shop_fee_premium",
        "env": "SHOP_FEE_PREMIUM_PERCENT",
        "default": "3",
        "label": "ショップ手数料（Premium / Business）",
        "help": "Premium・Business プランのショップ販売手数料",
        "unit": "%",
    },
    {
        "key": "referral_rebate_percent",
        "rate_key": "referral_rebate",
        "env": "REFERRAL_REBATE_PERCENT",
        "default": "10",
        "label": "ユーザー還元（紹介料）",
        "help": "紹介者へ支払う還元率（注文完了時）",
        "unit": "%",
    },
    {
        "key": "stripe_fee_percent",
        "rate_key": "stripe",
        "env": "STRIPE_FEE_PERCENT",
        "default": "3.6",
        "label": "決済手数料（Stripe）",
        "help": "決済代行の参考手数料率",
        "unit": "%",
    },
    {
        "key": "stream_donation_fee_percent",
        "rate_key": "stream_donation",
        "env": "STREAM_DONATION_FEE_PERCENT",
        "default": "5",
        "label": "投げ銭手数料",
        "help": "ライブ配信の投げ銭",
        "unit": "%",
    },
    {
        "key": "event_ticket_fee_percent",
        "rate_key": "event_ticket",
        "env": "EVENT_TICKET_FEE_PERCENT",
        "default": "8",
        "label": "イベントチケット手数料",
        "help": "イベントチケット販売",
        "unit": "%",
    },
]

PLAN_DETAIL_SLOTS = [
    {
        "slug": slot["slug"],
        "label": slot["label"],
        **({"legacy_slugs": slot["legacy_slugs"]} if slot.get("legacy_slugs") else {}),
    }
    for slot in LP_PLAN_CATALOG
]

SESSION_KEY_FEES = "pending_fee_settings"
SESSION_KEY_QUEST = "pending_quest_settings"
SESSION_KEY_PLAN_DETAILS = "pending_plan_details"
SESSION_KEY_ANNOUNCEMENT = "pending_announcement"
