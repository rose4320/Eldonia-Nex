import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";
import { BrandLogo } from "@/components/ui/brand-logo";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { sanitizeRedirectTo, resolvePostLoginPath } from "@/lib/auth/redirect";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

type LoginPageProps = {
  searchParams: Promise<{ redirect_to?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const params = await searchParams;
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
          <LoginForm redirectTo={redirectTo} supabaseConfigured={supabaseConfigured} />
        </div>
      </div>
    </div>
  );
}
