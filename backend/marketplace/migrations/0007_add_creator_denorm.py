"""Add denormalized creator fields to Artwork and backfill from creator FK."""
from __future__ import annotations

from django.db import migrations, models


def forwards(apps, schema_editor):
    Artwork = apps.get_model("marketplace", "Artwork")
    User = apps.get_model("users", "User")
    for a in Artwork.objects.all():
        try:
            u = User.objects.get(pk=a.creator_id)
            a.creator_external_id = getattr(u, "external_id", None)
            a.creator_display_name = getattr(u, "display_name", u.username if hasattr(u, 'username') else "")
            a.creator_avatar_url = getattr(u, "avatar_url", "")
            a.save(update_fields=["creator_external_id", "creator_display_name", "creator_avatar_url"])
        except Exception:
            # skip if user not found
            continue


def backwards(apps, schema_editor):
    # no-op
    return


class Migration(migrations.Migration):

    dependencies = [
        ("marketplace", "0006_make_referral_nullable"),
        ("users", "0009_user_users_subscri_f90c0b_idx"),
    ]

    operations = [
        migrations.AddField(
            model_name="artwork",
            name="creator_external_id",
            field=models.UUIDField(null=True, blank=True, editable=False),
        ),
        migrations.AddField(
            model_name="artwork",
            name="creator_display_name",
            field=models.CharField(max_length=100, blank=True),
        ),
        migrations.AddField(
            model_name="artwork",
            name="creator_avatar_url",
            field=models.URLField(max_length=1000, blank=True),
        ),
        migrations.RunPython(forwards, backwards),
    ]
