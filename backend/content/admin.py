"""Django admin registrations for content app."""

from django import forms
from django.contrib import admin

from .models import FooterPartner


class FooterPartnerAdminForm(forms.ModelForm):
    class Meta:
        model = FooterPartner
        fields = "__all__"

    def clean(self):
        cleaned = super().clean()
        link_enabled = cleaned.get("link_enabled")
        url = (cleaned.get("url") or "").strip()
        if link_enabled and not url:
            self.add_error("url", "「リンク付き」をオンにする場合は URL を入力してください。")
        return cleaned


@admin.register(FooterPartner)
class FooterPartnerAdmin(admin.ModelAdmin):
    form = FooterPartnerAdminForm
    list_display = (
        "name",
        "role_ja",
        "link_enabled",
        "url",
        "sort_order",
        "is_active",
        "updated_at",
    )
    list_editable = ("link_enabled", "sort_order", "is_active")
    list_filter = ("is_active", "link_enabled")
    search_fields = ("name", "role_ja", "role_en")
    ordering = ("sort_order", "id")
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "name",
                    "sort_order",
                    "is_active",
                )
            },
        ),
        (
            "リンク設定",
            {
                "description": "リンク付きをオフにすると、URL があってもフッターではテキストのみ表示されます。",
                "fields": (
                    "link_enabled",
                    "url",
                ),
            },
        ),
        (
            "役割ラベル（多言語）",
            {
                "fields": (
                    "role_ja",
                    "role_en",
                    "role_ko",
                    "role_zh_cn",
                )
            },
        ),
    )
    readonly_fields = ("created_at", "updated_at")
