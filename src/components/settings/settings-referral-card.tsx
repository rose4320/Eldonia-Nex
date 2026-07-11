"use client";

import { useState } from "react";
import { useContent } from "@/components/providers/locale-provider";
import { SettingsReferralQrSheet } from "@/components/settings/settings-referral-qr-sheet";
import type { ReferralProgramData } from "@/lib/referrals/get-referral-program";

type SettingsReferralCardProps = {
  referral: ReferralProgramData;
};

type CopiedField = "url" | "code" | null;

export function SettingsReferralCard({ referral }: SettingsReferralCardProps) {
  const { settingsUi } = useContent();
  const copy = settingsUi.referral;
  const [copied, setCopied] = useState<CopiedField>(null);
  const [qrSheetOpen, setQrSheetOpen] = useState(false);

  async function copyText(value: string, field: CopiedField) {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(field);
    window.setTimeout(() => setCopied(null), 1600);
  }

  async function shareReferralLink(url: string) {
    const shareData = {
      title: copy.shareTitle,
      text: copy.shareText,
      url,
    };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    await copyText(url, "url");
  }

  const hasCode = Boolean(referral.code && referral.qrSvg);

  return (
    <section id="referral" className="scroll-mt-24 space-y-4">
      <h2 className="eldonia-eyebrow">{copy.heading}</h2>

      <div className="eldonia-card eldonia-referral-settings">
        {!referral.eligible && referral.reason && (
          <p className="eldonia-alert-error">{referral.reason}</p>
        )}

        {hasCode && (
          <>
            {/* Mobile: LINE-style QR hero */}
            <div className="eldonia-referral-settings__mobile lg:hidden">
              <p className="eldonia-referral-settings__mobile-lead">{copy.mobileScanLead}</p>
              <button
                type="button"
                className="eldonia-referral-settings__qr-tap"
                onClick={() => setQrSheetOpen(true)}
                aria-label={copy.showQrFullscreen}
              >
                <div
                  className="eldonia-referral-settings__qr-display"
                  dangerouslySetInnerHTML={{ __html: referral.qrSvg! }}
                />
                <span className="eldonia-referral-settings__qr-tap-hint">{copy.tapToEnlarge}</span>
              </button>
              <code className="eldonia-referral-settings__code-pill">
                {referral.code!.referral_code}
              </code>
              <button
                type="button"
                className="eldonia-btn-primary w-full"
                onClick={() => shareReferralLink(referral.code!.referral_url)}
              >
                {copied === "url" && !qrSheetOpen ? copy.copied : copy.shareLink}
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="eldonia-btn-secondary"
                  onClick={() => copyText(referral.code!.referral_url, "url")}
                >
                  {copied === "url" ? copy.copied : copy.copyUrl}
                </button>
                <button
                  type="button"
                  className="eldonia-btn-secondary"
                  onClick={() => copyText(referral.code!.referral_code, "code")}
                >
                  {copied === "code" ? copy.copied : copy.copyCode}
                </button>
              </div>
              <p className="eldonia-body text-xs text-eldonia-text-muted">{copy.body}</p>
            </div>

            {/* Desktop */}
            <div className="hidden gap-6 lg:flex lg:items-center">
              <div className="min-w-0 flex-1">
                <h3 className="eldonia-heading eldonia-heading-sm">{copy.title}</h3>
                <p className="eldonia-body mt-2 text-sm">{copy.body}</p>
                <div className="mt-5 space-y-3">
                  <div>
                    <p className="eldonia-label">{copy.codeLabel}</p>
                    <code className="mt-1 block rounded-md border border-eldonia-border bg-black/30 px-3 py-2 text-lg font-semibold tracking-[0.2em] text-eldonia-gold-light">
                      {referral.code!.referral_code}
                    </code>
                  </div>
                  <div>
                    <p className="eldonia-label">{copy.urlLabel}</p>
                    <p className="mt-1 break-all rounded-md border border-eldonia-border bg-black/30 px-3 py-2 text-sm text-eldonia-text-muted">
                      {referral.code!.referral_url}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => copyText(referral.code!.referral_url, "url")}
                      className="eldonia-btn-secondary"
                    >
                      {copied === "url" ? copy.copied : copy.copyUrl}
                    </button>
                    <button
                      type="button"
                      onClick={() => copyText(referral.code!.referral_code, "code")}
                      className="eldonia-btn-secondary"
                    >
                      {copied === "code" ? copy.copied : copy.copyCode}
                    </button>
                  </div>
                </div>
              </div>
              <div className="eldonia-referral-settings__qr-frame w-52 shrink-0">
                <div
                  className="overflow-hidden rounded-md"
                  aria-label={copy.qrLabel}
                  dangerouslySetInnerHTML={{ __html: referral.qrSvg! }}
                />
              </div>
            </div>

            <SettingsReferralQrSheet
              open={qrSheetOpen}
              onClose={() => setQrSheetOpen(false)}
              qrSvg={referral.qrSvg!}
              referralCode={referral.code!.referral_code}
              title={copy.fullscreenTitle}
              hint={copy.fullscreenHint}
              closeLabel={copy.closeQr}
            />
          </>
        )}
      </div>
    </section>
  );
}
