import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/site-header";
import { categoryLabel, formatDate } from "@/lib/gallery/constants";
import { createClient } from "@/lib/supabase/server";
import type { ArtworkWithCreator } from "@/types/database";

type ArtworkDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ArtworkDetailPage({ params }: ArtworkDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: artwork } = await supabase
    .from("artworks")
    .select(
      `
      *,
      profiles:creator_id (
        display_name,
        username,
        avatar_url
      )
    `,
    )
    .eq("id", id)
    .single();

  if (!artwork) {
    notFound();
  }

  const item = artwork as ArtworkWithCreator;
  const creatorName =
    item.profiles?.display_name ?? item.profiles?.username ?? "クリエイター";

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main eldonia-main-narrow">
        <Link
          href="/gallery"
          className="eldonia-link text-sm"
        >
          ← ギャラリー一覧
        </Link>

        <article className="eldonia-card overflow-hidden p-0">
          <div className="bg-eldonia-surface">
            {item.media_type === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.media_url}
                alt={item.title}
                className="max-h-[70vh] w-full object-contain"
              />
            )}
            {item.media_type === "video" && (
              <video
                src={item.media_url}
                controls
                className="max-h-[70vh] w-full bg-black"
              />
            )}
            {item.media_type === "audio" && (
              <div className="flex items-center justify-center px-6 py-16">
                <audio src={item.media_url} controls className="w-full max-w-lg" />
              </div>
            )}
            {item.media_type === "document" && (
              <div className="flex items-center justify-center px-6 py-16">
                <a
                  href={item.media_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eldonia-btn-primary"
                >
                  PDF を開く
                </a>
              </div>
            )}
          </div>

          <div className="space-y-4 p-8">
            <div>
              <p className="eldonia-eyebrow text-[0.65rem]">
                {categoryLabel(item.category)}
              </p>
              <h1 className="mt-1 eldonia-heading eldonia-heading-lg">{item.title}</h1>
              <p className="mt-2 text-sm text-eldonia-text-muted">
                {creatorName} · {formatDate(item.created_at)}
              </p>
            </div>

            {item.description && (
              <p className="whitespace-pre-wrap eldonia-body text-sm">
                {item.description}
              </p>
            )}

            {item.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-eldonia-gold/20 bg-eldonia-gold/5 px-3 py-1 text-xs text-eldonia-text-muted"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
