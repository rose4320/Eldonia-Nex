from decimal import Decimal
from datetime import timedelta

from django.db import migrations, models


def backfill_referral_terms(apps, schema_editor):
    Referral = apps.get_model("marketplace", "Referral")
    for referral in Referral.objects.all():
        referral.rebate_percent = Decimal("10")
        if referral.referred_user_id:
            referral.reward_available_at = referral.created_at + timedelta(days=90)
        referral.save(update_fields=["rebate_percent", "reward_available_at"])


class Migration(migrations.Migration):
    dependencies = [
        ("marketplace", "0007_add_creator_denorm"),
    ]

    operations = [
        migrations.AddField(
            model_name="referral",
            name="country_code",
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AddField(
            model_name="referral",
            name="rebate_percent",
            field=models.DecimalField(decimal_places=2, default=10, max_digits=5),
        ),
        migrations.AddField(
            model_name="referral",
            name="reward_available_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.RunPython(backfill_referral_terms, migrations.RunPython.noop),
    ]
