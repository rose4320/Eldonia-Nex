from rest_framework import viewsets, permissions, generics
from .models import SystemSetting, CustomPage, SiteNotification
from .serializers import SystemSettingSerializer, CustomPageSerializer, SiteNotificationSerializer

class SystemSettingViewSet(viewsets.ModelViewSet):
    """
    Administrative API for full CRUD on SystemSettings.
    Requires Staff permissions (is_staff=True).
    """
    queryset = SystemSetting.objects.all().order_by('category', 'key')
    serializer_class = SystemSettingSerializer
    permission_classes = [permissions.IsAdminUser]

class PublicSettingListView(generics.ListAPIView):
    """
    Read-only API for public settings.
    Available to all users (including guests).
    """
    serializer_class = SystemSettingSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return SystemSetting.objects.filter(is_public=True).order_by('category', 'key')

class CustomPageViewSet(viewsets.ModelViewSet):
    """
    Administrative API for managing static/dynamic custom pages.
    """
    queryset = CustomPage.objects.all().order_by('slug')
    serializer_class = CustomPageSerializer
    permission_classes = [permissions.IsAdminUser]

class SiteNotificationViewSet(viewsets.ModelViewSet):
    """
    Administrative API for sending and managing site notifications.
    """
    queryset = SiteNotification.objects.all().order_by('-created_at')
    serializer_class = SiteNotificationSerializer
    permission_classes = [permissions.IsAdminUser]
