"""
Users API Views
"""
# pyright: reportMissingTypeStubs=false, reportMissingImports=false, reportUnknownMemberType=false, reportUnknownArgumentType=false, reportUnknownVariableType=false, reportUnknownParameterType=false

from typing import Any

from django.contrib.auth import authenticate, get_user_model
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import status, viewsets, permissions
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import UserAddress, UserDetail, UserSkill
from .serializers import UserManagementSerializer

# Use the project user model dynamically
User = get_user_model()


class UserManagementViewSet(viewsets.ModelViewSet):
    """管理者用ユーザー管理API"""
    queryset = User.objects.all().order_by('-created_at')
    serializer_class = UserManagementSerializer
    permission_classes = [IsAdminUser]
    filterset_fields = ['username', 'email', 'subscription']
    search_fields = ['username', 'email', 'display_name']


class CustomLoginView(APIView):
    """ユーザー名またはメールアドレスでのログイン"""

    permission_classes = []

    def post(self, request: Any):
        """ログイン処理（username or email + password）"""
        username_or_email = request.data.get("username", "")
        password = request.data.get("password", "")

        if not username_or_email or not password:
            return Response(
                {"non_field_errors": ["ユーザー名/メールアドレスとパスワードを入力してください"]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # まずユーザー名で認証を試行
        user = authenticate(username=username_or_email, password=password)

        # ユーザー名で失敗した場合、メールアドレスで検索して認証
        if user is None:
            try:
                user_obj = User.objects.get(email=username_or_email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass

        if user is None:
            return Response(
                {"non_field_errors": ["提供された認証情報でログインできません。"]}, status=status.HTTP_400_BAD_REQUEST
            )

        # トークンを取得または作成
        token, _created = Token.objects.get_or_create(user=user)  # type: ignore[attr-defined]

        return Response({"token": token.key, "user_id": user.pk, "username": user.username, "email": user.email})


class CurrentUserView(APIView):
    """現在のログインユーザー情報を取得・更新"""

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Any):
        """ログインユーザーの情報を返す"""
        user = request.user

        # DBから最新のユーザー情報を取得
        user.refresh_from_db()

        subscription_value = getattr(user, "subscription", "free")

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "display_name": user.display_name or user.username,
                "avatar_url": user.avatar_url or "",
                "subscription": subscription_value,
                "level": getattr(user, "current_level", 1),
                "exp": getattr(user, "total_exp", 0),
                "fan_count": getattr(user, "fan_count", 0),
                "preferred_language": getattr(user, "preferred_language", "ja"),
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
            }
        )


class ProfileUpdateView(APIView):
    """プロフィール更新"""

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request: Any):
        """プロフィールを更新する"""
        user = request.user

        # 更新可能なフィールド
        display_name = request.data.get("display_name")
        bio = request.data.get("bio")
        avatar_url = request.data.get("avatar_url")
        email = request.data.get("email")

        # フィールドを更新
        update_fields = []

        if display_name is not None:
            user.display_name = display_name
            update_fields.append("display_name")

        if bio is not None:
            user.bio = bio
            update_fields.append("bio")

        if avatar_url is not None:
            user.avatar_url = avatar_url
            update_fields.append("avatar_url")

        if email is not None:
            # メールの重複チェック
            if User.objects.exclude(pk=user.pk).filter(email=email).exists():
                return Response(
                    {"detail": "このメールアドレスは既に使用されています。"}, status=status.HTTP_400_BAD_REQUEST
                )
            user.email = email
            update_fields.append("email")

        if update_fields:
            user.save(update_fields=update_fields)

        return Response(
            {
                "detail": "プロフィールを更新しました",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "display_name": user.display_name or user.username,
                    "bio": getattr(user, "bio", ""),
                    "avatar_url": user.avatar_url or "",
                    "email": user.email,
                },
            }
        )


class SubscriptionUpdateView(APIView):
    """サブスクリプションプラン変更"""

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request: Any):
        """プランを変更する"""
        user = request.user
        new_plan = request.data.get("subscription_plan")

        valid_plans = ["free", "standard", "pro", "business", "enterprise"]
        if new_plan not in valid_plans:
            return Response(
                {"detail": f'無効なプランです。有効なプラン: {", ".join(valid_plans)}'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # プランを更新
        user.subscription = new_plan
        user.subscription_plan = new_plan
        user.save(update_fields=["subscription", "subscription_plan"])

        # DBから再取得して確認
        user.refresh_from_db()

        return Response(
            {
                "detail": "プランを変更しました",
                "subscription": new_plan,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "subscription": new_plan,
                },
            }
        )


class LogoutView(APIView):
    """ログアウト処理"""

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Any):
        """トークンを削除してログアウト"""
        # トークンが無いケースを明示的に扱う
        token = getattr(request.user, "auth_token", None)
        if token is None:
            return Response({"detail": "ログイン中ではありません"}, status=status.HTTP_400_BAD_REQUEST)

        token.delete()
        return Response({"detail": "ログアウトしました"}, status=status.HTTP_200_OK)


class UserAddressView(APIView):
    """ユーザー住所情報の取得・更新"""

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Any):
        """住所情報を取得"""
        try:
            address = UserAddress.objects.get(user=request.user)
        except ObjectDoesNotExist:
            return Response(None)

        return Response(
            {
                "id": address.id,
                "country_code": address.country_code,
                "country_name": address.country_name,
                "postal_code": address.postal_code,
                "state_province": address.state_province,
                "city": address.city,
                "address_line1": address.address_line1,
                "address_line2": address.address_line2,
                "full_address": address.full_address,
                "latitude": str(address.latitude) if address.latitude else None,
                "longitude": str(address.longitude) if address.longitude else None,
                "address_type": address.address_type,
                "is_primary": address.is_primary,
            }
        )

    def patch(self, request: Any):
        """住所情報を更新（なければ作成）"""
        address, _created = UserAddress.objects.get_or_create(user=request.user)

        fields = [
            "country_code",
            "country_name",
            "postal_code",
            "state_province",
            "city",
            "address_line1",
            "address_line2",
            "full_address",
            "latitude",
            "longitude",
            "address_type",
            "is_primary",
        ]

        for field in fields:
            if field in request.data:
                setattr(address, field, request.data[field])

        address.save()

        return Response(
            {
                "detail": "住所情報を更新しました",
                "address": {
                    "id": address.id,
                    "country_code": address.country_code,
                    "country_name": address.country_name,
                    "postal_code": address.postal_code,
                    "state_province": address.state_province,
                    "city": address.city,
                    "address_line1": address.address_line1,
                    "address_line2": address.address_line2,
                    "full_address": address.full_address,
                },
            }
        )


class UserSkillsView(APIView):
    """ユーザースキル情報の取得・追加"""

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Any):
        """スキル一覧を取得"""
        skills = UserSkill.objects.filter(user=request.user)
        return Response(
            [
                {
                    "id": skill.id,
                    "skill_name": skill.skill_name,
                    "category": skill.category,
                    "level": skill.level,
                    "years_of_experience": skill.years_of_experience,
                    "certification": skill.certification,
                    "description": skill.description,
                    "sort_order": skill.sort_order,
                    "is_primary": skill.is_primary,
                }
                for skill in skills
            ]
        )

    def post(self, request: Any):
        """スキルを追加"""
        skill = UserSkill.objects.create(
            user=request.user,
            skill_name=request.data.get("skill_name", ""),
            category=request.data.get("category", "other"),
            level=request.data.get("level", 1),
            years_of_experience=request.data.get("years_of_experience"),
            certification=request.data.get("certification"),
            description=request.data.get("description"),
            sort_order=request.data.get("sort_order", 0),
            is_primary=request.data.get("is_primary", False),
        )
        return Response(
            {
                "detail": "スキルを追加しました",
                "skill": {
                    "id": skill.id,
                    "skill_name": skill.skill_name,
                    "category": skill.category,
                    "level": skill.level,
                },
            },
            status=status.HTTP_201_CREATED,
        )


class UserSkillDetailView(APIView):
    """個別スキルの更新・削除"""

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request: Any, skill_id: int):
        """スキルを更新"""
        try:
            skill = UserSkill.objects.get(id=skill_id, user=request.user)
        except ObjectDoesNotExist:
            return Response({"detail": "スキルが見つかりません"}, status=status.HTTP_404_NOT_FOUND)

        fields = [
            "skill_name",
            "category",
            "level",
            "years_of_experience",
            "certification",
            "description",
            "sort_order",
            "is_primary",
        ]

        for field in fields:
            if field in request.data:
                setattr(skill, field, request.data[field])

        skill.save()
        return Response({"detail": "スキルを更新しました"})

    def delete(self, request: Any, skill_id: int):
        """スキルを削除"""
        try:
            skill = UserSkill.objects.get(id=skill_id, user=request.user)
        except ObjectDoesNotExist:
            return Response({"detail": "スキルが見つかりません"}, status=status.HTTP_404_NOT_FOUND)

        skill.delete()
        return Response({"detail": "スキルを削除しました"})


class UserDetailView(APIView):
    """ユーザー詳細情報の取得・更新"""

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Any):
        """詳細情報を取得"""
        try:
            detail = UserDetail.objects.get(user=request.user)
        except ObjectDoesNotExist:
            return Response(None)

        return Response(
            {
                "id": detail.id,
                "first_name_kanji": detail.first_name_kanji,
                "last_name_kanji": detail.last_name_kanji,
                "first_name_kana": detail.first_name_kana,
                "last_name_kana": detail.last_name_kana,
                "occupation": detail.occupation,
                "company_name": detail.company_name,
                "company_position": detail.company_position,
                "education": detail.education,
                "education_status": detail.education_status,
                "income_range": detail.income_range,
                "interests": detail.interests,
                "self_introduction": detail.self_introduction,
                "desired_work_types": detail.desired_work_types,
                "desired_hourly_rate_min": (
                    str(detail.desired_hourly_rate_min) if detail.desired_hourly_rate_min else None
                ),
                "desired_hourly_rate_max": (
                    str(detail.desired_hourly_rate_max) if detail.desired_hourly_rate_max else None
                ),
                "available_hours_per_week": detail.available_hours_per_week,
                "is_remote_available": detail.is_remote_available,
                "is_identity_verified": detail.is_identity_verified,
                "has_signed_nda": detail.has_signed_nda,
                "notes": detail.notes,
            }
        )

    def patch(self, request: Any):
        """詳細情報を更新（なければ作成）"""
        detail, _created = UserDetail.objects.get_or_create(user=request.user)

        fields = [
            "first_name_kanji",
            "last_name_kanji",
            "first_name_kana",
            "last_name_kana",
            "occupation",
            "company_name",
            "company_position",
            "education",
            "education_status",
            "income_range",
            "interests",
            "self_introduction",
            "desired_work_types",
            "desired_hourly_rate_min",
            "desired_hourly_rate_max",
            "available_hours_per_week",
            "is_remote_available",
            "is_identity_verified",
            "has_signed_nda",
            "notes",
        ]

        for field in fields:
            if field in request.data:
                setattr(detail, field, request.data[field])

        detail.save()

        return Response(
            {
                "detail": "詳細情報を更新しました",
                "data": {
                    "id": detail.id,
                    "first_name_kanji": detail.first_name_kanji,
                    "last_name_kanji": detail.last_name_kanji,
                    "occupation": detail.occupation,
                    "company_name": detail.company_name,
                },
            }
        )


class UserFullProfileView(APIView):
    """ユーザーの全情報を一括取得"""

    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Any):
        """ユーザーの全情報（基本情報、住所、スキル、詳細）を取得"""
        user = request.user

        # 住所
        address = UserAddress.objects.filter(user=user).first()
        address_data = (
            {
                "country_code": address.country_code,
                "country_name": address.country_name,
                "postal_code": address.postal_code,
                "state_province": address.state_province,
                "city": address.city,
                "address_line1": address.address_line1,
                "address_line2": address.address_line2,
                "full_address": address.full_address,
            }
            if address
            else None
        )

        # スキル
        skills = UserSkill.objects.filter(user=user)
        skills_data = [
            {
                "id": skill.id,
                "skill_name": skill.skill_name,
                "category": skill.category,
                "level": skill.level,
                "is_primary": skill.is_primary,
            }
            for skill in skills
        ]

        # 詳細
        detail = UserDetail.objects.filter(user=user).first()
        detail_data = (
            {
                "first_name_kanji": detail.first_name_kanji,
                "last_name_kanji": detail.last_name_kanji,
                "first_name_kana": detail.first_name_kana,
                "last_name_kana": detail.last_name_kana,
                "occupation": detail.occupation,
                "company_name": detail.company_name,
                "education": detail.education,
                "is_identity_verified": detail.is_identity_verified,
            }
            if detail
            else None
        )

        return Response(
            {
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "display_name": user.display_name or user.username,
                    "avatar_url": user.avatar_url or "",
                    "subscription": user.subscription,
                    "level": user.current_level,
                    "exp": user.total_exp,
                },
                "address": address_data,
                "skills": skills_data,
                "detail": detail_data,
            }
        )
