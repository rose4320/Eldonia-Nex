from decimal import Decimal
from datetime import timedelta
from unittest.mock import patch

# pylint: disable=no-member

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone


class ReferralRebateTest(TestCase):
    def test_paid_member_gets_referral_code(self):
        User = get_user_model()

        referrer = User.objects.create_user(username="ref", password="pw")
        referrer.subscription_plan = "standard"
        referrer.save()

        from .models import Referral

        referral = Referral.objects.get(referrer=referrer, referred_user__isnull=True)
        self.assertTrue(referral.referral_code.startswith("ENX-"))
        self.assertEqual(referral.status, "active")

    def test_free_member_does_not_get_referral_code(self):
        User = get_user_model()

        user = User.objects.create_user(username="free-user", password="pw")

        from .models import Referral

        self.assertFalse(Referral.objects.filter(referrer=user).exists())

    def test_any_non_free_plan_gets_referral_code(self):
        User = get_user_model()

        user = User.objects.create_user(username="custom-plan", password="pw")
        user.subscription_plan = "guild"
        user.save()

        from .models import Referral

        self.assertTrue(Referral.objects.filter(referrer=user, status="active").exists())

    def test_referral_code_retries_on_collision(self):
        User = get_user_model()

        existing_referrer = User.objects.create_user(username="existing-ref", password="pw")
        target = User.objects.create_user(username="retry-user", password="pw")

        from .models import Referral

        Referral.objects.create(
            referrer=existing_referrer,
            referral_code="ENX-DUPLICATE",
            status="active",
        )

        with patch(
            "marketplace.referral_service.generate_referral_code",
            side_effect=["ENX-DUPLICATE", "ENX-UNIQUE01"],
        ):
            target.subscription_plan = "standard"
            target.save()

        referral = Referral.objects.get(referrer=target, referred_user__isnull=True)
        self.assertEqual(referral.referral_code, "ENX-UNIQUE01")

    def test_referral_rebate_waits_until_third_month(self):
        """紹介料は紹介成立から3か月目以降に支払う。"""
        User = get_user_model()

        referrer = User.objects.create_user(username="ref", password="pw")
        referred = User.objects.create_user(username="refed", password="pw")

        from .models import Order, Referral, ReferralTrack, Transaction

        referral = Referral.objects.create(
            referrer=referrer,
            referred_user=referred,
            referral_code="RC",
            country_code="JP",
            rebate_percent=Decimal("10"),
            reward_available_at=timezone.now() + timedelta(days=1),
        )

        order = Order.objects.create(
            user=referred, total_amount=Decimal("100.00"), status="pending"
        )

        order.status = "completed"
        order.save()

        self.assertFalse(Transaction.objects.filter(transaction_type="referral_reward").exists())

        referral.reward_available_at = timezone.now() - timedelta(days=1)
        referral.save(update_fields=["reward_available_at"])
        order.save()

        txs = Transaction.objects.filter(
            user=referrer, transaction_type="referral_reward"
        )
        self.assertEqual(txs.count(), 1)
        self.assertEqual(txs.first().amount, Decimal("10.00"))

        # ReferralTrack should exist for this order
        tracks = ReferralTrack.objects.filter(order_id=order.id, tracking_type="reward")
        self.assertTrue(tracks.exists())

        # saving order completed again should not create another transaction
        order.save()
        self.assertEqual(
            Transaction.objects.filter(
                user=referrer, transaction_type="referral_reward"
            ).count(),
            1,
        )

    def test_referral_rebate_non_japanese_is_fifteen_percent(self):
        User = get_user_model()

        referrer = User.objects.create_user(username="global-ref", password="pw")
        referred = User.objects.create_user(username="global-refed", password="pw")

        from .models import Order, Referral, Transaction

        Referral.objects.create(
            referrer=referrer,
            referred_user=referred,
            referral_code="GL",
            country_code="US",
            rebate_percent=Decimal("15"),
            reward_available_at=timezone.now() - timedelta(days=1),
        )

        Order.objects.create(user=referred, total_amount=Decimal("200.00"), status="completed")

        tx = Transaction.objects.get(user=referrer, transaction_type="referral_reward")
        self.assertEqual(tx.amount, Decimal("30.00"))


