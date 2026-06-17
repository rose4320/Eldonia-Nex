import { redirect } from "next/navigation";
import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ExpBar } from "@/components/settings/exp-bar";
import { SettingsBasicsForm } from "@/components/settings/settings-basics-form";
import { SettingsFinance } from "@/components/settings/settings-finance";
import { SettingsNav } from "@/components/settings/settings-nav";
import { SettingsNotificationPrefs } from "@/components/settings/settings-notification-prefs";
import { SettingsNotifications } from "@/components/settings/settings-notifications";
import { SettingsPortfolioSummary } from "@/components/settings/settings-portfolio-summary";
import { SettingsPostHub } from "@/components/settings/settings-post-hub";
import { SettingsRecommendations } from "@/components/settings/settings-recommendations";
import { SettingsReferralCard } from "@/components/settings/settings-referral-card";
import { UserAvatarLink } from "@/components/settings/user-avatar-link";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { getSettingsHubData, mergeUserSettings } from "@/lib/settings/get-settings-data";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { getReferralProgramData } from "@/lib/referrals/get-referral-program";
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
  const expPoints = data.portfolio?.exp_points ?? 0;
  const titleBadge = data.portfolio?.title_badge ?? null;
  const settings = mergeUserSettings(user.id, data.userSettings);

  return (
    <div className="eldonia-page">
      <SiteHeader />

      <main className="eldonia-main">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <SettingsNav />

          <div className="min-w-0 flex-1 space-y-10">
            <section className="eldonia-card">
              <div className="flex flex-wrap items-center gap-4">
                <UserAvatarLink
                  displayName={
                    data.profile.display_name ??
                    data.profile.username ??
                    t.pages.userFallback
                  }
                  avatarUrl={data.profile.avatar_url}
                />
                <div className="flex-1">
                  <p className="eldonia-eyebrow">Settings</p>
                  <h1 className="eldonia-heading eldonia-heading-sm">{t.settings.heading}</h1>
                  <p className="eldonia-body mt-1 text-sm">{t.settings.lead}</p>
                </div>
              </div>
              <div className="mt-6">
                <ExpBar expPoints={expPoints} titleBadge={titleBadge} />
              </div>
            </section>

            <SettingsRecommendations items={data.recommendations} />
            <EldoniaDivider />

            <section id="basics" className="scroll-mt-24 space-y-4">
              <h2 className="eldonia-eyebrow">{t.pages.settings.sectionBasics}</h2>
              <div className="eldonia-card">
                <SettingsBasicsForm
                  userId={user.id}
                  email={user.email ?? null}
                  profile={data.profile}
                  settings={settings}
                />
              </div>
            </section>

            <SettingsPostHub />
            <SettingsReferralCard referral={referral} />
            <SettingsPortfolioSummary portfolio={data.portfolio} />
            <SettingsFinance finance={data.finance} />
            <SettingsNotificationPrefs userId={user.id} settings={settings} />
            <SettingsNotifications notifications={data.notifications} userId={user.id} />
          </div>
        </div>

        <p className="eldonia-hint mt-8 text-center text-xs">
          <Link href="/" className="eldonia-link">
            {t.pages.settings.backHome}
          </Link>
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
