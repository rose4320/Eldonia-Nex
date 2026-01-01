from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserManagementSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'display_name', 
            'current_level', 'total_exp', 'is_staff', 
            'is_superuser', 'account_status', 'subscription'
        ]
        read_only_fields = ['id', 'username', 'email']
