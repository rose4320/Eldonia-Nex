import Link from "next/link";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { TranslatedContentLine } from "@/components/i18n/content-line";
import { formatEventDate, formatPrice } from "@/lib/events/constants";
import { inferSourceLocale } from "@/lib/translation/infer-source-locale";
import type { NexusEventWithOrganizer } from "@/types/database";

type EventsHeroStripProps = {
  events: NexusEventWithOrganizer[];
  translations?: Record<string, { title?: string; description?: string }>;
};

export async function EventsHeroStrip({ events, translations = {} }: EventsHeroStripProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const featured = events.filter((e) => e.is_featured).slice(0, 3);

  if (featured.length === 0) return null;

  return (
    <section>
      <h2 className="eldonia-eyebrow">{t.events.heroHeading}</h2>
      <div className="mt-3 flex gap-4 overflow-x-auto pb-2">
        {featured.map((event) => {
          const date = formatEventDate(event.starts_at, locale);
          return (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="eldonia-events-hero-card group min-w-[14rem]"
            >
              <p className="eldonia-badge-bestseller">{t.events.featured}</p>
              <p className="mt-2 font-display text-xs text-[var(--eldonia-text-dim)]">
                {date.full}
              </p>
              <TranslatedContentLine
                text={event.title}
                translatedText={translations[event.id]?.title}
                sourceLocale={inferSourceLocale(event.title)}
                locale={locale}
                as="h3"
                className="mt-2 font-display text-sm text-[var(--eldonia-gold-light)] group-hover:text-[var(--eldonia-gold)]"
                hintClassName="eldonia-localized-hint text-[10px] line-clamp-2"
              />
              <p className="mt-2 text-lg text-[var(--eldonia-gold)]">
                {formatPrice(event.ticket_price, locale)}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
