"""Site content models managed via Django Admin."""

from django.db import models


class FooterPartner(models.Model):
    """フッター右側「協力・スポンサー」枠。Admin から表示順・文言を編集する。"""

    name = models.CharField("表示名", max_length=120)
    role_ja = models.CharField("役割（日本語）", max_length=120)
    role_en = models.CharField("役割（英語）", max_length=120, blank=True)
    role_ko = models.CharField("役割（韓国語）", max_length=120, blank=True)
    role_zh_cn = models.CharField("役割（中国語・簡体）", max_length=120, blank=True)
    link_enabled = models.BooleanField(
        "リンク付き",
        default=False,
        help_text="オンのときのみ、下の URL をフッターでクリック可能にします。",
    )
    url = models.URLField(
        "リンク URL",
        blank=True,
        help_text="「リンク付き」がオンのとき必須。オフなら保存していても表示しません。",
    )
    sort_order = models.IntegerField("表示順", default=0)
    is_active = models.BooleanField("公開", default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "footer_partners"
        ordering = ["sort_order", "id"]
        verbose_name = "フッター協力・スポンサー"
        verbose_name_plural = "フッター協力・スポンサー"

    def __str__(self) -> str:
        return self.name

    def role_payload(self) -> dict[str, str]:
        return {
            "ja": self.role_ja,
            "en": self.role_en or self.role_ja,
            "ko": self.role_ko or self.role_ja,
            "zh-CN": self.role_zh_cn or self.role_ja,
        }

    def public_url(self) -> str | None:
        if not self.link_enabled:
            return None
        value = (self.url or "").strip()
        return value or None
