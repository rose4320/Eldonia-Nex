from __future__ import annotations

# pylint: disable=unused-argument,broad-exception-caught

from typing import Any

from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from .services import award_exp, award_profile_completion_exp


User = get_user_model()


@receiver(post_save, sender=User)
def award_user_profile_exp(sender: Any, instance: Any, created: bool, **kwargs: Any) -> None:
    if created:
        award_exp(
            instance,
            "user.signup",
            reference_id=instance.pk,
            reference_type="user.signup",
            description="新規登録",
        )

    award_profile_completion_exp(instance)


def _award_created_instance(
    *,
    instance: Any,
    created: bool,
    user_attr: str,
    action_type: str,
    reference_type: str,
    description: str,
) -> None:
    if not created:
        return
    user = getattr(instance, user_attr, None)
    if user:
        award_exp(
            user,
            action_type,
            reference_id=getattr(instance, "pk", None),
            reference_type=reference_type,
            description=description,
        )


try:
    from users.models import UserProfile

    @receiver(post_save, sender=UserProfile)
    def award_user_profile_detail_exp(
        sender: Any, instance: UserProfile, created: bool, **kwargs: Any
    ) -> None:
        award_profile_completion_exp(instance.user)

except Exception:
    pass


try:
    from marketplace.models import Artwork, Comment, Fan, Like, Order, Product

    @receiver(post_save, sender=Artwork)
    def award_artwork_upload_exp(sender: Any, instance: Artwork, created: bool, **kwargs: Any) -> None:
        _award_created_instance(
            instance=instance,
            created=created,
            user_attr="creator",
            action_type="artwork.upload",
            reference_type="artwork",
            description="作品投稿",
        )

    @receiver(post_save, sender=Product)
    def award_product_create_exp(sender: Any, instance: Product, created: bool, **kwargs: Any) -> None:
        _award_created_instance(
            instance=instance,
            created=created,
            user_attr="seller",
            action_type="product.create",
            reference_type="product",
            description="商品作成",
        )

    @receiver(post_save, sender=Order)
    def award_order_create_exp(sender: Any, instance: Order, created: bool, **kwargs: Any) -> None:
        _award_created_instance(
            instance=instance,
            created=created,
            user_attr="user",
            action_type="order.create",
            reference_type="order",
            description="購入・注文",
        )

    @receiver(post_save, sender=Comment)
    def award_comment_create_exp(sender: Any, instance: Comment, created: bool, **kwargs: Any) -> None:
        _award_created_instance(
            instance=instance,
            created=created,
            user_attr="user",
            action_type="comment.create",
            reference_type="comment",
            description="コメント投稿",
        )

    @receiver(post_save, sender=Like)
    def award_like_create_exp(sender: Any, instance: Like, created: bool, **kwargs: Any) -> None:
        _award_created_instance(
            instance=instance,
            created=created,
            user_attr="user",
            action_type="like.create",
            reference_type="like",
            description="いいね",
        )

    @receiver(post_save, sender=Fan)
    def award_fan_create_exp(sender: Any, instance: Fan, created: bool, **kwargs: Any) -> None:
        _award_created_instance(
            instance=instance,
            created=created,
            user_attr="fan",
            action_type="fan.create",
            reference_type="fan",
            description="ファン登録",
        )

except Exception:
    pass


try:
    from events.models import Event, EventTicket

    @receiver(post_save, sender=Event)
    def award_event_create_exp(sender: Any, instance: Event, created: bool, **kwargs: Any) -> None:
        _award_created_instance(
            instance=instance,
            created=created,
            user_attr="organizer",
            action_type="event.create",
            reference_type="event",
            description="イベント作成",
        )

    @receiver(post_save, sender=EventTicket)
    def award_event_ticket_create_exp(
        sender: Any, instance: EventTicket, created: bool, **kwargs: Any
    ) -> None:
        if created and getattr(instance, "event", None):
            award_exp(
                instance.event.organizer,
                "event_ticket.create",
                reference_id=instance.pk,
                reference_type="event_ticket",
                description="イベントチケット作成",
            )

except Exception:
    pass
