"use client";

import { useAuth } from "@/app/context/AuthContext";
import ImageUpload from "@/components/ui/ImageUpload";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ArtworkUploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [artworkFile, setArtworkFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
    tags: "",
    price: "",
    is_for_sale: false,
    is_featured: false,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // ファイルがある場合は先にアップロード
      let uploadedImageUrl = formData.image_url;
      
      if (artworkFile) {
        const formDataForUpload = new FormData();
        formDataForUpload.append("file", artworkFile);
        formDataForUpload.append("user_id", user?.id.toString() || "");
        
        const uploadRes = await fetch("http://localhost:8001/api/v1/artworks/upload-image/", {
          method: "POST",
          credentials: "include",
          body: formDataForUpload
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedImageUrl = uploadData.url;
        } else {
          setMessage({ type: "error", text: "画像のアップロードに失敗しました。" });
          setIsSubmitting(false);
          return;
        }
      }

      // 作品投稿
      const res = await fetch("http://localhost:8001/api/v1/artworks/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          image_url: uploadedImageUrl,
          category: formData.category,
          tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
          price: formData.price ? parseFloat(formData.price) : 0,
          is_for_sale: formData.is_for_sale,
          is_featured: formData.is_featured,
          user_id: user?.id
        })
      });

      if (res.ok) {
        setMessage({ type: "success", text: "作品を投稿しました！ギャラリーに表示されます。" });
        setTimeout(() => router.push("/gallery"), 2000);
      } else {
        const error = await res.json();
        setMessage({ type: "error", text: error.message || "投稿に失敗しました。" });
      }
    } catch (error) {
      console.error("作品投稿エラー:", error);
      setMessage({ type: "error", text: "ネットワークエラーが発生しました。" });
    }

    setIsSubmitting(false);
  };

  const handleImageChange = (file: File | null, previewUrl: string) => {
    setArtworkFile(file);
    setFormData({
      ...formData,
      image_url: previewUrl
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-purple-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900 rounded-2xl shadow-2xl p-8">
          {/* ヘッダー */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-purple-300 hover:text-purple-100 mb-4 flex items-center gap-2 transition-colors"
            >
              <span>←</span> ダッシュボードに戻る
            </button>
            <h1 className="text-4xl font-bold text-purple-100 font-pt-serif">🎨 作品アップロード</h1>
            <p className="text-purple-300 mt-2">あなたの作品をギャラリーに投稿しましょう</p>
          </div>

          {/* メッセージ */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === "success" 
                ? "bg-green-900/50 border-2 border-green-500 text-green-200" 
                : "bg-red-900/50 border-2 border-red-500 text-red-200"
            }`}>
              <p className="font-semibold">{message.text}</p>
            </div>
          )}

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 作品タイトル */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-purple-200 mb-2">
                🎯 作品タイトル <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-950 border-2 border-purple-500/50 rounded-lg text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="例: 夕暮れの風景"
                maxLength={200}
                required
              />
            </div>

            {/* 作品説明 */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-purple-200 mb-2">
                📝 作品説明
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 bg-gray-950 border-2 border-purple-500/50 rounded-lg text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                placeholder="作品について説明してください..."
                maxLength={1000}
              />
              <p className="text-purple-400 text-xs mt-1">
                {formData.description.length}/1000文字
              </p>
            </div>

            {/* 作品画像アップロード */}
            <div>
              <label className="block text-sm font-semibold text-purple-200 mb-2">
                📁 作品ファイル <span className="text-red-400">*</span>
              </label>
              <ImageUpload
                currentImageUrl={formData.image_url}
                onImageChange={handleImageChange}
                maxSizeMB={500}
                recommendedSize="メディアタイプに応じて"
              />
              <div className="mt-3 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                <p className="text-purple-200 text-sm font-semibold mb-2">📋 対応ファイル形式：</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-purple-300">
                  <div>
                    <span className="font-semibold">🖼️ 画像:</span> JPG, PNG, GIF, WebP, BMP, SVG (最大10MB)
                  </div>
                  <div>
                    <span className="font-semibold">🎬 動画:</span> MP4, MOV, AVI, MKV, WebM, FLV (最大500MB)
                  </div>
                  <div>
                    <span className="font-semibold">🎵 音楽:</span> MP3, WAV, OGG, FLAC, AAC, M4A (最大50MB)
                  </div>
                  <div>
                    <span className="font-semibold">🧊 3Dモデル:</span> OBJ, FBX, GLTF, GLB, BLEND, STL (最大100MB)
                  </div>
                  <div>
                    <span className="font-semibold">📄 ドキュメント:</span> PDF, TXT, DOC, DOCX (最大20MB)
                  </div>
                  <div>
                    <span className="font-semibold">📦 アーカイブ:</span> ZIP, RAR, 7Z (最大200MB)
                  </div>
                </div>
              </div>
            </div>

            {/* カテゴリー */}
            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-purple-200 mb-2">
                📂 カテゴリー <span className="text-red-400">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-950 border-2 border-purple-500/50 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              >
                <option value="">カテゴリーを選択</option>
                <option value="illustration">🎨 イラスト</option>
                <option value="manga">📚 マンガ</option>
                <option value="3d">🧊 3DCG</option>
                <option value="pixel-art">🟦 ドット絵</option>
                <option value="photography">📷 写真</option>
                <option value="design">✨ デザイン</option>
                <option value="animation">🎬 アニメーション</option>
                <option value="video">🎥 動画</option>
                <option value="music">🎵 音楽</option>
                <option value="voice">🎙️ ボイス</option>
                <option value="novel">📖 小説</option>
                <option value="game">🎮 ゲーム</option>
                <option value="software">💻 ソフトウェア</option>
                <option value="model-3d">🗿 3Dモデル</option>
                <option value="texture">🎨 テクスチャ</option>
                <option value="other">📦 その他</option>
              </select>
            </div>

            {/* タグ */}
            <div>
              <label htmlFor="tags" className="block text-sm font-semibold text-purple-200 mb-2">
                🏷️ タグ
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-950 border-2 border-purple-500/50 rounded-lg text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="例: ファンタジー, 風景, デジタルアート（カンマ区切り）"
              />
              <p className="text-purple-400 text-xs mt-1">
                カンマ（,）で区切って複数指定できます
              </p>
            </div>

            {/* 販売設定 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-purple-200 mb-2">
                  💰 価格（円）
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-950 border-2 border-purple-500/50 rounded-lg text-purple-100 placeholder-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="1000"
                  min="0"
                />
              </div>

              <div className="flex items-center gap-4 pt-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_for_sale"
                    checked={formData.is_for_sale}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-purple-500 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-purple-200 text-sm font-semibold">販売する</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-purple-500 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-purple-200 text-sm font-semibold">注目作品</span>
                </label>
              </div>
            </div>

            {/* ボタン */}
            <div className="flex gap-4 pt-6 border-t-2 border-purple-500/30">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.title || !formData.category || (!artworkFile && !formData.image_url)}
                className={`flex-1 bg-gradient-to-r from-purple-600 to-purple-400 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-lg ${
                  isSubmitting || !formData.title || !formData.category || (!artworkFile && !formData.image_url)
                    ? "opacity-50 cursor-not-allowed" 
                    : "hover:from-purple-700 hover:to-purple-500 hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    投稿中...
                  </span>
                ) : (
                  "🚀 作品を投稿"
                )}
              </button>
            </div>
          </form>

          {/* ヒント */}
          <div className="mt-8 p-6 bg-purple-900/30 rounded-xl border-2 border-purple-500/30">
            <h3 className="text-lg font-semibold text-purple-200 mb-3">💡 投稿のヒント</h3>
            <ul className="space-y-2 text-purple-300 text-sm">
              <li>• 高解像度の画像を使用すると、作品が美しく表示されます</li>
              <li>• 詳細な説明を書くと、他のユーザーの興味を引きやすくなります</li>
              <li>• 適切なタグを付けると、作品が見つけやすくなります</li>
              <li>• 注目作品に設定すると、ギャラリーのトップに表示されます</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

