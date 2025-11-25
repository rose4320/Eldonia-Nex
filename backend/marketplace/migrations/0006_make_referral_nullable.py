"""Make ReferralTrack.referral nullable to allow tracking without a Referral record."""
from __future__ import annotations

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("marketplace", "0005_referraltrack_order_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name='referraltrack',
            name='referral',
            field=models.ForeignKey(blank=True, null=True, on_delete=models.CASCADE, to='marketplace.referral'),
        ),
    ]
