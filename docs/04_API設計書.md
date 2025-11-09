# Eldonia-Nex API設計書

## 1. API概要

### 1.1 基本情報

- **プロトコル**: HTTPS
- **ベースURL**: `https://api.eldonia-nex.com/v1`
- **認証方式**: JWT Bearer Token + OAuth 2.0
- **データ形式**: JSON
- **文字エンコーディング**: UTF-8
- **バックエンド**: Django 5.1+ / Django REST Framework 3.15+
- **認証**: djangorestframework-simplejwt + django-allauth

### 1.2 共通仕様

#### 1.2.1 リクエストヘッダー

```http
Content-Type: application/json
Authorization: Bearer {jwt_token}
Accept: application/json
X-API-Version: v1
X-Client-Type: web|mobile|desktop
```

#### 1.2.2 Django REST Framework 設定

```python
# settings.py

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
    },
}

# JWT設定

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
}
```

#### 1.2.3 レスポンス形式（Django REST Framework）

```json
{
  "success": true,
  "data": {
    // レスポンスデータ
  },
  "message": "Success",
  "timestamp": "2024-11-03T12:00:00Z",
  "request_id": "req_12345"
}
```

#### 1.2.4 エラーレスポンス形式

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "リクエストパラメータが正しくありません",
    "details": [
      {
        "field": "email",
        "message": "有効なメールアドレスを入力してください"
      }
    ]
  },
  "timestamp": "2024-11-03T12:00:00Z",
  "request_id": "req_12345"
}
```

#### 1.2.5 Django ViewSet 実装例

```python
# views.py

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters import rest_framework as filters

class ArtworkViewSet(viewsets.ModelViewSet):
    """作品APIエンドポイント"""
    queryset = Artwork.objects.select_related('creator', 'category').all()
    serializer_class = ArtworkSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['category', 'status', 'is_free']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'like_count', 'price']
  
    def get_queryset(self):
        """カスタムクエリセット"""
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(status='published')
        return queryset
  
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        """いいね機能"""
        artwork = self.get_object()
        Like.objects.get_or_create(
            user=request.user,
            artwork=artwork
        )
        artwork.like_count += 1
        artwork.save()
        return Response({'status': 'liked'})
  
    @action(detail=True, methods=['delete'])
    def unlike(self, request, pk=None):
        """いいね解除"""
        artwork = self.get_object()
        Like.objects.filter(
            user=request.user,
            artwork=artwork
        ).delete()
        artwork.like_count = max(0, artwork.like_count - 1)
        artwork.save()
        return Response({'status': 'unliked'})

# serializers.py

from rest_framework import serializers

class ArtworkSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    is_liked = serializers.SerializerMethodField()
  
    class Meta:
        model = Artwork
        fields = '__all__'
        read_only_fields = ['creator', 'view_count', 'like_count', 'created_at']
  
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Like.objects.filter(
                user=request.user,
                artwork=obj
            ).exists()
        return False

# urls.py

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'artworks', ArtworkViewSet, basename='artwork')
router.register(r'users', UserViewSet, basename='user')
router.register(r'events', EventViewSet, basename='event')

urlpatterns = router.urls
```

---

## 2. 認証・認可API

### 2.1 ユーザー認証

#### 2.1.1 ユーザー登録

```http
POST /auth/register
```

**リクエスト**:

```json
{
  "username": "creator123",
  "email": "creator@example.com",
  "password": "SecurePassword123!",
  "display_name": "クリエーター太郎",
  "terms_accepted": true
}
```

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 12345,
      "username": "creator123",
      "email": "creator@example.com",
      "display_name": "クリエーター太郎",
      "account_status": "active",
      "is_email_verified": false
    },
    "tokens": {
      "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      "refresh_token": "refresh_token_here",
      "expires_in": 3600
    }
  }
}
```

#### 2.1.2 ログイン

```http
POST /auth/login
```

**リクエスト**:

```json
{
  "email": "creator@example.com",
  "password": "SecurePassword123!",
  "remember_me": true
}
```

#### 2.1.3 トークン更新

```http
POST /auth/refresh
```

**リクエスト**:

```json
{
  "refresh_token": "refresh_token_here"
}
```

### 2.2 OAuth認証

#### 2.2.1 SNS連携ログイン

```http
POST /auth/oauth/{provider}
```

**パラメータ**:

- `provider`: `google` | `twitter` | `facebook`

---

## 3. ユーザー管理API

### 3.1 プロフィール管理

#### 3.1.1 プロフィール取得

```http
GET /users/{user_id}
```

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "id": 12345,
    "username": "creator123",
    "display_name": "クリエーター太郎",
    "bio": "デジタルアートを中心に活動しています",
    "avatar_url": "https://cdn.eldonia-nex.com/avatars/12345.jpg",
    "website_url": "https://creator123.com",
    "location": "東京都",
    "total_exp": 15000,
    "current_level": 25,
    "fan_count": 1234,
    "fanning_count": 567,
    "artwork_count": 89,
    "social_links": {
      "twitter": "https://twitter.com/creator123",
      "instagram": "https://instagram.com/creator123"
    },
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

#### 3.1.2 プロフィール更新

```http
PUT /users/me/profile
```

**リクエスト**:

```json
{
  "display_name": "新しい表示名",
  "bio": "更新されたプロフィール",
  "website_url": "https://newwebsite.com",
  "location": "大阪府",
  "social_links": {
    "twitter": "https://twitter.com/newusername"
  }
}
```

### 3.2 ファン管理

#### 3.2.1 ファンになる

```http
POST /users/{user_id}/fan
```

#### 3.2.2 ファン解除

```http
DELETE /users/{user_id}/fan
```

#### 3.2.3 ファン一覧

```http
GET /users/{user_id}/fans?page=1&limit=20
```

---

## 4. 作品管理API

### 4.1 作品CRUD操作

#### 4.1.1 作品投稿

```http
POST /artworks
Content-Type: multipart/form-data
```

**リクエスト**:

```text
file: (binary)
title: "美しい夕焼け"
description: "山から撮影した夕焼けの風景"
category_id: 5
tags: ["風景", "夕焼け", "写真"]
price: 1000
is_free: false
license_type: "commercial"
is_adult_content: false
```

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "id": 67890,
    "title": "美しい夕焼け",
    "description": "山から撮影した夕焼けの風景",
    "file_url": "https://cdn.eldonia-nex.com/artworks/67890.jpg",
    "thumbnail_url": "https://cdn.eldonia-nex.com/thumbnails/67890.jpg",
    "category": {
      "id": 5,
      "name": "写真"
    },
    "tags": [
      {"id": 1, "name": "風景"},
      {"id": 2, "name": "夕焼け"},
      {"id": 3, "name": "写真"}
    ],
    "creator": {
      "id": 12345,
      "username": "creator123",
      "display_name": "クリエーター太郎"
    },
    "price": 1000,
    "is_free": false,
    "view_count": 0,
    "like_count": 0,
    "comment_count": 0,
    "created_at": "2024-11-03T12:00:00Z"
  }
}
```

#### 4.1.2 作品一覧取得

```http
GET /artworks?category={category_id}&tags={tag1,tag2}&sort=popular&page=1&limit=20
```

**クエリパラメータ**:

- `category`: カテゴリID
- `tags`: タグ名（カンマ区切り）
- `sort`: `popular` | `newest` | `price_low` | `price_high`
- `price_min`: 最小価格
- `price_max`: 最大価格
- `is_free`: `true` | `false`
- `page`: ページ番号（デフォルト: 1）
- `limit`: 取得件数（デフォルト: 20、最大: 100）

#### 4.1.3 作品詳細取得

```http
GET /artworks/{artwork_id}
```

#### 4.1.4 作品更新

```http
PUT /artworks/{artwork_id}
```

#### 4.1.5 作品削除

```http
DELETE /artworks/{artwork_id}
```

### 4.2 作品インタラクション

#### 4.2.1 いいね追加/削除

```http
POST /artworks/{artwork_id}/like
DELETE /artworks/{artwork_id}/like
```

#### 4.2.2 お気に入り追加/削除

```http
POST /artworks/{artwork_id}/favorite
DELETE /artworks/{artwork_id}/favorite
```

#### 4.2.3 コメント投稿

```http
POST /artworks/{artwork_id}/comments
```

**リクエスト**:

```json
{
  "content": "素晴らしい作品ですね！",
  "parent_id": null,
  "rating": 5
}
```

---

## 5. イベント管理API

### 5.1 イベントCRUD

#### 5.1.1 イベント作成

```http
POST /events
```

**リクエスト**:

```json
{
  "title": "デジタルアート展示会",
  "description": "最新のデジタルアート作品を展示します",
  "event_type": "hybrid",
  "venue_name": "東京アートセンター",
  "venue_address": "東京都渋谷区...",
  "start_datetime": "2024-12-01T10:00:00+09:00",
  "end_datetime": "2024-12-01T18:00:00+09:00",
  "capacity": 100,
  "is_free": false,
  "tickets": [
    {
      "ticket_type": "一般",
      "price": 2000,
      "quantity": 80,
      "description": "一般入場券"
    },
    {
      "ticket_type": "VIP",
      "price": 5000,
      "quantity": 20,
      "description": "VIP席、特典付き"
    }
  ]
}
```

#### 5.1.2 イベント一覧取得

```http
GET /events?start_date={date}&category={category}&location={location}&page=1&limit=20
```

### 5.2 チケット管理

#### 5.2.1 チケット購入

```http
POST /events/{event_id}/tickets/purchase
```

**リクエスト**:

```json
{
  "tickets": [
    {
      "ticket_id": 123,
      "quantity": 2
    }
  ],
  "buyer_info": {
    "name": "購入者名",
    "email": "buyer@example.com",
    "phone": "090-1234-5678"
  },
  "payment_method": "credit_card",
  "currency": "JPY",
  "total_amount": 5000
}
```

---

## 6. Live配信API

### 6.1 配信管理

#### 6.1.1 配信開始

```http
POST /streams
```

**リクエスト**:

```json
{
  "title": "お絵かき配信",
  "description": "リアルタイムでイラストを描きます",
  "scheduled_start": "2024-11-03T20:00:00+09:00",
  "settings": {
    "quality": "1080p",
    "is_archived": true,
    "chat_enabled": true,
    "donations_enabled": true
  }
}
```

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "stream_id": 789,
    "stream_key": "live_key_abcdef123456",
    "rtmp_url": "rtmp://stream.eldonia-nex.com/live",
    "watch_url": "https://eldonia-nex.com/live/789"
  }
}
```

#### 6.1.2 投げ銭

```http
POST /streams/{stream_id}/donate
```

**リクエスト**:

```json
{
  "amount": 500,
  "message": "応援しています！",
  "is_anonymous": false
}
```

### 6.2 配信統計

#### 6.2.1 配信統計取得

```http
GET /streams/{stream_id}/stats
```

---

## 7. ECサイトAPI

### 7.1 商品管理

#### 7.1.1 商品作成

```http
POST /products
```

#### 7.1.2 注文処理

```http
POST /orders
```

**リクエスト**:

```json
{
  "items": [
    {
      "product_id": 456,
      "quantity": 1,
      "price": 2000
    }
  ],
  "shipping_address": {
    "name": "受取人名",
    "postal_code": "100-0001",
    "prefecture": "東京都",
    "city": "千代田区",
    "address_line": "丸の内1-1-1",
    "phone": "03-1234-5678"
  },
  "payment_method": "credit_card"
}
```

---

## 8. ゲーミフィケーションAPI

### 8.1 EXP・レベルシステム

#### 8.1.1 EXP獲得

```http
POST /gamification/exp
```

**リクエスト**:

```json
{
  "action_type": "artwork_post",
  "reference_id": 67890,
  "reference_type": "artwork"
}
```

#### 8.1.2 レベル情報取得

```http
GET /users/me/level
```

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "current_level": 25,
    "total_exp": 15000,
    "current_level_exp": 14500,
    "next_level_exp": 16000,
    "progress_percentage": 75,
    "next_level_rewards": [
      {
        "type": "feature_unlock",
        "name": "高画質アップロード",
        "description": "4K画像のアップロードが可能になります"
      }
    ]
  }
}
```

### 8.2 実績・バッジシステム

#### 8.2.1 実績一覧取得

```http
GET /users/{user_id}/achievements?category={category}&completed={true|false}
```

#### 8.2.2 バッジ獲得

```http
POST /gamification/badges/award
```

### 8.3 ランキング

#### 8.3.1 ランキング取得

```http
GET /rankings/{type}?period=monthly&page=1&limit=100
```

**パラメータ**:

- `type`: `level` | `exp` | `sales` | `artworks` | `fans`
- `period`: `daily` | `weekly` | `monthly` | `yearly` | `all_time`

---

## 9. 検索API

### 9.1 統合検索

#### 9.1.1 全体検索

```http
GET /search?q={keyword}&type={type}&filters={filters}&sort={sort}&page=1&limit=20
```

**パラメータ**:

- `q`: 検索キーワード
- `type`: `artworks` | `users` | `events` | `all`
- `filters`: フィルター条件（JSON文字列）
- `sort`: ソート条件

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "total_count": 1234,
    "artworks": {
      "count": 567,
      "items": [
        // 作品データ
      ]
    },
    "users": {
      "count": 89,
      "items": [
        // ユーザーデータ
      ]
    },
    "events": {
      "count": 12,
      "items": [
        // イベントデータ
      ]
    }
  },
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_pages": 62,
    "has_next": true
  }
}
```

### 9.2 サジェスト

#### 9.2.1 検索サジェスト

```http
GET /search/suggest?q={partial_keyword}&type={type}
```

---

## 10. 分析・統計API

### 10.1 ユーザー統計

#### 10.1.1 ダッシュボード統計

```http
GET /users/me/stats?period=monthly
```

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "overview": {
      "total_artworks": 89,
      "total_views": 12345,
      "total_likes": 6789,
      "total_sales": 456789,
      "fan_growth": 23
    },
    "period_stats": {
      "views": [
        {"date": "2024-11-01", "count": 123},
        {"date": "2024-11-02", "count": 156}
      ],
      "sales": [
        {"date": "2024-11-01", "amount": 5000},
        {"date": "2024-11-02", "amount": 7500}
      ]
    },
    "top_artworks": [
      {
        "id": 67890,
        "title": "美しい夕焼け",
        "views": 1234,
        "likes": 567
      }
    ]
  }
}
```

---

## 11. 管理者API

### 11.1 コンテンツ管理

#### 11.1.1 報告されたコンテンツ一覧

```http
GET /admin/reports?status=pending&type=artwork&page=1&limit=20
```

#### 11.1.2 コンテンツ審査

```http
PUT /admin/contents/{content_id}/moderate
```

**リクエスト**:

```json
{
  "action": "approve|reject|flag",
  "reason": "審査理由",
  "notes": "内部メモ"
}
```

---

## 12. Webhook API

### 12.1 Webhook設定

#### 12.1.1 Webhook登録

```http
POST /webhooks
```

**リクエスト**:

```json
{
  "url": "https://external-service.com/webhook",
  "events": ["artwork.created", "order.completed", "stream.started"],
  "secret": "webhook_secret_key"
}
```

### 12.2 Webhookイベント

#### 12.2.1 作品投稿イベント

```json
{
  "event": "artwork.created",
  "data": {
    "artwork_id": 67890,
    "creator_id": 12345,
    "title": "美しい夕焼け"
  },
  "timestamp": "2024-11-03T12:00:00Z"
}
```

---

## 13. 多言語・多通貨対応API

### 13.1 言語設定API

#### 13.1.1 対応言語取得

```http
GET /api/localization/languages

# レスポンス

{
  "languages": [
    {
      "code": "ja",
      "name": "日本語",
      "native_name": "日本語",
      "available": true
    },
    {
      "code": "en",
      "name": "English",
      "native_name": "English",
      "available": true
    },
    {
      "code": "ko",
      "name": "Korean",
      "native_name": "한국어",
      "available": true
    },
    {
      "code": "zh-CN",
      "name": "Chinese (Simplified)",
      "native_name": "简体中文",
      "available": true
    },
    {
      "code": "vi",
      "name": "Vietnamese",
      "native_name": "Tiếng Việt",
      "available": true
    }
  ]
}
```

#### 13.1.2 ユーザー言語設定

```http
PUT /api/users/me/language
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "language": "ko"
}
```

### 13.2 通貨対応API

#### 13.2.1 対応通貨取得

```http
GET /api/currencies

# レスポンス

{
  "currencies": [
    {
      "code": "JPY",
      "name": "Japanese Yen",
      "symbol": "¥",
      "decimal_places": 0
    },
    {
      "code": "USD",
      "name": "US Dollar",
      "symbol": "$",
      "decimal_places": 2
    },
    {
      "code": "EUR",
      "name": "Euro",
      "symbol": "€",
      "decimal_places": 2
    },
    {
      "code": "KRW",
      "name": "Korean Won",
      "symbol": "₩",
      "decimal_places": 0
    },
    {
      "code": "CNY",
      "name": "Chinese Yuan",
      "symbol": "¥",
      "decimal_places": 2
    },
    {
      "code": "VND",
      "name": "Vietnamese Dong",
      "symbol": "₫",
      "decimal_places": 0
    }
  ],
  "default_currency": "JPY"
}
```

#### 13.2.2 為替レート取得

```http
GET /api/currencies/rates?from=JPY&to=USD,EUR,KRW,CNY,VND

# レスポンス

{
  "base_currency": "JPY",
  "rates": {
    "USD": 0.0067,
    "EUR": 0.0061,
    "KRW": 8.95,
    "CNY": 0.048,
    "VND": 164.2
  },
  "last_updated": "2025-11-03T14:00:00Z"
}
```

#### 13.2.3 価格変換API

```http
GET /api/currencies/convert?amount=1000&from=JPY&to=USD

# レスポンス

{
  "original": {
    "amount": 1000,
    "currency": "JPY",
    "formatted": "¥1,000"
  },
  "converted": {
    "amount": 6.7,
    "currency": "USD", 
    "formatted": "$6.70"
  },
  "rate": 0.0067,
  "timestamp": "2025-11-03T14:00:00Z"
}
```

### 13.3 地域化API

#### 13.3.1 地域設定取得

```http
GET /api/users/me/locale
Authorization: Bearer {jwt_token}

# レスポンス

{
  "language": "ja",
  "currency": "JPY",
  "timezone": "Asia/Tokyo",
  "date_format": "YYYY/MM/DD",
  "number_format": "1,234.56"
}
```

#### 13.3.2 コンテンツ多言語取得

```http
GET /api/artworks/{id}?lang=ko
Authorization: Bearer {jwt_token}

# レスポンス（韓国語）

{
  "artwork_id": 67890,
  "title": "아름다운 석양",
  "description": "고향의 석양을 그린 작품입니다...",
  "price": {
    "amount": 5000,
    "currency": "JPY",
    "formatted": "¥5,000",
    "localized": {
      "KRW": {
        "amount": 44750,
        "formatted": "₩44,750"
      }
    }
  },
  "language": "ko"
}
```

---

## 14. 紹介・QRコードAPI

### 14.1 紹介コード管理

#### 14.1.1 紹介コード生成

```http
POST /api/v1/referral/code/generate
Authorization: Bearer {access_token}
```

**リクエスト**:

```json
{
  "customCode": "MYTARO2024", // 任意（未指定時は自動生成）
  "description": "イベント用紹介コード"
}
```

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "code": "MYTARO2024",
    "url": "https://eldonia-nex.com/invite/MYTARO2024",
    "qrCodeUrl": "https://api.eldonia-nex.com/qr/MYTARO2024.png",
    "createdAt": "2024-11-03T10:00:00Z",
    "expiresAt": null
  }
}
```

#### 14.1.2 QRコード生成

```http
GET /api/v1/referral/qr/{code}
GET /api/v1/referral/qr/{code}?size=300&color=000000&background=FFFFFF
```

**パラメータ**:

- `size`: QRコードサイズ（100-1000px、デフォルト：300）
- `color`: 前景色（16進数、デフォルト：000000）
- `background`: 背景色（16進数、デフォルト：FFFFFF）
- `format`: png|svg（デフォルト：png）

**レスポンス**:

- Content-Type: image/png または image/svg+xml
- QRコード画像バイナリ

#### 14.1.3 紹介統計取得

```http
GET /api/v1/referral/stats
Authorization: Bearer {access_token}
```

**レスポンス**:

```json
{
  "success": true,
  "data": {
    "totalReferrals": 45,
    "totalEarnings": 12500,
    "monthlyReferrals": 12,
    "monthlyEarnings": 2400,
    "conversionRate": 15.5,
    "topReferralCode": {
      "code": "MYTARO2024",
      "referrals": 18,
      "earnings": 4800
    },
    "recentActivity": [
      {
        "code": "MYTARO2024",
        "type": "registration",
        "earnings": 200,
        "timestamp": "2024-11-03T09:30:00Z"
      }
    ]
  }
}
```

### 14.2 紹介追跡

#### 14.2.1 紹介リンクアクセス記録

```http
POST /api/v1/referral/track/click
```

**リクエスト**:

```json
{
  "code": "MYTARO2024",
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1",
  "referer": "https://twitter.com"
}
```

#### 14.2.2 紹介成果記録

```http
POST /api/v1/referral/track/conversion
Authorization: Bearer {access_token}
```

**リクエスト**:

```json
{
  "referralCode": "MYTARO2024",
  "newUserId": 12345,
  "conversionType": "registration|subscription|purchase",
  "amount": 800
}
```

---

## 15. レート制限

### 13.1 制限ルール

- **認証済みユーザー**: 1000リクエスト/時間
- **未認証ユーザー**: 100リクエスト/時間
- **ファイルアップロード**: 10回/時間
- **検索API**: 500リクエスト/時間

### 13.2 制限ヘッダー

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1699027200
```

---

## 14. サブスクリプションAPI

### 14.1 プラン管理API

#### 14.1.1 プラン一覧取得

```http
GET /api/subscription/plans

# レスポンス

{
  "plans": [
    {
      "plan_id": "free",
      "name": "Free",
      "price": {
        "amount": 0,
        "currency": "JPY",
        "formatted": "¥0"
      },
      "billing_cycle": "monthly",
      "features": {
        "max_artworks_per_month": 3,
        "max_file_size_mb": 10,
        "storage_gb": 0.1,
        "live_streaming": false,
        "commission_rate": 0.15
      },
      "description": "主に観覧だけ"
    },
    {
      "plan_id": "standard", 
      "name": "Standard",
      "price": {
        "amount": 800,
        "currency": "JPY",
        "formatted": "¥800"
      },
      "billing_cycle": "monthly",
      "features": {
        "max_artworks_per_month": 20,
        "max_file_size_mb": 50,
        "storage_gb": 1,
        "live_streaming": true,
        "max_live_viewers": 50,
        "commission_rate": 0.12
      },
      "description": "お小遣い稼ぎ",
      "trial_days": 14
    },
    {
      "plan_id": "pro",
      "name": "Pro", 
      "price": {
        "amount": 1500,
        "currency": "JPY",
        "formatted": "¥1,500"
      },
      "billing_cycle": "monthly",
      "features": {
        "max_artworks_per_month": -1,
        "max_file_size_mb": 500,
        "storage_gb": 10,
        "live_streaming": true,
        "max_live_viewers": 200,
        "commission_rate": 0.08
      },
      "description": "専業・個人事業",
      "trial_days": 14
    },
    {
      "plan_id": "business",
      "name": "Business",
      "price": {
        "amount": 10000,
        "currency": "JPY", 
        "formatted": "¥10,000"
      },
      "billing_cycle": "monthly",
      "features": {
        "max_artworks_per_month": -1,
        "max_file_size_mb": 2048,
        "storage_gb": 100,
        "live_streaming": true,
        "max_live_viewers": 1000,
        "commission_rate": 0.05,
        "team_accounts": 10,
        "api_access": true
      },
      "description": "会社組織での業務レベル"
    }
  ]
}
```

#### 14.1.2 ユーザープラン情報取得

```http
GET /api/users/me/subscription
Authorization: Bearer {jwt_token}

# レスポンス

{
  "current_plan": {
    "plan_id": "standard",
    "name": "Standard",
    "status": "active",
    "start_date": "2025-10-01T00:00:00Z",
    "next_billing_date": "2025-12-01T00:00:00Z",
    "trial": false
  },
  "usage": {
    "artworks_this_month": 15,
    "storage_used_gb": 0.7,
    "live_streaming_hours_this_month": 8
  },
  "limits": {
    "max_artworks_per_month": 20,
    "storage_gb": 1,
    "live_streaming": true
  },
  "billing": {
    "next_amount": 800,
    "currency": "JPY",
    "payment_method": "credit_card",
    "card_last4": "1234"
  }
}
```

### 14.2 プラン変更API

#### 14.2.1 プランアップグレード

```http
POST /api/subscription/upgrade
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "plan_id": "pro",
  "apply_immediately": true,
  "payment_method_id": "pm_1234567890"
}

# レスポンス

{
  "success": true,
  "subscription": {
    "plan_id": "pro",
    "status": "active",
    "effective_date": "2025-11-03T14:30:00Z",
    "next_billing_date": "2025-12-03T14:30:00Z"
  },
  "charges": {
    "prorated_amount": 700,
    "currency": "JPY",
    "description": "Pro プランへのアップグレード（日割り計算）"
  }
}
```

#### 14.2.2 プランダウングレード

```http
POST /api/subscription/downgrade  
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "plan_id": "standard",
  "apply_at_period_end": true
}

# レスポンス

{
  "success": true,
  "subscription": {
    "current_plan": "pro",
    "scheduled_plan": "standard", 
    "change_effective_date": "2025-12-03T14:30:00Z"
  },
  "message": "次回請求日からStandardプランに変更されます"
}
```

### 14.3 課金・決済API

#### 14.3.1 支払い方法登録

```http
POST /api/subscription/payment-methods
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "type": "credit_card",
  "stripe_payment_method_id": "pm_1234567890"
}
```

#### 14.3.2 請求履歴取得

```http
GET /api/subscription/invoices?limit=10&page=1
Authorization: Bearer {jwt_token}

# レスポンス

{
  "invoices": [
    {
      "invoice_id": "inv_20251103_001",
      "amount": 1500,
      "currency": "JPY",
      "status": "paid",
      "issued_date": "2025-11-03T00:00:00Z",
      "due_date": "2025-11-03T23:59:59Z",
      "paid_date": "2025-11-03T14:30:00Z",
      "plan_name": "Pro",
      "period": {
        "start": "2025-11-03T00:00:00Z",
        "end": "2025-12-03T00:00:00Z"
      },
      "download_url": "https://api.example.com/invoices/inv_20251103_001.pdf"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 48
  }
}
```

### 14.4 使用量監視API

#### 14.4.1 使用量取得

```http
GET /api/users/me/usage?period=current_month
Authorization: Bearer {jwt_token}

# レスポンス

{
  "period": {
    "start": "2025-11-01T00:00:00Z", 
    "end": "2025-11-30T23:59:59Z"
  },
  "usage": {
    "artworks_uploaded": 15,
    "storage_used_bytes": 750000000,
    "live_streaming_minutes": 480,
    "api_requests": 2500
  },
  "limits": {
    "max_artworks": 20,
    "storage_bytes": 1073741824,
    "live_streaming_minutes": -1,
    "api_requests_per_hour": 1000
  },
  "warnings": [
    {
      "type": "approaching_limit",
      "resource": "artworks_uploaded", 
      "usage_percentage": 75,
      "message": "今月の投稿数が上限の75%に達しています"
    }
  ]
}
```

#### 14.4.2 制限チェックAPI

```http
GET /api/users/me/limits/check?action=upload_artwork&file_size=52428800
Authorization: Bearer {jwt_token}

# レスポンス

{
  "allowed": false,
  "reason": "file_size_exceeded",
  "current_limit": 52428800,
  "requested_size": 52428800,
  "message": "ファイルサイズが上限を超えています。Proプランにアップグレードしてください。",
  "suggested_plan": "pro"
}
```

---

## 15. エラーコード一覧

| コード                       | 説明                             |
| ---------------------------- | -------------------------------- |
| `VALIDATION_ERROR`         | リクエストパラメータ検証エラー   |
| `AUTHENTICATION_REQUIRED`  | 認証が必要                       |
| `INSUFFICIENT_PERMISSIONS` | 権限不足                         |
| `RESOURCE_NOT_FOUND`       | リソースが見つからない           |
| `DUPLICATE_RESOURCE`       | 重複リソース                     |
| `RATE_LIMIT_EXCEEDED`      | レート制限超過                   |
| `FILE_TOO_LARGE`           | ファイルサイズ超過               |
| `UNSUPPORTED_FILE_TYPE`    | サポートされていないファイル形式 |
| `PAYMENT_FAILED`           | 決済処理失敗                     |
| `INSUFFICIENT_BALANCE`     | 残高不足                         |
| `EXTERNAL_SERVICE_ERROR`   | 外部サービスエラー               |
| `MAINTENANCE_MODE`         | メンテナンス中                   |
| `SUBSCRIPTION_REQUIRED`    | サブスクリプション契約が必要     |
| `PLAN_LIMIT_EXCEEDED`      | プラン制限超過                   |
| `INVALID_PLAN`             | 無効なプラン                     |
| `SUBSCRIPTION_EXPIRED`     | サブスクリプション期限切れ       |
| `PAYMENT_METHOD_REQUIRED`  | 支払い方法の登録が必要           |
| `TRIAL_ALREADY_USED`       | トライアルは既に利用済み         |
| `DOWNGRADE_NOT_ALLOWED`    | ダウングレード不可（使用量超過） |

---

## 15. 管理者API

### 15.1 ユーザー管理API

#### 15.1.1 ユーザー一覧取得

```http
GET /api/admin/users?page=1&limit=20&status=active&role=user
Authorization: Bearer {admin_jwt_token}

# レスポンス

{
  "data": [
    {
      "user_id": 12345,
      "username": "creator123",
      "email": "creator@example.com",
      "status": "active",
      "role": "user",
      "created_at": "2025-10-15T10:30:00Z",
      "last_login": "2025-11-03T14:20:00Z",
      "statistics": {
        "artworks_count": 15,
        "total_revenue": 50000,
        "fans_count": 234
      }
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 125,
    "total_items": 2500,
    "per_page": 20
  }
}
```

#### 15.1.2 ユーザー詳細情報取得

```http
GET /api/admin/users/{user_id}
Authorization: Bearer {admin_jwt_token}

# レスポンス

{
  "user_id": 12345,
  "profile": {
    "username": "creator123",
    "display_name": "クリエーター太郎",
    "email": "creator@example.com",
    "phone": "+81-90-1234-5678",
    "birth_date": "1995-05-15",
    "registration_ip": "192.168.1.100"
  },
  "status": {
    "account_status": "active",
    "email_verified": true,
    "kyc_status": "approved"
  },
  "statistics": {
    "total_artworks": 15,
    "total_sales": 50000,
    "total_purchases": 25000,
    "fans": 234,
    "fanning": 89
  },
  "recent_activities": [
    {
      "action": "artwork_uploaded",
      "timestamp": "2025-11-03T14:30:00Z",
      "details": "作品ID: 67890"
    }
  ]
}
```

#### 15.1.3 ユーザー制御

```http
POST /api/admin/users/{user_id}/actions
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json

{
  "action": "suspend", // suspend, unsuspend, warn, change_role
  "reason": "不適切なコンテンツ投稿",
  "duration": 7, // days (suspendの場合)
  "new_role": "creator" // change_roleの場合
}

# レスポンス

{
  "success": true,
  "message": "ユーザーを7日間停止しました",
  "action_id": "ACT-001234",
  "effective_until": "2025-11-10T14:30:00Z"
}
```

### 15.2 コンテンツ管理API

#### 15.2.1 審査待ち作品一覧

```http
GET /api/admin/content/pending-review?category=all&priority=high
Authorization: Bearer {admin_jwt_token}

# レスポンス

{
  "data": [
    {
      "artwork_id": 67890,
      "title": "夕焼けの風景画",
      "creator": {
        "user_id": 12345,
        "username": "creator123"
      },
      "submitted_at": "2025-11-03T14:30:00Z",
      "auto_check_results": {
        "copyright_check": "passed",
        "adult_content": "requires_review",
        "quality_score": 8.5
      },
      "priority": "high",
      "file_info": {
        "size": 2560000,
        "dimensions": "1920x1080",
        "format": "jpeg"
      }
    }
  ],
  "count": 12
}
```

#### 15.2.2 コンテンツ審査処理

```http
POST /api/admin/content/{artwork_id}/review
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json

{
  "decision": "approved", // approved, rejected, requires_modification
  "reason": "品質基準を満たしている",
  "feedback": "素晴らしい作品です",
  "reviewer_id": 98765
}

# レスポンス

{
  "success": true,
  "message": "作品を承認しました",
  "artwork_id": 67890,
  "decision": "approved",
  "processed_at": "2025-11-03T15:00:00Z"
}
```

#### 15.2.3 通報処理

```http
GET /api/admin/reports?status=pending&type=all
Authorization: Bearer {admin_jwt_token}

POST /api/admin/reports/{report_id}/resolve
{
  "action": "content_removed", // no_action, content_removed, user_warned, user_suspended
  "notes": "不適切なコンテンツとして削除"
}
```

### 15.3 売上・決済管理API

#### 15.3.1 売上統計取得

```http
GET /api/admin/revenue/statistics?period=monthly&year=2025&month=11
Authorization: Bearer {admin_jwt_token}

# レスポンス

{
  "period": {
    "start_date": "2025-11-01",
    "end_date": "2025-11-30"
  },
  "summary": {
    "total_revenue": 2450000,
    "commission_revenue": 245000,
    "transaction_count": 1234,
    "average_order_value": 1987
  },
  "breakdown": {
    "by_category": [
      {"category": "イラスト", "revenue": 980000, "percentage": 40},
      {"category": "写真", "revenue": 612500, "percentage": 25}
    ],
    "by_day": [
      {"date": "2025-11-01", "revenue": 85000},
      {"date": "2025-11-02", "revenue": 92000}
    ]
  },
  "commission_rates": {
    "illustration": 0.10,
    "photo": 0.08,
    "video": 0.12,
    "music": 0.15
  }
}
```

#### 15.3.2 決済管理

```http
GET /api/admin/payments/failed?date_from=2025-11-01&date_to=2025-11-03
Authorization: Bearer {admin_jwt_token}

POST /api/admin/payments/{payment_id}/refund
{
  "amount": 5000,
  "reason": "システムエラーによる重複課金"
}
```

### 15.4 システム管理API

#### 15.4.1 システム統計

```http
GET /api/admin/system/stats
Authorization: Bearer {admin_jwt_token}

# レスポンス

{
  "realtime": {
    "active_users": 345,
    "concurrent_streams": 12,
    "server_load": 0.65
  },
  "daily": {
    "new_users": 25,
    "new_artworks": 89,
    "total_sales": 125000
  },
  "system_health": {
    "database_status": "healthy",
    "storage_usage": 0.78,
    "cache_hit_rate": 0.92,
    "error_rate": 0.001
  }
}
```

#### 15.4.2 機能制御

```http
POST /api/admin/system/features/{feature_name}/toggle
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json

{
  "enabled": false,
  "reason": "メンテナンス作業のため一時停止"
}

# レスポンス

{
  "success": true,
  "feature_name": "live_streaming",
  "enabled": false,
  "updated_at": "2025-11-03T15:30:00Z"
}
```

### 15.5 管理者認証・権限

#### 15.5.1 管理者ログイン

```http
POST /api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@eldonia-nex.com",
  "password": "secure_password",
  "two_factor_code": "123456"
}

# レスポンス

{
  "access_token": "admin_jwt_token",
  "refresh_token": "admin_refresh_token",
  "expires_in": 3600,
  "admin_info": {
    "admin_id": 1,
    "name": "システム管理者",
    "role": "super_admin",
    "permissions": [
      "user_management",
      "content_moderation",
      "financial_access",
      "system_control"
    ]
  }
}
```

#### 15.5.2 権限レベル

- **super_admin**: 全機能アクセス可能
- **moderator**: コンテンツ管理・ユーザー管理
- **support**: ユーザーサポート・問い合わせ対応
- **analyst**: 統計・レポート閲覧のみ

---

*作成日: 2025年11月3日*
*バージョン: 1.2 (管理機能・多言語・多通貨API追加)*
