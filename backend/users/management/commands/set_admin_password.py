"""Management command to set admin password."""

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    """Set admin user password."""

    help = "Set password for admin user"

    def handle(self, *args, **options):
        """Execute the command."""
        User = get_user_model()
        try:
            admin = User.objects.get(username="admin")
            admin.set_password("admin123")
            admin.save()
            self.stdout.write(
                self.style.SUCCESS(
                    "✅ Admin password set successfully!\n" "   Username: admin\n" "   Password: admin123"
                )
            )
        except User.DoesNotExist:
            self.stdout.write(self.style.ERROR("❌ Admin user not found. Please create it first."))
