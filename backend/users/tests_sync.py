from django.contrib.auth import get_user_model
from django.test import TestCase

from users.sync_service import normalize_username, sync_supabase_user


class SupabaseUserSyncTest(TestCase):
    def test_creates_user_from_supabase_payload(self):
        user, created = sync_supabase_user(
            supabase_user_id="11111111-1111-4111-8111-111111111111",
            email="creator@example.com",
            username="creator_name",
            display_name="Creator Name",
            subscription_plan="free",
            is_email_verified=True,
        )

        self.assertTrue(created)
        self.assertEqual(user.email, "creator@example.com")
        self.assertEqual(user.username, "creator_name")
        self.assertEqual(str(user.external_id), "11111111-1111-4111-8111-111111111111")
        self.assertEqual(user.display_name, "Creator Name")
        self.assertTrue(user.is_email_verified)

    def test_updates_existing_user_by_email(self):
        User = get_user_model()
        existing = User.objects.create_user(
            username="old_name",
            email="creator@example.com",
            password="pw",
        )

        user, created = sync_supabase_user(
            supabase_user_id="22222222-2222-4222-8222-222222222222",
            email="creator@example.com",
            username="new_name",
            display_name="Updated Name",
            subscription_plan="standard",
        )

        self.assertFalse(created)
        self.assertEqual(user.pk, existing.pk)
        self.assertEqual(str(user.external_id), "22222222-2222-4222-8222-222222222222")
        self.assertEqual(user.display_name, "Updated Name")
        self.assertEqual(user.subscription_plan, "standard")

    def test_username_collision_gets_suffix(self):
        User = get_user_model()
        User.objects.create_user(username="creator_name", email="other@example.com", password="pw")

        user, created = sync_supabase_user(
            supabase_user_id="33333333-3333-4333-8333-333333333333",
            email="creator@example.com",
            username="creator_name",
        )

        self.assertTrue(created)
        self.assertTrue(user.username.startswith("creator_name_"))

    def test_normalize_username_sanitizes_invalid_chars(self):
        self.assertEqual(normalize_username("Hello-World!", fallback="user"), "hello_world")


class ReferralSyncTest(TestCase):
    def test_referral_code_used_triggers_attachment(self):
        User = get_user_model()
        referrer = User.objects.create_user(username="alice", email="alice@example.com", password="pw")
        from marketplace.models import Referral

        Referral.objects.create(referrer=referrer, referral_code="REFCODE123")

        user, created = sync_supabase_user(
            supabase_user_id="44444444-4444-4444-8444-444444444444",
            email="charlie@example.com",
            username="charlie",
            referral_code_used="REFCODE123",
        )

        self.assertTrue(created)
        user.refresh_from_db()
        self.assertEqual(user.referred_by_user_id, referrer.id)
