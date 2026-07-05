import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/page-intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LpCard } from "@/components/ui/lp-card";
import { SIGNUP_CONTENT } from "@/lib/i18n/content/signup-messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { PAGE_ICONS } from "@/lib/layout/module-icons";

export const metadata: Metadata = {
  title: "利用規約 | Eldonia–Nex",
  description: "Eldonia–Nex の利用規約・ガイドライン・取引条件。",
};

const TERMS_TYPES = [
  "terms_of_service",
  "subscription_terms",
  "creator_guidelines",
  "commerce_terms",
];

const COPY: Record<
  string,
  { eyebrow: string; title: string; lead: string }
> = {
  ja: {
    eyebrow: "LEGAL",
    title: "利用規約",
    lead: "サービス利用・サブスクリプション・クリエイター活動・取引に関する規約です。",
  },
  en: {
    eyebrow: "LEGAL",
    title: "Terms of Service",
    lead: "Terms covering service use, subscriptions, creator activity, and commerce.",
  },
  ko: {
    eyebrow: "LEGAL",
    title: "이용약관",
    lead: "서비스 이용, 구독, 크리에이터 활동, 거래에 관한 약관입니다.",
  },
  "zh-CN": {
    eyebrow: "LEGAL",
    title: "使用条款",
    lead: "涵盖服务使用、订阅、创作者活动与交易的相关条款。",
  },
};

export default async function TermsPage() {
  const locale = await getUiLocale();
  const consents = SIGNUP_CONTENT[locale]?.consents ?? SIGNUP_CONTENT.ja.consents;
  const docs = TERMS_TYPES.map((type) =>
    consents.find((c) => c.type === type),
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const copy = COPY[locale] ?? COPY.ja;

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
        <PageIntro
          eyebrow={copy.eyebrow}
          title={copy.title}
          lead={copy.lead}
          iconSrc={PAGE_ICONS.terms}
        />
        <div className="space-y-5">
          {docs.map((doc) => (
            <LpCard key={doc.type} className="p-6">
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
          ))}
        </div>
        <p className="text-xs text-[#9e927d]">
          お問い合わせ: <a href="/help/contact" className="eldonia-link">/help/contact</a>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
