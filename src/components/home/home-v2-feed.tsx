import Link from "next/link";
import { HomeV2Reveal } from "@/components/home/home-v2-reveal";
import { categoryLabel } from "@/lib/gallery/constants";
import { formatQuestReward, questKindLabel } from "@/lib/quests/constants";
import type { HomeV2Content } from "@/lib/i18n/content/home-v2-messages";
import type { UiLocale } from "@/lib/i18n/locale";
import type { ArtworkWithCreator, Quest } from "@/types/database";

type HomeV2FeedProps = {
  copy: HomeV2Content;
  locale: UiLocale;
  topArtworks: ArtworkWithCreator[];
  quests: Quest[];
  creatorFallback: string;
};

function previewUrl(artwork: ArtworkWithCreator): string | null {
  if (artwork.thumbnail_url) return artwork.thumbnail_url;
  if (artwork.media_type === "image") return artwork.media_url;
  return null;
}

export function HomeV2Feed({
  copy,
  locale,
  topArtworks,
  quests,
  creatorFallback,
}: HomeV2FeedProps) {
  const featured = copy.featuredWorks;
  const openQuests = copy.openQuests;
  const displayQuests = quests.slice(0, 4);

  return (
    <HomeV2Reveal as="section" className="home-v2-feed">
      <div className="home-v2-feed__panel home-v2-stagger home-v2-stagger--1">
        <div className="home-v2-feed__head">
          <div>
            <p className="home-v2-eyebrow">{featured.eyebrow}</p>
            <h2 className="home-v2-section__title home-v2-section__title--sm">
              {featured.title}
            </h2>
          </div>
          <Link href="/gallery" className="home-v2-link">
            {featured.viewAll}
          </Link>
        </div>
        <p className="home-v2-feed__lead">{featured.lead}</p>
        <div className="home-v2-works-grid">
          {topArtworks.length > 0 ? (
            topArtworks.map((artwork, index) => {
              const imageUrl = previewUrl(artwork);
              const creatorName =
                artwork.profiles?.display_name ??
                artwork.profiles?.username ??
                creatorFallback;

              return (
                <Link
                  key={artwork.id}
                  href={`/gallery/${artwork.id}`}
                  className="home-v2-work-card"
                >
                  <span className="home-v2-work-card__rank">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="home-v2-work-card__thumb">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt={artwork.title} />
                    ) : (
                      <span>{artwork.media_type}</span>
                    )}
                  </div>
                  <div className="home-v2-work-card__body">
                    <p className="home-v2-work-card__category">
                      {categoryLabel(artwork.category, locale)}
                    </p>
                    <strong>{artwork.title}</strong>
                    <p>{creatorName}</p>
                    <small>
                      {artwork.view_count.toLocaleString()} {featured.views}
                    </small>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="home-v2-empty">{featured.empty}</p>
          )}
        </div>
      </div>

      <div className="home-v2-feed__panel home-v2-stagger home-v2-stagger--2">
        <div className="home-v2-feed__head">
          <div>
            <p className="home-v2-eyebrow">{openQuests.eyebrow}</p>
            <h2 className="home-v2-section__title home-v2-section__title--sm">
              {openQuests.title}
            </h2>
          </div>
          <Link href="/works" className="home-v2-link">
            {openQuests.viewAll}
          </Link>
        </div>
        <div className="home-v2-quest-list">
          {displayQuests.length > 0 ? (
            displayQuests.map((quest) => (
              <Link key={quest.id} href={`/works/${quest.id}`} className="home-v2-quest-row">
                <span className="home-v2-quest-row__glyph" aria-hidden="true" />
                <span className="home-v2-quest-row__body">
                  <strong>{quest.title}</strong>
                  <small>
                    {questKindLabel(quest.kind, locale)} /{" "}
                    {formatQuestReward(quest.exp_reward, locale)}
                    {quest.prize_summary ? ` / 🎁 ${quest.prize_summary}` : ""}
                  </small>
                </span>
              </Link>
            ))
          ) : (
            <p className="home-v2-empty">{openQuests.empty}</p>
          )}
        </div>
      </div>
    </HomeV2Reveal>
  );
}
