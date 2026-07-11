from django.contrib import admin, messages

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
from .supabase_sync import set_supabase_artworks_visibility


@admin.action(description="選択した作品を表示（公開）")
def make_artworks_public(modeladmin, request, queryset):
    missing_supabase = queryset.filter(supabase_id__isnull=True).count()
    supabase_ids = list(
        queryset.filter(supabase_id__isnull=False).values_list("supabase_id", flat=True)
    )
    updated = queryset.update(status="published")
    synced = 0
    sync_errors: list[str] = []
    if supabase_ids:
        synced, sync_errors = set_supabase_artworks_visibility(supabase_ids, True)

    modeladmin.message_user(
        request,
        f"{updated} 件を表示（published）に更新しました。"
        + (f" GALLERY（Supabase）同期: {synced} 件。" if supabase_ids else ""),
        messages.SUCCESS,
    )
    if missing_supabase:
        modeladmin.message_user(
            request,
            f"{missing_supabase} 件は Supabase ID 未設定のため GALLERY に反映されません。"
            "先に管理画面の Supabase カタログ同期を実行してください。",
            messages.WARNING,
        )
    if supabase_ids and synced == 0 and not sync_errors:
        modeladmin.message_user(
            request,
            "GALLERY（Supabase）への反映に失敗しました。Supabase カタログ同期を実行してください。",
            messages.ERROR,
        )
    for error in sync_errors[:5]:
        modeladmin.message_user(request, error, messages.ERROR)
    if len(sync_errors) > 5:
        modeladmin.message_user(
            request,
            f"他 {len(sync_errors) - 5} 件の Supabase 同期エラーがあります。",
            messages.WARNING,
        )


@admin.action(description="選択した作品を非表示")
def make_artworks_private(modeladmin, request, queryset):
    missing_supabase = queryset.filter(supabase_id__isnull=True).count()
    supabase_ids = list(
        queryset.filter(supabase_id__isnull=False).values_list("supabase_id", flat=True)
    )
    updated = queryset.update(status="draft")
    synced = 0
    sync_errors: list[str] = []
    if supabase_ids:
        synced, sync_errors = set_supabase_artworks_visibility(supabase_ids, False)

    modeladmin.message_user(
        request,
        f"{updated} 件を非表示（draft）に更新しました。"
        + (f" GALLERY（Supabase）同期: {synced} 件。" if supabase_ids else ""),
        messages.SUCCESS,
    )
    if missing_supabase:
        modeladmin.message_user(
            request,
            f"{missing_supabase} 件は Supabase ID 未設定のため GALLERY に反映されません。"
            "先に管理画面の Supabase カタログ同期を実行してください。",
            messages.WARNING,
        )
    if supabase_ids and synced == 0 and not sync_errors:
        modeladmin.message_user(
            request,
            "GALLERY（Supabase）への反映に失敗しました。Supabase カタログ同期を実行してください。",
            messages.ERROR,
        )
    for error in sync_errors[:5]:
        modeladmin.message_user(request, error, messages.ERROR)
    if len(sync_errors) > 5:
        modeladmin.message_user(
            request,
            f"他 {len(sync_errors) - 5} 件の Supabase 同期エラーがあります。",
            messages.WARNING,
        )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("name", "slug", "is_active")


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("name", "usage_count")


@admin.register(Artwork)
class ArtworkAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("id", "supabase_id", "title", "creator", "status", "price")
    list_filter = ("status",)
    search_fields = ("title", "description", "supabase_id")
    readonly_fields = ("supabase_id",)
    actions = [make_artworks_public, make_artworks_private]


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("id", "name", "seller", "price")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("id", "user", "total_amount", "status", "created_at")
    list_filter = ("status",)


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("id", "artwork", "user", "created_at")


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("user", "artwork", "id")


@admin.register(Fan)
class FanAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("fan", "fanned")


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("user", "transaction_type", "amount", "created_at")


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):  # type: ignore
    list_display = (
        "referral_code",
        "referrer",
        "referred_user",
        "status",
        "country_code",
        "rebate_percent",
        "reward_available_at",
    )
    list_filter = ("status", "country_code", "rebate_percent")
    search_fields = ("referral_code", "referrer__username", "referred_user__username")


@admin.register(ReferralTrack)
class ReferralTrackAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("referral", "tracking_type", "visitor_ip", "created_at")
