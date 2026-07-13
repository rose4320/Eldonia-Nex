"""Django Admin 向け Supabase カタログ同期 API"""

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json

from marketplace.supabase_sync import SupabaseSyncError, sync_supabase_artworks, sync_supabase_profiles, sync_supabase_shop_products


def _authorize_internal(request) -> bool:
    internal_token = getattr(settings, "INTERNAL_API_TOKEN", "")
    if not internal_token:
        return True
    return request.headers.get("x-internal-api-token") == internal_token


@csrf_exempt
@require_POST
def sync_supabase_catalog_view(request):
    """Supabase profiles / artworks を Django DB に同期する（内部 API）。"""
    if not _authorize_internal(request):
        return JsonResponse({"error": "unauthorized"}, status=401)

    try:
        body = json.loads(request.body.decode("utf-8") or "{}")
    except (json.JSONDecodeError, UnicodeDecodeError):
        body = {}

    creator_id = (body.get("creator_id") or "").strip() or None
    seller_id = (body.get("seller_id") or "").strip() or None
    profiles_only = bool(body.get("profiles_only"))
    artworks_only = bool(body.get("artworks_only"))
    shop_only = bool(body.get("shop_only"))

    try:
        result: dict = {"ok": True}
        if not artworks_only and not shop_only:
            result["profiles"] = sync_supabase_profiles()
        if not profiles_only and not shop_only:
            result["artworks"] = sync_supabase_artworks(creator_id=creator_id)
        if not profiles_only and not artworks_only:
            result["shop_products"] = sync_supabase_shop_products(seller_id=seller_id)
        return JsonResponse(result)
    except SupabaseSyncError as exc:
        return JsonResponse({"ok": False, "error": str(exc)}, status=502)
