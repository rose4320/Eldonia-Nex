"""Localization app configuration."""
from django.apps import AppConfig


class LocalizationConfig(AppConfig):
    """Configuration for the localization app."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "localization"
    verbose_name = "Localization"
