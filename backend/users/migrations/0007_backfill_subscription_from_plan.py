"""Backfill `subscription` from `subscription_plan` for existing users.

This migration forces `subscription` to match `subscription_plan` so the
compatibility column accurately reflects the user's plan id.
"""
from __future__ import annotations

from django.db import migrations


def forwards(apps, schema_editor):
    User = apps.get_model("users", "User")
    for u in User.objects.all():
        desired = getattr(u, "subscription_plan", "free") or "free"
        if u.subscription != desired:
            u.subscription = desired
            u.save(update_fields=["subscription"])


def backwards(apps, schema_editor):
    # Not reversible in a meaningful way; leave as no-op.
    return


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0006_make_external_unique"),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]
