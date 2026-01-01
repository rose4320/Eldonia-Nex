from django.db import models
from django.conf import settings

class SystemSetting(models.Model):
    """
    Centralized model for site-wide settings and configurations.
    """
    SETTING_CATEGORY_CHOICES = [
        ('SITE', 'Site Settings'),
        ('SECURITY', 'Security'),
        ('FEATURES', 'Feature Flags'),
        ('MAINTENANCE', 'Maintenance'),
        ('SYSTEM', 'System Health'),
        ('GAMIFICATION', 'Gamification (EXP)'),
        ('FINANCE', 'Finance & Fees'),
        ('CONTENT', 'Content & UI'),
    ]

    DATA_TYPE_CHOICES = [
        ('STRING', 'String'),
        ('BOOLEAN', 'Boolean'),
        ('INTEGER', 'Integer'),
        ('FLOAT', 'Float'),
        ('JSON', 'JSON/List'),
    ]

    key = models.CharField(max_length=100, unique=True, help_text="Unique key for the setting (e.g., 'SITE_NAME')")
    value = models.JSONField(help_text="The actual value of the setting, stored as JSON (e.g., 'Eldonia Nex', true, 100).")
    category = models.CharField(max_length=20, choices=SETTING_CATEGORY_CHOICES, default='SITE')
    data_type = models.CharField(max_length=10, choices=DATA_TYPE_CHOICES, default='STRING')
    description = models.TextField(blank=True, help_text="Explanation of what this setting controls.")
    is_public = models.BooleanField(default=False, help_text="If true, this setting can be read by public API endpoints.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.key} ({self.category})"

    class Meta:
        db_table = 'core_system_settings'
        verbose_name = 'System Setting'
        verbose_name_plural = 'System Settings'

class CustomPage(models.Model):
    """
    Model for creating dynamic site pages (e.g., About Us, FAQ).
    """
    slug = models.SlugField(max_length=100, unique=True, help_text="URL slug for the page (e.g., 'about-us')")
    title = models.CharField(max_length=200)
    content = models.TextField(help_text="Markdown or HTML content of the page")
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class SiteNotification(models.Model):
    """
    Model for system-wide or user-specific notifications.
    """
    NOTIFICATION_TYPES = [
        ('INFO', 'Information'),
        ('SUCCESS', 'Success'),
        ('WARNING', 'Warning'),
        ('ALERT', 'Alert/Danger'),
    ]

    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='site_notifications', help_text="If null, this is a broadcast to all users.")
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=10, choices=NOTIFICATION_TYPES, default='INFO')
    criteria = models.JSONField(null=True, blank=True, help_text="Conditional targeting (e.g., {'min_level': 5})")
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} (To: {self.recipient.username if self.recipient else 'ALL'})"

    class Meta:
        db_table = 'core_site_notifications'
        verbose_name = 'Site Notification'
        verbose_name_plural = 'Site Notifications'
