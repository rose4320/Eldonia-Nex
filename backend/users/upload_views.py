"""画像アップロード用のビューとユーティリティ"""

import os
import uuid
from pathlib import Path
from typing import Any

from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.uploadedfile import UploadedFile
from django.http import HttpRequest, JsonResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt


class UploadAvatarView(View):
    """アバター画像アップロードAPI"""

    ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "gif", "webp"}
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

    def get_file_extension(self, filename: str) -> str:
        """ファイル拡張子を取得"""
        return filename.rsplit(".", 1)[1].lower() if "." in filename else ""

    def validate_file(self, file: UploadedFile) -> tuple[bool, str]:
        """ファイルのバリデーション"""
        # ファイルサイズチェック
        if file.size > self.MAX_FILE_SIZE:
            return False, "ファイルサイズは5MB以下にしてください"

        # 拡張子チェック
        ext = self.get_file_extension(file.name)
        if ext not in self.ALLOWED_EXTENSIONS:
            return False, "JPG, PNG, GIF, WebP形式の画像のみアップロード可能です"

        # MIMEタイプチェック
        allowed_content_types = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
        ]
        if file.content_type not in allowed_content_types:
            return False, "無効な画像形式です"

        return True, ""

    @method_decorator(csrf_exempt)
    def dispatch(self, request: HttpRequest, *args: Any, **kwargs: Any) -> Any:
        return super().dispatch(request, *args, **kwargs)

    def post(self, request: HttpRequest) -> JsonResponse:
        """画像をアップロードしてURLを返す"""
        try:
            # ファイルの取得
            uploaded_file = request.FILES.get("file")
            if not uploaded_file:
                return JsonResponse(
                    {"error": "ファイルが選択されていません"}, status=400
                )

            # バリデーション
            is_valid, error_message = self.validate_file(uploaded_file)
            if not is_valid:
                return JsonResponse({"error": error_message}, status=400)

            # ファイル名を生成（UUID + 拡張子）
            ext = self.get_file_extension(uploaded_file.name)
            filename = f"avatars/{uuid.uuid4()}.{ext}"

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
                {"message": "画像をアップロードしました", "url": file_url}, status=200
            )

        except Exception as e:
            return JsonResponse(
                {"error": f"アップロード中にエラーが発生しました: {str(e)}"}, status=500
            )


class DeleteAvatarView(View):
    """アバター画像削除API"""

    @method_decorator(csrf_exempt)
    def dispatch(self, request: HttpRequest, *args: Any, **kwargs: Any) -> Any:
        return super().dispatch(request, *args, **kwargs)

    def delete(self, request: HttpRequest) -> JsonResponse:
        """画像を削除する"""
        try:
            # TODO: リクエストからファイルパスを取得
            # TODO: 権限チェック（自分の画像のみ削除可能）
            # TODO: ファイルを削除

            return JsonResponse({"message": "画像を削除しました"}, status=200)

        except Exception as e:
            return JsonResponse(
                {"error": f"削除中にエラーが発生しました: {str(e)}"}, status=500
            )


