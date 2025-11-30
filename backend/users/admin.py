from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.db.models import Count
from django.utils.html import format_html

from .models import Plan, User, UserProfile


@admin.register(User)
class UserAdmin(DjangoUserAdmin):  # type: ignore
    """拡張ユーザー管理 - 全ての機能を制御"""
    model = User
    
    # カスタムアクション
    actions = ['activate_users', 'deactivate_users', 'upgrade_to_premium']
    
    _fieldsets = list(DjangoUserAdmin.fieldsets)
    _fieldsets.append(
        (
            "🎨 プロフィール情報",
            {
                "fields": (
                    "display_name",
                    "bio",
                    "avatar_url",
                    "external_id",
                )
            },
        )
    )
    _fieldsets.append(
        (
            "💳 サブスクリプション",
            {
                "fields": (
                    "subscription_type",
                    "subscription",
                    "subscription_plan",
                )
            },
        )
    )
    _fieldsets.append(
        (
            "🏆 ゲーミフィケーション",
            {
                "fields": (
                    "total_exp",
                    "current_level",
                )
            },
        )
    )
    _fieldsets.append(
        (
            "🔗 リファラル",
            {
                "fields": (
                    "account_status",
                    "referred_by_user",
                    "referral_code_used",
                )
            },
        )
    )
    fieldsets = tuple(_fieldsets)
    
    list_display = [
        "id",
        "username_display",
        "email",
        "subscription_badge",
        "level_badge",
        "staff_badge",
        "status_badge",
        "referred_count",
        "joined_date",
    ]
    list_filter = [
        "is_staff",
        "is_superuser",
        "is_active",
        "subscription",
        "account_status",
        "date_joined",
    ]
    search_fields = ["username", "email", "display_name", "external_id"]
    readonly_fields = ("external_id", "date_joined", "last_login")
    ordering = ["-date_joined"]
    list_per_page = 50
    
    def username_display(self, obj):
        return format_html(
            '<strong>{}</strong><br><small style="color:#6c757d;">{}</small>',
            obj.username,
            obj.display_name or obj.email
        )
    username_display.short_description = "ユーザー"

    def subscription_badge(self, obj):
        colors = {
            "free": "#6c757d",
            "basic": "#007bff",
            "premium": "#28a745",
            "enterprise": "#ffc107"
        }
        icons = {
            "free": "🆓",
            "basic": "⭐",
            "premium": "💎",
            "enterprise": "👑"
        }
        color = colors.get(obj.subscription, "#6c757d")
        icon = icons.get(obj.subscription, "")
        return format_html(
            '<span style="background-color:{}; color:white; padding:5px 12px; border-radius:15px; font-weight:600; font-size:11px;">{} {}</span>',
            color, icon, obj.subscription.upper()
        )
    subscription_badge.short_description = "プラン"

    def level_badge(self, obj):
        return format_html(
            '<span style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%); color:white; padding:5px 12px; border-radius:15px; font-weight:600;">Lv.{}</span><br><small style="color:#6c757d;">{} XP</small>',
            obj.current_level, obj.total_exp
        )
    level_badge.short_description = "レベル"

    def staff_badge(self, obj):
        if obj.is_superuser:
            return format_html('<span style="background:#dc3545; color:white; padding:3px 8px; border-radius:10px; font-size:10px;">🛡️ スーパー</span>')
        elif obj.is_staff:
            return format_html('<span style="background:#17a2b8; color:white; padding:3px 8px; border-radius:10px; font-size:10px;">👤 スタッフ</span>')
        return "-"
    staff_badge.short_description = "権限"

    def status_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="color:green; font-size:16px;" title="アクティブ">✓</span>')
        return format_html('<span style="color:red; font-size:16px;" title="非アクティブ">✗</span>')
    status_badge.short_description = "状態"

    def referred_count(self, obj):
        count = obj.referred_users.count()
        if count > 0:
            return format_html('<strong style="color:#667eea;">{}</strong> 👥', count)
        return "-"
    referred_count.short_description = "紹介"

    def joined_date(self, obj):
        return format_html(
            '<span title="{}">{}</span>',
            obj.date_joined.strftime("%Y-%m-%d %H:%M"),
            obj.date_joined.strftime("%Y-%m-%d")
        )
    joined_date.short_description = "登録日"
    
    # カスタムアクション実装
    def activate_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated}人のユーザーをアクティブにしました。")
    activate_users.short_description = "✓ 選択したユーザーをアクティブにする"
    
    def deactivate_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated}人のユーザーを非アクティブにしました。")
    deactivate_users.short_description = "✗ 選択したユーザーを非アクティブにする"
    
    def upgrade_to_premium(self, request, queryset):
        updated = queryset.update(subscription="premium")
        self.message_user(request, f"{updated}人のユーザーをプレミアムにアップグレードしました。")
    upgrade_to_premium.short_description = "💎 プレミアムにアップグレード"


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):  # type: ignore
    """ユーザープロフィール管理"""
    list_display = ("user_display", "timezone", "created_date")
    list_filter = ("timezone", "created_at")
    search_fields = ("user__username", "user__email")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"
    
    def user_display(self, obj):
        return format_html(
            '<strong>{}</strong><br><small>{}</small>',
            obj.user.username,
            obj.user.email
        )
    user_display.short_description = "ユーザー"
    
    def created_date(self, obj):
        return obj.created_at.strftime("%Y-%m-%d")
    created_date.short_description = "作成日"


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):  # type: ignore
    """サブスクリプションプラン管理"""
    actions = ['activate_plans', 'deactivate_plans']
    
    list_display = (
        "name",
        "slug",
        "tier",
        "price_display",
        "billing_cycle",
        "trial_badge",
        "active_badge",
        "sort_order",
        "subscriber_count",
    )
    list_filter = ("billing_cycle", "is_active", "currency")
    search_fields = ("name", "slug", "tier")
    list_editable = ("sort_order",)
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = ("created_at", "updated_at", "subscriber_count_detail")
    
    fieldsets = (
        ("📋 基本情報", {
            "fields": ("name", "slug", "tier")
        }),
        ("💰 価格設定", {
            "fields": ("price", "currency", "billing_cycle")
        }),
        ("✨ 機能・特典", {
            "fields": ("features", "trial_days")
        }),
        ("⚙️ 表示設定", {
            "fields": ("is_active", "sort_order")
        }),
        ("📊 統計", {
            "fields": ("subscriber_count_detail",),
            "classes": ("collapse",)
        }),
        ("🕐 タイムスタンプ", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )

    def price_display(self, obj):
        return format_html(
            '<strong style="font-size:18px;">{}{:,.0f}</strong><small style="color:#6c757d;"> / {}</small>',
            obj.currency, obj.price, obj.billing_cycle
        )
    price_display.short_description = "価格"
    
    def trial_badge(self, obj):
        if obj.trial_days > 0:
            return format_html(
                '<span style="background:#17a2b8; color:white; padding:3px 8px; border-radius:10px; font-size:11px;">🎁 {}日間</span>',
                obj.trial_days
            )
        return "-"
    trial_badge.short_description = "トライアル"
    
    def active_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="color:green; font-size:18px;">✓</span>')
        return format_html('<span style="color:red; font-size:18px;">✗</span>')
    active_badge.short_description = "有効"
    
    def subscriber_count(self, obj):
        # Count users with this plan
        from .models import User
        count = User.objects.filter(subscription_plan=obj).count()
        if count > 0:
            return format_html('<strong style="color:#667eea;">{}</strong> 人', count)
        return "-"
    subscriber_count.short_description = "利用者"
    
    def subscriber_count_detail(self, obj):
        from .models import User
        count = User.objects.filter(subscription_plan=obj).count()
        return format_html('{} 人がこのプランを利用中', count)
    subscriber_count_detail.short_description = "利用者数"
    
    # カスタムアクション
    def activate_plans(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated}個のプランを有効にしました。")
    activate_plans.short_description = "✓ 選択したプランを有効にする"
    
    def deactivate_plans(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated}個のプランを無効にしました。")
    deactivate_plans.short_description = "✗ 選択したプランを無効にする"
