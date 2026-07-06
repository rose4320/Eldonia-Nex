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
  if (file.type.startsWith("image/")) return "image";
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
  const isImageWork = file != null && !needsThumbnail && (detected?.mediaType === "image" || mediaTypeIsImage(file));
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
    <form onSubmit={handleSubmit} className="artwork-upload">
      <div className="artwork-upload__grid">
        <div className="artwork-upload__fields">
          <section className="artwork-upload__section">
            <header className="artwork-upload__section-head">
              <h2 className="artwork-upload__section-title">{upload.stepWork}</h2>
              <span className="artwork-upload__badge">{upload.required}</span>
            </header>
            <label htmlFor="file" className="artwork-upload__label">
              {upload.file}
            </label>
            <input
              id="file"
              type="file"
              required
              accept="image/*,video/mp4,video/quicktime,video/webm,audio/mpeg,audio/mp3,audio/wav,audio/flac,audio/mp4,audio/x-m4a,application/pdf,.mp3,.wav,.flac,.m4a,.pdf"
              onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
              className="artwork-upload__file"
            />
            <p className="artwork-upload__hint">{upload.fileHint}</p>
            {file && (
              <p className="artwork-upload__filename" title={file.name}>
                {file.name}
              </p>
            )}
            {detected && (
              <p className="artwork-upload__detected">
                {upload.typeAuto(categoryLabel(detected.category, locale))}
              </p>
            )}
          </section>

          <section
            className={`artwork-upload__section artwork-upload__section--thumbnail${
              needsThumbnail ? " is-active" : ""
            }${!file ? " is-waiting" : ""}`}
          >
            <header className="artwork-upload__section-head">
              <h2 className="artwork-upload__section-title">{upload.stepThumbnail}</h2>
              {needsThumbnail && (
                <span className="artwork-upload__badge">{upload.required}</span>
              )}
            </header>
            {!file ? (
              <p className="artwork-upload__hint">{upload.thumbnailWaiting}</p>
            ) : isImageWork ? (
              <p className="artwork-upload__hint">{upload.thumbnailNotNeeded}</p>
            ) : (
              <>
                <label htmlFor="thumbnail" className="artwork-upload__label">
                  {upload.thumbnail}
                </label>
                <input
                  id="thumbnail"
                  type="file"
                  required={needsThumbnail}
                  disabled={!needsThumbnail}
                  accept="image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
                  onChange={(event) => handleThumbnailChange(event.target.files?.[0] ?? null)}
                  className="artwork-upload__file"
                />
                <p className="artwork-upload__hint">{upload.thumbnailHint}</p>
                {thumbnailFile && (
                  <p className="artwork-upload__filename" title={thumbnailFile.name}>
                    {thumbnailFile.name}
                  </p>
                )}
              </>
            )}
          </section>

          <section className="artwork-upload__section">
            <header className="artwork-upload__section-head">
              <h2 className="artwork-upload__section-title">{upload.stepDetails}</h2>
            </header>

            {detected?.mediaType === "image" && (
              <div className="artwork-upload__field">
                <label htmlFor="imageCategory" className="artwork-upload__label">
                  {upload.type}
                </label>
                <select
                  id="imageCategory"
                  value={imageCategory ?? detected.category}
                  onChange={(event) => setImageCategory(event.target.value)}
                  className="artwork-upload__control"
                >
                  {imageCategories.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <p className="artwork-upload__hint">
                  {upload.typeHint(categoryLabel(detected.category, locale))}
                </p>
              </div>
            )}

            <div className="artwork-upload__field">
              <label htmlFor="title" className="artwork-upload__label">
                {upload.title}
              </label>
              <input
                id="title"
                type="text"
                required
                maxLength={100}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="artwork-upload__control"
              />
            </div>

            <div className="artwork-upload__field">
              <label htmlFor="description" className="artwork-upload__label">
                {upload.description}
              </label>
              <textarea
                id="description"
                rows={4}
                maxLength={2000}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="artwork-upload__control"
              />
            </div>

            <div className="artwork-upload__field">
              <label htmlFor="tags" className="artwork-upload__label">
                {upload.tags}
              </label>
              <input
                id="tags"
                type="text"
                placeholder="fantasy, digital, portrait"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                className="artwork-upload__control"
              />
              <p className="artwork-upload__hint">{upload.tagsHint}</p>
            </div>
          </section>

          {error && <p className="artwork-upload__error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="artwork-upload__submit eldonia-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? upload.submitting : upload.submit}
          </button>
        </div>

        <aside className="artwork-upload__preview" aria-label={upload.previewTitle}>
          <h2 className="artwork-upload__preview-title">{upload.previewTitle}</h2>

          {!file || !mediaPreview ? (
            <div className="artwork-upload__preview-empty">
              <p>{upload.previewEmpty}</p>
            </div>
          ) : (
            <div className="artwork-upload__preview-body">
              {mediaType === "image" && (
                <div className="artwork-upload__media-frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mediaPreview}
                    alt={title.trim() || upload.previewUntitled}
                    className="artwork-upload__media-image"
                  />
                </div>
              )}

              {mediaType === "audio" && (
                <div className="artwork-upload__media-block">
                  <p className="artwork-upload__hint">{upload.previewAudio}</p>
                  <audio controls preload="metadata" src={mediaPreview} className="w-full">
                    {file.name}
                  </audio>
                </div>
              )}

              {mediaType === "video" && (
                <div className="artwork-upload__media-block">
                  <p className="artwork-upload__hint">{upload.previewVideo}</p>
                  <video
                    controls
                    preload="metadata"
                    src={mediaPreview}
                    className="artwork-upload__media-video"
                  >
                    {file.name}
                  </video>
                </div>
              )}

              {mediaType === "document" && (
                <div className="artwork-upload__media-block artwork-upload__pdf">
                  <span className="artwork-upload__pdf-icon" aria-hidden>
                    PDF
                  </span>
                  <div>
                    <p className="artwork-upload__hint">{upload.previewDocument}</p>
                    <p className="artwork-upload__filename">{file.name}</p>
                  </div>
                </div>
              )}

              <div className="artwork-upload__gallery-card">
                <p className="artwork-upload__gallery-label">{upload.previewGallery}</p>
                <div className="artwork-upload__gallery-cover">
                  {galleryCoverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={galleryCoverUrl}
                      alt={upload.thumbnailPreview}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="artwork-upload__gallery-placeholder">
                      <span aria-hidden>♪</span>
                      <p>{upload.previewNoThumbnail}</p>
                    </div>
                  )}
                </div>
                <div className="artwork-upload__gallery-meta">
                  <p className="artwork-upload__gallery-title">
                    {title.trim() || upload.previewUntitled}
                  </p>
                  {description.trim() && (
                    <p className="artwork-upload__gallery-desc">{description}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </form>
  );
}

function mediaTypeIsImage(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext ?? "");
}
