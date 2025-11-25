from django.conf import settings
from django.db import models


class ExpAction(models.Model):
    action_type = models.CharField(max_length=50, unique=True)
    base_exp = models.IntegerField()
    description = models.CharField(max_length=255, blank=True)
    max_daily_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "exp_actions"


class UserExpLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    action = models.ForeignKey(
        ExpAction,
        to_field="action_type",
        db_column="action_type",
        on_delete=models.CASCADE,
    )
    exp_gained = models.IntegerField()
    reference_id = models.BigIntegerField(null=True, blank=True)
    reference_type = models.CharField(max_length=50, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "user_exp_log"


class Achievement(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50, blank=True)
    condition_type = models.CharField(max_length=50)
    condition_value = models.IntegerField()
    badge_icon_url = models.URLField(max_length=500, blank=True)
    rarity = models.CharField(max_length=20, default="common")
    is_hidden = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "achievements"


class UserAchievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    progress = models.IntegerField(default=0)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "user_achievements"
        unique_together = ("user", "achievement")


"""Gamification models module.

Defined models above. Removed trailing template lines.
"""
