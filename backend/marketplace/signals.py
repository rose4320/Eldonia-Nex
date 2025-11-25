from decimal import Decimal
from typing import Any

from django.db.models.signals import post_save
from django.dispatch import receiver


@receiver(post_save)
def give_referral_rebate(
    sender: Any, instance: Any, created: bool, **kwargs: Any
) -> None:
    """When an Order is completed, give 10% rebate to the referrer if present.

    Behavior:
    - Only run for `Order` instances with status == 'completed'.
    - Determine referrer from `user.referred_by_user` or the `Referral` table.
    - Use `ReferralTrack.order_id` to ensure idempotency per order (don't pay twice).
    - Create a `Transaction` for the referrer with 10% of the order total.
    """
    # only care about completed orders
    try:
        from .models import Order as OrderModel  # type: ignore
        from .models import Referral, ReferralTrack, Transaction

        # ensure handler only acts on Order instances
        if not isinstance(instance, OrderModel):
            return

        if getattr(instance, "status", None) != "completed":
            return

        user = instance.user

        # prefer explicit field on User added by users app
        referrer = getattr(user, "referred_by_user", None)
        if not referrer:
            referral = Referral.objects.filter(referred_user=user).first()
            if referral:
                referrer = referral.referrer
            else:
                return

        # idempotency: check if this order has already generated a reward
        existing = ReferralTrack.objects.filter(
            tracking_type="reward", order_id=instance.id
        )
        if existing.exists():
            return

        # find the referral record if any
        referral = Referral.objects.filter(
            referrer=referrer, referred_user=user
        ).first()

        # create referral track marking this reward (allowing referral to be null)
        ReferralTrack.objects.create(
            referral=referral,
            tracking_type="reward",
            converted_user=user,
            order_id=instance.id,
        )

        rebate = instance.total_amount * Decimal("0.10")
        Transaction.objects.create(
            user=referrer,
            transaction_type="referral_reward",
            amount=rebate,
            fee_amount=Decimal("0"),
            net_amount=rebate,
        )
    except Exception:
        # Best-effort: do not raise from signals
        return
        return
