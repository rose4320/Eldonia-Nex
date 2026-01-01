from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import SystemSetting

User = get_user_model()

class SystemSettingTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            username='admin', password='password123', email='admin@example.com'
        )
        self.regular_user = User.objects.create_user(
            username='user', password='password123', email='user@example.com'
        )
        self.setting = SystemSetting.objects.create(
            key='TEST_SETTING',
            value='original',
            category='SITE',
            is_public=True
        )

    def test_public_settings_viewable_by_all(self):
        url = reverse('public-setting-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Handle pagination
        data = response.data.get('results', response.data)
        print(f"DEBUG: Setting keys found: {[s['key'] for s in data]}")
        self.assertEqual(len(data), 1)

    def test_admin_settings_requires_staff(self):
        url = reverse('admin-setting-list')
        
        # Unauthorized
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Regular user (unauthorized as well for admin endpoint usually)
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Admin user
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_can_update_setting(self):
        url = reverse('admin-setting-detail', kwargs={'pk': self.setting.id})
        self.client.force_authenticate(user=self.admin_user)
        
        response = self.client.patch(url, {'value': 'updated'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.setting.refresh_from_db()
        self.assertEqual(self.setting.value, 'updated')
