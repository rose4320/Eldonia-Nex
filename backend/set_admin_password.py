"""Set superuser password."""
from django.contrib.auth import get_user_model

User = get_user_model()
admin = User.objects.get(username='admin')
admin.set_password('admin123')
admin.save()
print("✅ Admin password set to: admin123")
