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
    ShopProduct,
    Tag,
    Transaction,
)
from .admin_filters import (
    CreatorFilter,
    GalleryCategoryFilter,
    VerifyArtworkFilter,
    gallery_category_label,
    infer_gallery_category,
)
from .supabase_sync import (
    hide_supabase_artworks_by_title_prefix,
    resolve_artwork_supabase_ids,
    set_supabase_artworks_visibility,
    set_supabase_shop_products_active,
)


def _apply_gallery_visibility(modeladmin, request, queryset, *, is_public: bool, status: str) -> None:
    supabase_ids, resolved_from_title, still_missing = resolve_artwork_supabase_ids(queryset)
    updated = queryset.update(status=status)
    synced = 0
    sync_errors: list[str] = []
    if supabase_ids:
        synced, sync_errors = set_supabase_artworks_visibility(supabase_ids, is_public)

    label = "表示（published）" if is_public else "非表示（draft）"
    modeladmin.message_user(
        request,
        f"{updated} 件を{label}に更新しました。"
        + (f" GALLERY（Supabase）同期: {synced} 件。" if supabase_ids else ""),
        messages.SUCCESS,
    )
    if resolved_from_title:
        modeladmin.message_user(
            request,
            f"{resolved_from_title} 件はタイトル一致で Supabase ID を補完しました。",
            messages.INFO,
        )
    if still_missing:
        modeladmin.message_user(
            request,
            f"{still_missing} 件は Supabase に対応作品が見つからず GALLERY に反映されません。"
            "管理画面の Supabase カタログ同期を実行してください。",
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


@admin.action(description="選択した作品を表示（公開）")
def make_artworks_public(modeladmin, request, queryset):
    _apply_gallery_visibility(modeladmin, request, queryset, is_public=True, status="published")


@admin.action(description="選択した作品を非表示")
def make_artworks_private(modeladmin, request, queryset):
    _apply_gallery_visibility(modeladmin, request, queryset, is_public=False, status="draft")


@admin.action(description="[verify] テスト作品をすべて非表示")
def hide_verify_test_artworks(modeladmin, request, queryset):
    del queryset
    try:
        hidden = hide_supabase_artworks_by_title_prefix("[verify]%")
    except Exception as exc:
        modeladmin.message_user(request, str(exc), messages.ERROR)
        return

    updated = Artwork.objects.filter(title__istartswith="[verify]").update(status="draft")
    modeladmin.message_user(
        request,
        f"[verify] テスト作品 {hidden} 件を GALLERY 非公開にしました（Django: {updated} 件）。",
        messages.SUCCESS,
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("name", "slug", "is_active")


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("name", "usage_count")


@admin.register(Artwork)
class ArtworkAdmin(admin.ModelAdmin):  # type: ignore
    list_display = (
        "id",
        "supabase_id_short",
        "title",
        "gallery_category_display",
        "creator_display_name",
        "status",
        "created_at",
    )
    list_filter = (
        "status",
        GalleryCategoryFilter,
        CreatorFilter,
        VerifyArtworkFilter,
    )
    search_fields = (
        "title",
        "description",
        "supabase_id",
        "creator__username",
        "creator__display_name",
        "creator_display_name",
    )
    readonly_fields = ("supabase_id", "gallery_category")
    autocomplete_fields = ("creator",)
    list_select_related = ("creator",)
    ordering = ("-created_at",)
    list_per_page = 50
    date_hierarchy = "created_at"
    actions = [make_artworks_public, make_artworks_private, hide_verify_test_artworks]

    @admin.display(description="Supabase ID", ordering="supabase_id")
    def supabase_id_short(self, obj: Artwork) -> str:
        if not obj.supabase_id:
            return "—"
        value = str(obj.supabase_id)
        return f"{value[:8]}…"

    @admin.display(description="GALLERYカテゴリ", ordering="gallery_category")
    def gallery_category_display(self, obj: Artwork) -> str:
        slug = infer_gallery_category(obj)
        return gallery_category_label(slug)


def _apply_shop_product_active(modeladmin, request, queryset, *, is_active: bool) -> None:
    supabase_ids = [row.supabase_id for row in queryset if row.supabase_id]
    updated = queryset.update(is_active=is_active)
    synced = 0
    sync_errors: list[str] = []
    if supabase_ids:
        synced, sync_errors = set_supabase_shop_products_active(supabase_ids, is_active)

    label = "公開" if is_active else "非公開"
    modeladmin.message_user(
        request,
        f"{updated} 件を{label}に更新しました。"
        + (f" SHOP（Supabase）同期: {synced} 件。" if supabase_ids else ""),
        messages.SUCCESS,
    )
    for error in sync_errors[:5]:
        modeladmin.message_user(request, error, messages.ERROR)
    if len(sync_errors) > 5:
        modeladmin.message_user(
            request,
            f"他 {len(sync_errors) - 5} 件の Supabase 同期エラーがあります。",
            messages.WARNING,
        )


@admin.action(description="選択した商品を公開（Shop FE 反映）")
def make_shop_products_active(modeladmin, request, queryset):
    _apply_shop_product_active(modeladmin, request, queryset, is_active=True)


@admin.action(description="選択した商品を非公開（Shop FE 反映）")
def make_shop_products_inactive(modeladmin, request, queryset):
    _apply_shop_product_active(modeladmin, request, queryset, is_active=False)


@admin.register(ShopProduct)
class ShopProductAdmin(admin.ModelAdmin):  # type: ignore
    list_display = (
        "title",
        "category",
        "product_type",
        "price",
        "seller_display",
        "is_active",
        "is_nexus_prime",
        "is_nexus_choice",
        "created_at",
    )
    list_filter = ("is_active", "category", "product_type", "is_nexus_prime", "is_nexus_choice")
    search_fields = ("title", "description", "supabase_id", "seller__username", "seller__display_name")
    readonly_fields = ("supabase_id", "seller_external_id", "created_at", "updated_at")
    autocomplete_fields = ("seller",)
    list_select_related = ("seller",)
    ordering = ("-created_at",)
    list_per_page = 50
    date_hierarchy = "created_at"
    actions = [make_shop_products_active, make_shop_products_inactive]

    @admin.display(description="出品者", ordering="seller__display_name")
    def seller_display(self, obj: ShopProduct) -> str:
        if obj.seller:
            return obj.seller.display_name or obj.seller.username
        if obj.seller_external_id:
            return str(obj.seller_external_id)[:8] + "…"
        return "—"


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
