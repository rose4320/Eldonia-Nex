import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QuestParticipateForm } from "@/components/works/quest-participate-form";
import { WorksToolbar } from "@/components/works/works-toolbar";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { ContentLine } from "@/components/i18n/content-line";
import { formatQuestReward, questKindLabel } from "@/lib/quests/constants";
import { getQuestById, getQuestParticipation } from "@/lib/quests/get-quests";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

type QuestDetailPageProps = { params: Promise<{ id: string }> };

export default async function QuestDetailPage({ params }: QuestDetailPageProps) {
  const { id } = await params;
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const quest = await getQuestById(id, locale);

  if (!quest) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const participation = user ? await getQuestParticipation(quest.id, user.id) : null;

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <WorksToolbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Link href="/works" className="eldonia-link text-sm">
          {pages.works.back}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <article className="eldonia-card space-y-4">
            {quest.is_featured && (
              <span className="eldonia-badge-bestseller">{pages.works.badgeFeatured}</span>
            )}
            <ContentLine
              text={quest.title}
              locale={locale}
              as="h1"
              className="eldonia-heading eldonia-heading-sm"
              hintClassName="eldonia-localized-hint text-sm"
            />
            <div className="my-4">
              <EldoniaDivider />
            </div>
            <ContentLine
              text={quest.description}
              locale={locale}
              as="p"
              className="eldonia-body whitespace-pre-wrap text-sm"
              hintClassName="eldonia-localized-hint text-xs"
            />
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-[var(--eldonia-text-dim)]">{pages.works.labelType}</dt>
                <dd>{questKindLabel(quest.kind, locale)}</dd>
              </div>
              <div>
                <dt className="text-[var(--eldonia-text-dim)]">{pages.works.labelExp}</dt>
                <dd>{formatQuestReward(quest.exp_reward, locale)}</dd>
              </div>
              {quest.prize_summary && (
                <div className="sm:col-span-2">
                  <dt className="text-[var(--eldonia-text-dim)]">{pages.works.labelPrize}</dt>
                  <dd>{quest.prize_summary}</dd>
                </div>
              )}
            </dl>
          </article>

          <QuestParticipateForm
            quest={quest}
            participation={participation}
            isLoggedIn={!!user}
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
