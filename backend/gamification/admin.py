from django.contrib import admin

from .models import Achievement, ExpAction, UserAchievement, UserExpLog


@admin.register(ExpAction)
class ExpActionAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("action_type", "base_exp", "is_active")


@admin.register(UserExpLog)
class UserExpLogAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("user", "action", "exp_gained", "created_at")


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("name", "category", "rarity")


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("user", "achievement", "progress", "completed_at")
