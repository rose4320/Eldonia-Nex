from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import F
from django.utils import timezone

from .models import ExpAction, UserExpLog

LEVEL_EXP_STEP = 500


@dataclass(frozen=True)
class DefaultExpAction:
    action_type: str
    base_exp: int
    description: str
    max_daily_count: int = 0
    is_active: bool = True


PROFILE_USER_FIELDS: tuple[tuple[str, str, int], ...] = (
    ("display_name", "表示名を入力", 75),
    ("bio", "自己紹介を入力", 75),
    ("avatar_url", "アバターを設定", 75),
    ("website_url", "Webサイトを入力", 75),
    ("location", "活動地域を入力", 75),
    ("birth_date", "生年月日を入力", 75),
    ("gender", "性別を入力", 75),
    ("phone_number", "電話番号を入力", 75),
)

PROFILE_DETAIL_FIELDS: tuple[tuple[str, str, int], ...] = (
    ("skills", "スキルを入力", 40),
    ("portfolio_url", "ポートフォリオURLを入力", 40),
    ("hourly_rate", "希望単価を入力", 40),
    ("available_hours", "稼働時間を入力", 40),
    ("timezone", "タイムゾーンを入力", 40),
    ("languages", "対応言語を入力", 40),
    ("social_links", "SNSリンクを入力", 40),
    ("preferences", "興味・設定を入力", 40),
    ("notification_settings", "通知設定を入力", 40),
    ("privacy_settings", "公開範囲設定を入力", 40),
)

DEFAULT_EXP_ACTIONS: tuple[DefaultExpAction, ...] = (
    DefaultExpAction("user.signup", 20, "新規登録", 1),
    DefaultExpAction("artwork.upload", 50, "作品投稿", 20),
    DefaultExpAction("product.create", 40, "商品作成", 20),
    DefaultExpAction("order.create", 30, "購入・注文", 20),
    DefaultExpAction("comment.create", 10, "コメント投稿", 50),
    DefaultExpAction("like.create", 3, "いいね", 100),
    DefaultExpAction("fan.create", 8, "ファン登録", 50),
    DefaultExpAction("event.create", 40, "イベント作成", 10),
    DefaultExpAction("event_ticket.create", 15, "イベントチケット作成", 20),
    *(
        DefaultExpAction(f"profile.{field}", exp, description, 1)
        for field, description, exp in PROFILE_USER_FIELDS
    ),
    *(
        DefaultExpAction(f"profile.{field}", exp, description, 1)
        for field, description, exp in PROFILE_DETAIL_FIELDS
    ),
)


def calculate_level(total_exp: int) -> int:
    """500 EXP ごとに1レベル上昇。0-499 EXP は Lv1、1000 EXP で Lv3。"""
    return max(1, int(total_exp // LEVEL_EXP_STEP) + 1)


def sync_user_level(user: Any) -> int:
    level = calculate_level(int(getattr(user, "total_exp", 0) or 0))
    if getattr(user, "current_level", None) != level:
        user.__class__.objects.filter(pk=user.pk).update(current_level=level)
        user.current_level = level
    return level


def ensure_default_exp_actions() -> None:
    for action in DEFAULT_EXP_ACTIONS:
        ExpAction.objects.update_or_create(
            action_type=action.action_type,
            defaults={
                "base_exp": action.base_exp,
                "description": action.description,
                "max_daily_count": action.max_daily_count,
                "is_active": action.is_active,
            },
        )


def _is_filled(value: Any) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (list, tuple, dict, set)):
        return bool(value)
    return True


def _daily_count_reached(user: Any, action: ExpAction) -> bool:
    if action.max_daily_count <= 0:
        return False
    today_start = timezone.localtime().replace(hour=0, minute=0, second=0, microsecond=0)
    count = UserExpLog.objects.filter(
        user=user,
        action=action,
        created_at__gte=today_start,
    ).count()
    return count >= action.max_daily_count


@transaction.atomic
def award_exp(
    user: Any,
    action_type: str,
    *,
    reference_id: int | None = None,
    reference_type: str | None = None,
    description: str | None = None,
    idempotent: bool = True,
) -> int:
    """Quest 設定に基づいて EXP を付与し、付与量を返す。"""
    if not user or not getattr(user, "pk", None):
        return 0

    action = ExpAction.objects.filter(action_type=action_type, is_active=True).first()
    if not action or action.base_exp <= 0:
        return 0

    if idempotent and reference_type:
        existing = UserExpLog.objects.filter(
            user=user,
            action=action,
            reference_type=reference_type,
        )
        if reference_id is not None:
            existing = existing.filter(reference_id=reference_id)
        if existing.exists():
            return 0

    if _daily_count_reached(user, action):
        return 0

    UserExpLog.objects.create(
        user=user,
        action=action,
        exp_gained=action.base_exp,
        reference_id=reference_id,
        reference_type=reference_type,
        description=description or action.description,
    )

    User = get_user_model()
    locked_user = User.objects.select_for_update().get(pk=user.pk)
    next_total = int(locked_user.total_exp or 0) + action.base_exp
    next_level = calculate_level(next_total)
    User.objects.filter(pk=locked_user.pk).update(
        total_exp=F("total_exp") + action.base_exp,
        current_level=next_level,
    )
    user.total_exp = next_total
    user.current_level = next_level
    return action.base_exp


def award_profile_completion_exp(user: Any) -> int:
    """入力済みのユーザー情報ごとに一度だけ EXP を付与する。"""
    total = 0
    for field, description, _exp in PROFILE_USER_FIELDS:
        if _is_filled(getattr(user, field, None)):
            total += award_exp(
                user,
                f"profile.{field}",
                reference_id=user.pk,
                reference_type=f"profile.{field}",
                description=description,
            )

    try:
        profile = user.profile
    except Exception:
        profile = None
    if not profile:
        return total

    for field, description, _exp in PROFILE_DETAIL_FIELDS:
        if _is_filled(getattr(profile, field, None)):
            total += award_exp(
                user,
                f"profile.{field}",
                reference_id=profile.pk,
                reference_type=f"profile.{field}",
                description=description,
            )

    return total
