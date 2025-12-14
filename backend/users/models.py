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

    # Localization settings
    preferred_language = models.CharField(
        max_length=5,
        default="ja",
        help_text="User's preferred language (ISO 639-1 code)",
    )
    preferred_currency = models.CharField(
        max_length=3,
        default="JPY",
        help_text="User's preferred currency (ISO 4217 code)",
    )
    timezone = models.CharField(
        max_length=50,
        default="Asia/Tokyo",
        help_text="User's timezone (e.g., 'Asia/Tokyo', 'America/New_York')",
    )

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
            models.Index(fields=["preferred_language"]),
            models.Index(fields=["preferred_currency"]),
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


class UserAddress(models.Model):
    """ユーザー住所詳細テーブル"""
    objects = models.Manager()

    user = models.OneToOneField(
        "users.User", on_delete=models.CASCADE, related_name="address"
    )
    # 国コード (ISO 3166-1 alpha-2)
    country_code = models.CharField(max_length=2, null=True, blank=True)
    country_name = models.CharField(max_length=100, null=True, blank=True)
    # 郵便番号
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    # 都道府県/州
    state_province = models.CharField(max_length=100, null=True, blank=True)
    # 市区町村
    city = models.CharField(max_length=100, null=True, blank=True)
    # 町名・番地
    address_line1 = models.CharField(max_length=255, null=True, blank=True)
    # 建物名・部屋番号
    address_line2 = models.CharField(max_length=255, null=True, blank=True)
    # フルアドレス（表示用）
    full_address = models.TextField(null=True, blank=True)
    # 緯度・経度（オプション）
    latitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    longitude = models.DecimalField(max_digits=10, decimal_places=7, null=True, blank=True)
    # 住所タイプ
    ADDRESS_TYPE_CHOICES = [
        ("home", "Home"),
        ("work", "Work"),
        ("billing", "Billing"),
        ("shipping", "Shipping"),
    ]
    address_type = models.CharField(max_length=20, choices=ADDRESS_TYPE_CHOICES, default="home")
    is_primary = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_addresses"
        indexes = [
            models.Index(fields=["country_code"]),
            models.Index(fields=["postal_code"]),
        ]

    def __str__(self) -> str:
        return f"{self.user.username} - {self.city or 'No city'}, {self.country_name or 'No country'}"


class UserSkill(models.Model):
    """ユーザースキル詳細テーブル（正規化版）"""
    objects = models.Manager()

    user = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="user_skills"
    )
    # スキル名
    skill_name = models.CharField(max_length=100)
    # スキルカテゴリ
    CATEGORY_CHOICES = [
        ("art", "Art & Illustration"),
        ("music", "Music & Audio"),
        ("video", "Video & Animation"),
        ("writing", "Writing & Content"),
        ("programming", "Programming"),
        ("design", "Design"),
        ("3d", "3D Modeling"),
        ("game", "Game Development"),
        ("marketing", "Marketing"),
        ("other", "Other"),
    ]
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="other")
    # スキルレベル (1-5)
    LEVEL_CHOICES = [
        (1, "Beginner"),
        (2, "Elementary"),
        (3, "Intermediate"),
        (4, "Advanced"),
        (5, "Expert"),
    ]
    level = models.IntegerField(choices=LEVEL_CHOICES, default=1)
    # 経験年数
    years_of_experience = models.IntegerField(null=True, blank=True)
    # 認定・資格（あれば）
    certification = models.CharField(max_length=255, null=True, blank=True)
    # スキル説明
    description = models.TextField(null=True, blank=True)
    # 表示順
    sort_order = models.IntegerField(default=0)
    # メインスキルかどうか
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_skills"
        ordering = ["-is_primary", "sort_order", "-level"]
        indexes = [
            models.Index(fields=["skill_name"]),
            models.Index(fields=["category"]),
        ]

    def __str__(self) -> str:
        return f"{self.user.username} - {self.skill_name} (Lv.{self.level})"


class UserDetail(models.Model):
    """ユーザー詳細情報テーブル"""
    objects = models.Manager()

    user = models.OneToOneField(
        "users.User", on_delete=models.CASCADE, related_name="detail"
    )
    # 氏名（本名）
    first_name_kanji = models.CharField(max_length=50, null=True, blank=True)
    last_name_kanji = models.CharField(max_length=50, null=True, blank=True)
    first_name_kana = models.CharField(max_length=50, null=True, blank=True)
    last_name_kana = models.CharField(max_length=50, null=True, blank=True)
    # 職業
    occupation = models.CharField(max_length=100, null=True, blank=True)
    # 会社名/所属
    company_name = models.CharField(max_length=200, null=True, blank=True)
    company_position = models.CharField(max_length=100, null=True, blank=True)
    # 学歴
    education = models.CharField(max_length=200, null=True, blank=True)
    education_status = models.CharField(max_length=50, null=True, blank=True)
    # 収入区分（オプション）
    INCOME_RANGE_CHOICES = [
        ("under_200", "Under 2M JPY"),
        ("200_400", "2M - 4M JPY"),
        ("400_600", "4M - 6M JPY"),
        ("600_800", "6M - 8M JPY"),
        ("800_1000", "8M - 10M JPY"),
        ("over_1000", "Over 10M JPY"),
        ("undisclosed", "Undisclosed"),
    ]
    income_range = models.CharField(max_length=20, choices=INCOME_RANGE_CHOICES, null=True, blank=True)
    # 興味・関心
    interests = models.JSONField(null=True, blank=True)
    # 自己PR
    self_introduction = models.TextField(null=True, blank=True)
    # 希望案件・仕事
    desired_work_types = models.JSONField(null=True, blank=True)
    # 希望報酬
    desired_hourly_rate_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    desired_hourly_rate_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    # 稼働可能時間/週
    available_hours_per_week = models.IntegerField(null=True, blank=True)
    # リモートワーク可否
    is_remote_available = models.BooleanField(null=True, blank=True)
    # 身分証明確認済み
    is_identity_verified = models.BooleanField(default=False)
    # NDA締結済み
    has_signed_nda = models.BooleanField(default=False)
    # その他メモ
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "user_details"

    def __str__(self) -> str:
        return f"{self.user.username} - Detail"


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
