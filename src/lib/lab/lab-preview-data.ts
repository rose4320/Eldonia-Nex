import type { CollabLabData } from "@/lib/gallery/get-collab-lab";

const PREVIEW_LAB_ID = "00000000-0000-4000-8000-0000000000a1";
const PREVIEW_ARTWORK_ID = "00000000-0000-4000-8000-0000000000a2";

/** Demo CollabLabData for `/lab/preview` (no DB row required). */
export function buildLabPreviewData(userId: string): CollabLabData {
  const now = new Date().toISOString();
  const peerId = "00000000-0000-4000-8000-0000000000b1";

  return {
    lab: {
      id: PREVIEW_LAB_ID,
      artwork_id: PREVIEW_ARTWORK_ID,
      collab_request_id: "00000000-0000-4000-8000-0000000000a3",
      title: "Demo Lab — World Framework",
      created_at: now,
    },
    artwork: {
      id: PREVIEW_ARTWORK_ID,
      title: "Preview Artwork",
      media_type: "image",
      media_url: "/logo.png",
      thumbnail_url: "/logo.png",
    },
    members: [
      {
        user_id: userId,
        role: "owner",
        profiles: {
          display_name: "You (Leader)",
          username: "you",
          avatar_url: null,
        },
      },
      {
        user_id: peerId,
        role: "collaborator",
        profiles: {
          display_name: "Collaborator A",
          username: "collab_a",
          avatar_url: null,
        },
      },
      {
        user_id: "00000000-0000-4000-8000-0000000000b2",
        role: "collaborator",
        profiles: {
          display_name: "Collaborator B",
          username: "collab_b",
          avatar_url: null,
        },
      },
    ],
    posts: [
      {
        id: "00000000-0000-4000-8000-0000000000c1",
        lab_id: PREVIEW_LAB_ID,
        author_id: peerId,
        body: "Framework folder に最新の世界設定を置きました。",
        created_at: now,
        profiles: {
          display_name: "Collaborator A",
          username: "collab_a",
          avatar_url: null,
        },
      },
      {
        id: "00000000-0000-4000-8000-0000000000c2",
        lab_id: PREVIEW_LAB_ID,
        author_id: userId,
        body: "Timeline v3 を開いて確認します。",
        created_at: now,
        profiles: {
          display_name: "You (Leader)",
          username: "you",
          avatar_url: null,
        },
      },
    ],
    folders: [],
    assets: [],
    snapshots: [],
  };
}
