from django.apps import AppConfig


class MarketplaceConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "marketplace"

    def ready(self):
        # import signals to register handlers
        try:
            from . import signals  # noqa: F401
        except Exception:
            pass
