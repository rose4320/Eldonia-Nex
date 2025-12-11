"""
URL configuration for eldinia_nex project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from typing import List

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import HttpRequest, JsonResponse
from django.shortcuts import render
from django.urls import include, path

from api.events.views import UserPlanLimitsView
from marketplace.artwork_views import (
    ArtworkListView,
    CreateArtworkView,
    UploadArtworkImageView,
)
from rest_framework.authtoken.views import obtain_auth_token
from users.api_views import CurrentUserView, LogoutView
from users.referral_views import ReferralCodeView, ReferralListView
from users.upload_views import UploadAvatarView
from users.views import PlanListView, RegisterUserView

from .views import community_page

## import削除（重複）




# API Health Check
def api_health_check(request: HttpRequest) -> JsonResponse:
    """Next.js SSR連携用ヘルスチェックAPI"""
    _ = request  # noqa: F841 未使用引数警告抑制
    return JsonResponse(
        {
            "status": "healthy",
            "message": "Eldonia-Nex Django API is running",
            "version": "1.0.0",
            "environment": "development" if settings.DEBUG else "production",
            "ssr_ready": True,
        }
    )


# API Root / Welcome Page
def api_root(request: HttpRequest):
    """APIルートエンドポイント - プロフェッショナルなUIウェルカムページを表示"""
    
    base_url = request.build_absolute_uri('/').rstrip('/')
    
    # JSON APIとして使いたい場合
    if request.META.get('HTTP_ACCEPT', '').startswith('application/json'):
        return JsonResponse(
            {
                "message": "🎨 Eldonia-Nex API へようこそ",
                "description": "クリエイターのための創作プラットフォーム",
                "version": "1.0.0",
                "environment": "development" if settings.DEBUG else "production",
                "documentation": f"{base_url}/admin/",
                "endpoints": {
                    "health": {
                        "url": f"{base_url}/api/v1/health/",
                        "method": "GET",
                        "description": "APIヘルスチェック"
                    },
                    "admin": {
                        "url": f"{base_url}/admin/",
                        "method": "GET",
                        "description": "Django管理画面"
                    },
                    "register": {
                        "url": f"{base_url}/api/v1/register/",
                        "method": "POST",
                        "description": "ユーザー登録"
                    },
                    "plans": {
                        "url": f"{base_url}/api/v1/plans/",
                        "method": "GET",
                        "description": "サブスクリプションプラン一覧"
                    },
                    "community": {
                        "url": f"{base_url}/community/",
                        "method": "GET",
                        "description": "コミュニティページ"
                    }
                },
                "status": "operational",
                "timestamp": "2025-11-30T22:00:00Z"
            },
            json_dumps_params={'ensure_ascii': False, 'indent': 2}
        )
    
    # ブラウザからのアクセス - HTMLテンプレートを表示
    context = {
        "message": "🎨 Eldonia-Nex API へようこそ",
        "description": "クリエイターのための創作プラットフォーム",
        "version": "1.0.0",
        "environment": "development" if settings.DEBUG else "production",
        "documentation": f"{base_url}/admin/",
        "endpoints": {
            "health": {
                "url": f"{base_url}/api/v1/health/",
                "method": "GET",
                "description": "APIヘルスチェック"
            },
            "admin": {
                "url": f"{base_url}/admin/",
                "method": "GET",
                "description": "Django管理画面"
            },
            "register": {
                "url": f"{base_url}/api/v1/register/",
                "method": "POST",
                "description": "ユーザー登録"
            },
            "plans": {
                "url": f"{base_url}/api/v1/plans/",
                "method": "GET",
                "description": "サブスクリプションプラン一覧"
            },
            "community": {
                "url": f"{base_url}/community/",
                "method": "GET",
                "description": "コミュニティページ"
            }
        },
        "status": "operational",
    }
    
    return render(request, 'api_root.html', context)



urlpatterns: List[object] = [
    path("", api_root, name="api_root"),  # ルートパス
    path("admin/", admin.site.urls),
    path("api/v1/health/", api_health_check, name="api_health"),
    path("community/", community_page, name="community"),
    # 認証関連
    path("api/v1/login/", obtain_auth_token, name="api_login"),
    path("api/v1/logout/", LogoutView.as_view(), name="api_logout"),
    path("api/v1/users/me/", CurrentUserView.as_view(), name="current_user"),
    path("api/v1/register/", RegisterUserView.as_view(), name="register_user"),
    # プラン制限情報
    path("api/v1/users/plan-limits/", UserPlanLimitsView.as_view(), name="user_plan_limits"),
    # その他のユーザー関連
    path("api/v1/plans/", PlanListView.as_view(), name="plan_list"),
    path("api/v1/users/upload-avatar/", UploadAvatarView.as_view(), name="upload_avatar"),
    path("api/v1/users/<int:user_id>/referral-code/", ReferralCodeView.as_view(), name="referral_code"),
    path("api/v1/users/<int:user_id>/referrals/", ReferralListView.as_view(), name="referral_list"),
    # アートワーク関連
    path("api/v1/artworks/upload-image/", UploadArtworkImageView.as_view(), name="upload_artwork_image"),
    path("api/v1/artworks/create/", CreateArtworkView.as_view(), name="create_artwork"),
    path("api/v1/artworks/list/", ArtworkListView.as_view(), name="artwork_list"),
    # Events API
    path("api/v1/events/", include('api.events.urls')),
]

# Development: Static/Media files
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
