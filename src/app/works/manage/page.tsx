import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QuestCreateForm } from "@/components/works/quest-create-form";
import { WorksToolbar } from "@/components/works/works-toolbar";
import { formatQuestReward, questKindLabel } from "@/lib/quests/constants";
import { getQuestListings } from "@/lib/quests/get-quests";
import { isQuestAdmin } from "@/lib/quests/is-quest-admin";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

export default async function WorksManagePage() {
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect_to=/works/manage");
  }

  if (!(await isQuestAdmin(user.id))) {
    redirect("/works?error=quest_admin_forbidden");
  }

  const quests = await getQuestListings({}, locale);

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <WorksToolbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
        <Link href="/works" className="eldonia-link text-sm">
          {pages.works.back}
        </Link>
        <h1 className="eldonia-heading eldonia-heading-lg mt-4">{pages.works.manageTitle}</h1>
        <p className="eldonia-body mt-2 text-sm">{pages.works.manageLead}</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_1fr]">
          <QuestCreateForm />
          <section className="eldonia-card space-y-4">
            <h2 className="font-display text-lg text-[var(--eldonia-gold-light)]">
              {pages.works.questPublishedTitle}
            </h2>
            <ul className="space-y-3">
              {quests.map((quest) => (
                <li
                  key={quest.id}
                  className="rounded-lg border border-[var(--eldonia-border)] p-4"
                >
                  <Link href={`/works/${quest.id}`} className="eldonia-link font-display">
                    {quest.title}
                  </Link>
                  <p className="mt-1 text-xs text-[var(--eldonia-text-dim)]">
                    {questKindLabel(quest.kind, locale)} · {formatQuestReward(quest.exp_reward, locale)} ·{" "}
                    {quest.status}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
