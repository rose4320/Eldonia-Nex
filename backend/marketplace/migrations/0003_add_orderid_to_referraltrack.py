"""Add order_id to ReferralTrack to allow per-order reward tracking."""
from __future__ import annotations

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("marketplace", "0002_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name='referraltrack',
            name='order_id',
            field=models.BigIntegerField(null=True, blank=True),
        ),
    ]
