from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from marketplace.referral_service import ensure_referral_code, is_paid_member


@require_GET
def referral_program_status(request):
    """Next.js 設定画面用: Django Admin のサブスクプランから紹介コード状態を返す。"""
    internal_token = getattr(settings, "INTERNAL_API_TOKEN", "")
    if internal_token and request.headers.get("x-internal-api-token") != internal_token:
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
