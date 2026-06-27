import { formatQuestReward, questKindLabel } from "@/lib/quests/constants";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import type { QuestParticipationWithQuest } from "@/types/database";

type QuestHistoryProps = {
  entries: QuestParticipationWithQuest[];
};

export async function QuestHistory({ entries }: QuestHistoryProps) {
  const locale = await getUiLocale();
  const copy = getContent(locale).pages.works;

  if (entries.length === 0) {
    return (
      <section className="eldonia-card mt-8">
        <h2 className="font-display text-lg text-[var(--eldonia-gold-light)]">
          {copy.questHistoryTitle}
        </h2>
        <p className="eldonia-body mt-2 text-sm">{copy.questHistoryEmpty}</p>
      </section>
    );
  }

  return (
    <section className="eldonia-card mt-8 space-y-4">
      <h2 className="font-display text-lg text-[var(--eldonia-gold-light)]">
        {copy.questHistoryTitle}
      </h2>
      <ul className="space-y-3">
        {entries.map((entry) => {
          const quest = entry.quests;
          return (
            <li
              key={entry.id}
              className="rounded-lg border border-[var(--eldonia-border)] p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <strong className="text-[var(--eldonia-gold-light)]">
                  {quest?.title ?? copy.questHistoryUnknown}
                </strong>
                {quest && (
                  <span className="eldonia-badge-nexus-prime text-[0.65rem]">
                    {questKindLabel(quest.kind, locale)}
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-[var(--eldonia-text-dim)]">
                {new Date(entry.created_at).toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US")}
                {" · "}
                {entry.status}
                {entry.exp_awarded > 0 && ` · ${formatQuestReward(entry.exp_awarded, locale)}`}
              </p>
              {entry.submission_url && (
                <a
                  href={entry.submission_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eldonia-link mt-2 inline-block text-xs"
                >
                  {copy.questSubmissionLink}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
