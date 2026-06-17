from typing import Any, Dict

# pylint: disable=no-member,unused-argument,broad-exception-caught

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import User


@receiver(post_save, sender=User)
def attach_referral_on_signup(
    sender: Any, instance: User, created: bool, **kwargs: Any
) -> None:
    """If a new user has `referral_code_used`, attach them to the referrer.

    This allows registration flows that accept a referral code string to set
    `referral_code_used` on the new user and have the relation wired up.
    """
    if not created:
        return
    if getattr(instance, "referral_code_used", None):
        try:
            from marketplace.referral_service import attach_referral_code

            attach_referral_code(instance, instance.referral_code_used)
        except Exception:
            return


@receiver(post_save, sender=User)
def sync_artwork_denorm_on_user_update(
    sender: Any, instance: User, created: bool, **kwargs: Any
) -> None:
    """Keep Artwork.denormalized creator fields in sync when a User changes.

    This updates all artworks created by the user to reflect the latest
    display_name, avatar_url and external_id so the frontend can rely on
    denormalized fields without joins.
    """
    # Avoid heavy operations on create when no artworks exist yet
    try:
        # Import lazily to avoid circular import at module import time
        from marketplace.models import Artwork  # type: ignore

        # Build update values
        update_vals: Dict[str, Any] = {
            "creator_display_name": instance.display_name or instance.username,
            "creator_avatar_url": instance.avatar_url or "",
            "creator_external_id": instance.external_id,
        }

        # Perform bulk update on all artworks by this creator
        Artwork.objects.filter(creator_id=instance.pk).update(**update_vals)
    except Exception:
        # Best-effort: do not raise from signal
        return


@receiver(post_save, sender=User)
def ensure_paid_member_referral_code(
    sender: Any, instance: User, created: bool, **kwargs: Any
) -> None:
    """有料会員に紹介コードを付与する。"""
    try:
        from marketplace.referral_service import ensure_referral_code

        ensure_referral_code(instance)
    except Exception:
        return
