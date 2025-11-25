"""Make external_id non-null and unique after backfill."""
from __future__ import annotations

import uuid

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0005_add_external_subscription"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="external_id",
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
        migrations.AlterField(
            model_name="user",
            name="subscription",
            field=models.CharField(default="free", max_length=20),
        ),
    ]
    
