# flake8: noqa
"""Add referred_by and referral_code_used to User and backfill from referrals."""
from __future__ import annotations

from django.db import migrations, models


def forwards(apps, schema_editor):
    User = apps.get_model("users", "User")
    Referral = apps.get_model("marketplace", "Referral")
    # For each Referral that has a referred_user, copy into User.referred_by
    for r in Referral.objects.filter(referred_user__isnull=False):
        try:
            u = User.objects.get(pk=r.referred_user_id)
            u.referred_by_user_id = r.referrer_id
            u.referral_code_used = r.referral_code
            u.save(update_fields=["referred_by_user_id", "referral_code_used"])
        except User.DoesNotExist:
            continue


def backwards(apps, schema_editor):
    # undoing is destructive; skip
    return


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0007_backfill_subscription_from_plan"),
        ("marketplace", "0002_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="referred_by_user",
            field=models.ForeignKey(blank=True, null=True, on_delete=models.SET_NULL, related_name='referred_users', to='users.user'),
        ),
        migrations.AddField(
            model_name='user',
            name='referral_code_used',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.RunPython(forwards, backwards),
    ]
