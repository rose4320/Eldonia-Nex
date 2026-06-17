"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useContent } from "@/components/providers/locale-provider";
import { createClient } from "@/lib/supabase/client";

type CollabRespondButtonsProps = {
  requestId: string;
  onDone?: () => void;
  size?: "xs" | "sm";
};

export function CollabRespondButtons({
  requestId,
  onDone,
  size = "sm",
}: CollabRespondButtonsProps) {
  const router = useRouter();
  const { engagement } = useContent();
  const [loading, setLoading] = useState<"accept" | "decline" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const btnClass = size === "xs" ? "text-xs" : "text-sm";

  async function respond(action: "accept" | "decline") {
    setError(null);
    setLoading(action);

    const supabase = createClient();

    const { data: request } = await supabase
      .from("collab_requests")
      .select("artwork_id")
      .eq("id", requestId)
      .maybeSingle();

    const { error: rpcError } = await supabase.rpc("respond_to_collab_request", {
      p_request_id: requestId,
      p_action: action,
    });

    if (rpcError) {
      setError(rpcError.message);
      setLoading(null);
      return;
    }

    setLoading(null);
    onDone?.();
    router.refresh();

    if (action === "accept" && request?.artwork_id) {
      router.push(`/gallery/${request.artwork_id}/lab`);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => respond("accept")}
          className={`eldonia-btn-primary disabled:opacity-60 ${btnClass}`}
        >
          {loading === "accept" ? engagement.processing : engagement.collabAccept}
        </button>
        <button
          type="button"
          disabled={loading !== null}
          onClick={() => respond("decline")}
          className={`eldonia-btn-secondary disabled:opacity-60 ${btnClass}`}
        >
          {loading === "decline" ? engagement.processing : engagement.collabDecline}
        </button>
      </div>
      {error && <p className="eldonia-alert-error text-xs">{error}</p>}
    </div>
  );
}
