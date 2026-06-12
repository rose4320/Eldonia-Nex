from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = "Automatically approve development users (mark email verified, activate accounts)"

    def handle(self, *args, **options):
        User = get_user_model()
        qs = User.objects.filter(is_active=False) | User.objects.filter(is_email_verified=False)
        updated = 0
        for u in qs.distinct():
            changed = False
            if not u.is_active:
                u.is_active = True
                changed = True
            if hasattr(u, "is_email_verified") and not u.is_email_verified:
                u.is_email_verified = True
                changed = True
            if hasattr(u, "account_status") and u.account_status != "active":
                u.account_status = "active"
                changed = True
            if changed:
                u.save()
                updated += 1

        self.stdout.write(self.style.SUCCESS(f"Auto-approved {updated} user(s)."))
