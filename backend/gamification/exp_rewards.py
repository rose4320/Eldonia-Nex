"""
EXP付与のヘルパー関数
"""
from typing import Optional

from users.models import User

# EXP報酬の定義
EXP_REWARDS = {
    # イベント作成
    'event_created': 50,  # イベント作成時
    
    # イベント成功時の売上率別報酬
    'event_success_100': 500,   # 即完売 (100%)
    'event_success_95_99': 400,  # ギリギリ完売 (95-99%)
    'event_success_90': 300,     # 90%達成
    'event_success_80': 250,     # 80%達成
    'event_success_70': 200,     # 70%達成
    'event_success_60': 150,     # 60%達成
    'event_success_50': 100,     # 50%達成
    'event_success_40': 80,      # 40%達成
    'event_success_30': 60,      # 30%達成
    'event_success_20': 40,      # 20%達成
    'event_success_10': 20,      # 10%達成
}


def calculate_level_from_exp(total_exp: int) -> int:
    """
    累計EXPからレベルを計算
    レベルアップに必要なEXP: level * 100
    例: Lv1→2: 100 EXP, Lv2→3: 200 EXP, Lv3→4: 300 EXP
    """
    if total_exp < 0:
        return 1
    
    level = 1
    required_exp = 0
    
    while True:
        next_level_exp = level * 100
        if required_exp + next_level_exp > total_exp:
            break
        required_exp += next_level_exp
        level += 1
    
    return level


def award_exp(user: User, exp_amount: int, reason: str = "") -> dict:
    """
    ユーザーにEXPを付与する
    
    Args:
        user: 対象ユーザー
        exp_amount: 付与するEXP量
        reason: 付与理由（ログ用）
    
    Returns:
        dict: {
            'previous_level': int,
            'new_level': int,
            'previous_exp': int,
            'new_exp': int,
            'exp_gained': int,
            'leveled_up': bool,
            'reason': str
        }
    """
    previous_exp = user.total_exp
    previous_level = user.current_level
    
    # EXPを加算
    user.total_exp += exp_amount
    
    # 新しいレベルを計算
    new_level = calculate_level_from_exp(user.total_exp)
    user.current_level = new_level
    
    # 保存
    user.save(update_fields=['total_exp', 'current_level'])
    
    leveled_up = new_level > previous_level
    
    return {
        'previous_level': previous_level,
        'new_level': new_level,
        'previous_exp': previous_exp,
        'new_exp': user.total_exp,
        'exp_gained': exp_amount,
        'leveled_up': leveled_up,
        'reason': reason
    }


def get_event_success_exp(attendance_rate: float) -> tuple[int, str]:
    """
    イベント成功時の売上率に応じたEXPを取得
    
    Args:
        attendance_rate: 参加率 (0.0 - 1.0)
    
    Returns:
        tuple: (EXP量, 達成ランク)
    """
    rate_percent = attendance_rate * 100
    
    if rate_percent >= 100:
        return EXP_REWARDS['event_success_100'], '即完売 (100%)'
    elif rate_percent >= 95:
        return EXP_REWARDS['event_success_95_99'], 'ギリギリ完売 (95-99%)'
    elif rate_percent >= 90:
        return EXP_REWARDS['event_success_90'], '90%達成'
    elif rate_percent >= 80:
        return EXP_REWARDS['event_success_80'], '80%達成'
    elif rate_percent >= 70:
        return EXP_REWARDS['event_success_70'], '70%達成'
    elif rate_percent >= 60:
        return EXP_REWARDS['event_success_60'], '60%達成'
    elif rate_percent >= 50:
        return EXP_REWARDS['event_success_50'], '50%達成'
    elif rate_percent >= 40:
        return EXP_REWARDS['event_success_40'], '40%達成'
    elif rate_percent >= 30:
        return EXP_REWARDS['event_success_30'], '30%達成'
    elif rate_percent >= 20:
        return EXP_REWARDS['event_success_20'], '20%達成'
    elif rate_percent >= 10:
        return EXP_REWARDS['event_success_10'], '10%達成'
    else:
        return 0, '低参加率'


def award_event_creation_exp(user: User) -> dict:
    """イベント作成時のEXP付与"""
    return award_exp(
        user,
        EXP_REWARDS['event_created'],
        reason="イベント作成"
    )


def award_event_success_exp(user: User, attendance_rate: float) -> dict:
    """
    イベント成功時のEXP付与
    
    Args:
        user: 対象ユーザー
        attendance_rate: 参加率 (0.0 - 1.0)
    """
    exp_amount, rank = get_event_success_exp(attendance_rate)
    
    if exp_amount > 0:
        return award_exp(
            user,
            exp_amount,
            reason=f"イベント成功 ({rank})"
        )
    
    return {
        'previous_level': user.current_level,
        'new_level': user.current_level,
        'previous_exp': user.total_exp,
        'new_exp': user.total_exp,
        'exp_gained': 0,
        'leveled_up': False,
        'reason': f'イベント成功 ({rank}) - EXP付与なし'
    }
