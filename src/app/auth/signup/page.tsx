import { SignupForm } from "@/components/auth/signup-form";
import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";
import { BrandLogo } from "@/components/ui/brand-logo";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { sanitizeRedirectTo } from "@/lib/auth/redirect";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type SignupPageProps = {
  searchParams: Promise<{ redirect_to?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;
  const redirectTo = sanitizeRedirectTo(params.redirect_to);
  const supabaseConfigured = isSupabaseConfigured();

  return (
    <div className="eldonia-page flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="eldonia-auth-panel">
        <BrandLogo showSubtitle size="sm" />
        <EldoniaDivider />
        {!supabaseConfigured && <SupabaseSetupNotice />}
        <h1 className="eldonia-heading eldonia-heading-sm mt-6">新規登録</h1>
        <p className="eldonia-body mt-2 text-sm">ネクサスへの扉を開く</p>
        <div className="mt-8 flex justify-center">
          <SignupForm redirectTo={redirectTo} supabaseConfigured={supabaseConfigured} />
        </div>
      </div>
    </div>
  );
}
