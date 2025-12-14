"""Views for localization API."""
from decimal import Decimal

from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from .models import Currency, ExchangeRate, Language
from .serializers import (
    CurrencyConversionRequestSerializer,
    CurrencyConversionResponseSerializer,
    CurrencySerializer,
    ExchangeRateSerializer,
    LanguageSerializer,
    UserCurrencyUpdateSerializer,
    UserLanguageUpdateSerializer,
    UserLocaleSerializer,
)


class LanguageViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Language model."""

    queryset = Language.objects.filter(is_active=True)
    serializer_class = LanguageSerializer
    permission_classes = []  # Public endpoint


class CurrencyViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Currency model."""

    queryset = Currency.objects.filter(is_active=True)
    serializer_class = CurrencySerializer
    permission_classes = []  # Public endpoint

    @action(detail=False, methods=["get"])
    def rates(self, request: Request) -> Response:
        """Get exchange rates for all currencies."""
        base_currency = request.query_params.get("base", "JPY")

        # Get latest rates for the base currency
        rates = ExchangeRate.objects.filter(
            from_currency_id=base_currency
        ).order_by("to_currency", "-effective_date").distinct("to_currency")

        serializer = ExchangeRateSerializer(rates, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def convert(self, request: Request) -> Response:
        """Convert amount from one currency to another."""
        request_serializer = CurrencyConversionRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)

        amount = request_serializer.validated_data["amount"]
        from_currency = request_serializer.validated_data["from_currency"]
        to_currency = request_serializer.validated_data["to_currency"]

        # If same currency, no conversion needed
        if from_currency == to_currency:
            response_data = {
                "amount": amount,
                "from_currency": from_currency,
                "to_currency": to_currency,
                "converted_amount": amount,
                "rate": Decimal("1.0"),
                "rate_date": None,
            }
            response_serializer = CurrencyConversionResponseSerializer(response_data)
            return Response(response_serializer.data)

        # Get latest exchange rate
        try:
            exchange_rate = (
                ExchangeRate.objects.filter(
                    from_currency_id=from_currency, to_currency_id=to_currency
                )
                .order_by("-effective_date")
                .first()
            )

            if not exchange_rate:
                # Try reverse rate
                reverse_rate = (
                    ExchangeRate.objects.filter(
                        from_currency_id=to_currency, to_currency_id=from_currency
                    )
                    .order_by("-effective_date")
                    .first()
                )

                if reverse_rate:
                    rate = Decimal("1.0") / reverse_rate.rate
                    rate_date = reverse_rate.effective_date
                else:
                    return Response(
                        {"error": "Exchange rate not found"},
                        status=status.HTTP_404_NOT_FOUND,
                    )
            else:
                rate = exchange_rate.rate
                rate_date = exchange_rate.effective_date

            converted_amount = amount * rate

            response_data = {
                "amount": amount,
                "from_currency": from_currency,
                "to_currency": to_currency,
                "converted_amount": converted_amount,
                "rate": rate,
                "rate_date": rate_date,
            }

            response_serializer = CurrencyConversionResponseSerializer(response_data)
            return Response(response_serializer.data)

        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_locale(request: Request) -> Response:
    """Get user's locale settings."""
    user = request.user
    serializer = UserLocaleSerializer(
        {
            "preferred_language": user.preferred_language,
            "preferred_currency": user.preferred_currency,
            "timezone": user.timezone,
        }
    )
    return Response(serializer.data)


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user_language(request: Request) -> Response:
    """Update user's preferred language."""
    serializer = UserLanguageUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    language_code = serializer.validated_data["language"]

    # Validate language exists and is active
    try:
        language = Language.objects.get(code=language_code, is_active=True)
    except Language.DoesNotExist:
        return Response(
            {"error": f"Language '{language_code}' is not supported"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    request.user.preferred_language = language_code
    request.user.save(update_fields=["preferred_language"])

    return Response(
        {
            "message": "Language updated successfully",
            "preferred_language": language_code,
        }
    )


@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user_currency(request: Request) -> Response:
    """Update user's preferred currency."""
    serializer = UserCurrencyUpdateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    currency_code = serializer.validated_data["currency"]

    # Validate currency exists and is active
    try:
        currency = Currency.objects.get(code=currency_code, is_active=True)
    except Currency.DoesNotExist:
        return Response(
            {"error": f"Currency '{currency_code}' is not supported"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    request.user.preferred_currency = currency_code
    request.user.save(update_fields=["preferred_currency"])

    return Response(
        {
            "message": "Currency updated successfully",
            "preferred_currency": currency_code,
        }
    )
