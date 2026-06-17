from django.db import migrations


DEFAULT_EXP_ACTIONS = [
    ("user.signup", 20, "新規登録", 1),
    ("artwork.upload", 50, "作品投稿", 20),
    ("product.create", 40, "商品作成", 20),
    ("order.create", 30, "購入・注文", 20),
    ("comment.create", 10, "コメント投稿", 50),
    ("like.create", 3, "いいね", 100),
    ("fan.create", 8, "ファン登録", 50),
    ("event.create", 40, "イベント作成", 10),
    ("event_ticket.create", 15, "イベントチケット作成", 20),
    ("profile.display_name", 75, "表示名を入力", 1),
    ("profile.bio", 75, "自己紹介を入力", 1),
    ("profile.avatar_url", 75, "アバターを設定", 1),
    ("profile.website_url", 75, "Webサイトを入力", 1),
    ("profile.location", 75, "活動地域を入力", 1),
    ("profile.birth_date", 75, "生年月日を入力", 1),
    ("profile.gender", 75, "性別を入力", 1),
    ("profile.phone_number", 75, "電話番号を入力", 1),
    ("profile.skills", 40, "スキルを入力", 1),
    ("profile.portfolio_url", 40, "ポートフォリオURLを入力", 1),
    ("profile.hourly_rate", 40, "希望単価を入力", 1),
    ("profile.available_hours", 40, "稼働時間を入力", 1),
    ("profile.timezone", 40, "タイムゾーンを入力", 1),
    ("profile.languages", 40, "対応言語を入力", 1),
    ("profile.social_links", 40, "SNSリンクを入力", 1),
    ("profile.preferences", 40, "興味・設定を入力", 1),
    ("profile.notification_settings", 40, "通知設定を入力", 1),
    ("profile.privacy_settings", 40, "公開範囲設定を入力", 1),
]


def seed_exp_actions(apps, schema_editor):  # pylint: disable=unused-argument
    ExpAction = apps.get_model("gamification", "ExpAction")
    for action_type, base_exp, description, max_daily_count in DEFAULT_EXP_ACTIONS:
        ExpAction.objects.update_or_create(
            action_type=action_type,
            defaults={
                "base_exp": base_exp,
                "description": description,
                "max_daily_count": max_daily_count,
                "is_active": True,
            },
        )


class Migration(migrations.Migration):
    dependencies = [
        ("gamification", "0002_initial"),
    ]

    operations = [
        migrations.RunPython(seed_exp_actions, migrations.RunPython.noop),
    ]
