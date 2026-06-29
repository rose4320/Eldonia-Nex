"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContent } from "@/components/providers/locale-provider";
import { ArtworkOwnerCollabPanel } from "@/components/gallery/artwork-owner-collab-panel";
import { awardUserExp } from "@/lib/exp/award-exp";
import { createClient } from "@/lib/supabase/client";
import type { ArtworkEngagementState } from "@/types/database";

type ArtworkEngagementActionsProps = {
  artworkId: string;
  creatorId: string;
  creatorName: string;
  userId: string | null;
  isOwner: boolean;
  engagement: ArtworkEngagementState;
  loginRedirect: string;
  pendingCollabRequests?: ArtworkEngagementState["pendingCollabRequests"];
  labAvailable?: boolean;
};

export function ArtworkEngagementActions({
  artworkId,
  creatorId,
  creatorName,
  userId,
  isOwner,
  engagement,
  loginRedirect,
  pendingCollabRequests = [],
  labAvailable = false,
}: ArtworkEngagementActionsProps) {
  const router = useRouter();
  const { engagement: copy } = useContent();
  const [isFan, setIsFan] = useState(engagement.isFan);
  const [fanCount, setFanCount] = useState(engagement.fanCount);
  const [collabRequest, setCollabRequest] = useState(engagement.collabRequest);
  const [showCollabForm, setShowCollabForm] = useState(false);
  const [collabMessage, setCollabMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<"fan" | "collab" | null>(null);

  if (isOwner) {
    return (
      <ArtworkOwnerCollabPanel
        artworkId={artworkId}
        creatorName={creatorName}
        fanCount={fanCount}
        pendingRequests={pendingCollabRequests}
        labAvailable={labAvailable}
      />
    );
  }

  async function toggleFan() {
    if (!userId) return;
    setError(null);
    setLoading("fan");

    const supabase = createClient();

    if (isFan) {
      const { error: deleteError } = await supabase
        .from("creator_fans")
        .delete()
        .eq("fan_id", userId)
        .eq("creator_id", creatorId);

      if (deleteError) {
        setError(deleteError.message);
        setLoading(null);
        return;
      }

      setIsFan(false);
      setFanCount((count) => Math.max(0, count - 1));
    } else {
      const { error: insertError } = await supabase.from("creator_fans").insert({
        fan_id: userId,
        creator_id: creatorId,
      });

      if (insertError) {
        setError(insertError.message);
        setLoading(null);
        return;
      }

      await awardUserExp(supabase, "fan.create", creatorId);
      setIsFan(true);
      setFanCount((count) => count + 1);
    }

    setLoading(null);
    router.refresh();
  }

  async function submitCollabRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!userId) return;
    setError(null);
    setLoading("collab");

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("collab_requests")
      .insert({
        artwork_id: artworkId,
        requester_id: userId,
        creator_id: creatorId,
        message: collabMessage.trim() || null,
      })
      .select("id, status, message")
      .single();

    if (insertError || !data) {
      setError(insertError?.message ?? copy.errCollab);
      setLoading(null);
      return;
    }

    await awardUserExp(supabase, "collab.request", data.id);
    setCollabRequest(data);
    setShowCollabForm(false);
    setCollabMessage("");
    setLoading(null);
    router.refresh();
  }

  const collabPending = collabRequest?.status === "pending";
  const collabStatusLabel = (status: string) =>
    copy.collabStatus[status] ?? status;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {!userId ? (
          <>
            <Link
              href={`/auth/login?redirect_to=${encodeURIComponent(loginRedirect)}`}
              className="eldonia-btn-secondary"
            >
              {copy.fanRegister}
            </Link>
            <Link
              href={`/auth/login?redirect_to=${encodeURIComponent(loginRedirect)}`}
              className="eldonia-btn-secondary"
            >
              {copy.collabRequest}
            </Link>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={toggleFan}
              disabled={loading === "fan"}
              className={`eldonia-btn-secondary disabled:cursor-not-allowed disabled:opacity-60 ${
                isFan ? "border-eldonia-gold/60 text-eldonia-gold" : ""
              }`}
            >
              {loading === "fan"
                ? copy.processing
                : isFan
                  ? copy.fanRegistered
                  : copy.fanRegister}
            </button>

            {collabPending ? (
              <span className="eldonia-badge eldonia-badge-ready px-3 py-2 text-xs">
                {collabStatusLabel("pending")}
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setShowCollabForm((open) => !open)}
                disabled={loading === "collab"}
                className="eldonia-btn-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {copy.collabRequest}
              </button>
            )}
          </>
        )}
        <span className="text-xs text-eldonia-text-muted">{copy.fanCount(fanCount)}</span>
      </div>

      {collabRequest && !collabPending && (
        <p className="text-xs text-eldonia-text-muted">
          {copy.collabLabel(collabStatusLabel(collabRequest.status))}
        </p>
      )}

      {(labAvailable || collabRequest?.status === "accepted") && (
        <Link
          href={`/gallery/${artworkId}/lab`}
          className="eldonia-btn-primary inline-flex text-sm"
        >
          {copy.openLab}
        </Link>
      )}

      {showCollabForm && !collabPending && userId && (
        <form onSubmit={submitCollabRequest} className="eldonia-card space-y-3">
          <label htmlFor="collabMessage" className="eldonia-label">
            {copy.collabMessageLabel}
          </label>
          <textarea
            id="collabMessage"
            rows={2}
            maxLength={1000}
            value={collabMessage}
            onChange={(event) => setCollabMessage(event.target.value)}
            placeholder={copy.collabMessagePlaceholder}
            className="eldonia-textarea"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={loading === "collab"}
              className="eldonia-btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading === "collab" ? copy.collabSending : copy.collabSubmit}
            </button>
            <button
              type="button"
              onClick={() => setShowCollabForm(false)}
              className="eldonia-btn-ghost text-sm"
            >
              {copy.cancel}
            </button>
          </div>
        </form>
      )}

      {error && <p className="eldonia-alert-error text-xs">{error}</p>}
    </div>
  );
}
