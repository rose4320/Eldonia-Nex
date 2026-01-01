from rest_framework import serializers
from .models import SystemSetting, CustomPage, SiteNotification

class SystemSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSetting
        fields = '__all__'

class CustomPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomPage
        fields = '__all__'

class SiteNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteNotification
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
