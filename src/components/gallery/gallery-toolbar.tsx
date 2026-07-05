import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";

type GalleryToolbarProps = {
  query?: string;
};

export async function GalleryToolbar({ query }: GalleryToolbarProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);

  return (
    <div className="eldonia-gallery-toolbar">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/gallery"
          className="flex shrink-0 items-center gap-2 hover:opacity-90"
        >
          <Image
            src="/aset/icons/modules/icon-gallery.png"
            alt=""
            width={28}
            height={28}
            className="rounded-sm"
          />
          <span className="eldonia-eyebrow hover:text-eldonia-gold-light">GALLERY</span>
        </Link>

        <form action="/gallery" method="get" className="eldonia-gallery-search min-w-48 flex-1">
          <input
            type="search"
            name="q"
            defaultValue={query ?? ""}
            placeholder={t.gallery.searchPlaceholder}
            className="eldonia-gallery-search-input"
            aria-label={t.gallery.searchAria}
          />
          <button type="submit" className="eldonia-gallery-search-btn">
            {t.common.search}
          </button>
        </form>
      </div>
    </div>
  );
}
