"""Service for fetching exchange rates from external API."""
import logging
from decimal import Decimal
from typing import Dict, Optional

from django.conf import settings
from django.utils import timezone

import requests
from localization.models import Currency, ExchangeRate

logger = logging.getLogger(__name__)


class ExchangeRateService:
    """Service to fetch and update exchange rates from external API."""

    # Free tier API: https://www.exchangerate-api.com/
    API_BASE_URL = "https://api.exchangerate-api.com/v4/latest"

    def __init__(self, base_currency: str = "JPY"):
        """Initialize with base currency."""
        self.base_currency = base_currency

    def fetch_latest_rates(self) -> Optional[Dict[str, Decimal]]:
        """
        Fetch latest exchange rates from API.

        Returns:
            Dict of currency_code -> rate, or None if failed
        """
        try:
            url = f"{self.API_BASE_URL}/{self.base_currency}"
            response = requests.get(url, timeout=10)
            response.raise_for_status()

            data = response.json()
            rates = data.get("rates", {})

            # Convert to Decimal for precision
            decimal_rates = {
                code: Decimal(str(rate)) for code, rate in rates.items()
            }

            logger.info(
                f"Fetched {len(decimal_rates)} exchange rates for {self.base_currency}"
            )
            return decimal_rates

        except requests.RequestException as e:
            logger.error(f"Failed to fetch exchange rates: {e}")
            return None
        except (ValueError, KeyError) as e:
            logger.error(f"Failed to parse exchange rate data: {e}")
            return None

    def update_database_rates(self, rates: Dict[str, Decimal]) -> int:
        """
        Update exchange rates in database.

        Args:
            rates: Dict of currency_code -> rate

        Returns:
            Number of rates updated
        """
        updated_count = 0
        effective_date = timezone.now()

        # Get all active currencies
        active_currencies = set(
            Currency.objects.filter(is_active=True).values_list("code", flat=True)
        )

        for to_currency_code, rate in rates.items():
            # Skip if target currency is not in our system
            if to_currency_code not in active_currencies:
                continue

            # Skip same currency (1:1 rate)
            if to_currency_code == self.base_currency:
                continue

            try:
                # Create or update exchange rate
                ExchangeRate.objects.update_or_create(
                    from_currency_id=self.base_currency,
                    to_currency_id=to_currency_code,
                    effective_date__date=effective_date.date(),
                    defaults={
                        "rate": rate,
                        "effective_date": effective_date,
                        "source": "exchangerate-api",
                    },
                )

                # Also create reverse rate for convenience
                reverse_rate = Decimal("1.0") / rate
                ExchangeRate.objects.update_or_create(
                    from_currency_id=to_currency_code,
                    to_currency_id=self.base_currency,
                    effective_date__date=effective_date.date(),
                    defaults={
                        "rate": reverse_rate,
                        "effective_date": effective_date,
                        "source": "exchangerate-api",
                    },
                )

                updated_count += 2  # Count both directions

            except Exception as e:
                logger.error(
                    f"Failed to update rate {self.base_currency}->{to_currency_code}: {e}"
                )

        logger.info(f"Updated {updated_count} exchange rates in database")
        return updated_count

    def sync_rates(self) -> bool:
        """
        Fetch and sync exchange rates.

        Returns:
            True if successful, False otherwise
        """
        rates = self.fetch_latest_rates()
        if not rates:
            return False

        count = self.update_database_rates(rates)
        return count > 0


def update_all_exchange_rates() -> Dict[str, int]:
    """
    Update exchange rates for all supported currencies.

    Returns:
        Dict with update statistics
    """
    stats = {"total_updated": 0, "errors": 0}

    # Update rates with JPY as base
    service = ExchangeRateService(base_currency="JPY")
    if service.sync_rates():
        stats["total_updated"] += 1
    else:
        stats["errors"] += 1

    # Optionally update with USD as base for better cross-currency accuracy
    service_usd = ExchangeRateService(base_currency="USD")
    if service_usd.sync_rates():
        stats["total_updated"] += 1
    else:
        stats["errors"] += 1

    return stats
