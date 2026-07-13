"""Public / internal APIs for site content."""

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .models import FooterPartner


def _authorize_internal(request) -> bool:
    internal_token = getattr(settings, "INTERNAL_API_TOKEN", "")
    if not internal_token:
        return True
    return request.headers.get("x-internal-api-token") == internal_token


@require_GET
def footer_partners_list(request):
    """Next.js フッター用: 公開中の協力・スポンサー一覧。"""
    if not _authorize_internal(request):
        return JsonResponse({"error": "unauthorized"}, status=401)

    partners = FooterPartner.objects.filter(is_active=True).order_by("sort_order", "id")
    return JsonResponse(
        {
            "partners": [
                {
                    "id": p.id,
                    "name": p.name,
                    "role": p.role_payload(),
                    "link_enabled": p.link_enabled,
                    "url": p.public_url(),
                    "sort_order": p.sort_order,
                }
                for p in partners
            ]
        }
    )
