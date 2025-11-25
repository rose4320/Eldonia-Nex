from django.contrib import admin

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
    list_display = ("name", "slug", "is_active")


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("name", "usage_count")


@admin.register(Artwork)
class ArtworkAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("id", "title", "creator", "status", "price")
    search_fields = ("title", "description")


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
    list_display = ("referral_code", "referrer", "status")


@admin.register(ReferralTrack)
class ReferralTrackAdmin(admin.ModelAdmin):  # type: ignore
    list_display = ("referral", "tracking_type", "visitor_ip", "created_at")
