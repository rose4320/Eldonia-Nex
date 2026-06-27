from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST
from django.views.decorators.csrf import csrf_exempt
import json

from marketplace.referral_service import ensure_referral_code, is_paid_member
from users.sync_service import sync_supabase_user


def _authorize_internal(request) -> bool:
    internal_token = getattr(settings, "INTERNAL_API_TOKEN", "")
    if not internal_token:
        return True
    return request.headers.get("x-internal-api-token") == internal_token


@require_GET
def referral_program_status(request):
    """Next.js 設定画面用: Django Admin のサブスクプランから紹介コード状態を返す。"""
    if not _authorize_internal(request):
        return JsonResponse({"error": "unauthorized"}, status=401)

    email = (request.GET.get("email") or "").strip()
    username = (request.GET.get("username") or "").strip()
    if not email and not username:
        return JsonResponse(
            {"eligible": False, "reason": "email or username is required"},
            status=400,
        )

    User = get_user_model()
    user = None
    if email:
        user = User.objects.filter(email__iexact=email).first()
    if not user and username:
        user = User.objects.filter(username__iexact=username).first()
    if not user:
        return JsonResponse(
            {"eligible": False, "reason": "Django user was not found."},
            status=404,
        )

    plan = (getattr(user, "subscription_plan", "") or "free").strip().lower()
    if not is_paid_member(user):
        return JsonResponse(
            {
                "eligible": False,
                "reason": "紹介コードはサブスクプランが Free 以外の会員に付与されます。",
                "subscription_plan": plan,
            }
        )

    referral = ensure_referral_code(user)
    return JsonResponse(
        {
            "eligible": True,
            "subscription_plan": plan,
            "referral_code": referral.referral_code if referral else None,
            "rebate_percent": str(referral.rebate_percent) if referral else None,
            "reward_available_at": referral.reward_available_at.isoformat()
            if referral and referral.reward_available_at
            else None,
        }
    )


@csrf_exempt
@require_POST
def sync_supabase_user_view(request):
    """Next.js から Supabase 登録ユーザーを Django User に同期する。"""
    if not _authorize_internal(request):
        return JsonResponse({"error": "unauthorized"}, status=401)

    try:
        body = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "invalid json"}, status=400)

    supabase_user_id = (body.get("supabase_user_id") or "").strip()
    email = (body.get("email") or "").strip()
    if not supabase_user_id or not email:
        return JsonResponse(
            {"error": "supabase_user_id and email are required"},
            status=400,
        )

    try:
        user, created = sync_supabase_user(
            supabase_user_id=supabase_user_id,
            email=email,
            username=(body.get("username") or None),
            display_name=(body.get("display_name") or None),
            phone=(body.get("phone") or None),
            subscription_plan=(body.get("subscription_plan") or "free"),
            referral_code_used=(body.get("referral_code_used") or None),
            is_email_verified=bool(body.get("is_email_verified")),
        )
    except ValueError as exc:
        return JsonResponse({"error": str(exc)}, status=400)

    return JsonResponse(
        {
            "ok": True,
            "created": created,
            "django_user_id": user.pk,
            "username": user.username,
            "subscription_plan": user.subscription_plan,
        }
    )
