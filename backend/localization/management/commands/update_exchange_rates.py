"""Management command to update exchange rates from external API."""
from django.core.management.base import BaseCommand

from localization.services import update_all_exchange_rates


class Command(BaseCommand):
    """Update exchange rates from external API."""

    help = "Fetch and update exchange rates from external API"

    def handle(self, *args, **options):
        """Execute the command."""
        self.stdout.write("Fetching latest exchange rates...")

        stats = update_all_exchange_rates()

        if stats["total_updated"] > 0:
            self.stdout.write(
                self.style.SUCCESS(
                    f"✅ Successfully updated exchange rates "
                    f"(Updated: {stats['total_updated']}, Errors: {stats['errors']})"
                )
            )
        else:
            self.stdout.write(
                self.style.ERROR(
                    f"❌ Failed to update exchange rates (Errors: {stats['errors']})"
                )
            )
