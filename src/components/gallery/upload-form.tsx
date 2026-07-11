"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { uploadArtworkFileToStorage, uploadArtworkMediaBundle } from "@/lib/gallery/client-upload-artwork";
import {
  artworkNeedsThumbnail,
  categoryLabel,
  detectCategoryFromFile,
  DOCUMENT_ARTWORK_CATEGORY_VALUES,
  fileMatchesMediaType,
  IMAGE_ARTWORK_CATEGORY_VALUES,
  isBgmAudioFile,
  isThumbnailImageFile,
  MEDIA_FILE_ACCEPT,
} from "@/lib/gallery/constants";
import { artworkCategoryOptions } from "@/lib/i18n/taxonomy";
import { ArtworkModelViewer } from "@/components/gallery/artwork-model-viewer";
import {
  UploadMediaPicker,
  UploadWizardSteps,
  type WizardStep,
} from "@/components/gallery/upload-wizard";
import { createClient, hasBrowserSupabaseConfig } from "@/lib/supabase/client";
import type { ArtworkMediaType } from "@/types/database";

type UploadFormProps = {
  successRedirect?: string;
};

function revokeObjectUrl(url: string | null) {
  if (url) URL.revokeObjectURL(url);
}

export function UploadForm({ successRedirect }: UploadFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const { forms } = useContent();
  const upload = forms.upload;
  const imageCategories = artworkCategoryOptions(IMAGE_ARTWORK_CATEGORY_VALUES, locale);
  const documentCategories = artworkCategoryOptions(DOCUMENT_ARTWORK_CATEGORY_VALUES, locale);

  const [selectedMediaType, setSelectedMediaType] = useState<ArtworkMediaType | null>(null);
  const [wizardStep, setWizardStep] = useState<WizardStep>("pick");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [storyExcerpt, setStoryExcerpt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [detected, setDetected] = useState<ReturnType<typeof detectCategoryFromFile>>(null);
  const [imageCategory, setImageCategory] = useState<string | null>(null);
  const [documentCategory, setDocumentCategory] = useState<string>("document");
  const [extraPageFiles, setExtraPageFiles] = useState<File[]>([]);
  const [bgmFile, setBgmFile] = useState<File | null>(null);
  const [bgmPreview, setBgmPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const mediaType = selectedMediaType;
  const needsThumbnail = mediaType != null && mediaType !== "image";
  const isImageWork = mediaType === "image" && file != null;
  const resolvedImageCategory = imageCategory ?? detected?.category ?? "illustration";
  const showMangaPages = isImageWork && resolvedImageCategory === "manga";
  const showPhotoSeries = isImageWork && resolvedImageCategory === "photo";
  const showStoryExcerpt = mediaType === "document" && documentCategory === "story";
  const showBgm = mediaType != null && mediaType !== "audio";
  const galleryCoverUrl =
    thumbnailPreview ?? (mediaType === "image" ? mediaPreview : null);
  const activeGuide = mediaType ? upload.mediaGuides[mediaType] : null;

  function clearFileState() {
    setMediaPreview((prev) => {
      revokeObjectUrl(prev);
      return null;
    });
    setFile(null);
    setDetected(null);
    setImageCategory(null);
    setThumbnailPreview((prev) => {
      revokeObjectUrl(prev);
      return null;
    });
    setThumbnailFile(null);
    setExtraPageFiles([]);
    setBgmPreview((prev) => {
      revokeObjectUrl(prev);
      return null;
    });
    setBgmFile(null);
  }

  function handleMediaSelect(type: ArtworkMediaType) {
    setError(null);
    clearFileState();
    setSelectedMediaType(type);
    setWizardStep("file");
  }

  function handleChangeMedia() {
    setError(null);
    clearFileState();
    setSelectedMediaType(null);
    setWizardStep("pick");
  }

  function handleFileChange(selected: File | null) {
    setError(null);
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
    setError(null);
    setThumbnailPreview((prev) => {
      revokeObjectUrl(prev);
      return selected ? URL.createObjectURL(selected) : null;
    });
    setThumbnailFile(selected);
  }

  function handleBgmChange(selected: File | null) {
    setBgmPreview((prev) => {
      revokeObjectUrl(prev);
      return selected ? URL.createObjectURL(selected) : null;
    });
    setBgmFile(selected);
  }

  function goNextStep() {
    setError(null);
    if (!mediaType) return;

    if (wizardStep === "file") {
      if (!file) {
        setError(upload.errNoFile);
        return;
      }
      if (!fileMatchesMediaType(file, mediaType)) {
        setError(upload.errMediaMismatch);
        return;
      }
      setWizardStep(mediaType === "image" ? "details" : "thumbnail");
      return;
    }

    if (wizardStep === "thumbnail") {
      if (!thumbnailFile) {
        setError(upload.errNoThumbnail);
        return;
      }
      if (!isThumbnailImageFile(thumbnailFile)) {
        setError(upload.errFormat);
        return;
      }
      setWizardStep("details");
    }
  }

  function goBackStep() {
    setError(null);
    if (!mediaType) {
      handleChangeMedia();
      return;
    }

    if (wizardStep === "details") {
      setWizardStep(needsThumbnail ? "thumbnail" : "file");
      return;
    }

    if (wizardStep === "thumbnail") {
      setWizardStep("file");
      return;
    }

    handleChangeMedia();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (wizardStep !== "details" || !mediaType) {
      goNextStep();
      return;
    }

    if (!file) {
      setError(upload.errNoFile);
      return;
    }

    if (!fileMatchesMediaType(file, mediaType)) {
      setError(upload.errMediaMismatch);
      return;
    }

    const fileInfo = detectCategoryFromFile(file);
    const resolvedMediaType = fileInfo?.mediaType ?? mediaType;

    let category: string;
    if (resolvedMediaType === "image" && imageCategory) {
      category = imageCategory;
    } else if (resolvedMediaType === "document") {
      category = documentCategory;
    } else {
      category =
        fileInfo?.category ??
        (resolvedMediaType === "audio" ? "music" : resolvedMediaType);
    }

    if (!title.trim()) {
      setError(upload.errNoTitle);
      return;
    }

    if (!description.trim()) {
      setError(upload.errNoDescription);
      return;
    }

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

    if (bgmFile && !isBgmAudioFile(bgmFile)) {
      setError(upload.errBgmFormat);
      return;
    }

    setLoading(true);

    try {
      if (!hasBrowserSupabaseConfig()) {
        setError(upload.errSave);
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError(upload.errSave);
        setLoading(false);
        return;
      }

      const uploaded = await uploadArtworkMediaBundle(
        supabase,
        user.id,
        file,
        resolvedMediaType === "image" ? null : thumbnailFile,
      );

      const pageUrls: string[] = [];
      for (const pageFile of extraPageFiles) {
        const pageUpload = await uploadArtworkFileToStorage(
          supabase,
          user.id,
          pageFile,
          "image",
          `-p${pageUrls.length + 2}`,
        );
        pageUrls.push(pageUpload.publicUrl);
      }

      let bgmUrl: string | null = null;
      if (bgmFile) {
        const bgmUpload = await uploadArtworkFileToStorage(
          supabase,
          user.id,
          bgmFile,
          "audio",
          "-bgm",
        );
        bgmUrl = bgmUpload.publicUrl;
      }

      const response = await fetch("/api/gallery/artworks", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          tags,
          media_type: uploaded.mediaType,
          media_url: uploaded.mediaUrl,
          thumbnail_url: uploaded.thumbnailUrl,
          page_urls: pageUrls,
          story_excerpt: showStoryExcerpt ? storyExcerpt.trim() : null,
          bgm_url: bgmUrl,
        }),
      });

      let payload: { id?: string; error?: string } = {};
      const raw = await response.text();
      if (raw) {
        try {
          payload = JSON.parse(raw) as { id?: string; error?: string };
        } catch {
          payload = {};
        }
      }

      if (response.status === 413) {
        setError(upload.errPayloadTooLarge);
        setLoading(false);
        return;
      }

      if (!response.ok || !payload.id) {
        setError(payload.error ?? upload.errSave);
        setLoading(false);
        return;
      }

      router.push(successRedirect ?? `/gallery/${payload.id}`);
      router.refresh();
    } catch (cause) {
      if (cause instanceof Error) {
        if (cause.message === "UNSUPPORTED_FORMAT") {
          setError(upload.errFormat);
        } else if (cause.message === "THUMBNAIL_REQUIRED") {
          setError(upload.errNoThumbnail);
        } else {
          setError(`${upload.errUploadMedia} ${cause.message}`);
        }
      } else {
        setError(upload.errSave);
      }
      setLoading(false);
    }
  }

  const showPreview = wizardStep !== "pick" && mediaType != null;

  return (
    <form onSubmit={handleSubmit} className="artwork-upload">
      {wizardStep === "pick" ? (
        <UploadMediaPicker upload={upload} onSelect={handleMediaSelect} />
      ) : (
        mediaType && (
          <>
            <UploadWizardSteps
              mediaType={mediaType}
              currentStep={wizardStep}
              upload={upload}
              onChangeMedia={handleChangeMedia}
            />

            <div className="artwork-upload__grid">
              <div className="artwork-upload__fields">
                {wizardStep === "file" && activeGuide && (
                  <section className="artwork-upload__section is-active">
                    <header className="artwork-upload__section-head">
                      <h2 className="artwork-upload__section-title">{upload.stepLabelFile}</h2>
                      <span className="artwork-upload__badge">{upload.required}</span>
                    </header>
                    <label htmlFor="file" className="artwork-upload__label">
                      {upload.file}
                    </label>
                    <input
                      id="file"
                      type="file"
                      required
                      accept={MEDIA_FILE_ACCEPT[mediaType]}
                      onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
                      className="artwork-upload__file"
                    />
                    <p className="artwork-upload__hint">{activeGuide.formats}</p>
                    {activeGuide.tip ? (
                      <p className="artwork-upload__hint artwork-upload__hint--tip">{activeGuide.tip}</p>
                    ) : null}
                    {file && (
                      <p className="artwork-upload__filename" title={file.name}>
                        {file.name}
                      </p>
                    )}
                    {detected && mediaType === "image" && (
                      <p className="artwork-upload__detected">
                        {upload.typeAuto(categoryLabel(detected.category, locale))}
                      </p>
                    )}
                  </section>
                )}

                {wizardStep === "thumbnail" && (
                  <section className="artwork-upload__section artwork-upload__section--thumbnail is-active">
                    <header className="artwork-upload__section-head">
                      <h2 className="artwork-upload__section-title">{upload.stepLabelThumbnail}</h2>
                      <span className="artwork-upload__badge">{upload.required}</span>
                    </header>
                    <label htmlFor="thumbnail" className="artwork-upload__label">
                      {upload.thumbnail}
                    </label>
                    <input
                      id="thumbnail"
                      type="file"
                      required
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
                  </section>
                )}

                {wizardStep === "details" && (
                  <section className="artwork-upload__section">
                    <header className="artwork-upload__section-head">
                      <h2 className="artwork-upload__section-title">{upload.stepLabelDetails}</h2>
                      <span className="artwork-upload__badge">{upload.required}</span>
                    </header>

                    {mediaType === "image" && detected && (
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

                    {mediaType === "document" && (
                      <div className="artwork-upload__field">
                        <label htmlFor="documentCategory" className="artwork-upload__label">
                          {upload.type}
                        </label>
                        <select
                          id="documentCategory"
                          value={documentCategory}
                          onChange={(event) => setDocumentCategory(event.target.value)}
                          className="artwork-upload__control"
                        >
                          {documentCategories.map((item) => (
                            <option key={item.value} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {(showMangaPages || showPhotoSeries) && (
                      <div className="artwork-upload__field">
                        <label htmlFor="extraPages" className="artwork-upload__label">
                          {showMangaPages ? upload.mangaPages : upload.photoSeriesPages}
                        </label>
                        <input
                          id="extraPages"
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp"
                          onChange={(event) =>
                            setExtraPageFiles(Array.from(event.target.files ?? []).slice(0, 48))
                          }
                          className="artwork-upload__file"
                        />
                        <p className="artwork-upload__hint">
                          {showMangaPages ? upload.mangaPagesHint : upload.photoSeriesHint}
                        </p>
                        {extraPageFiles.length > 0 && (
                          <p className="artwork-upload__filename">+{extraPageFiles.length}</p>
                        )}
                      </div>
                    )}

                    {showStoryExcerpt && (
                      <div className="artwork-upload__field">
                        <label htmlFor="storyExcerpt" className="artwork-upload__label">
                          {upload.storyExcerpt}
                        </label>
                        <textarea
                          id="storyExcerpt"
                          rows={3}
                          maxLength={500}
                          value={storyExcerpt}
                          onChange={(event) => setStoryExcerpt(event.target.value)}
                          className="eldonia-textarea"
                        />
                        <p className="artwork-upload__hint">{upload.storyExcerptHint}</p>
                      </div>
                    )}

                    {showBgm && (
                      <div className="artwork-upload__field">
                        <label htmlFor="bgm" className="artwork-upload__label">
                          {upload.bgm}
                        </label>
                        <input
                          id="bgm"
                          type="file"
                          accept="audio/mpeg,audio/mp3,audio/wav,audio/flac,audio/mp4,audio/x-m4a,.mp3,.wav,.flac,.m4a"
                          onChange={(event) => handleBgmChange(event.target.files?.[0] ?? null)}
                          className="artwork-upload__file"
                        />
                        <p className="artwork-upload__hint">{upload.bgmHint}</p>
                        {bgmFile && (
                          <p className="artwork-upload__filename" title={bgmFile.name}>
                            {bgmFile.name}
                          </p>
                        )}
                        {bgmPreview && (
                          <audio controls preload="metadata" src={bgmPreview} className="mt-2 w-full">
                            {bgmFile?.name}
                          </audio>
                        )}
                      </div>
                    )}

                    <div className="artwork-upload__field">
                      <label htmlFor="title" className="artwork-upload__label">
                        {upload.title}
                        <span className="artwork-upload__label-required">{upload.required}</span>
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
                        <span className="artwork-upload__label-required">{upload.required}</span>
                      </label>
                      <textarea
                        id="description"
                        rows={4}
                        required
                        maxLength={2000}
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder={upload.descriptionPlaceholder}
                        className="artwork-upload__control"
                      />
                      <p className="artwork-upload__hint">{upload.descriptionHint}</p>
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
                )}

                {error && <p className="artwork-upload__error">{error}</p>}

                <div className="artwork-upload__nav">
                  <button
                    type="button"
                    onClick={goBackStep}
                    className="artwork-upload__nav-back eldonia-btn-secondary"
                  >
                    {upload.stepBack}
                  </button>
                  {wizardStep === "details" ? (
                    <button
                      type="submit"
                      disabled={loading}
                      className="artwork-upload__submit eldonia-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? upload.submitting : upload.submit}
                    </button>
                  ) : (
                    <button type="button" onClick={goNextStep} className="artwork-upload__nav-next eldonia-btn-primary">
                      {upload.stepNext}
                    </button>
                  )}
                </div>
              </div>

              {showPreview && (
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

                      {mediaType === "model" && mediaPreview && (
                        <div className="artwork-upload__media-block">
                          <p className="artwork-upload__hint">{upload.previewModel}</p>
                          <ArtworkModelViewer
                            src={mediaPreview}
                            poster={galleryCoverUrl}
                            title={title.trim() || upload.previewUntitled}
                            className="artwork-upload__model-preview"
                          />
                          <p className="artwork-upload__filename">{file.name}</p>
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
              )}
            </div>
          </>
        )
      )}
    </form>
  );
}
