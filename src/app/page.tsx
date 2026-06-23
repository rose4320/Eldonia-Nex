import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HomeV2Categories } from "@/components/home/home-v2-categories";
import { HomeV2Feed } from "@/components/home/home-v2-feed";
import { HomeV2Hero } from "@/components/home/home-v2-hero";
import { HomeV2Investor } from "@/components/home/home-v2-investor";
import { HomeV2Modules } from "@/components/home/home-v2-modules";
import { getTopPublicArtworks } from "@/lib/gallery/get-public-artworks";
import { getHomePlatformStats } from "@/lib/home/get-home-stats";
import { getHomeV2Content } from "@/lib/i18n/content/home-v2-messages";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { getJobListings } from "@/lib/works/get-works";

export default async function HomePage() {
  const locale = await getUiLocale();
  const copy = getHomeV2Content(locale);
  const t = getContent(locale);

  const [stats, topArtworks, quests] = await Promise.all([
    getHomePlatformStats(),
    getTopPublicArtworks(6),
    getJobListings({}, locale),
  ]);

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="home-v2-main">
        <HomeV2Hero copy={copy} stats={stats} locale={locale} />
        <HomeV2Modules copy={copy} />
        <HomeV2Feed
          copy={copy}
          locale={locale}
          topArtworks={topArtworks}
          quests={quests}
          creatorFallback={t.pages.creatorFallback}
        />
        <HomeV2Investor copy={copy} />
        <HomeV2Categories copy={copy} />
      </main>

      <SiteFooter />
    </div>
  );
}
