from django.core.management.base import BaseCommand

from users.plan_sync import PlanSyncError, push_django_plans_to_supabase, sync_plans_bidirectional


class Command(BaseCommand):
    help = "Bidirectional sync of subscription plans between Django and Supabase (archive old)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--push",
            action="store_true",
            help="Force push Django catalog to Supabase (archive superseded rows).",
        )
        parser.add_argument(
            "--bidirectional",
            action="store_true",
            help="Newest-wins bidirectional sync (default if neither flag set).",
        )

    def handle(self, *args, **options):
        try:
            if options.get("push"):
                result = push_django_plans_to_supabase()
            else:
                result = sync_plans_bidirectional(prefer="newest")
        except PlanSyncError as exc:
            self.stderr.write(self.style.ERROR(str(exc)))
            return

        self.stdout.write(self.style.SUCCESS(str(result)))
