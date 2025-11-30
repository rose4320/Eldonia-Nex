"use client";

import Image from "next/image";
import { useRef, useState } from "react";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (file: File | null, previewUrl: string) => void;
  maxSizeMB?: number;
  recommendedSize?: string;
}

export default function ImageUpload({
  currentImageUrl = "",
  onImageChange,
  maxSizeMB = 5,
  recommendedSize = "400x400px"
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentImageUrl);
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // ファイルタイプチェック（全メディア対応）
    const validTypes = [
      // 画像
      "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/bmp", "image/svg+xml",
      // 動画
      "video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm", "video/x-flv",
      // 音声
      "audio/mpeg", "audio/wav", "audio/ogg", "audio/flac", "audio/aac", "audio/mp4",
      // 3Dモデル
      "application/octet-stream", "model/gltf+json", "model/gltf-binary",
      // ドキュメント
      "application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // アーカイブ
      "application/zip", "application/x-rar-compressed", "application/x-7z-compressed"
    ];
    
    if (!validTypes.includes(file.type)) {
      setError("対応していないファイル形式です");
      return false;
    }

    // ファイルサイズチェック
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`ファイルサイズは${maxSizeMB}MB以下にしてください`);
      return false;
    }

    setError("");
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    // プレビュー用のURLを生成
    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setPreview(previewUrl);
      onImageChange(file, previewUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = () => {
    setPreview("");
    setError("");
    onImageChange(null, "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* ドラッグ&ドロップエリア */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragging
            ? "border-purple-400 bg-purple-900/20"
            : "border-purple-500/50 bg-gray-950/50"
        }`}
      >
        {preview ? (
          <div className="space-y-4">
            {/* プレビュー画像 */}
            <div className="flex justify-center">
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-purple-500 shadow-xl">
                <Image
                  src={preview}
                  alt="プレビュー"
                  fill
                  className="object-cover"
                  onError={() => {
                    setError("画像の読み込みに失敗しました");
                    setPreview("");
                  }}
                />
              </div>
            </div>

            {/* 操作ボタン */}
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                📷 変更
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                🗑️ 削除
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* アップロードアイコン */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-purple-900/30 flex items-center justify-center">
                <span className="text-5xl">📷</span>
              </div>
            </div>

            {/* 説明テキスト */}
            <div>
              <p className="text-purple-200 font-semibold mb-2">
                画像をドラッグ&ドロップ
              </p>
              <p className="text-purple-400 text-sm mb-4">または</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                📁 ファイルを選択
              </button>
            </div>

            {/* ファイル情報 */}
            <div className="text-purple-400 text-xs space-y-1">
              <p>対応形式: JPG, PNG, GIF, WebP</p>
              <p>最大サイズ: {maxSizeMB}MB</p>
              <p>推奨サイズ: {recommendedSize}</p>
            </div>
          </div>
        )}
      </div>

      {/* エラーメッセージ */}
      {error && (
        <div className="bg-red-900/20 border-2 border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* 隠しファイルインプット */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,audio/*,.obj,.fbx,.gltf,.glb,.blend,.stl,.pdf,.txt,.doc,.docx,.zip,.rar,.7z"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
}

