import { PageIntro } from "@/components/layout/page-intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { LpCard } from "@/components/ui/lp-card";
import { getContent } from "@/lib/i18n/content/messages";
import { PRIVACY_POLICY } from "@/lib/i18n/content/privacy-policy";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { PAGE_ICONS } from "@/lib/layout/module-icons";

const COPY: Record<
  string,
  { metaTitle: string; metaDescription: string; eyebrow: string; title: string }
> = {
  ja: {
    metaTitle: "プライバシーポリシー | Eldonia–Nex",
    metaDescription:
      "Eldonia–Nex が取得する情報、利用目的、委託先、保管、ユーザーの権利を具体的に説明します。",
    eyebrow: "LEGAL",
    title: "プライバシーポリシー",
  },
  en: {
    metaTitle: "Privacy Policy | Eldonia–Nex",
    metaDescription:
      "What Eldonia–Nex collects, why, who processes it, retention, and your rights.",
    eyebrow: "LEGAL",
    title: "Privacy Policy",
  },
  ko: {
    metaTitle: "개인정보 처리방침 | Eldonia–Nex",
    metaDescription:
      "Eldonia–Nex가 수집하는 정보, 이용 목적, 처리 위탁, 보관, 이용자 권리를 구체적으로 설명합니다.",
    eyebrow: "LEGAL",
    title: "개인정보 처리방침",
  },
  "zh-CN": {
    metaTitle: "隐私政策 | Eldonia–Nex",
    metaDescription: "Eldonia–Nex 收集的信息、使用目的、处理方、保留期限与您的权利。",
    eyebrow: "LEGAL",
    title: "隐私政策",
  },
};

export async function generateMetadata() {
  const locale = await getUiLocale();
  const copy = COPY[locale] ?? COPY.ja;
  return { title: copy.metaTitle, description: copy.metaDescription };
}

export default async function PrivacyPage() {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const doc = PRIVACY_POLICY[locale] ?? PRIVACY_POLICY.ja;
  const copy = COPY[locale] ?? COPY.ja;

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6">
        <PageIntro
          eyebrow={copy.eyebrow}
          title={copy.title}
          lead={
            <>
              {doc.lead}
              <span className="mt-3 block text-xs tracking-wide text-[#9e927d]">
                {doc.updatedLabel}
              </span>
            </>
          }
          iconSrc={PAGE_ICONS.privacy}
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

        <LpCard className="p-6">
          <h2 className="font-display text-base font-semibold tracking-wider text-[#f8f1df]">
            {locale === "ja"
              ? "お問い合わせ"
              : locale === "ko"
                ? "문의"
                : locale === "zh-CN"
                  ? "联系我们"
                  : "Contact"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#d8c8a8]">{doc.contactNote}</p>
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
