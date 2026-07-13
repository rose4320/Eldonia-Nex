import { PageIntro } from "@/components/layout/page-intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LpCard } from "@/components/ui/lp-card";
import { getContent } from "@/lib/i18n/content/messages";
import { SIGNUP_CONTENT } from "@/lib/i18n/content/signup-messages";
import { TERMS_OF_SERVICE } from "@/lib/i18n/content/terms-of-service";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { PAGE_ICONS } from "@/lib/layout/module-icons";
import Link from "next/link";

const EXTRA_TYPES = [
  "subscription_terms",
  "creator_guidelines",
  "commerce_terms",
] as const;

const COPY: Record<
  string,
  {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    lead: string;
    relatedPrivacy: string;
    relatedPrivacyLink: string;
    otherHeading: string;
  }
> = {
  ja: {
    metaTitle: "利用規約 | Eldonia–Nex",
    metaDescription:
      "Eldonia–Nex の利用規約。個人情報、作品の著作権、紹介料（紹介プログラム）、禁止事項。",
    eyebrow: "LEGAL",
    title: "利用規約",
    lead: "サービス利用の基本条件です。個人情報・作品著作権・紹介料についてもここに定めます。",
    relatedPrivacy: "個人情報の詳細な取り扱い:",
    relatedPrivacyLink: "プライバシーポリシー",
    otherHeading: "関連する同意事項",
  },
  en: {
    metaTitle: "Terms of Service | Eldonia–Nex",
    metaDescription:
      "Eldonia–Nex Terms — personal data, artwork copyright, referral fees, and prohibitions.",
    eyebrow: "LEGAL",
    title: "Terms of Service",
    lead: "Core conditions for using the Service, including personal data, artwork copyright, and referral fees.",
    relatedPrivacy: "Detailed personal-data practices:",
    relatedPrivacyLink: "Privacy Policy",
    otherHeading: "Related agreements",
  },
  ko: {
    metaTitle: "이용약관 | Eldonia–Nex",
    metaDescription: "Eldonia–Nex 이용약관 — 개인정보, 작품 저작권, 금지사항.",
    eyebrow: "LEGAL",
    title: "이용약관",
    lead: "서비스 이용의 기본 조건입니다. 개인정보와 작품 저작권도 여기에 정합니다.",
    relatedPrivacy: "개인정보 처리 상세:",
    relatedPrivacyLink: "개인정보 처리방침",
    otherHeading: "관련 동의 항목",
  },
  "zh-CN": {
    metaTitle: "使用条款 | Eldonia–Nex",
    metaDescription: "Eldonia–Nex 使用条款 — 个人信息、作品著作权与禁止事项。",
    eyebrow: "LEGAL",
    title: "使用条款",
    lead: "服务使用的基本条件，包括个人信息与作品著作权。",
    relatedPrivacy: "个人信息处理详情:",
    relatedPrivacyLink: "隐私政策",
    otherHeading: "相关同意事项",
  },
};

export async function generateMetadata() {
  const locale = await getUiLocale();
  const copy = COPY[locale] ?? COPY.ja;
  return { title: copy.metaTitle, description: copy.metaDescription };
}

export default async function TermsPage() {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const consents = SIGNUP_CONTENT[locale]?.consents ?? SIGNUP_CONTENT.ja.consents;
  const extras = EXTRA_TYPES.map((type) => consents.find((c) => c.type === type)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c),
  );
  const copy = COPY[locale] ?? COPY.ja;
  const doc = TERMS_OF_SERVICE[locale] ?? TERMS_OF_SERVICE.ja;

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
        <PageIntro
          eyebrow={copy.eyebrow}
          title={copy.title}
          lead={
            <>
              {copy.lead}
              <span className="mt-3 block text-xs tracking-wide text-[#9e927d]">
                {doc.updatedLabel}
              </span>
              <span className="mt-2 block text-sm text-[#9e927d]">
                {copy.relatedPrivacy}{" "}
                <Link href="/privacy" className="eldonia-link">
                  {copy.relatedPrivacyLink}
                </Link>
              </span>
            </>
          }
          iconSrc={PAGE_ICONS.terms}
        />

        <div className="space-y-5">
          {doc.sections.map((section) => (
            <section key={section.id} id={section.id}>
              <LpCard className="p-6">
                <h2 className="font-display text-lg font-semibold tracking-wider text-[#f8f1df]">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-3 text-sm leading-7 text-[#d8c8a8]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets && section.bullets.length > 0 ? (
                    <ul className="space-y-2.5 pt-1">
                      {section.bullets.map((line) => (
                        <li key={line} className="flex gap-2">
                          <span className="mt-0.5 shrink-0 text-[#d6a84f]" aria-hidden>
                            ・
                          </span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </LpCard>
            </section>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-base font-semibold tracking-wider text-[#f0c978]">
            {copy.otherHeading}
          </h2>
          {extras.map((extra) => (
            <LpCard key={extra.type} className="p-6">
              <h3 className="font-display text-lg font-semibold tracking-wider text-[#f8f1df]">
                {extra.title}
              </h3>
              <p className="mt-2 text-sm text-[#9e927d]">{extra.lead}</p>
              <ul className="mt-4 space-y-2.5">
                {extra.body.map((line) => (
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

        <LpCard className="p-6">
          <p className="text-sm leading-7 text-[#d8c8a8]">{doc.contactNote}</p>
          <p className="mt-3 text-xs text-[#9e927d]">
            {pages.legalContactPrefix}{" "}
            <a href="/help/contact" className="eldonia-link">
              /help/contact
            </a>
          </p>
        </LpCard>
      </main>
      <SiteFooter />
    </div>
  );
}
