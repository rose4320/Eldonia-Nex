"""Serializers for localization API."""
from rest_framework import serializers

from .models import ContentTranslation, Currency, ExchangeRate, Language


class LanguageSerializer(serializers.ModelSerializer):
    """Serializer for Language model."""

    class Meta:
        model = Language
        fields = [
            "code",
            "name",
            "native_name",
            "is_active",
            "is_default",
            "sort_order",
        ]
        read_only_fields = ["code"]


class CurrencySerializer(serializers.ModelSerializer):
    """Serializer for Currency model."""

    class Meta:
        model = Currency
        fields = [
            "code",
            "name",
            "symbol",
            "decimal_places",
            "is_active",
            "is_default",
            "sort_order",
        ]
        read_only_fields = ["code"]


class ExchangeRateSerializer(serializers.ModelSerializer):
    """Serializer for ExchangeRate model."""

    from_currency_code = serializers.CharField(source="from_currency_id", read_only=True)
    to_currency_code = serializers.CharField(source="to_currency_id", read_only=True)

    class Meta:
        model = ExchangeRate
        fields = [
            "from_currency_code",
            "to_currency_code",
            "rate",
            "effective_date",
            "source",
        ]


class ContentTranslationSerializer(serializers.ModelSerializer):
    """Serializer for ContentTranslation model."""

    language_code = serializers.CharField(source="language_id", read_only=True)

    class Meta:
        model = ContentTranslation
        fields = [
            "id",
            "content_type",
            "content_id",
            "field_name",
            "language_code",
            "translation",
            "is_machine_translated",
            "is_verified",
        ]


class CurrencyConversionRequestSerializer(serializers.Serializer):
    """Request serializer for currency conversion."""

    amount = serializers.DecimalField(max_digits=20, decimal_places=8, required=True)
    from_currency = serializers.CharField(max_length=3, required=True)
    to_currency = serializers.CharField(max_length=3, required=True)


class CurrencyConversionResponseSerializer(serializers.Serializer):
    """Response serializer for currency conversion."""

    amount = serializers.DecimalField(max_digits=20, decimal_places=8)
    from_currency = serializers.CharField(max_length=3)
    to_currency = serializers.CharField(max_length=3)
    converted_amount = serializers.DecimalField(max_digits=20, decimal_places=8)
    rate = serializers.DecimalField(max_digits=20, decimal_places=8)
    rate_date = serializers.DateTimeField()


class UserLanguageUpdateSerializer(serializers.Serializer):
    """Serializer for updating user's preferred language."""

    language = serializers.CharField(max_length=5, required=True)


class UserCurrencyUpdateSerializer(serializers.Serializer):
    """Serializer for updating user's preferred currency."""

    currency = serializers.CharField(max_length=3, required=True)


class UserLocaleSerializer(serializers.Serializer):
    """Serializer for user's locale settings."""

    preferred_language = serializers.CharField(max_length=5)
    preferred_currency = serializers.CharField(max_length=3)
    timezone = serializers.CharField(max_length=50)
