# PostgreSQL 17 Direct Migration Test
import os
os.environ['DATABASE_TYPE'] = 'postgresql'
os.environ['POSTGRES_DB'] = 'eldonia_nex'
os.environ['POSTGRES_USER'] = 'postgres'
os.environ['POSTGRES_PASSWORD'] = 'postgres123'
os.environ['POSTGRES_HOST'] = 'localhost'
os.environ['POSTGRES_PORT'] = '5432'

import django
from pathlib import Path
import sys

# Add backend to path
backend_path = Path(__file__).resolve().parent / "backend"
sys.path.insert(0, str(backend_path))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eldinia_nex.settings')
django.setup()

from django.core.management import call_command

print("Running makemigrations...")
call_command('makemigrations')

print("\nRunning migrate...")
call_command('migrate')

print("\nMigrations complete!")

