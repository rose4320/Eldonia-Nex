import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";
import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";
import { BrandLogo } from "@/components/ui/brand-logo";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { resolvePostLoginPath, sanitizeRedirectTo } from "@/lib/auth/redirect";
import { hasCompletedOnboarding } from "@/lib/onboarding/status";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { isSupabaseBrowserConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type SignupPageProps = {
  searchParams: Promise<{ redirect_to?: string; ref?: string; resume?: string }>;
};

function SignupFormFallback() {
  return (
    <div className="flex w-full max-w-3xl justify-center py-8 text-sm text-eldonia-text-muted">
      読み込み中…
    </div>
  );
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const params = await searchParams;
  const redirectTo = sanitizeRedirectTo(params.redirect_to);
  const referralCode = params.ref?.trim().toUpperCase() || null;
  const supabaseConfigured = isSupabaseBrowserConfigured();

  if (supabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user && params.resume !== "1") {
      const completed = await hasCompletedOnboarding(supabase, user.id);
      if (completed) {
        redirect(resolvePostLoginPath(params.redirect_to));
      }
    }
  }

  return (
    <div className="eldonia-page flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="eldonia-auth-panel eldonia-auth-panel-wide">
        <BrandLogo showSubtitle size="sm" />
        <EldoniaDivider />
        {!supabaseConfigured && <SupabaseSetupNotice />}
        <h1 className="eldonia-heading eldonia-heading-sm mt-6">{t.auth.signupTitle}</h1>
        <p className="eldonia-body mt-2 text-sm">{t.auth.signupLead}</p>
        <div className="mt-8 flex justify-center">
          <Suspense fallback={<SignupFormFallback />}>
            <SignupForm
              redirectTo={redirectTo}
              supabaseConfigured={supabaseConfigured}
              referralCode={referralCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
