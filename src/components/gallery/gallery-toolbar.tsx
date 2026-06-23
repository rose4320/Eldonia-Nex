import Link from "next/link";
import { galleryUploadHref } from "@/lib/gallery/upload-link";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

type GalleryToolbarProps = {
  query?: string;
};

export async function GalleryToolbar({ query }: GalleryToolbarProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const uploadHref = galleryUploadHref(Boolean(user));

  return (
    <div className="eldonia-gallery-toolbar">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-6 py-3">
        <Link
          href="/gallery"
          className="eldonia-eyebrow shrink-0 hover:text-eldonia-gold-light"
        >
          GALLEY
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

        <Link href={uploadHref} className="eldonia-btn-ghost shrink-0 text-xs">
          {t.gallery.upload}
        </Link>
      </div>
    </div>
  );
}
