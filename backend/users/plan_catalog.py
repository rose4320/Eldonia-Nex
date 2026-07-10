"""LP Plans と Django Plan の正本カタログ（v0.9.2）。

Source of Truth: このファイル + Django `Plan` 行。
LP 表示（`src/lib/lp/content.ts`）と揃える。
"""

from __future__ import annotations

from decimal import Decimal

# slug 順 = LP 表示順
LP_PLAN_CATALOG = [
    {
        "slug": "free",
        "name": "Free",
        "label": "Free",
        "display_name": "Free",
        "sort_order": 1,
        "default_yen": 0,
        "trial_days": 0,
        "shop_fee_percent": None,
        "features": [
            "作品の公開（3点まで）",
            "コミュニティ参加",
            "基本プロフィール",
        ],
        "feature_flags": {
            "max_artworks": 3,
            "shop": False,
            "events_host": False,
            "works": False,
            "analytics": False,
            "priority_support": False,
            "team": False,
        },
    },
    {
        "slug": "standard",
        "name": "Standard",
        "label": "Standard",
        "display_name": "Standard",
        "sort_order": 2,
        "default_yen": 800,
        "trial_days": 14,
        "shop_fee_percent": 5,
        "features": [
            "作品の無制限公開",
            "ショップ機能（手数料5%）",
            "イベント参加・主催",
            "カスタムプロフィール",
        ],
        "feature_flags": {
            "max_artworks": None,
            "shop": True,
            "events_host": True,
            "works": False,
            "analytics": False,
            "priority_support": False,
            "team": False,
        },
    },
    {
        "slug": "premium",
        "name": "Premium",
        "label": "Premium",
        "display_name": "Premium",
        "sort_order": 3,
        "default_yen": 2980,
        "trial_days": 14,
        "shop_fee_percent": 3,
        "legacy_slugs": ["pro"],
        "features": [
            "Standard のすべて",
            "ショップ手数料 3%",
            "仕事の依頼・応募",
            "高度な分析・レポート",
            "優先サポート",
        ],
        "feature_flags": {
            "max_artworks": None,
            "shop": True,
            "events_host": True,
            "works": True,
            "analytics": True,
            "priority_support": True,
            "team": False,
        },
    },
    {
        "slug": "business",
        "name": "Business",
        "label": "Business",
        "display_name": "Business",
        "sort_order": 4,
        "default_yen": 10000,
        "trial_days": 0,
        "shop_fee_percent": 3,
        "features": [
            "法人向け機能",
            "チーム管理・権限設定",
            "専用サポート・SLA",
        ],
        "feature_flags": {
            "max_artworks": None,
            "shop": True,
            "events_host": True,
            "works": True,
            "analytics": True,
            "priority_support": True,
            "team": True,
        },
    },
]


def plan_features_payload(slot: dict) -> dict:
    """Plan.features JSON に保存する構造。"""
    return {
        "bullets": list(slot.get("features") or []),
        "flags": dict(slot.get("feature_flags") or {}),
        "shop_fee_percent": slot.get("shop_fee_percent"),
    }


def plan_defaults(slot: dict, *, yen: int | None = None) -> dict:
    price = Decimal(yen if yen is not None else slot["default_yen"])
    return {
        "name": slot["display_name"],
        "price": price,
        "currency": "JPY",
        "billing_cycle": "monthly",
        "is_active": True,
        "sort_order": slot["sort_order"],
        "trial_days": slot.get("trial_days", 0),
        "features": plan_features_payload(slot),
    }
