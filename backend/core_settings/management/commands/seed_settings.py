from django.core.management.base import BaseCommand
from core_settings.models import SystemSetting

class Command(BaseCommand):
    help = 'Seeds the database with default system settings'

    def handle(self, *args, **options):
        settings = [
            {'key': 'SITE_VERSION', 'value': '0.4.0', 'category': 'SITE', 'data_type': 'STRING', 'description': 'Current version of the platform', 'is_public': True},
            {'key': 'SITE_NAME', 'value': 'Eldonia-Nex', 'category': 'SITE', 'data_type': 'STRING', 'description': 'Name of the website', 'is_public': True},
            {'key': 'MAINTENANCE_MODE', 'value': False, 'category': 'MAINTENANCE', 'data_type': 'BOOLEAN', 'description': 'Global maintenance mode toggle', 'is_public': False},
            {'key': 'REGISTRATION_OPEN', 'value': True, 'category': 'SECURITY', 'data_type': 'BOOLEAN', 'description': 'Allow new user registrations', 'is_public': False},
            {'key': 'THEME_PRIMARY_COLOR', 'value': '#8B5CF6', 'category': 'CONTENT', 'data_type': 'STRING', 'description': 'Primary brand color (hex)', 'is_public': True},
            {'key': 'MAX_UPLOAD_SIZE', 'value': 10, 'category': 'SYSTEM', 'data_type': 'INTEGER', 'description': 'Max upload size in MB', 'is_public': False},
            
            # --- Finance & Fees ---
            {'key': 'FEE_SHOP_DIGITAL', 'value': 0.20, 'category': 'FINANCE', 'data_type': 'FLOAT', 'description': 'Shop販売手数料: デジタルコンテンツ (標準20%)', 'is_public': True},
            {'key': 'FEE_SHOP_GOODS', 'value': 0.10, 'category': 'FINANCE', 'data_type': 'FLOAT', 'description': 'Shop販売手数料: 物品・グッズ (標準10%)', 'is_public': True},
            {'key': 'FEE_EVENT_SALES', 'value': 0.15, 'category': 'FINANCE', 'data_type': 'FLOAT', 'description': 'Event販売手数料 (10～20%の範囲で調整可能)', 'is_public': True},
            {'key': 'FEE_WORKS_CORPORATE', 'value': 0.25, 'category': 'FINANCE', 'data_type': 'FLOAT', 'description': 'Works手数料: 企業案件 (20～30%の範囲で調整可能)', 'is_public': True},
            
            {'key': 'PLATFORM_FEE_RATE', 'value': 0.1, 'category': 'FINANCE', 'data_type': 'FLOAT', 'description': '一般販売手数料 (デフォルト)', 'is_public': True},
            {'key': 'WITHDRAWAL_FEE_FIXED', 'value': 200, 'category': 'FINANCE', 'data_type': 'INTEGER', 'description': '振込手数料: 固定額 (円)', 'is_public': True},
            {'key': 'TRANSFER_FEE_RATE', 'value': 0.05, 'category': 'FINANCE', 'data_type': 'FLOAT', 'description': '追加振込手数料率', 'is_public': True},
            {'key': 'SYSTEM_USAGE_FEE_MONTHLY', 'value': 0, 'category': 'FINANCE', 'data_type': 'INTEGER', 'description': 'クリエイター月額システム利用料', 'is_public': True},
            
            # --- Gamification / EXP ---
            {'key': 'EXP_PER_ARTWORK', 'value': 50, 'category': 'GAMIFICATION', 'data_type': 'INTEGER', 'description': 'EXP earned per published artwork', 'is_public': True},
            {'key': 'EXP_PER_COMMENT', 'value': 5, 'category': 'GAMIFICATION', 'data_type': 'INTEGER', 'description': 'EXP earned per comment posted', 'is_public': True},
            {'key': 'EXP_MULTIPLIER_EVENT', 'value': 1.0, 'category': 'GAMIFICATION', 'data_type': 'FLOAT', 'description': 'Global EXP multiplier during events', 'is_public': True},
            
            {'key': 'TOP_PAGE_WIDGETS', 'value': {
                'show_weekly_challenge': True,
                'show_best_artworks': True,
                'show_top_users': True,
                'show_live_streams': False
            }, 'category': 'CONTENT', 'data_type': 'JSON', 'description': 'Configuration for top page components', 'is_public': True},
            
            {'key': 'CHALLENGE_WEEKLY', 'value': '「サイバーパンクな日常」', 'category': 'CONTENT', 'data_type': 'STRING', 'description': '今週のお題として表示されるテキスト', 'is_public': True},
            {'key': 'CHALLENGE_MONTHLY', 'value': '「冬の光と影」', 'category': 'CONTENT', 'data_type': 'STRING', 'description': '今月のお題として表示されるテキスト', 'is_public': True},
        ]

        for setting in settings:
            key = setting['key']
            obj, created = SystemSetting.objects.update_or_create(
                key=key,
                defaults={
                    'value': setting['value'],
                    'category': setting['category'],
                    'data_type': setting['data_type'],
                    'description': setting['description'],
                    'is_public': setting.get('is_public', False)
                }
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created setting: {key}'))
            else:
                self.stdout.write(self.style.SUCCESS(f'Updated setting: {key}'))
