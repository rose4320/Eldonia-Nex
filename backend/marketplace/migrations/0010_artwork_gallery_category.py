# Generated manually for gallery_category admin filtering

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("marketplace", "0009_artwork_supabase_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="artwork",
            name="gallery_category",
            field=models.CharField(
                blank=True,
                db_index=True,
                help_text="Supabase artworks.category（GALLERY 表示カテゴリ slug）",
                max_length=30,
            ),
        ),
    ]
