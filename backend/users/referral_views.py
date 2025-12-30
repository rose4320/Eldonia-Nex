"""紹介コード生成と管理のビュー"""

from typing import Any

from django.http import HttpRequest, JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from marketplace.models import Referral
from users.models import User


class ReferralCodeView(View):
    """紹介コード生成・取得API"""

    @staticmethod
    def generate_referral_code(user: User) -> str:
        """ユーザーベースの紹介コード生成"""
        # ユーザー名を大文字に変換し、IDを付加
        base_code = f"ELDONIA-{user.username.upper()}-{user.id}"
        return base_code

    @method_decorator(csrf_exempt)
    def dispatch(self, request: HttpRequest, *args: Any, **kwargs: Any) -> Any:
        return super().dispatch(request, *args, **kwargs)

    def get(self, request: HttpRequest, user_id: int) -> JsonResponse:
        """紹介コードと統計を取得"""
        try:
            # ユーザーを取得
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({"error": "ユーザーが見つかりません"}, status=404)

            # 紹介コードを生成
            referral_code = self.generate_referral_code(user)

            # 紹介統計を取得
            total_referrals = Referral.objects.filter(referrer=user).count()
            active_referrals = Referral.objects.filter(referrer=user, referred_user__is_active=True).count()

            # 報酬計算（TODO: 実際の報酬システムに応じて調整）
            total_rewards = total_referrals * 500  # 1紹介あたり500ポイント

            # 紹介URLを生成
            protocol = "https" if request.is_secure() else "http"
            host = request.get_host()
            referral_url = f"{protocol}://{host}/register?ref={referral_code}"

            return JsonResponse(
                {
                    "referral_code": referral_code,
                    "referral_url": referral_url,
                    "stats": {
                        "total_referrals": total_referrals,
                        "active_referrals": active_referrals,
                        "total_rewards": total_rewards,
                    },
                },
                status=200,
            )

        except Exception as e:
            return JsonResponse({"error": f"紹介コード取得中にエラーが発生しました: {str(e)}"}, status=500)


class ReferralListView(View):
    """紹介したユーザーの一覧取得API"""

    @method_decorator(csrf_exempt)
    def dispatch(self, request: HttpRequest, *args: Any, **kwargs: Any) -> Any:
        return super().dispatch(request, *args, **kwargs)

    def get(self, request: HttpRequest, user_id: int) -> JsonResponse:
        """紹介したユーザーの一覧を取得"""
        try:
            # ユーザーを取得
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({"error": "ユーザーが見つかりません"}, status=404)

            # 紹介したユーザーを取得
            referrals = Referral.objects.filter(referrer=user).select_related("referred_user")

            # データを整形
            referral_list = []
            for referral in referrals:
                if referral.referred_user:  # referred_userがNullでないことを確認
                    referred_user = referral.referred_user
                    referral_list.append(
                        {
                            "id": referred_user.id,
                            "username": referred_user.username,
                            "display_name": referred_user.display_name,
                            "is_active": referred_user.is_active,
                            "joined_at": referral.created_at.isoformat(),
                            "status": "active" if referred_user.is_active else "inactive",
                        }
                    )

            return JsonResponse({"referrals": referral_list, "count": len(referral_list)}, status=200)

        except Exception as e:
            return JsonResponse({"error": f"紹介リスト取得中にエラーが発生しました: {str(e)}"}, status=500)
