import Link from "next/link";
import { ContentLine } from "@/components/i18n/content-line";
import { formatQuestReward, questKindLabel } from "@/lib/quests/constants";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import type { Quest } from "@/types/database";

type QuestCardProps = { quest: Quest };

export async function QuestCard({ quest }: QuestCardProps) {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;

  return (
    <Link href={`/works/${quest.id}`} className="eldonia-job-card group">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          {quest.is_featured && (
            <span className="eldonia-badge-bestseller mb-2 inline-block">
              {pages.works.badgeFeatured}
            </span>
          )}
          <ContentLine
            text={quest.title}
            locale={locale}
            as="h2"
            className="font-display text-lg text-[var(--eldonia-gold-light)] group-hover:text-[var(--eldonia-gold)]"
            hintClassName="eldonia-localized-hint text-xs"
          />
        </div>
        <span className="eldonia-badge-nexus-prime">{questKindLabel(quest.kind, locale)}</span>
      </div>
      <ContentLine
        text={quest.description}
        locale={locale}
        as="p"
        className="eldonia-body mt-3 line-clamp-2 text-sm"
        hintClassName="eldonia-localized-hint text-xs line-clamp-2"
      />
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="font-display text-[var(--eldonia-gold)]">
          {formatQuestReward(quest.exp_reward, locale)}
        </span>
        {quest.prize_summary && (
          <span className="text-[var(--eldonia-text-muted)]">🎁 {quest.prize_summary}</span>
        )}
      </div>
    </Link>
  );
}
