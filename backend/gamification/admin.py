from django.contrib import admin

from .models import Achievement, ExpAction, UserAchievement, UserExpLog


@admin.register(ExpAction)
class ExpActionAdmin(admin.ModelAdmin):  # type: ignore
    list_display = (
        "action_type",
        "description",
        "base_exp",
        "max_daily_count",
        "is_active",
        "created_at",
    )
    list_editable = ("base_exp", "max_daily_count", "is_active")
    list_filter = ("is_active",)
    search_fields = ("action_type", "description")
    ordering = ("action_type",)
    readonly_fields = ("created_at",)


@admin.register(UserExpLog)
class UserExpLogAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("user", "action", "exp_gained", "created_at")


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("name", "category", "rarity")


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("user", "achievement", "progress", "completed_at")
