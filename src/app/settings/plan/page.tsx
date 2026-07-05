import { redirect } from "next/navigation";
import Link from "next/link";
import { PageIntro } from "@/components/layout/page-intro";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SettingsNav } from "@/components/settings/settings-nav";
import { SettingsPlanChange } from "@/components/settings/settings-plan-change";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { PAGE_ICONS } from "@/lib/layout/module-icons";
import { ensureProfile } from "@/lib/auth/ensure-profile";
import { getSettingsHubData } from "@/lib/settings/get-settings-data";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPlanPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect_to=/settings/plan");
  }

  const profile = await ensureProfile(user);
  const data = await getSettingsHubData(user.id, profile);
  const checkoutMessage =
    params.checkout === "success"
      ? t.settingsUi.plan.checkoutSuccess
      : params.checkout === "cancelled"
        ? t.settingsUi.plan.checkoutCancelled
        : null;

  return (
    <div className="lp-page flex min-h-screen flex-col text-[#f8f1df]">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <PageIntro
          eyebrow={t.settingsUi.plan.eyebrow}
          title={t.settingsUi.plan.title}
          lead={t.settingsUi.plan.lead}
          iconSrc={PAGE_ICONS.settings}
        />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <SettingsNav />

          <div className="min-w-0 flex-1 space-y-6">
            <div className="eldonia-card">
              {checkoutMessage && (
                <p className="eldonia-alert-success mb-4">{checkoutMessage}</p>
              )}
              <SettingsPlanChange
                currentPlan={data.plan.plan}
                paymentStatus={data.plan.paymentStatus}
              />
            </div>

            <p className="eldonia-hint text-center text-xs">
              <Link href="/settings#basics" className="eldonia-link">
                {t.settingsUi.plan.backToBasics}
              </Link>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
