import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QuestCard } from "@/components/works/quest-card";
import { LpCard } from "@/components/ui/lp-card";
import { LpReveal } from "@/components/ui/lp-reveal";
import { LpSectionRule } from "@/components/ui/lp-section-rule";
import { LpSectionTitle } from "@/components/ui/lp-section-title";
import { getTopUsers } from "@/lib/home/get-top-users";
import { getTopPublicArtworks } from "@/lib/gallery/get-public-artworks";
import { getQuestListings, getUserQuestHistory } from "@/lib/quests/get-quests";
import { getUnreadNotificationCount } from "@/lib/notifications/get-notifications";
import { getPortfolioForUser } from "@/lib/works/get-works";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

import { getContent } from "@/lib/i18n/content/messages";
import { getHomeAuthenticated } from "@/lib/i18n/content/home-authenticated-messages";
import { getArtworkListTranslations } from "@/lib/translation/list-translations";
import { TranslatedContentLine } from "@/components/i18n/content-line";
import { inferSourceLocale } from "@/lib/translation/infer-source-locale";

export async function generateMetadata() {
  const locale = await getUiLocale();
  const home = getHomeAuthenticated(locale);
  return {
    title: home.metaTitle,
    description: home.metaDescription,
  };
}

export default async function HomePage() {
  const locale = await getUiLocale();
  const copy = getHomeAuthenticated(locale);

  // 未ログインはマーケ LP へ（/ はログイン後ホーム）
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/lp");
  }

  const [profileRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("display_name, username, avatar_url")
      .eq("id", user.id)
      .maybeSingle(),
  ]);
  const profile = profileRes.data;
  const displayName =
    profile?.display_name ?? profile?.username ?? user.email?.split("@")[0] ?? getContent(locale).pages.creatorFallback;

  const artworksPromise = getTopPublicArtworks(6);
  const [quests, topUsers, artworks, portfolio, questHistory, unreadCount, artworkTranslations] =
    await Promise.all([
      getQuestListings({}, locale),
      getTopUsers(6),
      artworksPromise,
      getPortfolioForUser(user.id, { useSampleFallback: false }),
      getUserQuestHistory(user.id),
      getUnreadNotificationCount(user.id),
      artworksPromise.then((items) =>
        getArtworkListTranslations(items, locale, { warmLimit: 6, liveLimit: 12 }),
      ),
    ]);

  const featuredQuests = quests.slice(0, 6);
  const activeQuests = questHistory
    .filter(
      (entry) =>
        entry.quests && (entry.status === "joined" || entry.status === "submitted"),
    )
    .slice(0, 3);
  const expPoints = portfolio?.exp_points ?? 0;
  const level = portfolio?.level ?? 1;
  const titleBadge = portfolio?.title_badge ?? null;
  const avatarUrl = profile?.avatar_url ?? null;
  const pages = getContent(locale).pages;

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        {/* Personal dashboard band */}
        <section className="lp-home-hero">
          <Image
            src="/aset/lp/hero.png?v=0.6.0"
            alt=""
            fill
            priority
            sizes="(max-width: 1240px) 100vw, 1240px"
            className="lp-home-hero__bg"
          />
          <div className="lp-home-hero__scrim" aria-hidden />
          <span className="lp-home-corner lp-home-corner--tl" aria-hidden />
          <span className="lp-home-corner lp-home-corner--tr" aria-hidden />
          <span className="lp-home-corner lp-home-corner--bl" aria-hidden />
          <span className="lp-home-corner lp-home-corner--br" aria-hidden />

          <div className="lp-home-hero__body">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d6a84f]/50 bg-[#060b14]">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="font-display text-xl text-[#f0c978]">
                    {displayName.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </span>
              <div>
                <h1 className="font-display text-2xl font-bold tracking-wide text-[#f8f1df] drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)] sm:text-3xl">
                  {copy.greeting(displayName)}
                </h1>
                <p className="mt-1 text-sm text-[#e5d4ad]">{copy.greetingLead}</p>
              </div>
            </div>

            {/* EXP / Level */}
            <div className="mt-6 max-w-xl">
              <div className="flex items-center justify-between text-sm">
                <span className="font-display text-[#f0c978]">
                  {copy.levelLabel}
                  {level}
                  {titleBadge ? ` · ${titleBadge}` : ""}
                </span>
                <span className="text-[#d8c8a8]">
                  {expPoints.toLocaleString()} {copy.expLabel}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full border border-[#d6a84f]/25 bg-[#060b14]">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#d6a84f] to-[#f0c978]"
                  style={{ width: `${Math.min(100, expPoints % 100)}%` }}
                />
              </div>
            </div>

            {/* Quick actions */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Link
                href="/gallery/upload"
                className="inline-flex items-center justify-center rounded-md border border-[#d6a84f]/80 bg-linear-to-b from-[#f0c978] to-[#d6a84f] px-4 py-2.5 font-display text-xs font-semibold tracking-[0.12em] text-[#1a1208] transition hover:from-[#f8dfaa] hover:to-[#e0b868]"
              >
                {copy.quickPost}
              </Link>
              <Link
                href="/works"
                className="inline-flex items-center justify-center rounded-md border border-[#d6a84f]/60 px-4 py-2.5 font-display text-xs font-semibold tracking-[0.12em] text-[#f8f1df] transition hover:border-[#d6a84f] hover:bg-[#d6a84f]/10"
              >
                {copy.quickQuest}
              </Link>
              <Link
                href="/lab"
                className="inline-flex items-center justify-center rounded-md border border-[#d6a84f]/60 px-4 py-2.5 font-display text-xs font-semibold tracking-[0.12em] text-[#f8f1df] transition hover:border-[#d6a84f] hover:bg-[#d6a84f]/10"
              >
                {copy.quickLab}
              </Link>
              <Link
                href="/settings"
                className="inline-flex items-center justify-center rounded-md border border-[#d6a84f]/60 px-4 py-2.5 font-display text-xs font-semibold tracking-[0.12em] text-[#f8f1df] transition hover:border-[#d6a84f] hover:bg-[#d6a84f]/10"
              >
                {copy.quickSettings}
              </Link>
            </div>

            {/* Personal stats */}
            <dl className="mt-6 grid max-w-md grid-cols-2 gap-2.5">
              <Link href="/works/portfolio" className="lp-home-stat block transition hover:border-[#d6a84f]/60">
                <dt className="text-[0.6rem] uppercase tracking-wider text-[#9e927d]">
                  {copy.statInProgress}
                </dt>
                <dd className="mt-1 font-display text-lg text-[#f0c978]">{activeQuests.length}</dd>
              </Link>
              <div className="lp-home-stat">
                <dt className="text-[0.6rem] uppercase tracking-wider text-[#9e927d]">
                  {copy.statUnread}
                </dt>
                <dd className="mt-1 font-display text-lg text-[#f0c978]">{unreadCount}</dd>
              </div>
            </dl>
          </div>
        </section>

        {activeQuests.length > 0 && (
          <>
            <LpReveal>
              <LpSectionRule className="mx-auto my-2 max-w-4xl" variant="compact" />
            </LpReveal>
            <LpReveal as="section" id="my-quests" className="scroll-mt-24">
              <LpSectionTitle className="mb-6">{copy.inProgressTitle}</LpSectionTitle>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activeQuests.map(
                  (entry) => entry.quests && <QuestCard key={entry.id} quest={entry.quests} />,
                )}
              </div>
            </LpReveal>
          </>
        )}

        <LpReveal>
          <LpSectionRule className="mx-auto my-2 max-w-4xl" variant="flourish" />
        </LpReveal>

        {/* Quests */}
        <LpReveal as="section" id="quests" className="scroll-mt-24">
          <LpSectionTitle className="mb-3">{copy.questsTitle}</LpSectionTitle>
          <p className="mb-8 text-center text-sm leading-7 text-[#9e927d]">
            {copy.questsLead}
          </p>

          {featuredQuests.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredQuests.map((quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-[#9e927d]">{copy.questsEmpty}</p>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/works"
              className="font-display text-sm tracking-wide text-[#d6a84f] hover:text-[#f0c978]"
            >
              {copy.questsMore} →
            </Link>
          </div>
        </LpReveal>

        <LpReveal>
          <LpSectionRule className="mx-auto my-2 max-w-4xl" variant="seal" />
        </LpReveal>

        {/* Top users */}
        <LpReveal as="section" id="top-users" className="scroll-mt-24">
          <LpSectionTitle className="mb-3">{copy.usersTitle}</LpSectionTitle>
          <p className="mb-8 text-center text-sm leading-7 text-[#9e927d]">
            {copy.usersLead}
          </p>

          {topUsers.length > 0 ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {topUsers.map((user, index) => (
                <li key={user.userId}>
                  <LpCard hover className="flex items-center gap-4 p-4">
                    <span
                      className={
                        index < 3
                          ? `lp-home-rank-badge lp-home-rank-badge--${index + 1}`
                          : "lp-home-rank-badge border border-[#d6a84f]/35 text-[#d6a84f]"
                      }
                    >
                      {index + 1}
                    </span>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d6a84f]/35 bg-[#060b14]">
                      {user.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.avatarUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="font-display text-sm text-[#f0c978]">
                          {user.displayName.slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-display text-[#f8f1df]">
                        {user.displayName}
                      </span>
                      <span className="block text-xs text-[#9e927d]">
                        {user.titleBadge ? `${user.titleBadge} · ` : ""}
                        {user.expPoints.toLocaleString()} {copy.expSuffix}
                      </span>
                    </span>
                  </LpCard>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-sm text-[#9e927d]">{copy.usersEmpty}</p>
          )}
        </LpReveal>

        <LpReveal>
          <LpSectionRule className="mx-auto my-2 max-w-4xl" variant="ornate" />
        </LpReveal>

        {/* Recommendations */}
        <LpReveal as="section" id="recommended" className="scroll-mt-24">
          <LpSectionTitle className="mb-3">{copy.recTitle}</LpSectionTitle>
          <p className="mb-8 text-center text-sm leading-7 text-[#9e927d]">{copy.recLead}</p>

          {artworks.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {artworks.map((art) => (
                <Link key={art.id} href={`/gallery/${art.id}`} className="group">
                  <LpCard hover className="h-full overflow-hidden p-0">
                    <div className="relative aspect-4/3 overflow-hidden bg-[#060b14]">
                      {art.thumbnail_url || art.media_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={art.thumbnail_url ?? art.media_url}
                          alt=""
                          className="lp-module-icon h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <TranslatedContentLine
                        text={art.title}
                        translatedText={artworkTranslations[art.id]?.title}
                        sourceLocale={inferSourceLocale(art.title)}
                        locale={locale}
                        as="p"
                        className="truncate font-display text-sm text-[#f8f1df] group-hover:text-[#f0c978]"
                        hintClassName="eldonia-localized-hint text-[10px] truncate"
                      />
                      <p className="mt-1 truncate text-xs text-[#9e927d]">
                        {art.profiles?.display_name ?? art.profiles?.username ?? pages.creatorFallback}
                      </p>
                    </div>
                  </LpCard>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-[#9e927d]">{copy.recEmpty}</p>
          )}
        </LpReveal>

        <LpReveal>
          <LpSectionRule className="mx-auto my-2 max-w-4xl" variant="compact" />
        </LpReveal>

        {/* World intro */}
        <LpReveal as="section" id="world" className="scroll-mt-24">
          <div className="lp-home-panel overflow-hidden rounded-2xl border border-[#d6a84f]/25">
            <span className="lp-home-corner lp-home-corner--tl" aria-hidden />
            <span className="lp-home-corner lp-home-corner--tr" aria-hidden />
            <span className="lp-home-corner lp-home-corner--bl" aria-hidden />
            <span className="lp-home-corner lp-home-corner--br" aria-hidden />
            <div className="grid lg:grid-cols-2">
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                <p className="eldonia-eyebrow">{copy.worldEyebrow}</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-wide text-[#f8f1df] sm:text-3xl">
                  {copy.worldTitle}
                </h2>
                <p className="mt-4 text-sm leading-7 text-[#d8c8a8]">{copy.worldBody}</p>
              </div>
              <div className="relative min-h-[220px] overflow-hidden lg:min-h-[300px]">
                <Image
                  src="/aset/lp/world.png?v=0.6.0"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-linear-to-r from-[#020817] via-[#020817]/35 to-transparent"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-linear-to-r from-[#020817] to-transparent"
                  aria-hidden
                />
              </div>
            </div>
          </div>
        </LpReveal>

        <LpReveal>
          <LpSectionRule className="mx-auto my-2 max-w-4xl" variant="ornate" />
        </LpReveal>

        {/* Vision */}
        <LpReveal as="section" id="vision" className="scroll-mt-24">
          <LpSectionTitle className="mb-3">{copy.visionTitle}</LpSectionTitle>
          <p className="mb-8 text-center text-sm leading-7 text-[#9e927d]">
            {copy.visionLead}
          </p>

          <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,300px)_1fr]">
            <div className="relative mx-auto aspect-square w-full max-w-[260px]">
              <div className="lp-globe-figure relative h-full w-full">
                <Image
                  src="/aset/lp/globe.png?v=0.6.0"
                  alt=""
                  fill
                  sizes="260px"
                  className="object-cover"
                />
              </div>
            </div>

            <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {copy.visionPillars.map((pillar) => (
                <li key={pillar.title}>
                  <LpCard className="h-full p-5">
                    <p className="font-display text-base font-semibold tracking-wider text-[#f0c978]">
                      {pillar.title}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-[#d8c8a8]">{pillar.body}</p>
                  </LpCard>
                </li>
              ))}
            </ul>
          </div>
        </LpReveal>

        <LpReveal>
          <LpSectionRule className="mx-auto my-2 max-w-4xl" variant="simple" />
        </LpReveal>

        {/* Modules showcase */}
        <LpReveal as="section" id="modules" className="scroll-mt-24">
          <LpSectionTitle className="mb-3">{copy.modulesTitle}</LpSectionTitle>
          <p className="mb-8 text-center text-sm leading-7 text-[#9e927d]">
            {copy.modulesLead}
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.modules.map((mod) => (
              <Link key={mod.key} href={mod.href} className="group">
                <LpCard hover className="flex h-full items-start gap-4 p-5">
                  <Image
                    src={`${mod.icon}?v=0.6.0`}
                    alt=""
                    width={160}
                    height={160}
                    className="lp-module-icon h-20 w-20 shrink-0 object-contain"
                  />
                  <span className="min-w-0">
                    <span className="font-display text-lg font-semibold tracking-wider text-[#f0c978] group-hover:text-[#f8dfaa]">
                      {mod.name}
                    </span>
                    <span className="mt-1.5 block text-sm leading-6 text-[#e5d8bd]">
                      {mod.desc}
                    </span>
                  </span>
                </LpCard>
              </Link>
            ))}
          </div>
        </LpReveal>

        <LpReveal>
          <LpSectionRule className="mx-auto my-2 max-w-4xl" variant="ornate" />
        </LpReveal>

        {/* Contributors — pin badge thank-you (always visible; no LpReveal fade) */}
        <section id="contributors" className="scroll-mt-24">
          <div className="lp-home-panel overflow-hidden rounded-2xl border border-[#d6a84f]/30">
            <span className="lp-home-corner lp-home-corner--tl" aria-hidden />
            <span className="lp-home-corner lp-home-corner--tr" aria-hidden />
            <span className="lp-home-corner lp-home-corner--bl" aria-hidden />
            <span className="lp-home-corner lp-home-corner--br" aria-hidden />
            <div className="grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,220px)_1fr] lg:p-10">
              <div className="mx-auto lg:mx-0">
                <Image
                  src="/aset/lp/pin-badge.png?v=0.6.0"
                  alt={copy.contributorPinAlt}
                  width={200}
                  height={200}
                  className="h-auto w-40 sm:w-48"
                />
              </div>
              <div>
                <p className="eldonia-eyebrow">{copy.contributorEyebrow}</p>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-wide text-[#f8f1df] sm:text-3xl">
                  {copy.contributorTitle}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#d8c8a8]">{copy.contributorLead}</p>
                <p className="mt-2 text-xs leading-6 text-[#9e927d]">{copy.contributorBody}</p>

                <ul className="mt-4 grid gap-2">
                  {copy.contributorPerks.map((perk) => (
                    <li
                      key={perk}
                      className="flex items-start gap-2 text-xs leading-6 text-[#d8c8a8] sm:text-sm"
                    >
                      <span className="mt-0.5 shrink-0 text-[#d6a84f]" aria-hidden>
                        ✦
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <Link
                    href="/contributors"
                    className="inline-flex items-center justify-center rounded-md border border-[#d6a84f]/55 bg-linear-to-b from-[#d6a84f]/90 to-[#9a7328]/90 px-5 py-2.5 font-display text-xs font-semibold tracking-[0.14em] text-[#1a1208] transition hover:from-[#e0bc6a] hover:to-[#b08938] sm:text-sm"
                  >
                    {copy.contributorCta} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

