import os
import pathlib
import secrets
import string
import sys

import django

# Ensure project root (backend) is on sys.path so Django settings package can be imported
BASE = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BASE))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "eldinia_nex.settings")

django.setup()

from django.contrib.auth import get_user_model  # noqa: E402

User = get_user_model()

USERNAME = "eldonia"
EMAIL = "rose3179@gmail.com"

# Generate a secure random password
alphabet = string.ascii_letters + string.digits + "!@#$%^&*()-_=+"
password = "".join(secrets.choice(alphabet) for _ in range(16))

user, created = User.objects.get_or_create(username=USERNAME, defaults={"email": EMAIL})
user.email = EMAIL
user.is_staff = True
user.is_superuser = True
user.set_password(password)
user.save()

if created:
    print(f"Superuser created: {USERNAME} <{EMAIL}>")
else:
    print(f"Superuser updated/ensured: {USERNAME} <{EMAIL}>")

print("Generated password (store this securely):")
print(password)
print("Generated password (store this securely):")
print(password)
