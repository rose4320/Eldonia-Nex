"""
イベント作成のプラン制限設定
"""

# プランごとのイベント作成制限
PLAN_LIMITS = {
    'free': {
        'max_events_per_month': 2,
        'max_capacity': 50,
        'can_use_paid_events': False,
        'can_use_advanced_features': False,
        'description': 'フリープラン: 月2イベントまで、無料イベントのみ、最大50名',
    },
    'premium': {
        'max_events_per_month': 10,
        'max_capacity': 200,
        'can_use_paid_events': True,
        'can_use_advanced_features': True,
        'description': 'プレミアムプラン: 月10イベントまで、有料イベント可、最大200名',
    },
    'pro': {
        'max_events_per_month': None,  # 無制限
        'max_capacity': None,  # 無制限
        'can_use_paid_events': True,
        'can_use_advanced_features': True,
        'description': 'Proプラン: イベント作成無制限、すべての機能利用可能',
    },
}


def get_plan_limits(subscription_plan):
    """プラン制限を取得"""
    return PLAN_LIMITS.get(subscription_plan, PLAN_LIMITS['free'])


def check_event_creation_permission(user, capacity=None, is_free=True):
    """
    イベント作成権限をチェック
    
    Args:
        user: ユーザーオブジェクト
        capacity: イベント収容人数
        is_free: 無料イベントかどうか
    
    Returns:
        tuple: (許可されているか, エラーメッセージ)
    """
    from datetime import datetime, timedelta

    from events.models import Event

    # ユーザーのプランを取得
    subscription_plan = getattr(user, 'subscription', 'free') or \
                       getattr(user, 'subscription_plan', 'free') or \
                       getattr(user, 'subscription_type', 'free')
    
    limits = get_plan_limits(subscription_plan)
    
    # 月間イベント数制限チェック
    if limits['max_events_per_month'] is not None:
        # 今月作成したイベント数を取得
        now = datetime.now()
        first_day_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        events_this_month = Event.objects.filter(
            organizer=user,
            created_at__gte=first_day_of_month
        ).count()
        
        if events_this_month >= limits['max_events_per_month']:
            return False, f"プラン制限: {limits['description']}。今月の作成上限に達しました。アップグレードをご検討ください。"
    
    # 収容人数制限チェック
    if capacity and limits['max_capacity'] is not None:
        if capacity > limits['max_capacity']:
            return False, f"プラン制限: 最大収容人数は{limits['max_capacity']}名までです。アップグレードをご検討ください。"
    
    # 有料イベント作成制限チェック
    if not is_free and not limits['can_use_paid_events']:
        return False, f"プラン制限: {limits['description']}。有料イベントを作成するにはアップグレードが必要です。"
    
    return True, None
    return True, None
