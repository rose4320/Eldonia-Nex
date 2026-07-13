from django.db import migrations


def seed_default_partners(apps, schema_editor):
    FooterPartner = apps.get_model("content", "FooterPartner")
    if FooterPartner.objects.exists():
        return
    defaults = [
        {
            "name": "Nexus Cloud",
            "role_ja": "インフラ協力",
            "role_en": "Infrastructure",
            "role_ko": "인프라",
            "role_zh_cn": "基础设施",
            "sort_order": 10,
        },
        {
            "name": "Creator Guild",
            "role_ja": "コミュニティ協力",
            "role_en": "Community Partner",
            "role_ko": "커뮤니티",
            "role_zh_cn": "社区合作",
            "sort_order": 20,
        },
        {
            "name": "Gold Sponsor Slot",
            "role_ja": "スポンサー枠",
            "role_en": "Sponsor Slot",
            "role_ko": "스폰서",
            "role_zh_cn": "赞助位",
            "sort_order": 30,
        },
    ]
    for row in defaults:
        FooterPartner.objects.create(**row, is_active=True)


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    """Local DBs that applied 0001 before seed was added get defaults here."""

    dependencies = [
        ("content", "0001_footer_partner"),
    ]

    operations = [
        migrations.RunPython(seed_default_partners, noop),
    ]
