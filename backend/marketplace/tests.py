from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase


class ReferralRebateTest(TestCase):
    def test_referral_rebate_idempotent(self):
        """Completing an order for a referred user gives a single 10% rebate to referrer."""
        User = get_user_model()

        referrer = User.objects.create_user(username="ref", password="pw")
        referred = User.objects.create_user(username="refed", password="pw")

        from .models import Order, Referral, ReferralTrack, Transaction

        # create referral linking referrer -> referred
        Referral.objects.create(
            referrer=referrer, referred_user=referred, referral_code="RC"
        )

        # create an order for the referred user
        order = Order.objects.create(
            user=referred, total_amount=Decimal("100.00"), status="pending"
        )

        # mark completed and save to trigger signal
        order.status = "completed"
        order.save()

        # one transaction should exist for referrer
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


from django.test import TestCase

# Create your tests here.
