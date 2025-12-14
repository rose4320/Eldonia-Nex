"""Admin configuration for localization app."""
from django.contrib import admin

from .models import ContentTranslation, Currency, ExchangeRate, Language


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    """Admin for Language model."""

    list_display = ["code", "name", "native_name", "is_active", "is_default", "sort_order"]
    list_filter = ["is_active", "is_default"]
    search_fields = ["code", "name", "native_name"]
    ordering = ["sort_order", "code"]


@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    """Admin for Currency model."""

    list_display = [
        "code",
        "name",
        "symbol",
        "decimal_places",
        "is_active",
        "is_default",
        "sort_order",
    ]
    list_filter = ["is_active", "is_default"]
    search_fields = ["code", "name"]
    ordering = ["sort_order", "code"]


@admin.register(ExchangeRate)
class ExchangeRateAdmin(admin.ModelAdmin):
    """Admin for ExchangeRate model."""

    list_display = ["from_currency", "to_currency", "rate", "effective_date", "source"]
    list_filter = ["from_currency", "to_currency", "effective_date"]
    search_fields = ["from_currency__code", "to_currency__code"]
    ordering = ["-effective_date"]
    date_hierarchy = "effective_date"


@admin.register(ContentTranslation)
class ContentTranslationAdmin(admin.ModelAdmin):
    """Admin for ContentTranslation model."""

    list_display = [
        "content_type",
        "content_id",
        "field_name",
        "language",
        "is_machine_translated",
        "is_verified",
    ]
    list_filter = [
        "content_type",
        "language",
        "is_machine_translated",
        "is_verified",
    ]
    search_fields = ["content_id", "translation"]
    ordering = ["-created_at"]
