"use client";

import type { FormsContent } from "@/lib/i18n/content/forms-messages";
import type { ArtworkMediaType } from "@/types/database";

const PICKER_ORDER: ArtworkMediaType[] = ["image", "video", "audio", "document", "model"];

const PICKER_ICON: Record<ArtworkMediaType, string> = {
  image: "🖼",
  video: "🎬",
  audio: "🎵",
  document: "📄",
  model: "🧊",
};

type UploadMediaPickerProps = {
  upload: FormsContent["upload"];
  onSelect: (mediaType: ArtworkMediaType) => void;
};

export function UploadMediaPicker({ upload, onSelect }: UploadMediaPickerProps) {
  return (
    <section className="artwork-upload-picker" aria-label={upload.pickerTitle}>
      <header className="artwork-upload-picker__head">
        <h2 className="artwork-upload-picker__title">{upload.pickerTitle}</h2>
        <p className="artwork-upload-picker__lead">{upload.pickerLead}</p>
      </header>
      <ul className="artwork-upload-picker__grid">
        {PICKER_ORDER.map((type) => {
          const option = upload.pickerOptions[type];
          return (
            <li key={type}>
              <button
                type="button"
                className="artwork-upload-picker__option"
                onClick={() => onSelect(type)}
              >
                <span className="artwork-upload-picker__icon" aria-hidden>
                  {PICKER_ICON[type]}
                </span>
                <span className="artwork-upload-picker__label">{option.label}</span>
                <span className="artwork-upload-picker__desc">{option.description}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export type WizardStep = "pick" | "file" | "thumbnail" | "details";

export function wizardStepsForMedia(mediaType: ArtworkMediaType): WizardStep[] {
  if (mediaType === "image") return ["file", "details"];
  return ["file", "thumbnail", "details"];
}

type UploadWizardStepsProps = {
  mediaType: ArtworkMediaType;
  currentStep: WizardStep;
  upload: FormsContent["upload"];
  onChangeMedia: () => void;
};

export function UploadWizardSteps({
  mediaType,
  currentStep,
  upload,
  onChangeMedia,
}: UploadWizardStepsProps) {
  const steps = wizardStepsForMedia(mediaType);
  const currentIndex = steps.indexOf(currentStep);

  return (
    <header className="artwork-upload-wizard">
      <div className="artwork-upload-wizard__type">
        <span className="artwork-upload-wizard__type-label">{upload.selectedMediaLabel}</span>
        <span className="artwork-upload-wizard__type-value">
          {upload.pickerOptions[mediaType].label}
        </span>
        <button type="button" className="artwork-upload-wizard__change" onClick={onChangeMedia}>
          {upload.changeMedia}
        </button>
      </div>
      <ol className="artwork-upload-wizard__steps">
        {steps.map((step, index) => {
          const done = index < currentIndex;
          const active = step === currentStep;
          const labels: Record<WizardStep, string> = {
            pick: upload.stepLabelPick,
            file: upload.stepLabelFile,
            thumbnail: upload.stepLabelThumbnail,
            details: upload.stepLabelDetails,
          };
          return (
            <li
              key={step}
              className={`artwork-upload-wizard__step${active ? " is-active" : ""}${
                done ? " is-done" : ""
              }`}
              aria-current={active ? "step" : undefined}
            >
              <span className="artwork-upload-wizard__step-num">{index + 1}</span>
              <span>{labels[step]}</span>
            </li>
          );
        })}
      </ol>
    </header>
  );
}
