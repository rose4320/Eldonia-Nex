"""ファイルセキュリティチェック用ユーティリティ"""

import hashlib
import os
import re
from pathlib import Path
from typing import Tuple

from django.core.files.uploadedfile import UploadedFile

import filetype


class FileSecurityChecker:
    """ファイルのセキュリティチェック"""

    # 危険な拡張子（二重拡張子攻撃対策）
    DANGEROUS_EXTENSIONS = {
        "exe", "bat", "cmd", "sh", "ps1", "vbs", "js", "jar", "app",
        "deb", "rpm", "msi", "dmg", "pkg", "scr", "com", "pif"
    }

    # スクリプトを含む可能性のあるファイル
    SCRIPT_EXTENSIONS = {"html", "htm", "svg", "xml"}

    # 許可されたMIMEタイプのパターン
    ALLOWED_MIME_PATTERNS = {
        "image": r"^image/(jpeg|png|gif|webp|bmp|svg\+xml)$",
        "video": r"^video/(mp4|quicktime|x-msvideo|x-matroska|webm|x-flv)$",
        "audio": r"^audio/(mpeg|wav|ogg|flac|aac|mp4)$",
        "3d": r"^(application/octet-stream|model/(gltf\+json|gltf-binary))$",
        "document": r"^(application/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)|text/plain)$",
        "archive": r"^application/(zip|x-rar-compressed|x-7z-compressed)$",
    }

    # ファイル名の許可パターン
    FILENAME_PATTERN = re.compile(r'^[a-zA-Z0-9_\-\.\s\(\)]+$')

    @staticmethod
    def get_file_extension(filename: str) -> str:
        """ファイル拡張子を取得（小文字）"""
        return filename.rsplit(".", 1)[1].lower() if "." in filename else ""

    @staticmethod
    def get_all_extensions(filename: str) -> list:
        """すべての拡張子を取得（二重拡張子チェック用）"""
        parts = filename.split(".")
        if len(parts) > 1:
            return [ext.lower() for ext in parts[1:]]
        return []

    @classmethod
    def check_filename(cls, filename: str) -> Tuple[bool, str]:
        """ファイル名の安全性チェック"""
        # 空のファイル名チェック
        if not filename or filename.strip() == "":
            return False, "ファイル名が空です"

        # ディレクトリトラバーサル攻撃チェック
        if ".." in filename or "/" in filename or "\\" in filename:
            return False, "不正なファイル名です（ディレクトリトラバーサル検出）"

        # NULL バイトチェック
        if "\x00" in filename:
            return False, "不正なファイル名です（NULLバイト検出）"

        # 制御文字チェック
        if any(ord(c) < 32 for c in filename):
            return False, "不正なファイル名です（制御文字検出）"

        # 長すぎるファイル名チェック
        if len(filename) > 255:
            return False, "ファイル名が長すぎます（255文字以下）"

        # 許可された文字のみかチェック（日本語対応のため緩和）
        # 危険な文字（<, >, :, ", |, ?, *, ;）をチェック
        dangerous_chars = ['<', '>', ':', '"', '|', '?', '*', ';']
        if any(char in filename for char in dangerous_chars):
            return False, f"不正なファイル名です（危険な文字を含む）"

        return True, ""

    @classmethod
    def check_double_extension(cls, filename: str) -> Tuple[bool, str]:
        """二重拡張子攻撃チェック"""
        extensions = cls.get_all_extensions(filename)
        
        # 二重拡張子チェック
        if len(extensions) > 1:
            for ext in extensions[:-1]:  # 最後の拡張子以外をチェック
                if ext in cls.DANGEROUS_EXTENSIONS:
                    return False, f"危険な拡張子が検出されました: .{ext}"

        return True, ""

    @classmethod
    def check_mime_type(cls, file: UploadedFile, expected_media_type: str) -> Tuple[bool, str]:
        """MIMEタイプの整合性チェック（filetype使用）"""
        try:
            # filetypeを使用してファイルの実際のMIMEタイプを取得
            file_content = file.read(2048)  # 最初の2KBを読み込む
            file.seek(0)  # ファイルポインタを戻す

            kind = filetype.guess(file_content)
            detected_mime = kind.mime if kind else None

            # 期待されるメディアタイプのMIMEパターンと照合
            if expected_media_type in cls.ALLOWED_MIME_PATTERNS and detected_mime:
                pattern = cls.ALLOWED_MIME_PATTERNS[expected_media_type]
                if not re.match(pattern, detected_mime):
                    # Content-Typeとの整合性もチェック
                    content_type = file.content_type or ""
                    if not re.match(pattern, content_type):
                        return False, f"ファイルの実際の形式が一致しません（検出: {detected_mime}）"

            return True, ""

        except Exception as e:
            # filetypeがない場合はスキップ（開発環境用）
            return True, ""

    @classmethod
    def check_file_content(cls, file: UploadedFile, media_type: str) -> Tuple[bool, str]:
        """ファイル内容の安全性チェック"""
        try:
            # ファイルの先頭を読み込む
            file_start = file.read(1024)
            file.seek(0)

            # SVG内のスクリプトチェック
            if media_type == "image" and file.content_type == "image/svg+xml":
                content = file.read()
                file.seek(0)
                
                # スクリプトタグの検出
                if b"<script" in content.lower() or b"javascript:" in content.lower():
                    return False, "SVGファイル内にスクリプトが検出されました"
                
                # イベントハンドラの検出
                event_handlers = [b"onclick", b"onerror", b"onload", b"onmouseover"]
                if any(handler in content.lower() for handler in event_handlers):
                    return False, "SVGファイル内に危険なイベントハンドラが検出されました"

            # 実行可能ファイルのマジックナンバーチェック
            executable_signatures = [
                b"MZ",  # Windows PE
                b"\x7fELF",  # Linux ELF
                b"\xca\xfe\xba\xbe",  # Mach-O
                b"#!",  # Shell script
            ]
            
            if any(file_start.startswith(sig) for sig in executable_signatures):
                return False, "実行可能ファイルは許可されていません"

            return True, ""

        except Exception as e:
            return False, f"ファイル内容のチェック中にエラーが発生しました: {str(e)}"

    @classmethod
    def calculate_file_hash(cls, file: UploadedFile) -> str:
        """ファイルのSHA-256ハッシュを計算"""
        sha256_hash = hashlib.sha256()
        for byte_block in iter(lambda: file.read(4096), b""):
            sha256_hash.update(byte_block)
        file.seek(0)
        return sha256_hash.hexdigest()

    @classmethod
    def check_file_size_realistic(cls, file: UploadedFile, media_type: str) -> Tuple[bool, str]:
        """ファイルサイズが現実的かチェック（極端に小さい・大きいファイル）"""
        size = file.size

        # メディアタイプごとの最小サイズ（バイト）
        min_sizes = {
            "image": 100,  # 100バイト未満の画像は怪しい
            "video": 1024,  # 1KB未満の動画は怪しい
            "audio": 1024,  # 1KB未満の音声は怪しい
            "3d": 100,
            "document": 10,
            "archive": 100,
        }

        if media_type in min_sizes and size < min_sizes[media_type]:
            return False, f"ファイルサイズが小さすぎます（最小{min_sizes[media_type]}バイト）"

        return True, ""

    @classmethod
    def sanitize_filename(cls, filename: str) -> str:
        """ファイル名をサニタイズ"""
        # 危険な文字を除去
        safe_filename = re.sub(r'[<>:"|?*;]', '', filename)
        
        # ディレクトリトラバーサルを防ぐ
        safe_filename = safe_filename.replace("..", "")
        safe_filename = safe_filename.replace("/", "")
        safe_filename = safe_filename.replace("\\", "")
        
        # 長すぎる場合は切り詰め
        if len(safe_filename) > 200:
            name, ext = os.path.splitext(safe_filename)
            safe_filename = name[:200-len(ext)] + ext
        
        return safe_filename

    @classmethod
    def full_security_check(
        cls, file: UploadedFile, expected_media_type: str
    ) -> Tuple[bool, str]:
        """包括的なセキュリティチェック"""
        
        # 1. ファイル名チェック
        is_safe, error = cls.check_filename(file.name)
        if not is_safe:
            return False, error

        # 2. 二重拡張子チェック
        is_safe, error = cls.check_double_extension(file.name)
        if not is_safe:
            return False, error

        # 3. ファイルサイズの現実性チェック
        is_safe, error = cls.check_file_size_realistic(file, expected_media_type)
        if not is_safe:
            return False, error

        # 4. ファイル内容チェック
        is_safe, error = cls.check_file_content(file, expected_media_type)
        if not is_safe:
            return False, error

        # 5. MIMEタイプチェック（オプション）
        is_safe, error = cls.check_mime_type(file, expected_media_type)
        if not is_safe:
            return False, error

        return True, ""


