"""Add external_id (UUID) and subscription (CharField) to User and backfill values.

This migration is created to ensure the database matches the model which now
defines `external_id` and `subscription`. It also copies `subscription_plan`
into `subscription` for existing users.
"""
from __future__ import annotations

import uuid

from django.db import migrations, models


def forwards(apps, schema_editor):
    User = apps.get_model("users", "User")
    # Backfill subscription from subscription_plan and assign external_id
    for u in User.objects.all():
        changed = False
        if not getattr(u, "subscription", None):
            u.subscription = getattr(u, "subscription_plan", "free") or "free"
            changed = True
        if not getattr(u, "external_id", None):
            u.external_id = uuid.uuid4()
            changed = True
        if changed:
            u.save(update_fields=[f for f in ("subscription", "external_id") if hasattr(u, f)])


def backwards(apps, schema_editor):
    # No-op: removing these columns would be destructive. Leave empty for safety.
    return


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0004_user_users_subscri_95bd21_idx"),
    ]

    operations = [
        # Add external_id without unique constraint first to avoid bulk-insert UNIQUE failures on SQLite.
        migrations.AddField(
            model_name="user",
            name="external_id",
            field=models.UUIDField(null=True),
        ),
        migrations.AddField(
            model_name="user",
            name="subscription",
            field=models.CharField(default="free", max_length=20),
        ),
        migrations.RunPython(forwards, backwards),
    ]
