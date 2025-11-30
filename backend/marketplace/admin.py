from django.contrib import admin
from django.db.models import Count
from django.utils.html import format_html

from .models import (
    Artwork,
    Category,
    Comment,
    Fan,
    Like,
    Order,
    Product,
    Referral,
    ReferralTrack,
    Tag,
    Transaction,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):  # type: ignore
    """カテゴリ管理"""
    list_display = ("name", "slug", "is_active", "artwork_count")
    list_filter = ("is_active",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ("is_active",)

    def artwork_count(self, obj):
        # Note: Need to add reverse relation or count manually
        return "-"
    artwork_count.short_description = "作品数"


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):  # type: ignore
    """タグ管理"""
    list_display = ("name", "usage_count", "created_at")
    search_fields = ("name",)
    readonly_fields = ("created_at",)
    ordering = ("-usage_count",)


@admin.register(Artwork)
class ArtworkAdmin(admin.ModelAdmin):  # type: ignore
    """作品管理 - 完全制御"""
    
    # カスタムアクション
    actions = ['publish_artworks', 'archive_artworks', 'mark_as_featured']
    
    list_display = (
        "id",
        "title",
        "creator",
        "status_badge",
        "price_display",
        "view_count",
        "like_count_display",
        "comment_count_display",
        "created_at",
    )
    list_filter = ("status", "created_at", "is_adult_content", "is_free")
    search_fields = ("title", "description", "creator__username")
    readonly_fields = ("created_at", "updated_at", "creator_external_id", "view_count", "like_count", "comment_count", "download_count")
    date_hierarchy = "created_at"
    list_per_page = 50
    filter_horizontal = ()  # tags uses through model, so can't use filter_horizontal
    
    fieldsets = (
        ("基本情報", {
            "fields": ("title", "description", "creator")
        }),
        ("ファイル", {
            "fields": ("file_url", "thumbnail_url", "file_size", "file_type")
        }),
        ("カテゴリ", {
            "fields": ("category",)
        }),
        ("価格・ライセンス", {
            "fields": ("price", "is_free", "license_type")
        }),
        ("ステータス・制限", {
            "fields": ("status", "is_adult_content", "featured_until")
        }),
        ("統計情報", {
            "fields": ("view_count", "like_count", "comment_count", "download_count"),
            "classes": ("collapse",)
        }),
        ("非正規化フィールド", {
            "fields": ("creator_display_name", "creator_avatar_url", "creator_external_id"),
            "classes": ("collapse",)
        }),
        ("タイムスタンプ", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )

    def like_count_display(self, obj):
        return format_html('<strong>{}</strong> ❤️', obj.like_count)
    like_count_display.short_description = "いいね"

    def comment_count_display(self, obj):
        return format_html('<strong>{}</strong> 💬', obj.comment_count)
    comment_count_display.short_description = "コメント"

    def status_badge(self, obj):
        colors = {
            "draft": "#6c757d",
            "published": "#28a745",
            "archived": "#dc3545"
        }
        return format_html(
            '<span style="background-color:{}; color:white; padding:3px 10px; border-radius:3px;">{}</span>',
            colors.get(obj.status, "#6c757d"), obj.status.upper()
        )
    status_badge.short_description = "ステータス"

    def price_display(self, obj):
        if obj.is_free or obj.price == 0:
            return format_html('<span style="color:green;">無料</span>')
        return format_html('<strong>¥{:,.0f}</strong>', obj.price)
    price_display.short_description = "価格"

    def like_count(self, obj):
        return obj.likes.count()
    like_count.short_description = "いいね"

    def comment_count(self, obj):
        return obj.comments.count()
    comment_count.short_description = "コメント"
    
    # カスタムアクション実装
    def publish_artworks(self, request, queryset):
        updated = queryset.update(status="published")
        self.message_user(request, f"{updated}作品を公開しました。")
    publish_artworks.short_description = "✓ 選択した作品を公開する"
    
    def archive_artworks(self, request, queryset):
        updated = queryset.update(status="archived")
        self.message_user(request, f"{updated}作品をアーカイブしました。")
    archive_artworks.short_description = "📦 選択した作品をアーカイブ"
    
    def mark_as_featured(self, request, queryset):
        from datetime import timedelta

        from django.utils import timezone
        featured_until = timezone.now() + timedelta(days=30)
        updated = queryset.update(featured_until=featured_until)
        self.message_user(request, f"{updated}作品を30日間特集しました。")
    mark_as_featured.short_description = "⭐ 特集作品に設定（30日間）"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):  # type: ignore
    """商品管理"""
    list_display = ("id", "name", "seller", "price_display", "stock_quantity", "created_at")
    list_filter = ("created_at", "is_digital")
    search_fields = ("name", "description", "seller__username")
    readonly_fields = ("created_at",)

    def price_display(self, obj):
        return format_html('<strong>¥{:,.0f}</strong>', obj.price)
    price_display.short_description = "価格"


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):  # type: ignore
    """注文管理 - 完全制御"""
    list_display = (
        "id",
        "user",
        "status_badge",
        "total_amount_display",
        "item_count",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = ("id", "user__username", "user__email")
    readonly_fields = ("created_at", "updated_at")
    date_hierarchy = "created_at"

    def status_badge(self, obj):
        colors = {
            "pending": "#ffc107",
            "paid": "#28a745",
            "shipped": "#17a2b8",
            "completed": "#28a745",
            "cancelled": "#dc3545"
        }
        return format_html(
            '<span style="background-color:{}; color:white; padding:3px 10px; border-radius:3px;">{}</span>',
            colors.get(obj.status, "#6c757d"), obj.get_status_display()
        )
    status_badge.short_description = "ステータス"

    def total_amount_display(self, obj):
        return format_html('<strong>¥{:,.0f}</strong>', obj.total_amount)
    total_amount_display.short_description = "合計金額"

    def item_count(self, obj):
        return obj.items.count()
    item_count.short_description = "商品数"


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):  # type: ignore
    """コメント管理"""
    list_display = ("id", "artwork", "user", "content_preview", "created_at")
    list_filter = ("created_at",)
    search_fields = ("content", "user__username")
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"

    def content_preview(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content
    content_preview.short_description = "コメント内容"


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):  # type: ignore
    """いいね管理"""
    list_display = ("user", "artwork", "created_at")
    list_filter = ("created_at",)
    search_fields = ("user__username", "artwork__title")
    date_hierarchy = "created_at"


@admin.register(Fan)
class FanAdmin(admin.ModelAdmin):  # type: ignore
    """フォロー管理"""
    list_display = ("fan", "fanned", "created_at")
    list_filter = ("created_at",)
    search_fields = ("fan__username", "fanned__username")
    date_hierarchy = "created_at"


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):  # type: ignore
    """取引管理 - 完全制御"""
    list_display = (
        "id",
        "user",
        "transaction_type",
        "amount_display",
        "created_at",
    )
    list_filter = ("transaction_type", "created_at")
    search_fields = ("user__username",)
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"

    def amount_display(self, obj):
        return format_html('<strong>¥{:,.0f}</strong>', obj.amount)
    amount_display.short_description = "金額"



@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):  # type: ignore
    """リファラル管理 - 完全制御"""
    list_display = (
        "referral_code",
        "referrer",
        "referred_user",
        "status_badge",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = ("referral_code", "referrer__username")
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"

    def status_badge(self, obj):
        colors = {
            "active": "#28a745",
            "inactive": "#6c757d",
            "completed": "#17a2b8"
        }
        return format_html(
            '<span style="background-color:{}; color:white; padding:3px 10px; border-radius:3px;">{}</span>',
            colors.get(obj.status, "#6c757d"), obj.status.upper()
        )
    status_badge.short_description = "ステータス"


@admin.register(ReferralTrack)
class ReferralTrackAdmin(admin.ModelAdmin):  # type: ignore
    """リファラルトラッキング管理"""
    list_display = (
        "referral",
        "tracking_type",
        "visitor_ip",
        "user_agent_preview",
        "created_at",
    )
    list_filter = ("tracking_type", "created_at")
    search_fields = ("visitor_ip", "referral__referral_code")
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"

    def user_agent_preview(self, obj):
        return obj.user_agent[:50] + "..." if obj.user_agent and len(obj.user_agent) > 50 else obj.user_agent or "-"
    user_agent_preview.short_description = "User Agent"
