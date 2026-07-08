"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { formatRelativeTime } from "@/lib/community/constants";
import { awardUserExp } from "@/lib/exp/award-exp";
import { createClient } from "@/lib/supabase/client";
import { LabArtworkDownloads } from "@/components/gallery/lab-artwork-downloads";
import type { CollabLabData } from "@/lib/gallery/get-collab-lab";

type CollabLabWorkspaceProps = {
  labData: CollabLabData;
  userId: string;
};

export function CollabLabWorkspace({ labData, userId }: CollabLabWorkspaceProps) {
  const router = useRouter();
  const locale = useLocale();
  const { engagement, pages } = useContent();
  const lab = engagement.lab;
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("collab_lab_posts")
      .insert({
        lab_id: labData.lab.id,
        author_id: userId,
        body: body.trim(),
      })
      .select("id")
      .single();

    if (insertError || !data) {
      setError(insertError?.message ?? engagement.errCollab);
      setLoading(false);
      return;
    }

    await awardUserExp(supabase, "lab.post", data.id);
    setBody("");
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <section className="eldonia-card">
        <p className="eldonia-eyebrow text-[0.65rem]">Collab Lab</p>
        <h1 className="eldonia-heading eldonia-heading-sm mt-1">{labData.lab.title}</h1>
        <p className="eldonia-body mt-2 text-sm">{lab.lead}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <Link href={`/gallery/${labData.lab.artwork_id}`} className="eldonia-link">
            {pages.lab.viewArtwork}
          </Link>
          <Link href="/lab" className="eldonia-link">
            {pages.lab.allLabs}
          </Link>
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          {labData.members.map((member) => {
            const name =
              member.profiles?.display_name ??
              member.profiles?.username ??
              lab.memberFallback;
            return (
              <li
                key={member.user_id}
                className="rounded-full border border-eldonia-gold/25 px-3 py-1 text-xs text-eldonia-text-muted"
              >
                {name}
                {member.role === "owner" ? lab.ownerSuffix : ""}
              </li>
            );
          })}
        </ul>
      </section>

      <LabArtworkDownloads
        artworkId={labData.artwork.id}
        title={labData.artwork.title}
        mediaType={labData.artwork.media_type}
        hasThumbnail={Boolean(
          labData.artwork.thumbnail_url &&
            labData.artwork.thumbnail_url !== labData.artwork.media_url,
        )}
      />

      <section className="eldonia-card">
        <h2 className="eldonia-label">{lab.notesHeading}</h2>
        {labData.posts.length === 0 ? (
          <p className="eldonia-body mt-4 text-sm text-eldonia-text-muted">{lab.notesEmpty}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {labData.posts.map((post) => {
              const author =
                post.profiles?.display_name ?? post.profiles?.username ?? lab.memberFallback;
              return (
                <li
                  key={post.id}
                  className="rounded-lg border border-eldonia-border bg-eldonia-surface px-4 py-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-eldonia-gold">{author}</p>
                    <span className="text-xs text-eldonia-text-dim">
                      {formatRelativeTime(post.created_at, locale)}
                    </span>
                  </div>
                  <p className="eldonia-body mt-2 whitespace-pre-wrap text-sm">{post.body}</p>
                </li>
              );
            })}
          </ul>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-3 border-t border-eldonia-border pt-4">
          <textarea
            required
            rows={3}
            maxLength={4000}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={lab.postPlaceholder}
            className="eldonia-textarea"
          />
          {error && <p className="eldonia-alert-error text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="eldonia-btn-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? lab.postSending : lab.postSubmit}
          </button>
        </form>
      </section>
    </div>
  );
}
