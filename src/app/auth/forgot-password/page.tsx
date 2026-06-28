import Link from "next/link";
import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";
import { BrandLogo } from "@/components/ui/brand-logo";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export default async function ForgotPasswordPage() {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const supabaseConfigured = isSupabaseConfigured();

  if (supabaseConfigured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect("/settings");
    }
  }

  return (
    <div className="eldonia-page flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="eldonia-auth-panel">
        <BrandLogo showSubtitle size="sm" />
        <EldoniaDivider />
        {!supabaseConfigured && <SupabaseSetupNotice />}
        <h1 className="eldonia-heading eldonia-heading-sm mt-6">{t.auth.forgotPasswordTitle}</h1>
        <p className="eldonia-body mt-2 text-sm">{t.auth.forgotPasswordLead}</p>
        <div className="mt-8 flex justify-center">
          <ForgotPasswordForm supabaseConfigured={supabaseConfigured} />
        </div>
        <p className="mt-6 text-center text-sm text-eldonia-text-muted">
          <Link href="/auth/login" className="eldonia-link font-medium">
            {t.auth.backToLogin}
          </Link>
        </p>
      </div>
    </div>
  );
}
