from django.apps import AppConfig

# pylint: disable=broad-exception-caught


class GamificationConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "gamification"

    def ready(self):
        try:
            from . import signals  # noqa: F401  # pylint: disable=unused-import,import-outside-toplevel
        except Exception:
            pass
