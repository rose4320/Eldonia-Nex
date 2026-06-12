"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ARTWORK_CATEGORIES,
  detectMediaType,
} from "@/lib/gallery/constants";

type UploadFormProps = {
  userId: string;
};

export function UploadForm({ userId }: UploadFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!file) {
      setError("ファイルを選択してください。");
      return;
    }

    const mediaType = detectMediaType(file.type);
    if (!mediaType) {
      setError("対応していないファイル形式です。");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const extension = file.name.split(".").pop() ?? "bin";
    const objectPath = `${userId}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("artworks")
      .upload(objectPath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      setError(uploadError.message);
      setLoading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("artworks").getPublicUrl(objectPath);

    const tagList = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 10);

    const { data: artwork, error: insertError } = await supabase
      .from("artworks")
      .insert({
        creator_id: userId,
        title: title.trim(),
        description: description.trim() || null,
        media_type: mediaType,
        media_url: publicUrl,
        thumbnail_url: mediaType === "image" ? publicUrl : null,
        category,
        tags: tagList,
        is_public: true,
      })
      .select("id")
      .single();

    if (insertError || !artwork) {
      setError(insertError?.message ?? "作品の登録に失敗しました。");
      setLoading(false);
      return;
    }

    router.push(`/gallery/${artwork.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="file" className="eldonia-label">
          ファイル
        </label>
        <input
          id="file"
          type="file"
          required
          accept="image/*,video/mp4,video/quicktime,audio/mpeg,audio/wav,audio/flac,application/pdf"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="eldonia-input"
        />
        <p className="text-xs text-eldonia-text-muted">
          画像・動画・音声・PDF に対応
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="eldonia-label">
          タイトル
        </label>
        <input
          id="title"
          type="text"
          required
          maxLength={100}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="eldonia-input"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="eldonia-label">
          説明
        </label>
        <textarea
          id="description"
          rows={4}
          maxLength={2000}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="eldonia-input"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="category" className="eldonia-label">
          カテゴリ
        </label>
        <select
          id="category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="eldonia-input"
        >
          {ARTWORK_CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="tags" className="eldonia-label">
          タグ
        </label>
        <input
          id="tags"
          type="text"
          placeholder="fantasy, digital, portrait"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          className="eldonia-input"
        />
        <p className="text-xs text-eldonia-text-muted">カンマ区切り（最大10個）</p>
      </div>

      {error && (
        <p className="eldonia-alert-error">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-fit eldonia-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "投稿中..." : "作品を投稿"}
      </button>
    </form>
  );
}
