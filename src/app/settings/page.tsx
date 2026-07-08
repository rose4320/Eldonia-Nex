import { redirect } from "next/navigation";
import Link from "next/link";
import { PageIntro } from "@/components/layout/page-intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ExpBar } from "@/components/settings/exp-bar";
import { SettingsArtworkManagement } from "@/components/settings/settings-artwork-management";
import { SettingsBasicsCollapsible } from "@/components/settings/settings-basics-collapsible";
import { SettingsBasicsForm } from "@/components/settings/settings-basics-form";
import { SettingsFinance } from "@/components/settings/settings-finance";
import { SettingsNav } from "@/components/settings/settings-nav";
import { SettingsNotificationPrefs } from "@/components/settings/settings-notification-prefs";
import { SettingsNotifications } from "@/components/settings/settings-notifications";
import { SettingsPortfolioSummary } from "@/components/settings/settings-portfolio-summary";
import { SettingsPostHub } from "@/components/settings/settings-post-hub";
import { SettingsRecommendations } from "@/components/settings/settings-recommendations";
import { SettingsReferralCard } from "@/components/settings/settings-referral-card";
import { LpReveal } from "@/components/ui/lp-reveal";
import { LpSectionRule } from "@/components/ui/lp-section-rule";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { PAGE_ICONS } from "@/lib/layout/module-icons";
import { getSettingsHubData, mergeUserSettings } from "@/lib/settings/get-settings-data";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { getReferralProgramData } from "@/lib/referrals/get-referral-program";
import { getUserArtworks } from "@/lib/gallery/get-user-artworks";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect_to=/settings");
  }

  const profile = await ensureProfile(user);
  const data = await getSettingsHubData(user.id, profile);
  const referral = await getReferralProgramData(user.id, user.email, data.profile.username);
  const userArtworks = await getUserArtworks(user.id);
  const expPoints = data.portfolio?.exp_points ?? 0;
  const titleBadge = data.portfolio?.title_badge ?? null;
  const settings = mergeUserSettings(user.id, data.userSettings);

  const displayName =
    data.profile.display_name ?? data.profile.username ?? t.pages.userFallback;
  const avatarUrl = data.profile.avatar_url;
  const initial = displayName.slice(0, 1).toUpperCase();

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* Hero band */}
        <section className="lp-home-hero">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/aset/lp/hero.png?v=0.6.0" alt="" className="lp-home-hero__bg" />
          <div className="lp-home-hero__scrim" aria-hidden />
          <span className="lp-home-corner lp-home-corner--tl" aria-hidden />
          <span className="lp-home-corner lp-home-corner--tr" aria-hidden />
          <span className="lp-home-corner lp-home-corner--bl" aria-hidden />
          <span className="lp-home-corner lp-home-corner--br" aria-hidden />

          <div className="lp-home-hero__body">
            <PageIntro
              eyebrow="SETTINGS"
              title={displayName}
              lead={t.settings.lead}
              iconSrc={PAGE_ICONS.settings}
              action={
                <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d6a84f]/50 bg-[#060b14]">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-display text-2xl text-[#f0c978]">{initial}</span>
                  )}
                </span>
              }
            />

            <div className="mt-6 max-w-xl">
              <ExpBar expPoints={expPoints} titleBadge={titleBadge} />
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <SettingsNav />

          <div className="min-w-0 flex-1 space-y-8">
            <LpReveal>
              <SettingsRecommendations items={data.recommendations} />
            </LpReveal>

            <LpSectionRule variant="simple" />

            <LpReveal>
              <SettingsBasicsCollapsible>
                <SettingsBasicsForm
                  userId={user.id}
                  email={user.email ?? null}
                  profile={data.profile}
                  settings={settings}
                  currentPlan={data.plan.plan}
                  basicsExpAwarded={data.basicsExpAwarded}
                />
              </SettingsBasicsCollapsible>
            </LpReveal>

            <LpSectionRule variant="simple" />

            <LpReveal>
              <SettingsPostHub />
            </LpReveal>

            <LpSectionRule variant="simple" />

            <LpReveal>
              <SettingsArtworkManagement artworks={userArtworks} />
            </LpReveal>

            <LpReveal>
              <SettingsReferralCard referral={referral} />
            </LpReveal>

            <LpSectionRule variant="simple" />

            <LpReveal>
              <SettingsPortfolioSummary portfolio={data.portfolio} />
            </LpReveal>

            <LpReveal>
              <SettingsFinance finance={data.finance} />
            </LpReveal>

            <LpSectionRule variant="simple" />

            <LpReveal as="section" id="notifications" className="scroll-mt-24 space-y-4">
              <SettingsNotificationPrefs userId={user.id} settings={settings} />
            </LpReveal>

            <LpReveal>
              <SettingsNotifications notifications={data.notifications} userId={user.id} />
            </LpReveal>
          </div>
        </div>

        <p className="eldonia-hint mt-4 text-center text-xs">
          <Link href="/" className="eldonia-link">
            {t.pages.settings.backHome}
          </Link>
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
