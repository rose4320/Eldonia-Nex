"""Create ops_settings table and seed fee defaults."""

import os

from django.db import migrations, models


def seed_ops_settings(apps, schema_editor):
    OpsSetting = apps.get_model("users", "OpsSetting")
    slots = [
        ("marketplace_fee_percent", "10", "MARKETPLACE_FEE_PERCENT", "マーケットプレイス手数料"),
        ("referral_rebate_percent", "10", "REFERRAL_REBATE_PERCENT", "ユーザー還元（紹介料）"),
        ("stripe_fee_percent", "3.6", "STRIPE_FEE_PERCENT", "決済手数料（Stripe）"),
        ("stream_donation_fee_percent", "5", "STREAM_DONATION_FEE_PERCENT", "投げ銭手数料"),
        ("event_ticket_fee_percent", "8", "EVENT_TICKET_FEE_PERCENT", "イベントチケット手数料"),
    ]
    for key, default, env_key, label in slots:
        value = os.getenv(env_key, default)
        OpsSetting.objects.get_or_create(
            key=key,
            defaults={"value": value, "label": label, "category": "fees"},
        )


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0010_sync_subscription_plan"),
    ]

    operations = [
        migrations.CreateModel(
            name="OpsSetting",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("key", models.CharField(max_length=100, unique=True)),
                ("value", models.CharField(max_length=255)),
                ("label", models.CharField(blank=True, max_length=200)),
                ("category", models.CharField(default="general", max_length=50)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "db_table": "ops_settings",
                "ordering": ["category", "key"],
            },
        ),
        migrations.RunPython(seed_ops_settings, migrations.RunPython.noop),
    ]
