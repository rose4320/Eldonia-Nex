import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { EldoniaDivider } from "@/components/ui/eldonia-divider";

type ModulePlaceholderProps = {
  name: string;
  description: string;
};

export function ModulePlaceholder({ name, description }: ModulePlaceholderProps) {
  return (
    <div className="eldonia-page">
      <SiteHeader />
      <main className="eldonia-main flex flex-1 items-center justify-center">
        <section className="eldonia-card max-w-lg text-center">
          <p className="eldonia-eyebrow">{name}</p>
          <h1 className="eldonia-heading eldonia-heading-lg mt-3">準備中</h1>
          <EldoniaDivider />
          <p className="eldonia-body mt-4 text-sm">{description}</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
