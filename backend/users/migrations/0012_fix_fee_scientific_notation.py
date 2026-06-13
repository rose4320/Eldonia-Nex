"""Fix fee settings stored as scientific notation (e.g. 1E+1 -> 10)."""

from decimal import Decimal, InvalidOperation

from django.db import migrations


def fix_scientific_fee_values(apps, schema_editor):
    OpsSetting = apps.get_model("users", "OpsSetting")
    fee_keys = {
        "marketplace_fee_percent",
        "referral_rebate_percent",
        "stripe_fee_percent",
        "stream_donation_fee_percent",
        "event_ticket_fee_percent",
    }
    for row in OpsSetting.objects.filter(key__in=fee_keys):
        try:
            number = Decimal(str(row.value).strip())
            text = format(number.quantize(Decimal("0.1")), "f")
            if "." in text:
                text = text.rstrip("0").rstrip(".")
            if text != row.value:
                row.value = text or "0"
                row.save(update_fields=["value"])
        except InvalidOperation:
            continue


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0011_opssetting"),
    ]

    operations = [
        migrations.RunPython(fix_scientific_fee_values, migrations.RunPython.noop),
    ]
