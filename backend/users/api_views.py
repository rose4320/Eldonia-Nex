"""
Users API Views
"""
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User


class CurrentUserView(APIView):
    """現在のログインユーザー情報を取得"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """ログインユーザーの情報を返す"""
        user = request.user
        
        # DBから最新のユーザー情報を取得
        user.refresh_from_db()
        
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'display_name': user.display_name or user.username,
            'avatar_url': user.avatar_url or '',
            'subscription': getattr(user, 'subscription', 'free'),
            'level': getattr(user, 'current_level', 1),
            'exp': getattr(user, 'total_exp', 0),
            'fan_count': getattr(user, 'fan_count', 0),
        })


class LogoutView(APIView):
    """ログアウト処理"""
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """トークンを削除してログアウト"""
        try:
            # ユーザーのトークンを削除
            request.user.auth_token.delete()
            return Response({'detail': 'ログアウトしました'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
