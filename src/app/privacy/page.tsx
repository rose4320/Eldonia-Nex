import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/page-intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LpCard } from "@/components/ui/lp-card";
import { SIGNUP_CONTENT } from "@/lib/i18n/content/signup-messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { PAGE_ICONS } from "@/lib/layout/module-icons";

export const metadata: Metadata = {
  title: "プライバシーポリシー | Eldonia–Nex",
  description: "Eldonia–Nex における個人情報・決済情報・利用履歴の取り扱い方針。",
};

const COPY: Record<
  string,
  { eyebrow: string; title: string }
> = {
  ja: { eyebrow: "LEGAL", title: "プライバシーポリシー" },
  en: { eyebrow: "LEGAL", title: "Privacy Policy" },
  ko: { eyebrow: "LEGAL", title: "개인정보 처리방침" },
  "zh-CN": { eyebrow: "LEGAL", title: "隐私政策" },
};

export default async function PrivacyPage() {
  const locale = await getUiLocale();
  const consents = SIGNUP_CONTENT[locale]?.consents ?? SIGNUP_CONTENT.ja.consents;
  const doc =
    consents.find((c) => c.type === "privacy_policy") ??
    SIGNUP_CONTENT.ja.consents.find((c) => c.type === "privacy_policy")!;
  const copy = COPY[locale] ?? COPY.ja;

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
        <PageIntro
          eyebrow={copy.eyebrow}
          title={copy.title}
          lead={doc.lead}
          iconSrc={PAGE_ICONS.privacy}
        />
        <LpCard className="p-6">
          <h2 className="font-display text-lg font-semibold tracking-wider text-[#f8f1df]">
            {doc.title}
          </h2>
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
        <p className="text-xs text-[#9e927d]">
          お問い合わせ: <a href="/help/contact" className="eldonia-link">/help/contact</a>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
