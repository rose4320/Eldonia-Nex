from django.core.management.base import BaseCommand
from django.db import transaction


class Command(BaseCommand):
    help = "Assign subscription_plan to all users based on their subscription_type (or default to 'free')."

    def add_arguments(self, parser):
        parser.add_argument(
            "--apply",
            action="store_true",
            help="Apply changes. If not set, runs a dry-run.",
        )

    def handle(self, *args, **options):
        from users.models import Plan, User

        apply_changes = options.get("apply", False)

        # mapping from existing subscription_type to plan slug
        mapping = {
            "free": "free",
            "premium": "premium",
            "pro": "premium",  # map legacy 'pro' to 'premium'
            "standard": "standard",
            "business": "business",
        }

        existing_plans = set(Plan.objects.values_list("slug", flat=True))
        default_plan = "free"
        if default_plan not in existing_plans:
            # create free plan if missing
            Plan.objects.get_or_create(
                slug=default_plan,
                defaults={
                    "name": "Free",
                    "price": 0,
                    "billing_cycle": "monthly",
                    "is_active": True,
                },
            )
            existing_plans.add(default_plan)

        users_qs = User.objects.all()
        total = users_qs.count()
        to_update = []
        for u in users_qs:
            desired = mapping.get(getattr(u, "subscription_type", None), default_plan)
            # if mapped plan missing, fallback to default
            if desired not in existing_plans:
                desired = default_plan
            if (getattr(u, "subscription_plan", None) or "") != desired:
                to_update.append((u.pk, desired))

        self.stdout.write(f"Total users: {total}. Users to update: {len(to_update)}")

        if not apply_changes:
            self.stdout.write(
                self.style.WARNING(
                    "Dry-run: no changes applied. Rerun with --apply to commit."
                )
            )
            return

        # apply updates in a transaction
        with transaction.atomic():
            updated = 0
            # iterate and save to ensure model signals run if any
            for pk, desired in to_update:
                u = User.objects.get(pk=pk)
                u.subscription_plan = desired
                u.save()
                updated += 1

        self.stdout.write(self.style.SUCCESS(f"Applied: updated {updated} users."))
