"""Supabase の GALLERY データを Django Admin 用 DB に同期する管理コマンド"""

from django.core.management.base import BaseCommand

from marketplace.supabase_sync import (
    SupabaseSyncError,
    sync_supabase_artworks,
    sync_supabase_profiles,
)


class Command(BaseCommand):
    help = "Supabase profiles / artworks を Django DB に同期します（Admin 表示用）"

    def add_arguments(self, parser):
        parser.add_argument(
            "--creator-id",
            dest="creator_id",
            default=None,
            help="特定クリエイターの作品のみ同期（Supabase profile UUID）",
        )
        parser.add_argument(
            "--profiles-only",
            action="store_true",
            help="profiles のみ同期",
        )
        parser.add_argument(
            "--artworks-only",
            action="store_true",
            help="artworks のみ同期",
        )

    def handle(self, *args, **options):
        creator_id = options.get("creator_id")
        profiles_only = options.get("profiles_only")
        artworks_only = options.get("artworks_only")

        try:
            if not artworks_only:
                profile_stats = sync_supabase_profiles()
                self.stdout.write(self.style.SUCCESS(f"profiles: {profile_stats}"))

            if not profiles_only:
                artwork_stats = sync_supabase_artworks(creator_id=creator_id)
                self.stdout.write(self.style.SUCCESS(f"artworks: {artwork_stats}"))

        except SupabaseSyncError as exc:
            self.stderr.write(self.style.ERROR(str(exc)))
            raise SystemExit(1) from exc
