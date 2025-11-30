"""作品アップロード用のビュー"""

import os
import uuid
from pathlib import Path
from typing import Any

from common.security import FileSecurityChecker
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.uploadedfile import UploadedFile
from django.http import HttpRequest, JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from users.models import User

from marketplace.models import Artwork, Category


class UploadArtworkImageView(View):
    """作品メディアアップロードAPI（全メディア対応）"""

    # 画像
    IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"}
    IMAGE_CONTENT_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/bmp", "image/svg+xml"]
    IMAGE_MAX_SIZE = 10 * 1024 * 1024  # 10MB

    # 動画
    VIDEO_EXTENSIONS = {"mp4", "mov", "avi", "mkv", "webm", "flv"}
    VIDEO_CONTENT_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm", "video/x-flv"]
    VIDEO_MAX_SIZE = 500 * 1024 * 1024  # 500MB

    # 音楽
    AUDIO_EXTENSIONS = {"mp3", "wav", "ogg", "flac", "aac", "m4a"}
    AUDIO_CONTENT_TYPES = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/flac", "audio/aac", "audio/mp4"]
    AUDIO_MAX_SIZE = 50 * 1024 * 1024  # 50MB

    # 3Dモデル
    MODEL_3D_EXTENSIONS = {"obj", "fbx", "gltf", "glb", "blend", "stl"}
    MODEL_3D_CONTENT_TYPES = ["application/octet-stream", "model/gltf+json", "model/gltf-binary"]
    MODEL_3D_MAX_SIZE = 100 * 1024 * 1024  # 100MB

    # ドキュメント
    DOCUMENT_EXTENSIONS = {"pdf", "txt", "doc", "docx"}
    DOCUMENT_CONTENT_TYPES = ["application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    DOCUMENT_MAX_SIZE = 20 * 1024 * 1024  # 20MB

    # アーカイブ
    ARCHIVE_EXTENSIONS = {"zip", "rar", "7z"}
    ARCHIVE_CONTENT_TYPES = ["application/zip", "application/x-rar-compressed", "application/x-7z-compressed"]
    ARCHIVE_MAX_SIZE = 200 * 1024 * 1024  # 200MB

    def get_file_extension(self, filename: str) -> str:
        """ファイル拡張子を取得"""
        return filename.rsplit(".", 1)[1].lower() if "." in filename else ""

    def get_media_type(self, ext: str) -> str:
        """拡張子からメディアタイプを判定"""
        if ext in self.IMAGE_EXTENSIONS:
            return "image"
        elif ext in self.VIDEO_EXTENSIONS:
            return "video"
        elif ext in self.AUDIO_EXTENSIONS:
            return "audio"
        elif ext in self.MODEL_3D_EXTENSIONS:
            return "3d"
        elif ext in self.DOCUMENT_EXTENSIONS:
            return "document"
        elif ext in self.ARCHIVE_EXTENSIONS:
            return "archive"
        else:
            return "unknown"

    def validate_file(self, file: UploadedFile) -> tuple[bool, str, str]:
        """ファイルのバリデーション"""
        ext = self.get_file_extension(file.name)
        media_type = self.get_media_type(ext)

        # メディアタイプ別のバリデーション
        if media_type == "image":
            if ext not in self.IMAGE_EXTENSIONS:
                return False, "対応していない画像形式です", media_type
            if file.size > self.IMAGE_MAX_SIZE:
                return False, "画像ファイルサイズは10MB以下にしてください", media_type
            if file.content_type not in self.IMAGE_CONTENT_TYPES:
                return False, "無効な画像形式です", media_type

        elif media_type == "video":
            if ext not in self.VIDEO_EXTENSIONS:
                return False, "対応していない動画形式です", media_type
            if file.size > self.VIDEO_MAX_SIZE:
                return False, "動画ファイルサイズは500MB以下にしてください", media_type

        elif media_type == "audio":
            if ext not in self.AUDIO_EXTENSIONS:
                return False, "対応していない音声形式です", media_type
            if file.size > self.AUDIO_MAX_SIZE:
                return False, "音声ファイルサイズは50MB以下にしてください", media_type

        elif media_type == "3d":
            if ext not in self.MODEL_3D_EXTENSIONS:
                return False, "対応していない3Dモデル形式です", media_type
            if file.size > self.MODEL_3D_MAX_SIZE:
                return False, "3Dモデルファイルサイズは100MB以下にしてください", media_type

        elif media_type == "document":
            if ext not in self.DOCUMENT_EXTENSIONS:
                return False, "対応していないドキュメント形式です", media_type
            if file.size > self.DOCUMENT_MAX_SIZE:
                return False, "ドキュメントファイルサイズは20MB以下にしてください", media_type

        elif media_type == "archive":
            if ext not in self.ARCHIVE_EXTENSIONS:
                return False, "対応していないアーカイブ形式です", media_type
            if file.size > self.ARCHIVE_MAX_SIZE:
                return False, "アーカイブファイルサイズは200MB以下にしてください", media_type

        else:
            return False, "対応していないファイル形式です", media_type

        return True, "", media_type

    @method_decorator(csrf_exempt)
    def dispatch(self, request: HttpRequest, *args: Any, **kwargs: Any) -> Any:
        return super().dispatch(request, *args, **kwargs)

    def post(self, request: HttpRequest) -> JsonResponse:
        """メディアファイルをアップロードしてURLを返す（セキュリティチェック付き）"""
        try:
            # ファイルの取得
            uploaded_file = request.FILES.get("file")
            if not uploaded_file:
                return JsonResponse(
                    {"error": "ファイルが選択されていません"}, status=400
                )

            # 基本バリデーション
            is_valid, error_message, media_type = self.validate_file(uploaded_file)
            if not is_valid:
                return JsonResponse({"error": error_message}, status=400)

            # セキュリティチェック（包括的）
            is_secure, security_error = FileSecurityChecker.full_security_check(
                uploaded_file, media_type
            )
            if not is_secure:
                return JsonResponse(
                    {"error": f"セキュリティチェック失敗: {security_error}"},
                    status=400
                )

            # ファイル名をサニタイズ
            sanitized_name = FileSecurityChecker.sanitize_filename(uploaded_file.name)
            
            # ファイルハッシュを計算（重複チェック・ウイルススキャン用）
            file_hash = FileSecurityChecker.calculate_file_hash(uploaded_file)

            # ファイル名を生成（UUID + サニタイズされた拡張子）
            ext = self.get_file_extension(sanitized_name)
            filename = f"artworks/{media_type}/{uuid.uuid4()}.{ext}"

            # メタデータを記録（ログ・監査用）
            metadata = {
                "original_filename": sanitized_name,
                "file_hash": file_hash,
                "media_type": media_type,
                "file_size": uploaded_file.size,
                "content_type": uploaded_file.content_type,
                "user_ip": request.META.get('REMOTE_ADDR', 'unknown'),
            }

            # ファイルを保存
            saved_path = default_storage.save(filename, uploaded_file)

            # URLを生成
            if settings.DEBUG:
                # 開発環境: ローカルURL
                file_url = f"{settings.MEDIA_URL}{saved_path}"
            else:
                # 本番環境: フルURL
                file_url = default_storage.url(saved_path)

            return JsonResponse(
                {
                    "message": "ファイルをアップロードしました",
                    "url": file_url,
                    "media_type": media_type,
                    "file_size": uploaded_file.size,
                    "file_name": sanitized_name,
                    "file_hash": file_hash,
                },
                status=200
            )

        except Exception as e:
            return JsonResponse(
                {"error": f"アップロード中にエラーが発生しました: {str(e)}"}, status=500
            )


class CreateArtworkView(View):
    """作品作成API"""

    @method_decorator(csrf_exempt)
    def dispatch(self, request: HttpRequest, *args: Any, **kwargs: Any) -> Any:
        return super().dispatch(request, *args, **kwargs)

    def post(self, request: HttpRequest) -> JsonResponse:
        """作品を作成する"""
        try:
            import json

            data = json.loads(request.body)

            # ユーザーを取得
            user_id = data.get("user_id")
            if not user_id:
                return JsonResponse({"error": "ユーザーIDが必要です"}, status=400)

            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({"error": "ユーザーが見つかりません"}, status=404)

            # カテゴリーを取得または作成
            category_name = data.get("category", "その他")
            category, _ = Category.objects.get_or_create(
                name=category_name,
                defaults={"description": category_name}
            )

            # 作品を作成
            artwork = Artwork.objects.create(
                title=data.get("title"),
                description=data.get("description", ""),
                image_url=data.get("image_url", ""),
                price=data.get("price", 0),
                is_for_sale=data.get("is_for_sale", False),
                is_featured=data.get("is_featured", False),
                creator=user,
                category=category,
                status="published"  # 公開状態
            )

            # タグを追加
            tags = data.get("tags", [])
            if tags:
                from marketplace.models import Tag
                for tag_name in tags:
                    if tag_name:
                        tag, _ = Tag.objects.get_or_create(name=tag_name)
                        artwork.tags.add(tag)

            return JsonResponse(
                {
                    "message": "作品を投稿しました",
                    "artwork_id": artwork.id,
                    "title": artwork.title
                },
                status=201
            )

        except json.JSONDecodeError:
            return JsonResponse({"error": "無効なJSON形式です"}, status=400)
        except Exception as e:
            return JsonResponse(
                {"error": f"作品作成中にエラーが発生しました: {str(e)}"}, status=500
            )


class ArtworkListView(View):
    """作品一覧取得API"""

    @method_decorator(csrf_exempt)
    def dispatch(self, request: HttpRequest, *args: Any, **kwargs: Any) -> Any:
        return super().dispatch(request, *args, **kwargs)

    def get(self, request: HttpRequest) -> JsonResponse:
        """作品一覧を取得"""
        try:
            artworks = Artwork.objects.filter(status="published").select_related(
                "creator", "category"
            ).prefetch_related("tags")[:50]  # 最新50件

            artwork_list = []
            for artwork in artworks:
                artwork_list.append({
                    "id": artwork.id,
                    "title": artwork.title,
                    "description": artwork.description,
                    "image_url": artwork.image_url,
                    "price": float(artwork.price),
                    "is_for_sale": artwork.is_for_sale,
                    "is_featured": artwork.is_featured,
                    "creator": {
                        "id": artwork.creator.id,
                        "username": artwork.creator.username,
                        "display_name": artwork.creator.display_name,
                    },
                    "category": artwork.category.name if artwork.category else "その他",
                    "tags": [tag.name for tag in artwork.tags.all()],
                    "likes_count": artwork.likes.count(),
                    "views": artwork.view_count,
                    "created_at": artwork.created_at.isoformat(),
                })

            return JsonResponse({"artworks": artwork_list, "count": len(artwork_list)}, status=200)

        except Exception as e:
            return JsonResponse(
                {"error": f"作品一覧取得中にエラーが発生しました: {str(e)}"}, status=500
            )

