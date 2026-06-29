"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContent } from "@/components/providers/locale-provider";
import { CollabRespondButtons } from "@/components/gallery/collab-respond-buttons";
import type { PendingCollabRequest } from "@/types/database";

type ArtworkOwnerCollabPanelProps = {
  artworkId: string;
  creatorName: string;
  fanCount: number;
  pendingRequests: PendingCollabRequest[];
  labAvailable: boolean;
};

export function ArtworkOwnerCollabPanel({
  artworkId,
  creatorName,
  fanCount,
  pendingRequests,
  labAvailable,
}: ArtworkOwnerCollabPanelProps) {
  const router = useRouter();
  const { engagement: copy } = useContent();

  function handleResponded() {
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-eldonia-text-muted">
        {copy.ownerFans(creatorName, fanCount)}
      </p>

      {labAvailable && (
        <Link
          href={`/gallery/${artworkId}/lab`}
          className="eldonia-btn-primary inline-flex text-sm"
        >
          {copy.openLab}
        </Link>
      )}

      {pendingRequests.length > 0 && (
        <div className="eldonia-card space-y-4">
          <h2 className="eldonia-label">{copy.pendingCollabHeading(pendingRequests.length)}</h2>
          <ul className="space-y-4">
            {pendingRequests.map((request) => {
              const name =
                request.requester.display_name ??
                request.requester.username ??
                copy.lab.memberFallback;
              return (
                <li
                  key={request.id}
                  className="rounded-lg border border-eldonia-border bg-eldonia-surface px-4 py-3"
                >
                  <p className="text-sm font-medium text-eldonia-gold-light">{name}</p>
                  {request.message && (
                    <p className="eldonia-body mt-2 whitespace-pre-wrap text-sm text-eldonia-text-muted">
                      {request.message}
                    </p>
                  )}
                  <div className="mt-3">
                    <CollabRespondButtons
                      requestId={request.id}
                      size="xs"
                      onDone={handleResponded}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {pendingRequests.length === 0 && !labAvailable && (
        <p className="text-xs text-eldonia-text-muted">{copy.ownerCollabHint}</p>
      )}
    </div>
  );
}
