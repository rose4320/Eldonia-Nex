import Link from "next/link";
import { ContentLine } from "@/components/i18n/content-line";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import type { CommunityBoard } from "@/types/database";

type BoardCardProps = { board: CommunityBoard };

export async function BoardCard({ board }: BoardCardProps) {
  const locale = await getUiLocale();

  return (
    <Link href={`/community/b/${board.slug}`} className="eldonia-board-card group">
      <p className="eldonia-eyebrow">{board.slug}</p>
      <ContentLine
        text={board.name}
        locale={locale}
        as="h2"
        className="mt-2 font-display text-lg text-[var(--eldonia-gold-light)] group-hover:text-[var(--eldonia-gold)]"
        hintClassName="eldonia-localized-hint text-xs"
      />
      <ContentLine
        text={board.description ?? ""}
        locale={locale}
        as="p"
        className="eldonia-body mt-2 text-sm"
        hintClassName="eldonia-localized-hint text-xs line-clamp-2"
      />
    </Link>
  );
}
