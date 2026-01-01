from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import UserManagementViewSet

router = DefaultRouter()
router.register(r'management', UserManagementViewSet, basename='user-management')

urlpatterns = [
    path('', include(router.urls)),
]
