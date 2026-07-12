"""
Django settings for Eldinia-Nex project.

Creative Platform for Artists and Creators
"""

import os
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

# pyright: reportUnknownVariableType=false

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# ローカル開発のみ .env を読む（Render/Fly 等の注入 env を上書きしない）
if os.getenv("DEBUG", "True").lower() == "true":
    _repo_root = BASE_DIR.parent
    load_dotenv(_repo_root / ".env")
    load_dotenv(_repo_root / ".env.local", override=True)
    load_dotenv(BASE_DIR / ".env", override=True)


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv(
    "SECRET_KEY", "django-insecure-m7a_498b&oydhb^lr1e(_^sl^ad*9#j+r4$y^+(c579qtjs%vq"
)

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG", "True").lower() == "true"

ALLOWED_HOSTS = [
    h.strip()
    for h in os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")
    if h.strip()
]

# HTTPS reverse-proxy hosts (Railway / Render / custom domain)
CSRF_TRUSTED_ORIGINS = [
    o.strip()
    for o in os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",")
    if o.strip()
]


def _extend_cloud_hosts(hosts: list[str], origins: list[str]) -> None:
    """Render / Fly.io / Railway が注入するホスト名を自動許可（初回デプロイ用）。"""
    render_hostname = os.getenv("RENDER_EXTERNAL_HOSTNAME", "").strip()
    if render_hostname:
        if render_hostname not in hosts:
            hosts.append(render_hostname)
        origin = f"https://{render_hostname}"
        if origin not in origins:
            origins.append(origin)

    render_url = os.getenv("RENDER_EXTERNAL_URL", "").strip().rstrip("/")
    if render_url.startswith("https://") and render_url not in origins:
        origins.append(render_url)

    fly_app = os.getenv("FLY_APP_NAME", "").strip()
    if fly_app:
        fly_host = f"{fly_app}.fly.dev"
        if fly_host not in hosts:
            hosts.append(fly_host)
        fly_origin = f"https://{fly_host}"
        if fly_origin not in origins:
            origins.append(fly_origin)

    railway_domain = os.getenv("RAILWAY_PUBLIC_DOMAIN", "").strip()
    if railway_domain:
        if railway_domain not in hosts:
            hosts.append(railway_domain)
        railway_origin = f"https://{railway_domain}"
        if railway_origin not in origins:
            origins.append(railway_origin)


_extend_cloud_hosts(ALLOWED_HOSTS, CSRF_TRUSTED_ORIGINS)

# Next.js ↔ Django internal API auth (empty = dev-only open access)
INTERNAL_API_TOKEN = os.getenv("INTERNAL_API_TOKEN", "")

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
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
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
        "DIRS": [BASE_DIR / "templates"],
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

DATABASE_TYPE = os.getenv("DATABASE_TYPE", "sqlite")
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
# Cloud (Railway/Render): USE_DATABASE_URL=true または DEBUG=False のときだけ DATABASE_URL を使う。
# ローカル DEBUG では .env の DATABASE_URL があっても SQLite / DATABASE_TYPE を優先する。
_use_database_url = bool(DATABASE_URL) and (
    os.getenv("USE_DATABASE_URL", "").lower() == "true" or not DEBUG
)

if _use_database_url:
    try:
        import dj_database_url
    except ImportError as exc:  # pragma: no cover
        raise ImproperlyConfigured(
            "DATABASE_URL が設定されていますが dj-database-url が未インストールです。"
            " pip install dj-database-url を実行するか、ローカルでは USE_DATABASE_URL を外してください。"
        ) from exc

    _ssl_default = "false" if DEBUG else "true"
    DATABASES = {  # type: ignore
        "default": dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            ssl_require=os.getenv("DATABASE_SSL_REQUIRE", _ssl_default).lower() == "true",
        )
    }
elif DATABASE_TYPE == "sqlite":
    # Current: SQLite (開発中)
    DATABASES = {  # type: ignore
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
elif DATABASE_TYPE == "postgresql":
    # Future: PostgreSQL 15 (移行準備完了)
    DATABASES = {  # type: ignore
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("POSTGRES_DB", "eldonia_nex_dev"),
            "USER": os.getenv("POSTGRES_USER", "postgres"),
            "PASSWORD": os.getenv("POSTGRES_PASSWORD", "eldonia_pass"),
            "HOST": os.getenv("POSTGRES_HOST", "localhost"),
            "PORT": os.getenv("POSTGRES_PORT", "5433"),
            "OPTIONS": {
                "connect_timeout": 10,
                "options": "-c default_transaction_isolation=read_committed",
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
STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        # Manifest は collectstatic 必須。クラウドでは CompressedStaticFilesStorage で十分。
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}

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

# Celery configuration - Development setup (disabled)
# CELERY_BROKER_URL = f"redis://{os.getenv('REDIS_HOST', 'localhost')}:{os.getenv('REDIS_PORT', '6379')}/0"
# CELERY_RESULT_BACKEND = f"redis://{os.getenv('REDIS_HOST', 'localhost')}:{os.getenv('REDIS_PORT', '6379')}/0"
# CELERY_ACCEPT_CONTENT = ['json']
# CELERY_TASK_SERIALIZER = 'json'
# CELERY_RESULT_SERIALIZER = 'json'
# CELERY_TIMEZONE = TIME_ZONE

# Email configuration
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = os.getenv("EMAIL_HOST", "localhost")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() == "true"
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "noreply@eldinia-nex.com")

# Logging (console always; file only when local logs/ exists)
_log_handlers = ["console"]
_logging_handlers = {
    "console": {
        "level": "DEBUG" if DEBUG else "INFO",
        "class": "logging.StreamHandler",
        "formatter": "verbose",
    },
}
_logs_dir = BASE_DIR / "logs"
if _logs_dir.exists() or DEBUG:
    try:
        _logs_dir.mkdir(parents=True, exist_ok=True)
        _logging_handlers["file"] = {
            "level": "INFO",
            "class": "logging.FileHandler",
            "filename": str(_logs_dir / "django.log"),
            "formatter": "verbose",
        }
        _log_handlers.append("file")
    except OSError:
        pass

LOGGING = {  # type: ignore
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
    },
    "handlers": _logging_handlers,
    "root": {
        "handlers": _log_handlers,
        "level": "INFO",
    },
    "loggers": {
        "django": {
            "handlers": _log_handlers,
            "level": "INFO",
            "propagate": False,
        },
    },
}

# CORS Configuration for Next.js Integration
CORS_ALLOW_ALL_ORIGINS = DEBUG  # Only in development
CORS_ALLOWED_ORIGINS = [
    o.strip()
    for o in os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,https://eldonia-nex.com",
    ).split(",")
    if o.strip()
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
    SECURE_SSL_REDIRECT = os.getenv("SECURE_SSL_REDIRECT", "true").lower() == "true"
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    X_FRAME_OPTIONS = "DENY"
