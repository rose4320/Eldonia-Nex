import Link from "next/link";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import {
  GALLERY_REALM_FILTER_VALUES,
  galleryRealmFilterLabel,
  type GalleryRealmFilter,
} from "@/lib/gallery/creator-taxonomy";

type GalleryRealmFiltersProps = {
  active?: string;
  query?: string;
};

function buildHref(realm: GalleryRealmFilter, query?: string): string {
  const params = new URLSearchParams();
  if (realm !== "all") params.set("realm", realm);
  if (query?.trim()) params.set("q", query.trim());
  const qs = params.toString();
  return qs ? `/gallery?${qs}` : "/gallery";
}

export async function GalleryRealmFilters({ active, query }: GalleryRealmFiltersProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const current = (active?.trim() || "all") as GalleryRealmFilter;

  return (
    <nav
      aria-label={t.gallery.realmFiltersAria}
      className="eldonia-gallery-realms mx-auto flex max-w-[1240px] flex-wrap gap-2 px-4 pb-2 sm:px-6"
    >
      {GALLERY_REALM_FILTER_VALUES.map((realm) => {
        const isActive = current === realm;
        return (
          <Link
            key={realm}
            href={buildHref(realm, query)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              isActive
                ? "border-eldonia-gold/60 bg-eldonia-gold/15 text-eldonia-gold-light"
                : "border-eldonia-border text-eldonia-text-muted hover:border-eldonia-gold/40 hover:text-eldonia-gold-light"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {galleryRealmFilterLabel(realm, locale)}
          </Link>
        );
      })}
    </nav>
  );
}
