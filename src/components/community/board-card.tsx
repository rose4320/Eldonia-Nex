import Link from "next/link";
import { getBoardDescription, getBoardName } from "@/lib/community/board-labels";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import type { CommunityBoard } from "@/types/database";

type BoardCardProps = { board: CommunityBoard };

export async function BoardCard({ board }: BoardCardProps) {
  const locale = await getUiLocale();
  const name = getBoardName(board.slug, locale, board.name);
  const description = getBoardDescription(board.slug, locale, board.description);

  return (
    <Link href={`/community/b/${board.slug}`} className="eldonia-board-card group">
      <p className="eldonia-eyebrow">{board.slug}</p>
      <h2 className="mt-2 font-display text-lg text-[var(--eldonia-gold-light)] group-hover:text-[var(--eldonia-gold)]">
        {name}
      </h2>
      <p className="eldonia-body mt-2 line-clamp-2 text-sm">{description}</p>
    </Link>
  );
}
