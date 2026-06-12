import Link from "next/link";
import { BrandLogo } from "@/components/ui/brand-logo";
import { createClient } from "@/lib/supabase/server";

const navLinks = [
  { href: "/gallery", label: "GALLEY" },
  { href: "/shop", label: "SHOP" },
  { href: "/events", label: "EVENTS" },
  { href: "/community", label: "COMMUNITY" },
  { href: "/works", label: "WORKS" },
];

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = user?.email ?? null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, username")
      .eq("id", user.id)
      .single();

    displayName =
      profile?.display_name ?? profile?.username ?? user.email ?? "ユーザー";
  }

  return (
    <header className="eldonia-header">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-8">
          <BrandLogo size="sm" />
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="eldonia-nav-link">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <nav className="flex items-center gap-2">
          <Link href="/help" className="eldonia-btn-ghost hidden sm:inline-flex">
            ヘルプ
          </Link>
          {user ? (
            <>
              <span className="hidden text-sm text-eldonia-text-muted sm:inline">
                {displayName}
              </span>
              <Link href="/dashboard" className="eldonia-btn-secondary">
                ダッシュボード
              </Link>
              <form action="/auth/sign-out" method="post">
                <button type="submit" className="eldonia-btn-ghost">
                  ログアウト
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="eldonia-btn-ghost">
                ログイン
              </Link>
              <Link href="/auth/signup" className="eldonia-btn-primary">
                新規登録
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
