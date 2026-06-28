import Link from "next/link";
import { headers } from "next/headers";
import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/admin/require-admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const adminPath = headersList.get("x-admin-path") ?? "/admin";
  await requireAdmin(adminPath);

  return (
    <div className="eldonia-page min-h-screen">
      <header className="border-b border-[var(--eldonia-border)] bg-[var(--eldonia-surface)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
          <div>
            <p className="eldonia-eyebrow">Operations</p>
            <h1 className="font-display text-xl tracking-wide text-[var(--eldonia-gold-light)]">
              Admin
            </h1>
          </div>
          <Link href="/" className="eldonia-link text-sm">
            ← Site
          </Link>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-6 py-8">
        <aside className="w-44 shrink-0">
          <AdminNav />
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
