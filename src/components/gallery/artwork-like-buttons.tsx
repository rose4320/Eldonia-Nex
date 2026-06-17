"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContent } from "@/components/providers/locale-provider";
import { awardUserExp } from "@/lib/exp/award-exp";
import { createClient } from "@/lib/supabase/client";
import type { ArtworkEngagementState } from "@/types/database";

type ArtworkLikeButtonsProps = {
  artworkId: string;
  userId: string | null;
  isOwner: boolean;
  engagement: ArtworkEngagementState;
  loginRedirect: string;
};

export function ArtworkLikeButtons({
  artworkId,
  userId,
  isOwner,
  engagement,
  loginRedirect,
}: ArtworkLikeButtonsProps) {
  const router = useRouter();
  const likeLabel = useContent().pages.gallery.like;
  const [isLiked, setIsLiked] = useState(engagement.isLiked);
  const [likeCount, setLikeCount] = useState(engagement.likeCount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const likedClass = isLiked ? "border-eldonia-gold/60 text-eldonia-gold" : "";

  async function toggleLike() {
    if (!userId || isOwner) return;
    setError(null);
    setLoading(true);

    const supabase = createClient();

    if (isLiked) {
      const { error: deleteError } = await supabase
        .from("artwork_likes")
        .delete()
        .eq("artwork_id", artworkId)
        .eq("user_id", userId);

      if (deleteError) {
        setError(deleteError.message);
        setLoading(false);
        return;
      }

      setIsLiked(false);
      setLikeCount((count) => Math.max(0, count - 1));
    } else {
      const { error: insertError } = await supabase.from("artwork_likes").insert({
        artwork_id: artworkId,
        user_id: userId,
      });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      await awardUserExp(supabase, "like.create", artworkId);
      setIsLiked(true);
      setLikeCount((count) => count + 1);
    }

    setLoading(false);
    router.refresh();
  }

  if (!userId) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={`/auth/login?redirect_to=${encodeURIComponent(loginRedirect)}`}
          className="eldonia-btn-secondary"
        >
          {likeLabel} {likeCount > 0 && <span className="ml-1">{likeCount}</span>}
        </Link>
      </div>
    );
  }

  if (isOwner) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="eldonia-btn-secondary pointer-events-none opacity-70">
          {likeLabel} <span className="ml-1">{likeCount}</span>
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={toggleLike}
          disabled={loading}
          className={`eldonia-btn-secondary disabled:cursor-not-allowed disabled:opacity-60 ${likedClass}`}
        >
          {loading ? "..." : likeLabel}
          {likeCount > 0 && <span className="ml-1">{likeCount}</span>}
        </button>
      </div>
      {error && <p className="eldonia-alert-error text-xs">{error}</p>}
    </div>
  );
}
