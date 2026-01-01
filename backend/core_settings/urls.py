from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'admin', views.SystemSettingViewSet, basename='admin-setting')
router.register(r'pages', views.CustomPageViewSet, basename='admin-page')
router.register(r'notifications', views.SiteNotificationViewSet, basename='admin-notification')

urlpatterns = [
    path('', include(router.urls)),
    path('public/', views.PublicSettingListView.as_view(), name='public-setting-list'),
]
