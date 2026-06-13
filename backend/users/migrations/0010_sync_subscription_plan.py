"""subscription を subscription_plan に再同期（重複表示の解消）"""

from django.db import migrations, models


def sync_subscription_from_plan(apps, schema_editor):
    User = apps.get_model("users", "User")
    for user in User.objects.all().iterator():
        plan = (getattr(user, "subscription_plan", None) or "free").strip() or "free"
        if user.subscription != plan:
            user.subscription = plan
            user.save(update_fields=["subscription"])


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0009_user_users_subscri_f90c0b_idx"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="subscription",
            field=models.CharField(default="free", editable=False, max_length=20),
        ),
        migrations.AlterField(
            model_name="user",
            name="subscription_plan",
            field=models.CharField(
                default="free", max_length=20, verbose_name="サブスクプラン"
            ),
        ),
        migrations.RunPython(sync_subscription_from_plan, migrations.RunPython.noop),
    ]
