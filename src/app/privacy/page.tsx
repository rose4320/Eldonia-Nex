import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LpCard } from "@/components/ui/lp-card";
import { SIGNUP_CONTENT } from "@/lib/i18n/content/signup-messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Eldonia–Nex",
  description: "Eldonia–Nex における個人情報・決済情報・利用履歴の取り扱い方針。",
};

const HEADING: Record<string, string> = {
  ja: "プライバシーポリシー",
  en: "Privacy Policy",
  ko: "개인정보 처리방침",
  "zh-CN": "隐私政策",
};

export default async function PrivacyPage() {
  const locale = await getUiLocale();
  const consents = SIGNUP_CONTENT[locale]?.consents ?? SIGNUP_CONTENT.ja.consents;
  const doc =
    consents.find((c) => c.type === "privacy_policy") ??
    SIGNUP_CONTENT.ja.consents.find((c) => c.type === "privacy_policy")!;

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-bold tracking-wide text-[#f0c978]">
          {HEADING[locale] ?? HEADING.ja}
        </h1>
        <LpCard className="mt-8 p-6">
          <h2 className="font-display text-lg font-semibold tracking-wider text-[#f8f1df]">
            {doc.title}
          </h2>
          <p className="mt-2 text-sm text-[#9e927d]">{doc.lead}</p>
          <ul className="mt-4 space-y-2.5">
            {doc.body.map((line) => (
              <li key={line} className="flex gap-2 text-sm leading-7 text-[#d8c8a8]">
                <span className="mt-0.5 shrink-0 text-[#d6a84f]" aria-hidden>
                  ・
                </span>
                {line}
              </li>
            ))}
          </ul>
        </LpCard>
        <p className="mt-6 text-xs text-[#9e927d]">
          お問い合わせ: <a href="/help/contact" className="eldonia-link">/help/contact</a>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
