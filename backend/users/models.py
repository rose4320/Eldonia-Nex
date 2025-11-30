import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """カスタムユーザーモデル（AbstractUser を拡張）"""

    # external unique identifier for user management (UUID)
    external_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    display_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(max_length=500, blank=True)
    website_url = models.URLField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    birth_date = models.DateField(null=True, blank=True)

    GENDER_CHOICES = [("M", "Male"), ("F", "Female"), ("O", "Other")]
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)

    phone_number = models.CharField(max_length=20, blank=True)
    is_email_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)

    ACCOUNT_STATUS_CHOICES = [
        ("active", "Active"),
        ("suspended", "Suspended"),
        ("deleted", "Deleted"),
    ]
    account_status = models.CharField(
        max_length=20, choices=ACCOUNT_STATUS_CHOICES, default="active"
    )

    SUBSCRIPTION_TYPE_CHOICES = [
        ("free", "Free"),
        ("premium", "Premium"),
        ("pro", "Pro"),
    ]
    subscription_type = models.CharField(
        max_length=20, choices=SUBSCRIPTION_TYPE_CHOICES, default="free"
    )
    # subscription_plan stored as VARCHAR(20) per DB design doc (plan id like 'free','standard','pro','business')
    subscription_plan = models.CharField(max_length=20, default="free")
    # compatibility field `subscription` requested in docs/usage — mirrors subscription_plan (backfilled)
    subscription = models.CharField(max_length=20, default="free")
    # who referred this user (optional)
    referred_by_user = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="referred_users",
    )
    # the referral code used at registration (if any)
    referral_code_used = models.CharField(max_length=50, null=True, blank=True)

    total_exp = models.BigIntegerField(default=0)
    current_level = models.IntegerField(default=1)
    fan_count = models.IntegerField(default=0)
    fanning_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "users"
        indexes = [
            models.Index(fields=["username"]),
            models.Index(fields=["email"]),
            models.Index(fields=["current_level"]),
            models.Index(fields=["total_exp"]),
            models.Index(fields=["subscription_plan"]),
            models.Index(fields=["subscription"]),
        ]


class UserProfile(models.Model):
    """拡張プロフィール（skills, socials 等を JSON で保持）"""

    user = models.OneToOneField(
        "users.User", on_delete=models.CASCADE, related_name="profile"
    )
    skills = models.JSONField(null=True, blank=True)
    portfolio_url = models.URLField(max_length=500, blank=True)
    hourly_rate = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    available_hours = models.IntegerField(null=True, blank=True)
    timezone = models.CharField(max_length=50, blank=True)
    languages = models.JSONField(null=True, blank=True)
    social_links = models.JSONField(null=True, blank=True)
    preferences = models.JSONField(null=True, blank=True)
    notification_settings = models.JSONField(null=True, blank=True)
    privacy_settings = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_profiles"


class Plan(models.Model):
    """Service subscription plan (pricing & features)."""
    objects = models.Manager()

    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    tier = models.CharField(max_length=50, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default="JPY")
    BILLING_CHOICES = [
        ("monthly", "Monthly"),
        ("yearly", "Yearly"),
        ("one_time", "One-time"),
    ]
    billing_cycle = models.CharField(
        max_length=20, choices=BILLING_CHOICES, default="monthly"
    )
    features = models.JSONField(null=True, blank=True)
    trial_days = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "plans"
        ordering = ["-is_active", "sort_order", "price"]

    def __str__(self) -> str:
        return f"{self.name} ({self.currency} {self.price})"


"""Users models module.

Defined models above. Removed trailing template lines.
"""
