"""運用ダッシュボード — Admin ホーム用 KPI 集計"""

from __future__ import annotations

from datetime import timedelta
from decimal import Decimal
from typing import Any

from django.db.models import Count, Sum
from django.db.models.functions import Coalesce
from django.utils import timezone

from .settings_service import get_fee_rates, get_referral_rebate_percent


def _yen(value: Decimal | int | float | None) -> str:
    if value is None:
        return "0"
    return f"{int(Decimal(value)):,}"


def _pct(value: Decimal) -> str:
    normalized = value.quantize(Decimal("0.1"))
    if normalized == normalized.to_integral():
        return f"{int(normalized)}%"
    return f"{normalized}%"


def get_dashboard_metrics() -> dict[str, Any]:
    fee_rates = get_fee_rates()
    now = timezone.now()
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
    month_start = today_start.replace(day=1)
    prev_month_end = month_start - timedelta(seconds=1)
    prev_month_start = prev_month_end.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    week_ago = now - timedelta(days=7)
    day_ago = now - timedelta(days=1)

    from users.models import Plan, User

    users_total = User.objects.count()
    users_active = User.objects.filter(is_active=True, account_status="active").count()
    users_new_today = User.objects.filter(created_at__gte=today_start).count()
    users_new_7d = User.objects.filter(created_at__gte=week_ago).count()

    plan_rows = (
        User.objects.values("subscription_plan")
        .annotate(count=Count("id"))
        .order_by("-count")
    )
    plan_names = {p.slug: p.name for p in Plan.objects.all()}
    users_by_plan = [
        {
            "slug": row["subscription_plan"] or "free",
            "label": plan_names.get(row["subscription_plan"] or "free", row["subscription_plan"] or "free"),
            "count": row["count"],
        }
        for row in plan_rows
    ]

    online_24h = _count_recent_active_users(day_ago)

    sales = _sales_metrics(today_start, month_start, prev_month_start, prev_month_end)
    referrals = _referral_metrics(month_start)
    quest = _quest_metrics(today_start, week_ago)
    fees = _fee_metrics(sales, month_start)

    return {
        "updated_at": now,
        "users": {
            "total": users_total,
            "active": users_active,
            "online_24h": online_24h,
            "new_today": users_new_today,
            "new_7d": users_new_7d,
            "by_plan": users_by_plan,
        },
        "sales": sales,
        "fees": fees,
        "referrals": referrals,
        "quest": quest,
        "fee_rates": [
            {
                "key": "marketplace",
                "label": "マーケットプレイス手数料",
                "rate": _pct(fee_rates["marketplace"]),
                "note": "作品・商品売上から",
            },
            {
                "key": "referral_rebate",
                "label": "ユーザー還元（紹介料）",
                "rate": _pct(fee_rates["referral_rebate"]),
                "note": "紹介者への還元率",
            },
            {
                "key": "stripe",
                "label": "決済手数料（Stripe）",
                "rate": _pct(fee_rates["stripe"]),
                "note": "参考値・決済代行",
            },
            {
                "key": "stream_donation",
                "label": "投げ銭手数料",
                "rate": _pct(fee_rates["stream_donation"]),
                "note": "ライブ配信",
            },
            {
                "key": "event_ticket",
                "label": "イベントチケット手数料",
                "rate": _pct(fee_rates["event_ticket"]),
                "note": "イベント販売",
            },
        ],
    }


def _count_recent_active_users(since) -> int:
    from users.models import User

    recent_ids: set[int] = set()

    try:
        from gamification.models import UserExpLog

        recent_ids.update(
            UserExpLog.objects.filter(created_at__gte=since).values_list("user_id", flat=True)
        )
    except Exception:
        pass

    try:
        from marketplace.models import Order

        recent_ids.update(
            Order.objects.filter(created_at__gte=since).values_list("user_id", flat=True)
        )
    except Exception:
        pass

    if not recent_ids:
        return User.objects.filter(last_login__gte=since).count()

    return len(recent_ids)


def _sales_metrics(today_start, month_start, prev_month_start, prev_month_end) -> dict[str, Any]:
    try:
        from marketplace.models import Order
    except Exception:
        return _empty_sales()

    completed = Order.objects.filter(status="completed")
    gmv_today = completed.filter(created_at__gte=today_start).aggregate(
        total=Coalesce(Sum("total_amount"), Decimal("0"))
    )["total"]
    gmv_month = completed.filter(created_at__gte=month_start).aggregate(
        total=Coalesce(Sum("total_amount"), Decimal("0"))
    )["total"]
    gmv_prev_month = completed.filter(
        created_at__gte=prev_month_start, created_at__lte=prev_month_end
    ).aggregate(total=Coalesce(Sum("total_amount"), Decimal("0")))["total"]

    orders_today = Order.objects.filter(created_at__gte=today_start).count()
    orders_pending = Order.objects.filter(status="pending").count()
    orders_completed = completed.count()

    if gmv_prev_month and gmv_prev_month > 0:
        sales_index = int((gmv_month / gmv_prev_month) * 100)
    elif gmv_month > 0:
        sales_index = 100
    else:
        sales_index = 0

    stream_donations = Decimal("0")
    try:
        from streaming.models import StreamDonation

        stream_donations = StreamDonation.objects.filter(
            payment_status="completed", created_at__gte=month_start
        ).aggregate(total=Coalesce(Sum("amount"), Decimal("0")))["total"]
    except Exception:
        pass

    return {
        "gmv_today": _yen(gmv_today),
        "gmv_today_raw": gmv_today,
        "gmv_month": _yen(gmv_month),
        "gmv_month_raw": gmv_month,
        "gmv_prev_month_raw": gmv_prev_month,
        "orders_today": orders_today,
        "orders_pending": orders_pending,
        "orders_completed": orders_completed,
        "sales_index": sales_index,
        "stream_donations_month": _yen(stream_donations),
    }


def _empty_sales() -> dict[str, Any]:
    return {
        "gmv_today": "0",
        "gmv_today_raw": Decimal("0"),
        "gmv_month": "0",
        "gmv_month_raw": Decimal("0"),
        "gmv_prev_month_raw": Decimal("0"),
        "orders_today": 0,
        "orders_pending": 0,
        "orders_completed": 0,
        "sales_index": 0,
        "stream_donations_month": "0",
    }


def _referral_metrics(month_start) -> dict[str, Any]:
    try:
        from marketplace.models import Referral, ReferralTrack, Transaction
    except Exception:
        return {
            "total_paid": "0",
            "count_paid": 0,
            "active_codes": 0,
            "conversions": 0,
            "rebate_rate": _pct(get_referral_rebate_percent()),
            "paid_month": "0",
        }

    rewards = Transaction.objects.filter(transaction_type="referral_reward")
    total_paid = rewards.aggregate(total=Coalesce(Sum("amount"), Decimal("0")))["total"]
    paid_month = rewards.filter(created_at__gte=month_start).aggregate(
        total=Coalesce(Sum("amount"), Decimal("0"))
    )["total"]

    return {
        "total_paid": _yen(total_paid),
        "paid_month": _yen(paid_month),
        "count_paid": rewards.count(),
        "active_codes": Referral.objects.filter(status="active").count(),
        "conversions": ReferralTrack.objects.filter(converted_user__isnull=False).count(),
        "rebate_rate": _pct(get_referral_rebate_percent()),
    }


def _quest_metrics(today_start, week_ago) -> dict[str, Any]:
    try:
        from gamification.models import Achievement, ExpAction, UserAchievement, UserExpLog
    except Exception:
        return {
            "active_actions": 0,
            "active_achievements": 0,
            "xp_today": 0,
            "xp_7d": 0,
            "achievements_completed": 0,
            "top_actions": [],
        }

    xp_today = UserExpLog.objects.filter(created_at__gte=today_start).aggregate(
        total=Coalesce(Sum("exp_gained"), 0)
    )["total"]
    xp_7d = UserExpLog.objects.filter(created_at__gte=week_ago).aggregate(
        total=Coalesce(Sum("exp_gained"), 0)
    )["total"]

    top_raw = list(
        UserExpLog.objects.filter(created_at__gte=week_ago)
        .values("action_id")
        .annotate(count=Count("id"), xp=Coalesce(Sum("exp_gained"), 0))
        .order_by("-count")[:5]
    )
    action_labels = {
        a.action_type: a.description or a.action_type
        for a in ExpAction.objects.filter(
            action_type__in=[row["action_id"] for row in top_raw]
        )
    }
    top_actions = [
        {
            "action_type": row["action_id"],
            "label": action_labels.get(row["action_id"], row["action_id"]),
            "count": row["count"],
            "xp": row["xp"],
        }
        for row in top_raw
    ]

    return {
        "active_actions": ExpAction.objects.filter(is_active=True).count(),
        "active_achievements": Achievement.objects.filter(is_active=True).count(),
        "xp_today": xp_today or 0,
        "xp_7d": xp_7d or 0,
        "achievements_completed": UserAchievement.objects.filter(
            completed_at__isnull=False
        ).count(),
        "top_actions": top_actions,
    }


def _fee_metrics(sales: dict[str, Any], month_start) -> dict[str, Any]:
    fee_rates = get_fee_rates()
    gmv = sales.get("gmv_month_raw") or Decimal("0")

    marketplace_fee = gmv * fee_rates["marketplace"] / Decimal("100")
    stripe_fee = gmv * fee_rates["stripe"] / Decimal("100")

    referral_paid = Decimal("0")
    try:
        from marketplace.models import Transaction

        referral_paid = Transaction.objects.filter(
            transaction_type="referral_reward", created_at__gte=month_start
        ).aggregate(total=Coalesce(Sum("amount"), Decimal("0")))["total"]
    except Exception:
        pass

    recorded_fees = Decimal("0")
    try:
        from marketplace.models import Transaction

        recorded_fees = Transaction.objects.filter(created_at__gte=month_start).aggregate(
            total=Coalesce(Sum("fee_amount"), Decimal("0"))
        )["total"]
    except Exception:
        pass

    estimated_total = marketplace_fee + stripe_fee + referral_paid

    return {
        "marketplace_mtd": _yen(marketplace_fee),
        "stripe_mtd": _yen(stripe_fee),
        "referral_paid_mtd": _yen(referral_paid),
        "recorded_fees_mtd": _yen(recorded_fees),
        "estimated_total_mtd": _yen(estimated_total),
    }
