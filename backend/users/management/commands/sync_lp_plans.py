from django.core.management.base import BaseCommand
from django.db import transaction

from users.models import Plan, User
from users.operations.settings_service import seed_fee_settings
from users.plan_catalog import LP_PLAN_CATALOG, plan_defaults


class Command(BaseCommand):
    help = "Sync Django Plan rows and fee settings to LP Plans (v0.9.2)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--apply",
            action="store_true",
            help="Apply changes. Without this flag, dry-run only.",
        )

    def handle(self, *args, **options):
        apply_changes = options.get("apply", False)

        self.stdout.write("LP Plans catalog:")
        for slot in LP_PLAN_CATALOG:
            fee = slot.get("shop_fee_percent")
            fee_txt = f"shop {fee}%" if fee is not None else "shop n/a"
            self.stdout.write(
                f"  - {slot['slug']}: JPY {slot['default_yen']}/mo · {fee_txt}"
            )

        existing = {p.slug: p for p in Plan.objects.all()}
        for slot in LP_PLAN_CATALOG:
            current = existing.get(slot["slug"])
            if current:
                self.stdout.write(
                    f"  existing {slot['slug']}: JPY {int(current.price)} -> JPY {slot['default_yen']}"
                )
            else:
                self.stdout.write(
                    f"  missing {slot['slug']}: will create JPY {slot['default_yen']}"
                )

        pro_users = User.objects.filter(subscription_plan="pro").count()
        if pro_users:
            self.stdout.write(f"  users with legacy slug 'pro': {pro_users} → premium")

        if not apply_changes:
            self.stdout.write(
                self.style.WARNING("Dry-run only. Rerun with --apply to commit.")
            )
            return

        with transaction.atomic():
            for slot in LP_PLAN_CATALOG:
                Plan.objects.update_or_create(
                    slug=slot["slug"],
                    defaults=plan_defaults(slot),
                )

            # Plan 行の有無に関係なく、legacy slug を premium へ寄せる
            migrated = User.objects.filter(subscription_plan="pro").update(
                subscription_plan="premium"
            )
            if migrated:
                self.stdout.write(f"  migrated users pro -> premium: {migrated}")

            Plan.objects.filter(slug="pro").delete()

            seed_fee_settings()

        self.stdout.write(self.style.SUCCESS("Synced LP Plans into Django Plan + fee settings."))
