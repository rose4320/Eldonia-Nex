"use client";

import { useState } from "react";
import type { ReferralProgramData } from "@/lib/referrals/get-referral-program";

type SettingsReferralCardProps = {
  referral: ReferralProgramData;
};

export function SettingsReferralCard({ referral }: SettingsReferralCardProps) {
  const [copied, setCopied] = useState(false);

  async function copyReferralUrl() {
    if (!referral.code) return;
    await navigator.clipboard.writeText(referral.code.referral_url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section id="referral" className="scroll-mt-24 space-y-4">
      <h2 className="eldonia-eyebrow">Referral Program</h2>
      <div className="eldonia-card">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <div className="min-w-0 flex-1">
            <h3 className="eldonia-heading eldonia-heading-sm">紹介コード / QR</h3>
            <p className="eldonia-body mt-2 text-sm">
              サブスクプランが Free 以外の会員には、サインイン確定後に紹介コードが付与されます。紹介成立から3か月目以降、日本の紹介は10%、日本以外は15%を還元します。
            </p>

            {!referral.eligible && (
              <p className="eldonia-alert-error mt-4">{referral.reason}</p>
            )}

            {referral.code && (
              <div className="mt-5 space-y-3">
                <div>
                  <p className="eldonia-label">紹介コード</p>
                  <code className="mt-1 block rounded-md border border-eldonia-border bg-black/30 px-3 py-2 text-lg font-semibold tracking-[0.2em] text-eldonia-gold-light">
                    {referral.code.referral_code}
                  </code>
                </div>
                <div>
                  <p className="eldonia-label">紹介URL</p>
                  <p className="mt-1 break-all rounded-md border border-eldonia-border bg-black/30 px-3 py-2 text-sm text-eldonia-text-muted">
                    {referral.code.referral_url}
                  </p>
                </div>
                <button type="button" onClick={copyReferralUrl} className="eldonia-btn-secondary">
                  {copied ? "コピーしました" : "紹介URLをコピー"}
                </button>
              </div>
            )}
          </div>

          {referral.qrSvg && (
            <div className="mx-auto w-52 rounded-lg border border-eldonia-border-strong bg-eldonia-gold-light p-3 shadow-[0_0_32px_rgba(201,168,76,0.14)]">
              <div
                className="overflow-hidden rounded-md"
                aria-label="紹介URLのQRコード"
                dangerouslySetInnerHTML={{ __html: referral.qrSvg }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
