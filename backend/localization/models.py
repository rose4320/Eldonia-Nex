"""Models for multi-language and multi-currency support."""
from django.db import models
from django.utils import timezone


class Language(models.Model):
    """Supported languages for the platform."""

    code = models.CharField(
        max_length=5,
        primary_key=True,
        help_text="ISO 639-1 language code (e.g., 'ja', 'en', 'ko')",
    )
    name = models.CharField(
        max_length=100, help_text="Language name in English (e.g., 'Japanese')"
    )
    native_name = models.CharField(
        max_length=100, help_text="Language name in native script (e.g., '日本語')"
    )
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "languages"
        ordering = ["sort_order", "code"]
        verbose_name = "Language"
        verbose_name_plural = "Languages"

    def __str__(self) -> str:
        return f"{self.native_name} ({self.code})"


class Currency(models.Model):
    """Supported currencies for the platform."""

    code = models.CharField(
        max_length=3,
        primary_key=True,
        help_text="ISO 4217 currency code (e.g., 'JPY', 'USD', 'KRW')",
    )
    name = models.CharField(
        max_length=100, help_text="Currency name (e.g., 'Japanese Yen')"
    )
    symbol = models.CharField(max_length=10, help_text="Currency symbol (e.g., '¥')")
    decimal_places = models.IntegerField(
        default=0, help_text="Number of decimal places (e.g., 0 for JPY, 2 for USD)"
    )
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    sort_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "currencies"
        ordering = ["sort_order", "code"]
        verbose_name = "Currency"
        verbose_name_plural = "Currencies"

    def __str__(self) -> str:
        return f"{self.name} ({self.symbol})"


class ExchangeRate(models.Model):
    """Exchange rates between currencies."""

    from_currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        related_name="rates_from",
        db_column="from_currency_code",
    )
    to_currency = models.ForeignKey(
        Currency,
        on_delete=models.CASCADE,
        related_name="rates_to",
        db_column="to_currency_code",
    )
    rate = models.DecimalField(
        max_digits=20,
        decimal_places=8,
        help_text="Exchange rate (1 from_currency = rate * to_currency)",
    )
    effective_date = models.DateTimeField(
        default=timezone.now, help_text="When this rate became effective"
    )
    source = models.CharField(
        max_length=100,
        blank=True,
        help_text="Source of the exchange rate (e.g., 'ECB', 'manual')",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "exchange_rates"
        ordering = ["-effective_date"]
        indexes = [
            models.Index(fields=["from_currency", "to_currency", "-effective_date"]),
        ]
        verbose_name = "Exchange Rate"
        verbose_name_plural = "Exchange Rates"

    def __str__(self) -> str:
        return f"1 {self.from_currency_id} = {self.rate} {self.to_currency_id} ({self.effective_date.date()})"


class ContentTranslation(models.Model):
    """Translations for user-generated content."""

    CONTENT_TYPE_CHOICES = [
        ("artwork", "Artwork"),
        ("event", "Event"),
        ("product", "Product"),
        ("post", "Post"),
        ("comment", "Comment"),
    ]

    content_type = models.CharField(max_length=50, choices=CONTENT_TYPE_CHOICES)
    content_id = models.BigIntegerField(
        help_text="ID of the content being translated"
    )
    field_name = models.CharField(
        max_length=100, help_text="Field name (e.g., 'title', 'description')"
    )
    language = models.ForeignKey(
        Language, on_delete=models.CASCADE, related_name="translations"
    )
    translation = models.TextField(help_text="Translated text")
    is_machine_translated = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "content_translations"
        unique_together = [["content_type", "content_id", "field_name", "language"]]
        indexes = [
            models.Index(fields=["content_type", "content_id"]),
            models.Index(fields=["language"]),
        ]
        verbose_name = "Content Translation"
        verbose_name_plural = "Content Translations"

    def __str__(self) -> str:
        return f"{self.content_type}:{self.content_id}.{self.field_name} ({self.language_id})"
