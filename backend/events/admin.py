from django.contrib import admin
from django.utils.html import format_html

from .models import Event, EventTicket


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):  # type: ignore
    """イベント管理"""
    list_display = (
        "title",
        "organizer",
        "status_badge",
        "start_datetime",
        "end_datetime",
        "venue_name",
    )
    list_filter = ("status", "start_datetime", "event_type")
    search_fields = ("title", "description", "organizer__username", "venue_name")
    readonly_fields = ("created_at",)
    date_hierarchy = "start_datetime"
    list_per_page = 50

    def status_badge(self, obj):
        colors = {
            "draft": "#6c757d",
            "published": "#28a745",
            "ongoing": "#17a2b8",
            "completed": "#ffc107",
            "cancelled": "#dc3545"
        }
        return format_html(
            '<span style="background-color:{}; color:white; padding:3px 10px; border-radius:3px;">{}</span>',
            colors.get(obj.status, "#6c757d"), obj.status.upper()
        )
    status_badge.short_description = "ステータス"


@admin.register(EventTicket)
class EventTicketAdmin(admin.ModelAdmin):  # type: ignore
    """イベントチケット管理"""
    list_display = (
        "event",
        "ticket_type",
        "price_display",
        "quantity",
        "sold_quantity",
        "is_active",
    )
    list_filter = ("is_active", "created_at")
    search_fields = ("event__title", "ticket_type")
    readonly_fields = ("created_at",)
    list_editable = ("is_active",)

    def price_display(self, obj):
        return format_html('<strong>¥{:,.0f}</strong>', obj.price)
    price_display.short_description = "価格"
