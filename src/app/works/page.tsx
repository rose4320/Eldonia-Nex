import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { JobCard } from "@/components/works/job-card";
import { WorksToolbar } from "@/components/works/works-toolbar";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { jobTypeOptions } from "@/lib/i18n/taxonomy";
import { getJobListings } from "@/lib/works/get-works";

type WorksPageProps = {
  searchParams: Promise<{ q?: string; type?: string }>;
};

export default async function WorksPage({ searchParams }: WorksPageProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const { q, type = "all" } = await searchParams;
  const jobs = await getJobListings({ q, type }, locale);
  const jobTypes = jobTypeOptions(locale);

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <WorksToolbar query={q} type={type} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-8">
        <section className="space-y-2">
          <p className="eldonia-eyebrow">WORKS</p>
          <h1 className="eldonia-heading eldonia-heading-lg">{t.works.heading}</h1>
          <p className="eldonia-body text-sm">{t.works.lead}</p>
        </section>

        <EldoniaDivider />

        <nav className="flex flex-wrap gap-2">
          {[{ value: "all", label: t.common.all }, ...jobTypes].map((item) => {
            const params = new URLSearchParams();
            if (item.value !== "all") params.set("type", item.value);
            if (q?.trim()) params.set("q", q.trim());
            const href = params.toString() ? `/works?${params}` : "/works";
            const active = type === item.value;
            return (
              <Link
                key={item.value}
                href={href}
                className={
                  active
                    ? "eldonia-badge-nexus-prime"
                    : "rounded border border-[var(--eldonia-border)] px-3 py-1 text-xs text-[var(--eldonia-text-muted)]"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <section className="grid gap-4 lg:grid-cols-2">
          {jobs.length === 0 ? (
            <p className="eldonia-body col-span-full py-16 text-center">{t.works.empty}</p>
          ) : (
            jobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
