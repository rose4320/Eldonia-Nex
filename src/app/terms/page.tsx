import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LpCard } from "@/components/ui/lp-card";
import { SIGNUP_CONTENT } from "@/lib/i18n/content/signup-messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

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

const HEADING: Record<string, string> = {
  ja: "利用規約",
  en: "Terms of Service",
  ko: "이용약관",
  "zh-CN": "使用条款",
};

export default async function TermsPage() {
  const locale = await getUiLocale();
  const consents = SIGNUP_CONTENT[locale]?.consents ?? SIGNUP_CONTENT.ja.consents;
  const docs = TERMS_TYPES.map((type) =>
    consents.find((c) => c.type === type),
  ).filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-bold tracking-wide text-[#f0c978]">
          {HEADING[locale] ?? HEADING.ja}
        </h1>
        <div className="mt-8 space-y-5">
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
      </main>
      <SiteFooter />
    </div>
  );
}
