from django.contrib.auth import get_user_model
from django.test import TestCase


class ArtworkDenormSyncTest(TestCase):
    def test_user_update_syncs_artwork_denorm(self):
        """When a User is updated, related Artwork denormalized fields should be updated."""
        User = get_user_model()

        # create user and an artwork with stale denormalized fields
        user = User.objects.create_user(username="bob", password="pw")
        user.display_name = "Bob Original"
        user.avatar_url = "http://example.local/old.png"
        user.save()

        from marketplace.models import Artwork

        art = Artwork.objects.create(
            creator=user,
            title="Sample",
            file_url="http://example.local/file.png",
            creator_display_name="OLD",
            creator_avatar_url="http://example.local/old-avatar.png",
            creator_external_id=None,
        )

        # ensure denorm is stale initially
        self.assertNotEqual(art.creator_display_name, user.display_name)

        # update user profile
        user.display_name = "Bob Updated"
        user.avatar_url = "http://example.local/new-avatar.png"
        user.save()

        # refresh artwork and assert denormalized fields reflect user
        art.refresh_from_db()
        self.assertEqual(art.creator_display_name, "Bob Updated")
        self.assertEqual(art.creator_avatar_url, "http://example.local/new-avatar.png")
        # external_id should be copied (both are UUIDs) - compare stringified
        self.assertEqual(str(art.creator_external_id), str(user.external_id))


class ReferralSignupTest(TestCase):
    def test_referral_attach_on_signup(self):
        """Creating a user with referral_code_used links them to the referrer."""
        User = get_user_model()

        referrer = User.objects.create_user(username="alice", password="pw")
        from marketplace.models import Referral

        ref = Referral.objects.create(referrer=referrer, referral_code="REFCODE123")

        # create new user using the referral code
        new_user = User.objects.create_user(
            username="charlie", password="pw", referral_code_used="REFCODE123"
        )

        # refresh
        new_user.refresh_from_db()
        ref.refresh_from_db()

        self.assertIsNotNone(new_user.referred_by_user)
        self.assertEqual(new_user.referred_by_user.id, referrer.id)
        self.assertEqual(ref.referred_user.id, new_user.id)
