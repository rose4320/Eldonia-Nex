from datetime import date
from decimal import Decimal

# pylint: disable=no-member

from django.contrib.auth import get_user_model
from django.test import TestCase

from users.models import UserProfile

from .models import ExpAction, UserExpLog
from .services import award_exp, award_profile_completion_exp, calculate_level


class ExpAwardServiceTest(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="expuser",
            email="exp@example.com",
            password="pw",
        )

    def test_level_reaches_three_at_two_hundred_exp(self):
        self.assertEqual(calculate_level(0), 1)
        self.assertEqual(calculate_level(500), 2)
        self.assertEqual(calculate_level(1000), 3)

    def test_award_exp_updates_total_and_level_once_for_reference(self):
        gained = award_exp(
            self.user,
            "artwork.upload",
            reference_id=1,
            reference_type="artwork",
        )
        self.user.refresh_from_db()

        self.assertEqual(gained, 50)
        self.assertEqual(self.user.total_exp, 70)  # user.signup signal grants 20
        self.assertEqual(self.user.current_level, 1)

        duplicated = award_exp(
            self.user,
            "artwork.upload",
            reference_id=1,
            reference_type="artwork",
        )
        self.user.refresh_from_db()

        self.assertEqual(duplicated, 0)
        self.assertEqual(self.user.total_exp, 70)
        self.assertEqual(UserExpLog.objects.filter(action__action_type="artwork.upload").count(), 1)

    def test_complete_user_information_reaches_level_three(self):
        self.user.display_name = "EXP User"
        self.user.bio = "Creative profile"
        self.user.avatar_url = "https://example.com/avatar.png"
        self.user.website_url = "https://example.com"
        self.user.location = "Tokyo"
        self.user.birth_date = date(1990, 1, 1)
        self.user.gender = "O"
        self.user.phone_number = "09000000000"
        self.user.save()

        UserProfile.objects.create(
            user=self.user,
            skills=["illustration", "music"],
            portfolio_url="https://example.com/portfolio",
            hourly_rate=Decimal("3000"),
            available_hours=20,
            timezone="Asia/Tokyo",
            languages=["ja", "en"],
            social_links={"x": "https://example.com/x"},
            preferences={"genre": "fantasy"},
            notification_settings={"email": True},
            privacy_settings={"profile": "public"},
        )

        award_profile_completion_exp(self.user)
        self.user.refresh_from_db()

        profile_exp = sum(
            log.exp_gained
            for log in UserExpLog.objects.filter(
                user=self.user,
                action__action_type__startswith="profile.",
            )
        )
        self.assertEqual(profile_exp, 1000)
        self.assertGreaterEqual(self.user.current_level, 3)
        self.assertLess(self.user.total_exp, 1500)

    def test_default_profile_actions_sum_to_level_three_requirement(self):
        profile_total = sum(
            action.base_exp
            for action in ExpAction.objects.filter(action_type__startswith="profile.")
        )
        self.assertEqual(profile_total, 1000)
