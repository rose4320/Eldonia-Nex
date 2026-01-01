"""
Django settings for Eldinia-Nex project.

Creative Platform for Artists and Creators
"""

import os
from pathlib import Path

# from dotenv import load_dotenv
# Temporarily disabled due to encoding issues
# load_dotenv(Path(__file__).resolve().parent.parent.parent / ".env")

# pyright: reportUnknownVariableType=false

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv(
    "SECRET_KEY", "django-insecure-m7a_498b&oydhb^lr1e(_^sl^ad*9#j+r4$y^+(c579qtjs%vq"
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1,172.16.0.2,0.0.0.0,*").split(",")


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party apps
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "channels",
    # Local apps
    "users.apps.UsersConfig",
    "content.apps.ContentConfig",
    "collaboration.apps.CollaborationConfig",
    "events.apps.EventsConfig",
    "marketplace.apps.MarketplaceConfig",
    "streaming.apps.StreamingConfig",
    "jobs.apps.JobsConfig",
    "gamification.apps.GamificationConfig",
    "localization.apps.LocalizationConfig",
    "core_settings.apps.CoreSettingsConfig",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "eldinia_nex.urls"

TEMPLATES = [  # type: ignore
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "eldinia_nex.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

# Database Configuration - Multi-Environment Support
# 環境変数で簡単に切り替え可能: 'sqlite' | 'postgresql' | 'aurora'
# 開発環境では Docker Compose の Postgres を使うためデフォルトを postgresql に変更
DATABASE_TYPE = os.getenv("DATABASE_TYPE", "postgresql")

if DATABASE_TYPE == "sqlite":
    # Current: SQLite (開発中)
    DATABASES = {  # type: ignore
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
elif DATABASE_TYPE == "postgresql":
    # Future: PostgreSQL 17 (移行準備完了)
    DATABASES = {  # type: ignore
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("POSTGRES_DB", "eldonia_nex"),
            "USER": os.getenv("POSTGRES_USER", "postgres"),
            "PASSWORD": os.getenv("POSTGRES_PASSWORD", "postgres123"),
            "HOST": os.getenv("POSTGRES_HOST", "localhost"),
            # docker-compose.dev.yml maps host 5433 -> container 5432 for dev
            "PORT": os.getenv("POSTGRES_PORT", "5433"),
            "OPTIONS": {
                "connect_timeout": 10,
            },
        }
    }
elif DATABASE_TYPE == "aurora":
    # Production: AWS Aurora PostgreSQL
    DATABASES = {  # type: ignore
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("AURORA_DB_NAME", "eldonia_nex"),
            "USER": os.getenv("AURORA_DB_USER", "aurora_user"),
            "PASSWORD": os.getenv("AURORA_DB_PASSWORD"),
            "HOST": os.getenv("AURORA_DB_HOST"),  # Aurora cluster endpoint
            "PORT": os.getenv("AURORA_DB_PORT", "5432"),
            "OPTIONS": {
                "sslmode": "require",
                "connect_timeout": 10,
                "options": "-c default_transaction_isolation=read_committed",
            },
        }
    }
else:
    # Fallback to SQLite
    DATABASES = {  # type: ignore
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = "ja"

TIME_ZONE = "Asia/Tokyo"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [
    BASE_DIR / "static",
]

# Media files
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Use custom user model implemented in backend/users/models.py
AUTH_USER_MODEL = "users.User"

# Django REST Framework
REST_FRAMEWORK = {  # type: ignore
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
    ],
}

# Channels (WebSocket) - Development configuration
ASGI_APPLICATION = "eldinia_nex.asgi.application"

# Redis for caching and channels (disabled for development)
# CHANNEL_LAYERS = {  # type: ignore
#     'default': {
#         'BACKEND': 'channels_redis.core.RedisChannelLayer',
#         'CONFIG': {
#             "hosts": [(os.getenv('REDIS_HOST', 'localhost'), os.getenv('REDIS_PORT', '6379'))],
#         },
#     },
# }

# Development: Use in-memory channel layer
CHANNEL_LAYERS = {  # type: ignore
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    },
}

# Cache configuration - Development setup
# CACHES = {  # type: ignore
#     'default': {
#         'BACKEND': 'django_redis.cache.RedisCache',
#         'LOCATION': f"redis://{os.getenv('REDIS_HOST', 'localhost')}:{os.getenv('REDIS_PORT', '6379')}/1",
#         'OPTIONS': {
#             'CLIENT_CLASS': 'django_redis.client.DefaultClient',
#         }
#     }
# }

# Development: Use database cache
CACHES = {  # type: ignore
    "default": {
        "BACKEND": "django.core.cache.backends.db.DatabaseCache",
        "LOCATION": "eldinia_cache_table",
    }
}

# Alternative: Use dummy cache for development
# CACHES = {  # type: ignore
#     'default': {
#         'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
#     }
# }

# Session engine - Development setup
# SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
# SESSION_CACHE_ALIAS = 'default'

# Development: Use database sessions
SESSION_ENGINE = "django.contrib.sessions.backends.db"

# Celery configuration
CELERY_BROKER_URL = f"redis://{os.getenv('REDIS_HOST', 'localhost')}:{os.getenv('REDIS_PORT', '6380')}/0"
CELERY_RESULT_BACKEND = f"redis://{os.getenv('REDIS_HOST', 'localhost')}:{os.getenv('REDIS_PORT', '6380')}/0"
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = TIME_ZONE

# Celery Beat schedule for periodic tasks
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'update-exchange-rates-daily': {
        'task': 'localization.tasks.update_exchange_rates_task',
        'schedule': crontab(hour=0, minute=0),  # Every day at midnight
    },
}

# Email configuration
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.getenv("EMAIL_HOST", "localhost")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() == "true"
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "noreply@eldinia-nex.com")

# Logging
LOGGING = {  # type: ignore
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "file": {
            "level": "INFO",
            "class": "logging.FileHandler",
            "filename": BASE_DIR / "logs" / "django.log",
            "formatter": "verbose",
        },
        "console": {
            "level": "DEBUG" if DEBUG else "INFO",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console", "file"],
        "level": "INFO",
    },
    "loggers": {
        "django": {
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": False,
        },
    },
}

# CORS Configuration for Next.js Integration
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Only in development
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]

CORS_ALLOW_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]

# Security settings
if not DEBUG:
    # 本番環境: 全セキュリティ機能を有効化
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = "DENY"
    
    # Cookie セキュリティ
    SESSION_COOKIE_SECURE = True              # セッションCookieをHTTPSのみに制限
    CSRF_COOKIE_SECURE = True                 # CSRF CookieをHTTPSのみに制限
    CSRF_COOKIE_HTTPONLY = True               # JavaScriptからCSRF Cookieへのアクセスを防止
    SESSION_COOKIE_HTTPONLY = True            # JavaScriptからセッションCookieへのアクセスを防止
    CSRF_COOKIE_SAMESITE = 'Strict'          # CSRF対策: 同一サイトからのみCookie送信
    SESSION_COOKIE_SAMESITE = 'Strict'       # セッション固定攻撃対策
    
    # 追加のセキュリティヘッダー
    SECURE_REFERRER_POLICY = 'same-origin'    # リファラー情報を同一オリジンのみに制限
else:
    # 開発環境: HTTPアクセスを許可
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    CSRF_COOKIE_HTTPONLY = True               # 開発環境でもXSS対策は有効化
    SESSION_COOKIE_HTTPONLY = True            # 開発環境でもXSS対策は有効化
    CSRF_COOKIE_SAMESITE = 'Lax'             # 開発環境では少し緩和
    SESSION_COOKIE_SAMESITE = 'Lax'          # 開発環境では少し緩和
