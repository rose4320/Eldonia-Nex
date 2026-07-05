import Link from "next/link";
import { formatQuestReward, questKindLabel } from "@/lib/quests/constants";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { localizeQuest } from "@/lib/quests/quest-content-i18n";
import type { Quest } from "@/types/database";

type QuestCardProps = { quest: Quest };

export async function QuestCard({ quest }: QuestCardProps) {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const localized = localizeQuest(quest, locale);

  return (
    <Link href={`/works/${quest.id}`} className="eldonia-job-card group">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          {quest.is_featured && (
            <span className="eldonia-badge-bestseller mb-2 inline-block">
              {pages.works.badgeFeatured}
            </span>
          )}
          <h2 className="font-display text-lg text-eldonia-gold-light group-hover:text-eldonia-gold">
            {localized.title}
          </h2>
        </div>
        <span className="eldonia-badge-nexus-prime">{questKindLabel(quest.kind, locale)}</span>
      </div>
      <p className="eldonia-body mt-3 line-clamp-2 text-sm">{localized.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="font-display text-eldonia-gold">
          {formatQuestReward(quest.exp_reward, locale)}
        </span>
        {localized.prizeSummary && (
          <span className="text-eldonia-text-muted">🎁 {localized.prizeSummary}</span>
        )}
      </div>
    </Link>
  );
}
