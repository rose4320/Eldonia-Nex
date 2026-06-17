import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { getContent } from "@/lib/i18n/content/messages";
import { createClient } from "@/lib/supabase/server";

export default async function LabHubPage() {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let labs: {
    id: string;
    title: string;
    artwork_id: string;
    created_at: string;
  }[] = [];

  if (user) {
    const { data: memberships } = await supabase
      .from("collab_lab_members")
      .select("lab_id")
      .eq("user_id", user.id);

    const labIds = (memberships ?? []).map((row) => row.lab_id);
    if (labIds.length > 0) {
      const { data } = await supabase
        .from("collab_labs")
        .select("id, title, artwork_id, created_at")
        .in("id", labIds)
        .order("created_at", { ascending: false });
      labs = data ?? [];
    }
  }

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <main className="eldonia-main">
        <p className="eldonia-eyebrow">LAB</p>
        <h1 className="eldonia-heading eldonia-heading-lg">LAB</h1>
        <p className="eldonia-body mt-2 text-sm">{t.lab.lead}</p>

        <div className="my-8">
          <EldoniaDivider />
        </div>

        {!user ? (
          <div className="eldonia-card text-center">
            <p className="eldonia-body text-sm">
              <Link href="/auth/login?redirect_to=/lab" className="eldonia-link">
                {t.chrome.login}
              </Link>
            </p>
          </div>
        ) : labs.length === 0 ? (
          <div className="eldonia-card-dashed px-6 py-10 text-center">
            <p className="eldonia-body text-sm">{t.lab.empty}</p>
            <Link href="/gallery" className="eldonia-link mt-3 inline-block text-sm">
              {t.pages.lab.galleryLink}
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {labs.map((lab) => (
              <li key={lab.id}>
                <Link
                  href={`/gallery/${lab.artwork_id}/lab`}
                  className="eldonia-card block transition hover:border-eldonia-gold/50"
                >
                  <p className="font-display text-sm font-semibold text-eldonia-gold-light">
                    {lab.title}
                  </p>
                  <p className="eldonia-hint mt-1 text-xs">
                    {new Date(lab.created_at).toLocaleDateString(locale === "ja" ? "ja-JP" : "en-US")}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
