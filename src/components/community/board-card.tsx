import Link from "next/link";
import type { CommunityBoard } from "@/types/database";

type BoardCardProps = { board: CommunityBoard };

export function BoardCard({ board }: BoardCardProps) {
  return (
    <Link href={`/community/b/${board.slug}`} className="eldonia-board-card group">
      <p className="eldonia-eyebrow">{board.slug}</p>
      <h2 className="mt-2 font-display text-lg text-[var(--eldonia-gold-light)] group-hover:text-[var(--eldonia-gold)]">
        {board.name}
      </h2>
      <p className="eldonia-body mt-2 text-sm">{board.description}</p>
    </Link>
  );
}
