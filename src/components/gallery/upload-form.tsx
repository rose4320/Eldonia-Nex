"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import {
  categoryLabel,
  detectCategoryFromFile,
  IMAGE_ARTWORK_CATEGORY_VALUES,
} from "@/lib/gallery/constants";
import { artworkCategoryOptions } from "@/lib/i18n/taxonomy";

type UploadFormProps = {
  successRedirect?: string;
};

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
  const [detected, setDetected] = useState<ReturnType<typeof detectCategoryFromFile>>(null);
  const [imageCategory, setImageCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(selected: File | null) {
    setFile(selected);
    const info = selected ? detectCategoryFromFile(selected) : null;
    setDetected(info);
    setImageCategory(info?.mediaType === "image" ? info.category : null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!file) {
      setError(upload.errNoFile);
      return;
    }

    const fileInfo = detectCategoryFromFile(file);
    if (!fileInfo) {
      setError(upload.errFormat);
      return;
    }

    const { mediaType } = fileInfo;
    const category =
      mediaType === "image" && imageCategory ? imageCategory : fileInfo.category;

    setLoading(true);

    const body = new FormData();
    body.append("file", file);
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
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="file" className="eldonia-label">
          {upload.file}
        </label>
        <input
          id="file"
          type="file"
          required
          accept="image/*,video/mp4,video/quicktime,audio/mpeg,audio/wav,audio/flac,application/pdf"
          onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
          className="eldonia-input"
        />
        <p className="text-xs text-eldonia-text-muted">{upload.fileHint}</p>
        {detected && detected.mediaType !== "image" && (
          <p className="text-xs text-eldonia-gold">
            {upload.typeAuto(categoryLabel(detected.category, locale))}
          </p>
        )}
      </div>

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
