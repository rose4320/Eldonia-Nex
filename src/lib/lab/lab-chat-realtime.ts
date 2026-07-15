"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CollabLabPostWithAuthor } from "@/types/database";

type Options = {
  labId: string;
  enabled: boolean;
  onInsert: (post: CollabLabPostWithAuthor) => void;
};

/**
 * Subscribe to new Lab chat posts (Realtime).
 * Falls back silently if Realtime is unavailable.
 */
export function useLabChatRealtime({ labId, enabled, onInsert }: Options) {
  useEffect(() => {
    if (!enabled || !labId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`lab-chat:${labId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "collab_lab_posts",
          filter: `lab_id=eq.${labId}`,
        },
        async (payload) => {
          const row = payload.new as {
            id: string;
            lab_id: string;
            author_id: string;
            body: string;
            created_at: string;
          };

          const { data: profile } = await supabase
            .from("profiles")
            .select("display_name, username, avatar_url")
            .eq("id", row.author_id)
            .maybeSingle();

          onInsert({
            id: row.id,
            lab_id: row.lab_id,
            author_id: row.author_id,
            body: row.body,
            created_at: row.created_at,
            profiles: profile ?? null,
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [labId, enabled, onInsert]);
}
