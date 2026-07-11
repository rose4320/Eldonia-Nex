"use client";

import { useEffect } from "react";

type SettingsReferralQrSheetProps = {
  open: boolean;
  onClose: () => void;
  qrSvg: string;
  referralCode: string;
  title: string;
  hint: string;
  closeLabel: string;
};

export function SettingsReferralQrSheet({
  open,
  onClose,
  qrSvg,
  referralCode,
  title,
  hint,
  closeLabel,
}: SettingsReferralQrSheetProps) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="eldonia-referral-qr-sheet"
      role="dialog"
      aria-modal="true"
      aria-labelledby="referral-qr-sheet-title"
    >
      <button
        type="button"
        className="eldonia-referral-qr-sheet__backdrop"
        aria-label={closeLabel}
        onClick={onClose}
      />
      <div className="eldonia-referral-qr-sheet__panel">
        <p id="referral-qr-sheet-title" className="eldonia-referral-qr-sheet__title">
          {title}
        </p>
        <p className="eldonia-referral-qr-sheet__hint">{hint}</p>
        <div
          className="eldonia-referral-qr-sheet__qr"
          aria-hidden
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />
        <code className="eldonia-referral-qr-sheet__code">{referralCode}</code>
        <button type="button" className="eldonia-btn-secondary w-full" onClick={onClose}>
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
