from django.contrib import admin
from django.utils.html import format_html

from .models import LiveStream, StreamDonation


@admin.register(LiveStream)
class LiveStreamAdmin(admin.ModelAdmin):  # type: ignore
    """ライブ配信管理"""
    list_display = (
        "title",
        "streamer",
        "status_badge",
        "scheduled_start",
        "created_at",
    )
    list_filter = ("status", "scheduled_start", "created_at")
    search_fields = ("title", "description", "streamer__username")
    readonly_fields = ("created_at",)
    date_hierarchy = "scheduled_start"
    list_per_page = 50

    def status_badge(self, obj):
        colors = {
            "scheduled": "#ffc107",
            "live": "#dc3545",
            "ended": "#6c757d",
            "cancelled": "#343a40"
        }
        icons = {
            "scheduled": "⏱",
            "live": "🔴",
            "ended": "✓",
            "cancelled": "✗"
        }
        return format_html(
            '<span style="background-color:{}; color:white; padding:3px 10px; border-radius:3px;">{} {}</span>',
            colors.get(obj.status, "#6c757d"), 
            icons.get(obj.status, ""), 
            obj.status.upper()
        )
    status_badge.short_description = "ステータス"



@admin.register(StreamDonation)
class StreamDonationAdmin(admin.ModelAdmin):  # type: ignore
    """投げ銭管理"""
    list_display = (
        "stream",
        "donor",
        "amount_display",
        "message_preview",
        "created_at",
    )
    list_filter = ("created_at",)
    search_fields = ("stream__title", "donor__username", "message")
    readonly_fields = ("created_at",)
    date_hierarchy = "created_at"

    def amount_display(self, obj):
        return format_html('<strong>¥{:,.0f}</strong>', obj.amount)
    amount_display.short_description = "金額"

    def message_preview(self, obj):
        if obj.message:
            return obj.message[:50] + "..." if len(obj.message) > 50 else obj.message
        return "-"
    message_preview.short_description = "メッセージ"
