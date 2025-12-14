"""URL configuration for localization app."""
from django.urls import include, path

from rest_framework.routers import DefaultRouter

from . import views

app_name = "localization"

router = DefaultRouter()
router.register(r"languages", views.LanguageViewSet, basename="language")
router.register(r"currencies", views.CurrencyViewSet, basename="currency")

urlpatterns = [
    path("", include(router.urls)),
    path("users/me/locale/", views.get_user_locale, name="user-locale"),
    path(
        "users/me/language/", views.update_user_language, name="update-user-language"
    ),
    path(
        "users/me/currency/", views.update_user_currency, name="update-user-currency"
    ),
]
