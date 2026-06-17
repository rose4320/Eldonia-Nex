import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CommunityToolbar } from "@/components/community/community-toolbar";
import { ThreadCreateForm } from "@/components/community/thread-create-form";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { getCommunityBoards } from "@/lib/community/get-community";
import { createClient } from "@/lib/supabase/server";

type NewThreadPageProps = { params: Promise<{ slug: string }> };

export default async function NewThreadPage({ params }: NewThreadPageProps) {
  const { slug } = await params;
  const locale = await getUiLocale();
  const pages = getContent(locale).pages;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect_to=/community/b/${slug}/new`);
  }

  const boards = await getCommunityBoards();
  const board = boards.find((b) => b.slug === slug);

  if (!board) notFound();

  return (
    <div className="eldonia-page">
      <SiteHeader />
      <CommunityToolbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
        <Link href={`/community/b/${slug}`} className="eldonia-link text-sm">
          ← {board.name}
        </Link>
        <h1 className="eldonia-heading eldonia-heading-lg mt-4">{pages.community.newThread}</h1>
        <div className="mt-6">
          <ThreadCreateForm boardId={board.id} boardSlug={slug} userId={user.id} />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
