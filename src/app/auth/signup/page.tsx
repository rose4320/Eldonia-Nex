import { SignupForm } from "@/components/auth/signup-form";
import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";
import { BrandLogo } from "@/components/ui/brand-logo";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { sanitizeRedirectTo } from "@/lib/auth/redirect";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { getLivePlanCatalog, toSignupPlans } from "@/lib/plans/live-catalog";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env";

type SignupPageProps = {
  searchParams: Promise<{ redirect_to?: string; ref?: string; resume?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const params = await searchParams;
  const redirectTo = sanitizeRedirectTo(params.redirect_to);
  const referralCode = params.ref?.trim().toUpperCase() || null;
  const supabaseConfigured = isSupabaseBrowserConfigured();
  const liveCatalog = await getLivePlanCatalog();
  const plans = toSignupPlans(liveCatalog, locale === "en" ? "en" : "ja");

  return (
    <div className="eldonia-page flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="eldonia-auth-panel eldonia-auth-panel-wide">
        <BrandLogo showSubtitle size="sm" />
        <EldoniaDivider />
        {!supabaseConfigured && <SupabaseSetupNotice />}
        <h1 className="eldonia-heading eldonia-heading-sm mt-6">{t.auth.signupTitle}</h1>
        <p className="eldonia-body mt-2 text-sm">{t.auth.signupLead}</p>
        <div className="mt-8 flex justify-center">
          <SignupForm
            redirectTo={redirectTo}
            supabaseConfigured={supabaseConfigured}
            referralCode={referralCode}
            resume={params.resume === "1"}
            plans={plans}
          />
        </div>
      </div>
    </div>
  );
}
