from django.apps import AppConfig


class UsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "users"

    def ready(self):
        try:
            from . import signals  # noqa: F401
        except Exception:
            pass
        from .admin_hooks import register_operations_admin_urls

        register_operations_admin_urls()
