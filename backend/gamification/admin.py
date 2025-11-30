from django.contrib import admin
from django.utils.html import format_html

from .models import Achievement, ExpAction, UserAchievement, UserExpLog


@admin.register(ExpAction)
class ExpActionAdmin(admin.ModelAdmin):  # type: ignore
    """経験値アクション管理"""
    list_display = (
        "action_type",
        "base_exp_display",
        "is_active",
    )
    list_filter = ("is_active",)
    search_fields = ("action_type", "description")
    list_editable = ("is_active",)

    def base_exp_display(self, obj):
        return format_html('<strong>+{}</strong> XP', obj.base_exp)
    base_exp_display.short_description = "基本経験値"


@admin.register(UserExpLog)
class UserExpLogAdmin(admin.ModelAdmin):  # type: ignore
    """ユーザー経験値ログ管理"""
    list_display = (
        "user",
        "action",
        "exp_gained_display",
        "created_at",
    )
    list_filter = ("action", "created_at")
    search_fields = ("user__username",)
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"

    def exp_gained_display(self, obj):
        return format_html('<strong style="color:green;">+{}</strong> XP', obj.exp_gained)
    exp_gained_display.short_description = "獲得経験値"


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):  # type: ignore
    """実績管理 - 完全制御"""
    list_display = (
        "name",
        "category",
        "rarity_badge",
        "reward_exp_display",
        "unlock_count",
    )
    list_filter = ("category", "rarity")
    search_fields = ("name", "description")

    def rarity_badge(self, obj):
        colors = {
            "common": "#6c757d",
            "uncommon": "#28a745",
            "rare": "#17a2b8",
            "epic": "#6f42c1",
            "legendary": "#ffc107"
        }
        icons = {
            "common": "⚪",
            "uncommon": "🟢",
            "rare": "🔵",
            "epic": "🟣",
            "legendary": "🟡"
        }
        return format_html(
            '<span style="background-color:{}; color:white; padding:3px 10px; border-radius:3px;">{} {}</span>',
            colors.get(obj.rarity, "#6c757d"),
            icons.get(obj.rarity, ""),
            obj.rarity.upper()
        )
    rarity_badge.short_description = "レアリティ"

    def reward_exp_display(self, obj):
        return format_html('<strong>+{}</strong> XP', obj.reward_exp)
    reward_exp_display.short_description = "報酬経験値"

    def unlock_count(self, obj):
        count = obj.user_achievements.filter(unlocked_at__isnull=False).count()
        return format_html('<strong>{}</strong> 人', count) if count > 0 else "-"
    unlock_count.short_description = "達成者数"


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):  # type: ignore
    """ユーザー実績管理"""
    list_display = (
        "user",
        "achievement",
        "progress_bar",
        "completed_at",
    )
    list_filter = ("completed_at",)
    search_fields = ("user__username", "achievement__name")
    readonly_fields = ("completed_at",)
    date_hierarchy = "completed_at"

    def progress_bar(self, obj):
        achievement = obj.achievement
        if achievement.required_count > 0:
            percentage = min(100, (obj.progress / achievement.required_count) * 100)
            color = "#28a745" if percentage >= 100 else "#17a2b8"
            return format_html(
                '<div style="width:100px; background:#e9ecef; border-radius:3px;"><div style="width:{}%; background:{}; padding:2px; border-radius:3px; text-align:center; color:white; font-size:10px;">{:.0f}%</div></div>',
                percentage, color, percentage
            )
        return "-"
    progress_bar.short_description = "進捗"

