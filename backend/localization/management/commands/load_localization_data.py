"""Management command to load initial localization data."""
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.utils import timezone

from localization.models import Currency, ExchangeRate, Language


class Command(BaseCommand):
    """Load initial languages, currencies, and exchange rates."""

    help = "Load initial localization data (languages, currencies, exchange rates)"

    def handle(self, *args, **options):
        """Execute the command."""
        self.stdout.write("Loading initial localization data...")

        # Load languages
        self.load_languages()

        # Load currencies
        self.load_currencies()

        # Load exchange rates
        self.load_exchange_rates()

        self.stdout.write(self.style.SUCCESS("Successfully loaded localization data!"))

    def load_languages(self):
        """Load supported languages."""
        languages = [
            {
                "code": "ja",
                "name": "Japanese",
                "native_name": "日本語",
                "is_default": True,
                "sort_order": 1,
            },
            {
                "code": "en",
                "name": "English",
                "native_name": "English",
                "is_default": False,
                "sort_order": 2,
            },
            {
                "code": "ko",
                "name": "Korean",
                "native_name": "한국어",
                "is_default": False,
                "sort_order": 3,
            },
            {
                "code": "zh-CN",
                "name": "Chinese (Simplified)",
                "native_name": "简体中文",
                "is_default": False,
                "sort_order": 4,
            },
            {
                "code": "zh-TW",
                "name": "Chinese (Traditional)",
                "native_name": "繁體中文",
                "is_default": False,
                "sort_order": 5,
            },
        ]

        for lang_data in languages:
            language, created = Language.objects.update_or_create(
                code=lang_data["code"],
                defaults={
                    "name": lang_data["name"],
                    "native_name": lang_data["native_name"],
                    "is_active": True,
                    "is_default": lang_data["is_default"],
                    "sort_order": lang_data["sort_order"],
                },
            )
            status = "Created" if created else "Updated"
            self.stdout.write(f"  {status}: {language}")

    def load_currencies(self):
        """Load supported currencies."""
        currencies = [
            {
                "code": "JPY",
                "name": "Japanese Yen",
                "symbol": "¥",
                "decimal_places": 0,
                "is_default": True,
                "sort_order": 1,
            },
            {
                "code": "USD",
                "name": "US Dollar",
                "symbol": "$",
                "decimal_places": 2,
                "is_default": False,
                "sort_order": 2,
            },
            {
                "code": "EUR",
                "name": "Euro",
                "symbol": "€",
                "decimal_places": 2,
                "is_default": False,
                "sort_order": 3,
            },
            {
                "code": "KRW",
                "name": "South Korean Won",
                "symbol": "₩",
                "decimal_places": 0,
                "is_default": False,
                "sort_order": 4,
            },
            {
                "code": "CNY",
                "name": "Chinese Yuan",
                "symbol": "¥",
                "decimal_places": 2,
                "is_default": False,
                "sort_order": 5,
            },
            {
                "code": "TWD",
                "name": "New Taiwan Dollar",
                "symbol": "NT$",
                "decimal_places": 0,
                "is_default": False,
                "sort_order": 6,
            },
        ]

        for curr_data in currencies:
            currency, created = Currency.objects.update_or_create(
                code=curr_data["code"],
                defaults={
                    "name": curr_data["name"],
                    "symbol": curr_data["symbol"],
                    "decimal_places": curr_data["decimal_places"],
                    "is_active": True,
                    "is_default": curr_data["is_default"],
                    "sort_order": curr_data["sort_order"],
                },
            )
            status = "Created" if created else "Updated"
            self.stdout.write(f"  {status}: {currency}")

    def load_exchange_rates(self):
        """Load initial exchange rates (approximate values for 2025-12-13)."""
        # Base currency: JPY
        rates_from_jpy = [
            {"to": "USD", "rate": Decimal("0.0067")},  # 1 JPY = 0.0067 USD (≈150 JPY/USD)
            {"to": "EUR", "rate": Decimal("0.0062")},  # 1 JPY = 0.0062 EUR
            {"to": "KRW", "rate": Decimal("9.20")},  # 1 JPY = 9.2 KRW
            {"to": "CNY", "rate": Decimal("0.048")},  # 1 JPY = 0.048 CNY
            {"to": "TWD", "rate": Decimal("0.215")},  # 1 JPY = 0.215 TWD
        ]

        effective_date = timezone.now()

        for rate_data in rates_from_jpy:
            rate, created = ExchangeRate.objects.update_or_create(
                from_currency_id="JPY",
                to_currency_id=rate_data["to"],
                effective_date__date=effective_date.date(),
                defaults={
                    "rate": rate_data["rate"],
                    "effective_date": effective_date,
                    "source": "manual",
                },
            )
            status = "Created" if created else "Updated"
            self.stdout.write(f"  {status}: {rate}")

        # Add reverse rates for convenience
        for rate_data in rates_from_jpy:
            reverse_rate = Decimal("1.0") / rate_data["rate"]
            rate, created = ExchangeRate.objects.update_or_create(
                from_currency_id=rate_data["to"],
                to_currency_id="JPY",
                effective_date__date=effective_date.date(),
                defaults={
                    "rate": reverse_rate,
                    "effective_date": effective_date,
                    "source": "manual",
                },
            )
            status = "Created" if created else "Updated"
            self.stdout.write(f"  {status}: {rate}")
