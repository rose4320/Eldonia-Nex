import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";
import { BrandLogo } from "@/components/ui/brand-logo";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { sanitizeRedirectTo, resolvePostLoginPath } from "@/lib/auth/redirect";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { LOCALE_COOKIE, parseUiLocale } from "@/lib/i18n/locale";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{ redirect_to?: string; error?: string; detail?: string; locale?: string }>;
};

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  if (params.locale) {
    const cookieStore = await cookies();
    cookieStore.set(LOCALE_COOKIE, parseUiLocale(params.locale), {
      path: "/",
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
    });
  }

  const locale = await getUiLocale();
  const t = getContent(locale);
  const redirectTo = sanitizeRedirectTo(params.redirect_to);
  const supabaseConfigured = isSupabaseConfigured();

  if (supabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect(resolvePostLoginPath(params.redirect_to));
    }
  }

  return (
    <div className="eldonia-page flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="eldonia-auth-panel">
        <BrandLogo showSubtitle size="sm" />
        <EldoniaDivider />
        {!supabaseConfigured && <SupabaseSetupNotice />}
        <h1 className="eldonia-heading eldonia-heading-sm mt-6">{t.auth.loginTitle}</h1>
        <p className="eldonia-body mt-2 text-sm">{t.auth.loginLead}</p>
        <div className="mt-8 flex justify-center">
          <LoginForm
            redirectTo={redirectTo}
            supabaseConfigured={supabaseConfigured}
            initialError={
              params.error === "auth_callback_failed" ? t.auth.authCallbackFailed : null
            }
          />
        </div>
      </div>
    </div>
  );
}
