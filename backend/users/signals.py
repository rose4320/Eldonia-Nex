from typing import Any, Dict

from django.db.models.signals import post_save
from django.dispatch import receiver

from marketplace.models import Referral

from .models import User


@receiver(post_save, sender=User)
def attach_referral_on_signup(
    sender: type, instance: Any, created: bool, **kwargs: Any
) -> None:
    """If a new user has `referral_code_used`, attach them to the referrer.

    This allows registration flows that accept a referral code string to set
    `referral_code_used` on the new user and have the relation wired up.
    """
    if not created:
        return
    if getattr(instance, "referral_code_used", None):
        try:
            ref = Referral.objects.filter(
                referral_code=instance.referral_code_used
            ).first()  # type: ignore[attr-defined]
            if ref:
                # assign referred_user and user's referred_by_user
                instance.referred_by_user = ref.referrer
                instance.save(update_fields=["referred_by_user"])
                if not ref.referred_user:
                    ref.referred_user = instance
                    ref.save(update_fields=["referred_user"])
        except (AttributeError, ValueError, TypeError) as e:  # よく起こる例外のみ握りつぶし
            print(f"[attach_referral_on_signup] Exception: {e}")
            return


@receiver(post_save, sender=User)
def sync_artwork_denorm_on_user_update(
    sender: type, instance: Any, **kwargs: Any
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
            "creator_display_name": getattr(instance, "display_name", getattr(instance, "username", "")),
            "creator_avatar_url": getattr(instance, "avatar_url", ""),
            "creator_external_id": getattr(instance, "external_id", None),
        }

        # Perform bulk update on all artworks by this creator
        Artwork.objects.filter(creator_id=instance.pk).update(**update_vals)  # type: ignore[attr-defined]
    except (AttributeError, ValueError, TypeError) as e:  # よく起こる例外のみ握りつぶし
        print(f"[sync_artwork_denorm_on_user_update] Exception: {e}")
        return
