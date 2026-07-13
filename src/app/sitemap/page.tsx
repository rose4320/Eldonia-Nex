import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { PageIntro } from "@/components/layout/page-intro";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import type { UiLocale } from "@/lib/i18n/locale";
import {
  localizedSiteMapLabel,
  SITE_MAP_SECTIONS,
} from "@/lib/layout/site-map-links";

export const dynamic = "force-dynamic";

const PAGE_COPY: Record<
  UiLocale,
  { title: string; lead: string; metaDescription: string }
> = {
  ja: {
    title: "サイトマップ",
    lead: "Eldonia–Nex の主なページ一覧です。",
    metaDescription: "Eldonia–Nex のサイトマップ。モジュール・ヘルプ・規約へのリンク一覧。",
  },
  en: {
    title: "Sitemap",
    lead: "A directory of the main pages on Eldonia–Nex.",
    metaDescription: "Eldonia–Nex sitemap — modules, help, and legal pages.",
  },
  ko: {
    title: "사이트맵",
    lead: "Eldonia–Nex의 주요 페이지 목록입니다.",
    metaDescription: "Eldonia–Nex 사이트맵 — 모듈·도움말·약관 링크.",
  },
  "zh-CN": {
    title: "站点地图",
    lead: "Eldonia–Nex 主要页面一览。",
    metaDescription: "Eldonia–Nex 站点地图 — 模块、帮助与条款链接。",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getUiLocale();
  const copy = PAGE_COPY[locale] ?? PAGE_COPY.ja;
  return {
    title: `${copy.title} | Eldonia–Nex`,
    description: copy.metaDescription,
  };
}

export default async function HtmlSitemapPage() {
  const locale = await getUiLocale();
  const copy = PAGE_COPY[locale] ?? PAGE_COPY.ja;

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <PageIntro eyebrow="Sitemap" title={copy.title} lead={copy.lead} />

        <div className="mt-10 space-y-10">
          {SITE_MAP_SECTIONS.map((section) => (
            <section key={section.id} aria-labelledby={`sitemap-${section.id}`}>
              <h2
                id={`sitemap-${section.id}`}
                className="eldonia-eyebrow text-[#d6a84f]"
              >
                {localizedSiteMapLabel(section.title, locale)}
              </h2>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="eldonia-link text-sm">
                      {localizedSiteMapLabel(link.label, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
