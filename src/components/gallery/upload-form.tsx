"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import {
  artworkNeedsThumbnail,
  categoryLabel,
  detectCategoryFromFile,
  IMAGE_ARTWORK_CATEGORY_VALUES,
  isThumbnailImageFile,
} from "@/lib/gallery/constants";
import { artworkCategoryOptions } from "@/lib/i18n/taxonomy";
import type { ArtworkMediaType } from "@/types/database";

type UploadFormProps = {
  successRedirect?: string;
};

function revokeObjectUrl(url: string | null) {
  if (url) URL.revokeObjectURL(url);
}

function effectiveMediaType(
  file: File,
  detected: ReturnType<typeof detectCategoryFromFile>,
): ArtworkMediaType | null {
  if (detected) return detected.mediaType;
  if (artworkNeedsThumbnail(file)) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "document";
    if (["mp4", "mov", "webm"].includes(ext ?? "")) return "video";
    if (["mp3", "wav", "flac", "m4a"].includes(ext ?? "")) return "audio";
  }
  return null;
}

export function UploadForm({ successRedirect }: UploadFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const { forms } = useContent();
  const upload = forms.upload;
  const imageCategories = artworkCategoryOptions(IMAGE_ARTWORK_CATEGORY_VALUES, locale);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [detected, setDetected] = useState<ReturnType<typeof detectCategoryFromFile>>(null);
  const [imageCategory, setImageCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const needsThumbnail = artworkNeedsThumbnail(file);
  const mediaType = file ? effectiveMediaType(file, detected) : null;
  const galleryCoverUrl =
    thumbnailPreview ?? (mediaType === "image" ? mediaPreview : null);

  function handleFileChange(selected: File | null) {
    setMediaPreview((prev) => {
      revokeObjectUrl(prev);
      return selected ? URL.createObjectURL(selected) : null;
    });
    setFile(selected);
    const info = selected ? detectCategoryFromFile(selected) : null;
    setDetected(info);
    setImageCategory(info?.mediaType === "image" ? info.category : null);
    if (!selected || !artworkNeedsThumbnail(selected)) {
      setThumbnailPreview((prev) => {
        revokeObjectUrl(prev);
        return null;
      });
      setThumbnailFile(null);
    }
  }

  function handleThumbnailChange(selected: File | null) {
    setThumbnailPreview((prev) => {
      revokeObjectUrl(prev);
      return selected ? URL.createObjectURL(selected) : null;
    });
    setThumbnailFile(selected);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!file) {
      setError(upload.errNoFile);
      return;
    }

    const fileInfo = detectCategoryFromFile(file);
    const resolvedMediaType = fileInfo?.mediaType ?? mediaType;
    if (!resolvedMediaType) {
      setError(upload.errFormat);
      return;
    }

    const category =
      resolvedMediaType === "image" && imageCategory
        ? imageCategory
        : (fileInfo?.category ??
          (resolvedMediaType === "audio"
            ? "music"
            : resolvedMediaType === "document"
              ? "document"
              : resolvedMediaType));

    if (resolvedMediaType !== "image") {
      if (!thumbnailFile) {
        setError(upload.errNoThumbnail);
        return;
      }
      if (!isThumbnailImageFile(thumbnailFile)) {
        setError(upload.errFormat);
        return;
      }
    }

    setLoading(true);

    const body = new FormData();
    body.append("file", file);
    if (thumbnailFile) {
      body.append("thumbnail", thumbnailFile);
    }
    body.append("title", title.trim());
    body.append("description", description.trim());
    body.append("category", category);
    body.append("tags", tags);

    try {
      const response = await fetch("/api/gallery/artworks", {
        method: "POST",
        credentials: "same-origin",
        body,
      });
      const payload = (await response.json()) as { id?: string; error?: string };

      if (!response.ok || !payload.id) {
        setError(payload.error ?? upload.errSave);
        setLoading(false);
        return;
      }

      router.push(successRedirect ?? `/gallery/${payload.id}`);
      router.refresh();
    } catch {
      setError(upload.errSave);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-5">
      <div className="flex flex-col gap-1">
        <label htmlFor="file" className="eldonia-label">
          {upload.file}
        </label>
        <input
          id="file"
          type="file"
          required
          accept="image/*,video/mp4,video/quicktime,video/webm,audio/mpeg,audio/mp3,audio/wav,audio/flac,audio/mp4,audio/x-m4a,application/pdf,.mp3,.wav,.flac,.m4a,.pdf"
          onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
          className="eldonia-input"
        />
        <p className="text-xs text-eldonia-text-muted">{upload.fileHint}</p>
        {detected && (
          <p className="text-xs text-eldonia-gold">
            {upload.typeAuto(categoryLabel(detected.category, locale))}
          </p>
        )}
      </div>

      {needsThumbnail && (
        <div className="flex flex-col gap-2 rounded-md border border-eldonia-gold/35 bg-eldonia-gold/5 p-4">
          <label htmlFor="thumbnail" className="eldonia-label text-eldonia-gold-light">
            {upload.thumbnail}
            <span className="ml-1 text-eldonia-gold">*</span>
          </label>
          <input
            id="thumbnail"
            type="file"
            required
            accept="image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
            onChange={(event) => handleThumbnailChange(event.target.files?.[0] ?? null)}
            className="eldonia-input"
          />
          <p className="text-xs text-eldonia-text-muted">{upload.thumbnailHint}</p>
        </div>
      )}

      {file && mediaPreview && (
        <section
          className="flex flex-col gap-4 rounded-md border border-eldonia-gold/20 bg-eldonia-surface/40 p-4"
          aria-label={upload.previewTitle}
        >
          <h3 className="font-display text-sm font-semibold tracking-wide text-eldonia-gold-light">
            {upload.previewTitle}
          </h3>

          {mediaType === "image" && (
            <div className="overflow-hidden rounded-md border border-eldonia-gold/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mediaPreview}
                alt={title.trim() || upload.previewUntitled}
                className="max-h-80 w-full object-contain bg-black/30"
              />
            </div>
          )}

          {mediaType === "audio" && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-eldonia-text-muted">{upload.previewAudio}</p>
              <audio controls preload="metadata" src={mediaPreview} className="w-full">
                {file.name}
              </audio>
            </div>
          )}

          {mediaType === "video" && (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-eldonia-text-muted">{upload.previewVideo}</p>
              <video
                controls
                preload="metadata"
                src={mediaPreview}
                className="max-h-80 w-full rounded-md border border-eldonia-gold/15 bg-black/40"
              >
                {file.name}
              </video>
            </div>
          )}

          {mediaType === "document" && (
            <div className="flex items-center gap-3 rounded-md border border-eldonia-gold/15 bg-black/20 px-4 py-3">
              <span className="font-display text-2xl text-eldonia-gold" aria-hidden>
                PDF
              </span>
              <div className="min-w-0">
                <p className="text-xs text-eldonia-text-muted">{upload.previewDocument}</p>
                <p className="truncate text-sm text-eldonia-text">{file.name}</p>
              </div>
            </div>
          )}

          <div className="border-t border-eldonia-gold/15 pt-4">
            <p className="mb-2 text-xs font-medium text-eldonia-text-muted">
              {upload.previewGallery}
            </p>
            <div className="overflow-hidden rounded-md border border-eldonia-gold/25 bg-eldonia-surface">
              <div className="relative aspect-video w-full bg-black/35">
                {galleryCoverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={galleryCoverUrl}
                    alt={upload.thumbnailPreview}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                    <span className="font-display text-3xl text-eldonia-gold/50" aria-hidden>
                      ♪
                    </span>
                    <p className="text-xs text-eldonia-text-muted">{upload.previewNoThumbnail}</p>
                  </div>
                )}
              </div>
              <div className="border-t border-eldonia-gold/15 px-3 py-2">
                <p className="truncate font-display text-sm text-eldonia-gold-light">
                  {title.trim() || upload.previewUntitled}
                </p>
                {description.trim() && (
                  <p className="mt-1 line-clamp-2 text-xs text-eldonia-text-muted">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {detected?.mediaType === "image" && (
        <div className="flex flex-col gap-1">
          <label htmlFor="imageCategory" className="eldonia-label">
            {upload.type}
          </label>
          <select
            id="imageCategory"
            value={imageCategory ?? detected.category}
            onChange={(event) => setImageCategory(event.target.value)}
            className="eldonia-input"
          >
            {imageCategories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-eldonia-text-muted">
            {upload.typeHint(categoryLabel(detected.category, locale))}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="eldonia-label">
          {upload.title}
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
          {upload.description}
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
        <label htmlFor="tags" className="eldonia-label">
          {upload.tags}
        </label>
        <input
          id="tags"
          type="text"
          placeholder="fantasy, digital, portrait"
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          className="eldonia-input"
        />
        <p className="text-xs text-eldonia-text-muted">{upload.tagsHint}</p>
      </div>

      {error && <p className="eldonia-alert-error">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-fit eldonia-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? upload.submitting : upload.submit}
      </button>
    </form>
  );
}
