"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LabChatTranslatedBody } from "@/components/lab/lab-chat-translated-body";
import { LabArtworkDownloads } from "@/components/gallery/lab-artwork-downloads";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { formatRelativeTime } from "@/lib/community/constants";
import { awardUserExp } from "@/lib/exp/award-exp";
import type { CollabLabData } from "@/lib/gallery/get-collab-lab";
import {
  archiveLabAsset,
  archiveLabFolder,
  insertLabAsset,
} from "@/lib/lab/lab-assets";
import {
  encodeLabChatFile,
  parseLabChatFile,
} from "@/lib/lab/lab-chat-file";
import { useLabChatRealtime } from "@/lib/lab/lab-chat-realtime";
import {
  LAB_DEMO_ASSETS,
  LAB_DEMO_FOLDERS,
  LAB_DEMO_TIMELINE_TRACKS,
  LAB_EQ_BANDS,
  LAB_EQ_DEFAULTS,
  LAB_TIMELINE_MARKERS,
  type LabDemoAsset,
  type LabTimelineTrack,
  type LabTimelineTrackKind,
} from "@/lib/lab/lab-room-demo";
import {
  cloneSnapshotPayload,
  formatSnapshotDefaultLabel,
  type LabRoomSnapshot,
  type LabRoomSnapshotPayload,
} from "@/lib/lab/lab-snapshot";
import {
  archiveLabSnapshot,
  insertLabSnapshot,
} from "@/lib/lab/lab-snapshot-db";
import { LabAudioEngine } from "@/lib/lab/lab-audio-engine";
import { uploadLabChatShare } from "@/lib/lab/upload-lab-chat-share";
import { createClient } from "@/lib/supabase/client";
import { inferSourceLocale } from "@/lib/translation/infer-source-locale";
import { requestTranslationWarm } from "@/lib/translation/request-warm";
import type { CollabLabPostWithAuthor } from "@/types/database";

type LabRoomShellProps = {
  labData: CollabLabData;
  userId: string;
  /** UI-only demo — no DB writes / artwork downloads. */
  preview?: boolean;
};

type OpenFile = {
  id: string;
  title: string;
  subtitle: string;
  source: "folder" | "media" | "artwork";
};

type AudioConsoleTab = "mixer" | "eq";

type LabPresenceFocus =
  | "chat"
  | "folders"
  | "workspace"
  | "timeline"
  | "mixer"
  | "idle";

type LabMemberPresence = {
  userId: string;
  online: boolean;
  focus: LabPresenceFocus;
  color: string;
  /** Ghost playhead when focusing the timeline (0–100). */
  playheadPct: number;
};

const PRESENCE_COLORS = ["#3dcf7a", "#5bb8e8", "#e6a35a", "#e07a7a", "#9ad0c2"];
const PRESENCE_FOCUS_CYCLE: LabPresenceFocus[] = [
  "timeline",
  "workspace",
  "folders",
  "chat",
  "mixer",
  "idle",
];

type WorkspaceStagedFile = {
  id: string;
  label: string;
  kind: LabTimelineTrackKind;
  expanded: boolean;
  clipId: string | null;
  /** Snapshot so「共有フォルダに戻す」can restore the asset. */
  assetId: string;
  folderId: string;
  name: string;
  ext: string;
  assetKind: LabDemoAsset["kind"];
  /** Public / object URL for real playback (audio/video). */
  url?: string | null;
};

const NLE_HEIGHT_MIN = 168;
const NLE_HEIGHT_MAX = 520;
const NLE_HEIGHT_DEFAULT = 228;
/** Demo timeline length matching ruler 00:00–02:00 */
const NLE_DURATION_SEC = 120;
const NLE_PLAYHEAD_DEFAULT = 34;
/** Timeline seconds advanced per real second while playing (demo). */
const NLE_PLAY_SPEED = 6;

const EQ_PRESETS: Record<string, number[]> = {
  flat: [50, 50, 50, 50, 50, 50, 50],
  voice: [40, 46, 58, 72, 62, 44, 38],
  music: [58, 50, 48, 54, 62, 60, 55],
  bass: [78, 70, 55, 46, 42, 40, 38],
};

const AUDIO_WIN_W_DEFAULT = 416;
const AUDIO_WIN_H_DEFAULT = 420;
const AUDIO_WIN_W_MIN = 280;
const AUDIO_WIN_H_MIN = 240;

/** Probe HTML media duration from a public / blob URL (audio or video). */
function probeMediaDuration(url: string): Promise<number | null> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audio.preload = "metadata";
    let settled = false;
    const finish = (value: number | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      audio.onloadedmetadata = null;
      audio.onerror = null;
      audio.removeAttribute("src");
      audio.load();
      resolve(value);
    };
    const timer = window.setTimeout(() => finish(null), 8000);
    audio.onloadedmetadata = () => {
      const d = audio.duration;
      finish(Number.isFinite(d) && d > 0 ? d : null);
    };
    audio.onerror = () => finish(null);
    audio.src = url;
  });
}

type AudioWinResizeEdge = "e" | "s" | "se";

type ClipMiniWin = {
  stageId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  locked: boolean;
  z: number;
};

const CLIP_MINI_W = 320;
const CLIP_MINI_H = 248;
const CLIP_MINI_W_MIN = 220;
const CLIP_MINI_H_MIN = 168;
const CLIP_MINI_CASCADE = 28;

function buildDemoWaveform(seed: string, bars = 72): number[] {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const out: number[] = [];
  for (let i = 0; i < bars; i += 1) {
    hash = Math.imul(hash ^ (hash >>> 13), 1274126177);
    const noise = ((hash >>> 0) % 1000) / 1000;
    const envelope = 0.28 + 0.72 * Math.sin((i / Math.max(1, bars - 1)) * Math.PI);
    const midPulse = 0.15 * Math.sin(i * 0.45 + (hash % 7));
    out.push(Math.max(0.08, Math.min(1, noise * 0.55 + envelope * 0.5 + midPulse)));
  }
  return out;
}

function parseAssetLabel(label: string): { name: string; ext: string } {
  const parts = label.split(".");
  if (parts.length < 2) return { name: label, ext: "bin" };
  const ext = parts.pop() as string;
  return { name: parts.join(".") || label, ext };
}

/** Mirror bottom timeline clips into the center list (checked = staged on timeline). */
function buildStagedFromTracks(trackList: LabTimelineTrack[]): WorkspaceStagedFile[] {
  const items: WorkspaceStagedFile[] = [];
  for (const track of trackList) {
    for (const clip of track.clips) {
      const { name, ext } = parseAssetLabel(clip.label);
      items.push({
        id: `stage-seed-${clip.id}`,
        label: clip.label,
        kind: track.kind,
        expanded: true,
        clipId: clip.id,
        assetId: `seed-asset-${clip.id}`,
        folderId: track.kind === "audio" ? "audio" : "project",
        name,
        ext,
        assetKind: track.kind === "audio" ? "audio" : "video",
        url: null,
      });
    }
  }
  return items;
}

function memberLabel(
  member: CollabLabData["members"][number],
  fallback: string,
): string {
  return member.profiles?.display_name ?? member.profiles?.username ?? fallback;
}

function initialOf(name: string): string {
  return name.trim().slice(0, 1).toUpperCase() || "?";
}

export function LabRoomShell({ labData, userId, preview = false }: LabRoomShellProps) {
  const router = useRouter();
  const locale = useLocale();
  const { engagement, pages } = useContent();
  const t = engagement.lab;
  const room = t.room;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderUploadInputRef = useRef<HTMLInputElement>(null);

  const isLeader = useMemo(
    () => labData.members.some((m) => m.user_id === userId && m.role === "owner"),
    [labData.members, userId],
  );

  const leaderName = useMemo(() => {
    const leader = labData.members.find((m) => m.role === "owner");
    return leader ? memberLabel(leader, t.memberFallback) : t.memberFallback;
  }, [labData.members, t.memberFallback]);

  const selfProfile = useMemo(() => {
    const self = labData.members.find((m) => m.user_id === userId);
    return (
      self?.profiles ?? {
        display_name: "You",
        username: "you",
        avatar_url: null,
      }
    );
  }, [labData.members, userId]);

  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(
    preview
      ? (LAB_DEMO_FOLDERS[0]?.id ?? "project")
      : (labData.folders[0]?.id ?? ""),
  );
  const [openFile, setOpenFile] = useState<OpenFile | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [localPosts, setLocalPosts] = useState<CollabLabPostWithAuthor[]>([]);
  const [tracks, setTracks] = useState<LabTimelineTrack[]>(() =>
    LAB_DEMO_TIMELINE_TRACKS.map((t) => ({ ...t, clips: [...t.clips] })),
  );
  const [audioConsoleOpen, setAudioConsoleOpen] = useState(false);
  const [audioConsoleTab, setAudioConsoleTab] = useState<AudioConsoleTab>("mixer");
  /** Floating window position; null = CSS default (bottom-right). */
  const [audioWinPos, setAudioWinPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const audioWinPosRef = useRef<{ x: number; y: number } | null>(null);
  /** Fixed until title is clicked; then drag is allowed until locked again. */
  const [audioWinLocked, setAudioWinLocked] = useState(true);
  const audioWinLockedRef = useRef(true);
  const audioWinDragRef = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
    pointerId: number;
  } | null>(null);
  const audioWinSkipClickRef = useRef(false);
  const audioWinRef = useRef<HTMLDivElement>(null);
  const [audioWinSize, setAudioWinSize] = useState({
    w: AUDIO_WIN_W_DEFAULT,
    h: AUDIO_WIN_H_DEFAULT,
  });
  const audioWinResizeRef = useRef<{
    edge: AudioWinResizeEdge;
    startX: number;
    startY: number;
    originW: number;
    originH: number;
    originLeft: number;
    originTop: number;
    pointerId: number;
  } | null>(null);
  /** Floating mini windows for timeline-staged media (cascade as files expand). */
  const [clipMiniWins, setClipMiniWins] = useState<ClipMiniWin[]>([]);
  const clipMiniZRef = useRef(40);
  const clipMiniDragRef = useRef<{
    stageId: string;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    moved: boolean;
    pointerId: number;
  } | null>(null);
  const clipMiniSkipClickRef = useRef(false);
  const clipMiniWinsRef = useRef<ClipMiniWin[]>([]);
  const [mixerLevels, setMixerLevels] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = { master: 78 };
    for (const track of LAB_DEMO_TIMELINE_TRACKS) {
      if (track.kind === "audio") init[track.id] = 70 - track.index * 8;
    }
    return init;
  });
  /** -50 (L) … 0 (C) … +50 (R) */
  const [mixerPans, setMixerPans] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = { master: 0 };
    for (const track of LAB_DEMO_TIMELINE_TRACKS) {
      if (track.kind === "audio") init[track.id] = 0;
    }
    return init;
  });
  const [mixerMutes, setMixerMutes] = useState<Record<string, boolean>>({});
  const [mixerSolos, setMixerSolos] = useState<Record<string, boolean>>({});
  const [mixerSends, setMixerSends] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = { master: 0 };
    for (const track of LAB_DEMO_TIMELINE_TRACKS) {
      if (track.kind === "audio") init[track.id] = 20;
    }
    return init;
  });
  const [eqTargetId, setEqTargetId] = useState<string>(
    () => LAB_DEMO_TIMELINE_TRACKS.find((t) => t.kind === "audio")?.id ?? "master",
  );
  const [eqByTrack, setEqByTrack] = useState<Record<string, number[]>>(() => {
    const init: Record<string, number[]> = {
      master: [...LAB_EQ_DEFAULTS],
    };
    for (const track of LAB_DEMO_TIMELINE_TRACKS) {
      if (track.kind === "audio") init[track.id] = [...LAB_EQ_DEFAULTS];
    }
    return init;
  });
  const [eqQ, setEqQ] = useState(50);
  const [eqLowCut, setEqLowCut] = useState(false);
  const [eqHighCut, setEqHighCut] = useState(false);
  const [masterLimiter, setMasterLimiter] = useState(72);
  const [nleHeight, setNleHeight] = useState(NLE_HEIGHT_DEFAULT);
  const nleDragRef = useRef<{ startY: number; startH: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const playheadDragRef = useRef(false);
  const [playheadPct, setPlayheadPct] = useState(NLE_PLAYHEAD_DEFAULT);
  const [timelineDurationSec, setTimelineDurationSec] = useState(NLE_DURATION_SEC);
  const timelineDurationRef = useRef(NLE_DURATION_SEC);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioNotice, setAudioNotice] = useState<string | null>(null);
  const audioEngineRef = useRef<LabAudioEngine | null>(null);
  const playheadScrubbedRef = useRef(false);
  const playheadOverrideRef = useRef<number | null>(null);
  const waveformCanvasRef = useRef<HTMLDivElement>(null);
  const waveformDragRef = useRef(false);
  const [workspaceDropActive, setWorkspaceDropActive] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<WorkspaceStagedFile[]>(() =>
    buildStagedFromTracks(LAB_DEMO_TIMELINE_TRACKS),
  );
  const [selectedStageId, setSelectedStageId] = useState<string | null>(() => {
    const seeded = buildStagedFromTracks(LAB_DEMO_TIMELINE_TRACKS);
    return seeded.find((s) => s.kind === "audio")?.id ?? seeded[0]?.id ?? null;
  });
  const [selectedClipId, setSelectedClipId] = useState<string | null>(() => {
    const seeded = buildStagedFromTracks(LAB_DEMO_TIMELINE_TRACKS);
    return (
      seeded.find((s) => s.kind === "audio")?.clipId ?? seeded[0]?.clipId ?? null
    );
  });
  const clipDragRef = useRef<{
    clipId: string;
    startX: number;
    startPct: number;
    widthPct: number;
    laneWidth: number;
    moved: boolean;
  } | null>(null);
  const [folderList, setFolderList] = useState(() =>
    preview
      ? [...LAB_DEMO_FOLDERS]
      : labData.folders.map((folder) => ({ ...folder })),
  );
  const [assetList, setAssetList] = useState<LabDemoAsset[]>(() => {
    if (!preview) {
      return labData.assets.map((asset) => ({ ...asset }));
    }
    const seedLabels = new Set(
      buildStagedFromTracks(LAB_DEMO_TIMELINE_TRACKS).map((s) =>
        s.label.toLowerCase(),
      ),
    );
    return LAB_DEMO_ASSETS.filter(
      (asset) => !seedLabels.has(`${asset.name}.${asset.ext}`.toLowerCase()),
    ).map((asset) => ({ ...asset }));
  });
  const [folderUploadLoading, setFolderUploadLoading] = useState(false);
  const [folderUploadError, setFolderUploadError] = useState<string | null>(null);
  const [chatFocused, setChatFocused] = useState(false);
  const [snapshotPanelOpen, setSnapshotPanelOpen] = useState(false);
  const [snapshots, setSnapshots] = useState<LabRoomSnapshot[]>(() =>
    preview ? [] : labData.snapshots.map((s) => ({ ...s, payload: cloneSnapshotPayload(s.payload) })),
  );
  const [snapshotLabelDraft, setSnapshotLabelDraft] = useState("");
  const [snapshotNotice, setSnapshotNotice] = useState<string | null>(null);
  const [peerPresence, setPeerPresence] = useState<
    Record<string, Omit<LabMemberPresence, "userId" | "color">>
  >(() => {
    const init: Record<string, Omit<LabMemberPresence, "userId" | "color">> = {};
    labData.members.forEach((peer, i) => {
      if (peer.user_id === userId) return;
      // Preview only: seed demo focus. Production stays idle until realtime exists.
      init[peer.user_id] = preview
        ? {
            online: true,
            focus: PRESENCE_FOCUS_CYCLE[i % PRESENCE_FOCUS_CYCLE.length],
            playheadPct: 22 + i * 18,
          }
        : {
            online: true,
            focus: "idle",
            playheadPct: 34,
          };
    });
    return init;
  });

  const folderAssets = assetList.filter((a) => a.folderId === selectedFolderId);
  const posts = useMemo(
    () => [...labData.posts, ...localPosts],
    [labData.posts, localPosts],
  );

  const handleRealtimePost = useCallback((post: CollabLabPostWithAuthor) => {
    setLocalPosts((prev) => {
      if (prev.some((p) => p.id === post.id) || labData.posts.some((p) => p.id === post.id)) {
        return prev;
      }
      return [...prev, post];
    });
  }, [labData.posts]);

  useLabChatRealtime({
    labId: labData.lab.id,
    enabled: !preview,
    onInsert: handleRealtimePost,
  });

  const audioTracks = useMemo(
    () => tracks.filter((track) => track.kind === "audio"),
    [tracks],
  );

  const selfFocus = useMemo((): LabPresenceFocus => {
    if (chatFocused) return "chat";
    if (audioConsoleOpen) return "mixer";
    if (isPlaying || selectedClipId) return "timeline";
    if (selectedStageId) return "workspace";
    if (selectedFolderId) return "folders";
    return "idle";
  }, [
    chatFocused,
    audioConsoleOpen,
    isPlaying,
    selectedClipId,
    selectedStageId,
    selectedFolderId,
  ]);

  const memberPresences = useMemo((): LabMemberPresence[] => {
    return labData.members.map((member, index) => {
      const color = PRESENCE_COLORS[index % PRESENCE_COLORS.length];
      if (member.user_id === userId) {
        return {
          userId: member.user_id,
          online: true,
          focus: selfFocus,
          color,
          playheadPct: playheadPct,
        };
      }
      const peer = peerPresence[member.user_id];
      return {
        userId: member.user_id,
        online: peer?.online ?? true,
        focus: peer?.focus ?? "idle",
        color,
        playheadPct: peer?.playheadPct ?? 28 + index * 12,
      };
    });
  }, [labData.members, userId, selfFocus, peerPresence, playheadPct]);

  const presenceByUser = useMemo(() => {
    const map = new Map<string, LabMemberPresence>();
    for (const p of memberPresences) map.set(p.userId, p);
    return map;
  }, [memberPresences]);

  const remoteTimelinePeers = useMemo(
    () =>
      memberPresences.filter(
        (p) => p.userId !== userId && p.online && p.focus === "timeline",
      ),
    [memberPresences, userId],
  );

  // Preview only: simulate peers cycling focus. Production waits for realtime sync.
  useEffect(() => {
    if (!preview) return;
    const peers = labData.members.filter((m) => m.user_id !== userId);
    if (peers.length === 0) return;

    const tick = window.setInterval(() => {
      setPeerPresence((prev) => {
        const next = { ...prev };
        peers.forEach((peer, i) => {
          const cur = next[peer.user_id];
          const idx = PRESENCE_FOCUS_CYCLE.indexOf(cur?.focus ?? "idle");
          const focus =
            PRESENCE_FOCUS_CYCLE[(idx + 1 + i) % PRESENCE_FOCUS_CYCLE.length];
          next[peer.user_id] = {
            online: focus !== "idle" || Math.random() > 0.25,
            focus,
            playheadPct: Math.min(
              92,
              Math.max(8, (cur?.playheadPct ?? 30) + (i % 2 === 0 ? 7 : -5)),
            ),
          };
        });
        return next;
      });
    }, 5200);

    return () => window.clearInterval(tick);
  }, [preview, labData.members, userId]);

  function presenceFocusLabel(focus: LabPresenceFocus): string {
    switch (focus) {
      case "chat":
        return room.presenceFocusChat;
      case "folders":
        return room.presenceFocusFolders;
      case "workspace":
        return room.presenceFocusWorkspace;
      case "timeline":
        return room.presenceFocusTimeline;
      case "mixer":
        return room.presenceFocusMixer;
      default:
        return room.presenceFocusIdle;
    }
  }

  function captureRoomSnapshotPayload(): LabRoomSnapshotPayload {
    return {
      schemaVersion: 1,
      tracks: tracks.map((track) => ({
        ...track,
        clips: track.clips.map((clip) => ({ ...clip })),
      })),
      stagedFiles: stagedFiles.map((item) => ({
        id: item.id,
        label: item.label,
        kind: item.kind,
        expanded: item.expanded,
        clipId: item.clipId,
        assetId: item.assetId,
        folderId: item.folderId,
        name: item.name,
        ext: item.ext,
        assetKind: item.assetKind,
        url: item.url ?? null,
      })),
      assetList: assetList.map((asset) => ({ ...asset })),
      folderList: folderList.map((folder) => ({ ...folder })),
      playheadPct,
      selectedFolderId,
      mixerLevels: { ...mixerLevels },
      mixerPans: { ...mixerPans },
      mixerMutes: { ...mixerMutes },
      mixerSolos: { ...mixerSolos },
      mixerSends: { ...mixerSends },
      eqByTrack: Object.fromEntries(
        Object.entries(eqByTrack).map(([id, bands]) => [id, [...bands]]),
      ),
      eqTargetId,
      eqQ,
      eqLowCut,
      eqHighCut,
      masterLimiter,
      nleHeight,
    };
  }

  function applyRoomSnapshotPayload(payload: LabRoomSnapshotPayload) {
    const next = cloneSnapshotPayload(payload);
    setTracks(next.tracks);
    setStagedFiles(next.stagedFiles);
    setAssetList(next.assetList);
    setFolderList(next.folderList);
    setPlayheadPct(next.playheadPct);
    setSelectedFolderId(next.selectedFolderId);
    setMixerLevels(next.mixerLevels);
    setMixerPans(next.mixerPans);
    setMixerMutes(next.mixerMutes);
    setMixerSolos(next.mixerSolos);
    setMixerSends(next.mixerSends);
    setEqByTrack(next.eqByTrack);
    setEqTargetId(next.eqTargetId);
    setEqQ(next.eqQ);
    setEqLowCut(next.eqLowCut);
    setEqHighCut(next.eqHighCut);
    setMasterLimiter(next.masterLimiter);
    setNleHeight(next.nleHeight);
    setIsPlaying(false);
    setSelectedClipId(null);
    setSelectedStageId(next.stagedFiles.find((s) => s.expanded)?.id ?? null);
  }

  async function handleSaveSnapshot(kind: LabRoomSnapshot["kind"] = "snapshot") {
    if (kind === "publish" && !preview && !isLeader) {
      setSnapshotNotice(room.snapshotLeaderOnly);
      return;
    }
    const label =
      snapshotLabelDraft.trim() ||
      (kind === "publish"
        ? room.snapshotPublishDefault(snapshots.filter((s) => s.kind === "publish").length + 1)
        : formatSnapshotDefaultLabel());
    const payload = captureRoomSnapshotPayload();

    if (preview) {
      const entry: LabRoomSnapshot = {
        id: crypto.randomUUID(),
        label,
        kind,
        createdAt: new Date().toISOString(),
        createdBy: userId,
        archived: false,
        payload,
      };
      setSnapshots((prev) => [entry, ...prev]);
    } else {
      const supabase = createClient();
      const saved = await insertLabSnapshot(supabase, {
        labId: labData.lab.id,
        userId,
        label,
        kind,
        payload,
      });
      if (!saved) {
        setSnapshotNotice(room.snapshotSaveFailed);
        return;
      }
      setSnapshots((prev) => [saved, ...prev]);
    }

    setSnapshotLabelDraft("");
    setSnapshotNotice(
      kind === "publish" ? room.snapshotPublishSaved(label) : room.snapshotSaved(label),
    );
  }

  function handleRestoreSnapshot(id: string) {
    if (!preview && !isLeader) {
      setSnapshotNotice(room.snapshotLeaderOnly);
      return;
    }
    const target = snapshots.find((s) => s.id === id && !s.archived);
    if (!target) return;
    if (!window.confirm(room.snapshotRestoreConfirm(target.label))) return;
    applyRoomSnapshotPayload(target.payload);
    setSnapshotNotice(room.snapshotRestored(target.label));
  }

  async function handleArchiveSnapshot(id: string) {
    if (!preview && !isLeader) {
      setSnapshotNotice(room.snapshotLeaderOnly);
      return;
    }
    if (!preview) {
      const supabase = createClient();
      const ok = await archiveLabSnapshot(supabase, id);
      if (!ok) {
        setSnapshotNotice(room.snapshotSaveFailed);
        return;
      }
    }
    setSnapshots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, archived: true } : s)),
    );
    setSnapshotNotice(room.snapshotArchived);
  }

  const visibleSnapshots = useMemo(
    () => snapshots.filter((s) => !s.archived),
    [snapshots],
  );

  const timelineStageFiles = useMemo(
    () => stagedFiles.filter((item) => item.expanded),
    [stagedFiles],
  );
  const pendingStageFiles = useMemo(
    () => stagedFiles.filter((item) => !item.expanded),
    [stagedFiles],
  );

  const operateItem = useMemo(() => {
    const byStage = stagedFiles.find((item) => item.id === selectedStageId);
    if (byStage?.expanded) return byStage;
    const byClip = stagedFiles.find(
      (item) => item.clipId === selectedClipId && item.expanded,
    );
    if (byClip) return byClip;
    return timelineStageFiles[0] ?? null;
  }, [stagedFiles, selectedStageId, selectedClipId, timelineStageFiles]);

  const playheadTimecode = useMemo(() => {
    const totalFrames = Math.round(
      (playheadPct / 100) * timelineDurationSec * 30,
    );
    const ff = totalFrames % 30;
    const totalSec = Math.floor(totalFrames / 30);
    const ss = totalSec % 60;
    const mm = Math.floor(totalSec / 60) % 60;
    const hh = Math.floor(totalSec / 3600);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`;
  }, [playheadPct, timelineDurationSec]);

  const waveformTarget = useMemo(() => {
    if (!operateItem || operateItem.kind !== "audio") return null;
    const clipId = operateItem.clipId;
    let clipStartPct: number | null = null;
    let clipWidthPct: number | null = null;
    if (clipId) {
      for (const track of tracks) {
        const clip = track.clips.find((c) => c.id === clipId);
        if (clip) {
          clipStartPct = clip.startPct;
          clipWidthPct = clip.widthPct;
          break;
        }
      }
    }
    return {
      id: operateItem.id,
      label: operateItem.label,
      clipStartPct,
      clipWidthPct,
    };
  }, [operateItem, tracks]);

  /** Center waveform playhead: clip-local when on timeline, else full sequence. */
  const waveformPlayheadPct = useMemo(() => {
    if (!waveformTarget) return playheadPct;
    const start = waveformTarget.clipStartPct;
    const width = waveformTarget.clipWidthPct;
    if (start == null || width == null || width <= 0) return playheadPct;
    if (playheadPct <= start) return 0;
    if (playheadPct >= start + width) return 100;
    return ((playheadPct - start) / width) * 100;
  }, [waveformTarget, playheadPct]);

  const waveBars = useMemo(() => {
    if (!waveformTarget) return [];
    return buildDemoWaveform(waveformTarget.id, 72);
  }, [waveformTarget]);

  const videoPreviewFrames = useMemo(() => {
    if (!operateItem || operateItem.kind !== "video") return [];
    const width =
      tracks
        .flatMap((t) => t.clips)
        .find((c) => c.id === operateItem.clipId)?.widthPct ?? 24;
    const count = Math.max(4, Math.min(16, Math.round(width / 3.5)));
    return Array.from({ length: count }, (_, i) => i);
  }, [operateItem, tracks]);

  useEffect(() => {
    const engine = new LabAudioEngine();
    audioEngineRef.current = engine;
    return () => {
      engine.dispose();
      audioEngineRef.current = null;
    };
  }, []);

  const playableAudioClips = useMemo(() => {
    const out: Array<{
      clipId: string;
      trackId: string;
      url: string;
      startPct: number;
      widthPct: number;
    }> = [];
    for (const track of tracks) {
      if (track.kind !== "audio") continue;
      for (const clip of track.clips) {
        const stage = stagedFiles.find((s) => s.clipId === clip.id);
        const fromStage = stage?.url?.trim();
        const fromAsset = assetList
          .find((a) => a.id === stage?.assetId)
          ?.url?.trim();
        const url = fromStage || fromAsset || "";
        if (!url) continue;
        out.push({
          clipId: clip.id,
          trackId: track.id,
          url,
          startPct: clip.startPct,
          widthPct: clip.widthPct,
        });
      }
    }
    return out;
  }, [tracks, stagedFiles, assetList]);

  const timelinePlaySpeed =
    playableAudioClips.length > 0 ? 1 : NLE_PLAY_SPEED;

  useEffect(() => {
    if (!isPlaying) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setPlayheadPct((prev) => {
        const dur = Math.max(0.05, timelineDurationRef.current);
        const next = prev + ((dt * timelinePlaySpeed) / dur) * 100;
        if (next >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, timelinePlaySpeed]);

  useEffect(() => {
    const engine = audioEngineRef.current;
    if (!engine) return;
    const forceSeek = playheadScrubbedRef.current;
    playheadScrubbedRef.current = false;
    const head =
      playheadOverrideRef.current != null
        ? playheadOverrideRef.current
        : playheadPct;
    playheadOverrideRef.current = null;
    const result = engine.sync({
      isPlaying,
      playheadPct: head,
      durationSec: timelineDurationSec,
      playSpeed: timelinePlaySpeed,
      clips: playableAudioClips,
      mixer: {
        levels: mixerLevels,
        mutes: mixerMutes,
        solos: mixerSolos,
        masterLimiter,
      },
      forceSeek,
    });
    if (result.error) {
      setAudioNotice(result.error);
    }
  }, [
    isPlaying,
    playheadPct,
    playableAudioClips,
    timelinePlaySpeed,
    mixerLevels,
    mixerMutes,
    mixerSolos,
    masterLimiter,
    timelineDurationSec,
  ]);

  function startTimelinePlayback() {
    const head = playheadPct >= 100 ? 0 : playheadPct;
    if (playheadPct >= 100) {
      setPlayheadPct(0);
    }

    const hasUrlOnTimeline = playableAudioClips.length > 0;
    const underHead = playableAudioClips.some(
      (c) => head >= c.startPct && head < c.startPct + c.widthPct,
    );
    const hasAudioClip = tracks.some(
      (t) => t.kind === "audio" && t.clips.length > 0,
    );

    if (hasUrlOnTimeline && underHead) {
      setAudioNotice(null);
    } else if (hasUrlOnTimeline && !underHead) {
      setAudioNotice(room.timelineAudioMovePlayhead);
    } else if (hasAudioClip) {
      setAudioNotice(room.timelineAudioNeedsUrl);
    } else {
      setAudioNotice(null);
    }

    // Keep playhead where the user left it — never jump to a clip.
    playheadScrubbedRef.current = true;
    playheadOverrideRef.current = null;
    setIsPlaying(true);
  }

  function guessAssetKind(file: File): LabDemoAsset["kind"] {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    const lower = file.name.toLowerCase();
    if (/\.(pdf|doc|docx|txt|md)$/.test(lower)) return "doc";
    if (/\.(mp3|wav|flac|aac|m4a|ogg)$/.test(lower)) return "audio";
    if (/\.(mp4|mov|webm|mkv)$/.test(lower)) return "video";
    if (/\.(png|jpg|jpeg|gif|webp|psd)$/.test(lower)) return "image";
    return "other";
  }

  function folderAssetCount(folderId: string): number {
    return assetList.filter((asset) => asset.folderId === folderId).length;
  }

  async function handleFolderUpload(file: File) {
    setFolderUploadError(null);
    setFolderUploadLoading(true);
    try {
      const parts = file.name.split(".");
      const ext = parts.length > 1 ? (parts.pop() as string) : "bin";
      const name = parts.join(".") || file.name;
      const kind = guessAssetKind(file);

      if (preview) {
        const asset: LabDemoAsset = {
          id: `up-${crypto.randomUUID().slice(0, 8)}`,
          name,
          ext,
          kind,
          folderId: selectedFolderId,
          url:
            kind === "audio" || kind === "video" || kind === "image"
              ? URL.createObjectURL(file)
              : null,
        };
        setAssetList((prev) => [...prev, asset]);
        return;
      }

      if (!selectedFolderId) {
        setFolderUploadError(room.fileUploadFailed);
        return;
      }

      const supabase = createClient();
      const uploaded = await uploadLabChatShare(
        supabase,
        userId,
        labData.lab.id,
        file,
      );
      const saved = await insertLabAsset(supabase, {
        labId: labData.lab.id,
        folderId: selectedFolderId,
        userId,
        name,
        ext,
        kind,
        storagePath: uploaded.storagePath,
        publicUrl: uploaded.publicUrl,
      });
      if (!saved) {
        setFolderUploadError(room.fileUploadFailed);
        return;
      }
      setAssetList((prev) => [...prev, saved]);
    } catch (err) {
      const message = err instanceof Error ? err.message : room.fileUploadFailed;
      if (message === "FILE_TOO_LARGE") {
        setFolderUploadError(room.fileTooLarge);
      } else {
        setFolderUploadError(message || room.fileUploadFailed);
      }
    } finally {
      setFolderUploadLoading(false);
      if (folderUploadInputRef.current) folderUploadInputRef.current.value = "";
    }
  }

  async function handleDeleteAsset(assetId: string) {
    if (!isLeader) {
      setFolderUploadError(room.deleteLeaderOnly);
      return;
    }
    if (!preview) {
      const supabase = createClient();
      const ok = await archiveLabAsset(supabase, assetId);
      if (!ok) {
        setFolderUploadError(room.fileUploadFailed);
        return;
      }
    }
    setAssetList((prev) => prev.filter((asset) => asset.id !== assetId));
    setFolderUploadError(null);
  }

  async function handleDeleteFolder(folderId: string) {
    if (!isLeader) {
      setFolderUploadError(room.deleteLeaderOnly);
      return;
    }
    if (!preview) {
      const supabase = createClient();
      const ok = await archiveLabFolder(supabase, folderId);
      if (!ok) {
        setFolderUploadError(room.fileUploadFailed);
        return;
      }
    }
    const remaining = folderList.filter((folder) => folder.id !== folderId);
    setFolderList(remaining);
    setAssetList((prev) => prev.filter((asset) => asset.folderId !== folderId));
    if (selectedFolderId === folderId) {
      setSelectedFolderId(remaining[0]?.id ?? "");
    }
    setFolderUploadError(null);
  }

  function handleNleResizePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    nleDragRef.current = { startY: event.clientY, startH: nleHeight };
  }

  function handleNleResizePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!nleDragRef.current) return;
    const delta = nleDragRef.current.startY - event.clientY;
    const next = Math.min(
      NLE_HEIGHT_MAX,
      Math.max(NLE_HEIGHT_MIN, nleDragRef.current.startH + delta),
    );
    setNleHeight(next);
  }

  function handleNleResizePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    nleDragRef.current = null;
  }

  function setPlayheadFromClientX(clientX: number) {
    const el = canvasRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    playheadScrubbedRef.current = true;
    setPlayheadPct(Math.min(100, Math.max(0, pct)));
  }

  function handlePlayheadPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsPlaying(false);
    playheadDragRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setPlayheadFromClientX(event.clientX);
  }

  function handlePlayheadPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!playheadDragRef.current) return;
    setPlayheadFromClientX(event.clientX);
  }

  function handlePlayheadPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    playheadDragRef.current = false;
  }

  function handleRulerPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsPlaying(false);
    playheadDragRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setPlayheadFromClientX(event.clientX);
  }

  function setPlayheadFromWaveformClientX(clientX: number) {
    const el = waveformCanvasRef.current;
    if (!el || !waveformTarget) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const localPct = Math.min(
      100,
      Math.max(0, ((clientX - rect.left) / rect.width) * 100),
    );
    const start = waveformTarget.clipStartPct;
    const width = waveformTarget.clipWidthPct;
    if (start != null && width != null && width > 0) {
      playheadScrubbedRef.current = true;
      setPlayheadPct(start + (localPct / 100) * width);
      return;
    }
    playheadScrubbedRef.current = true;
    setPlayheadPct(localPct);
  }

  function handleWaveformPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsPlaying(false);
    waveformDragRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    setPlayheadFromWaveformClientX(event.clientX);
  }

  function handleWaveformPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!waveformDragRef.current) return;
    setPlayheadFromWaveformClientX(event.clientX);
  }

  function handleWaveformPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    waveformDragRef.current = false;
  }

  function trackKindForAsset(asset: Pick<LabDemoAsset, "kind">): LabTimelineTrackKind {
    return asset.kind === "audio" ? "audio" : "video";
  }

  function addClipToTimeline(
    label: string,
    kind: LabTimelineTrackKind,
    clipId: string,
    mediaDurationSec?: number,
  ) {
    const prevDur = Math.max(0.05, timelineDurationRef.current);
    const defaultClipSec =
      kind === "audio" ? prevDur * 0.22 : prevDur * 0.16;
    const mediaSec =
      mediaDurationSec && mediaDurationSec > 0
        ? mediaDurationSec
        : defaultClipSec;
    const startSec = (playheadPct / 100) * prevDur;
    const nextDur = Math.max(prevDur, startSec + mediaSec, NLE_DURATION_SEC);
    const scale = prevDur / nextDur;
    const startPct = Math.min(
      99.5,
      Math.max(0, Math.round((startSec / nextDur) * 1000) / 10),
    );
    const widthPct = Math.min(
      100 - startPct,
      Math.max(1, Math.round((mediaSec / nextDur) * 1000) / 10),
    );

    if (nextDur !== prevDur) {
      timelineDurationRef.current = nextDur;
      setTimelineDurationSec(nextDur);
      setPlayheadPct((p) => Math.min(100, (p / 100) * prevDur / nextDur * 100));
    }

    const existing = tracks.find((track) => track.kind === kind);
    let targetId = existing?.id ?? null;
    let created: LabTimelineTrack | null = null;

    if (!existing) {
      const same = tracks.filter((t) => t.kind === kind);
      const nextIndex =
        same.length === 0 ? 1 : Math.max(...same.map((t) => t.index)) + 1;
      created = {
        id: `${kind[0]}${nextIndex}-${crypto.randomUUID().slice(0, 6)}`,
        kind,
        index: nextIndex,
        height: kind === "video" ? "tall" : "short",
        clips: [],
      };
      targetId = created.id;
    }

    setTracks((prev) => {
      const scaled =
        nextDur === prevDur
          ? prev
          : prev.map((track) => ({
              ...track,
              clips: track.clips.map((clip) => ({
                ...clip,
                startPct: clip.startPct * scale,
                widthPct: clip.widthPct * scale,
              })),
            }));

      const target = created ?? scaled.find((track) => track.id === targetId);
      if (!target) return scaled;
      const next = created
        ? kind === "video"
          ? [
              created,
              ...scaled.filter((t) => t.kind === "video"),
              ...scaled.filter((t) => t.kind === "audio"),
            ]
          : [...scaled, created]
        : scaled;

      const live = next.find((track) => track.id === target!.id) ?? target;

      return next.map((track) =>
        track.id === live.id
          ? {
              ...track,
              clips: [...track.clips, { id: clipId, label, startPct, widthPct }],
            }
          : track,
      );
    });

    if (kind === "audio" && targetId) {
      setMixerLevels((levels) =>
        levels[targetId!] == null ? { ...levels, [targetId!]: 65 } : levels,
      );
      setMixerPans((pans) =>
        pans[targetId!] == null ? { ...pans, [targetId!]: 0 } : pans,
      );
    }

    setSelectedClipId(clipId);
    setNleHeight((h) => Math.max(h, 240));
  }

  /** Premiere-style: new empty A track (+ mixer channel). Clips still share that track's fader. */
  function addAudioTrack() {
    const same = tracks.filter((t) => t.kind === "audio");
    const nextIndex =
      same.length === 0 ? 1 : Math.max(...same.map((t) => t.index)) + 1;
    const track: LabTimelineTrack = {
      id: `a${nextIndex}-${crypto.randomUUID().slice(0, 6)}`,
      kind: "audio",
      index: nextIndex,
      height: "short",
      clips: [],
    };
    setTracks((prev) => [...prev, track]);
    setMixerLevels((levels) => ({ ...levels, [track.id]: 65 }));
    setMixerPans((pans) => ({ ...pans, [track.id]: 0 }));
    setMixerSends((sends) => ({ ...sends, [track.id]: 20 }));
    setEqByTrack((prev) => ({ ...prev, [track.id]: [...LAB_EQ_DEFAULTS] }));
    setEqTargetId(track.id);
    setAudioConsoleTab("mixer");
    setAudioConsoleOpen(true);
    audioWinLockedRef.current = true;
    setAudioWinLocked(true);
    setNleHeight((h) => Math.max(h, 240));
  }

  const anySolo = useMemo(
    () => Object.values(mixerSolos).some(Boolean),
    [mixerSolos],
  );

  useEffect(() => {
    if (!audioConsoleOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setAudioConsoleOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [audioConsoleOpen]);

  useEffect(() => {
    audioWinLockedRef.current = audioWinLocked;
  }, [audioWinLocked]);

  useEffect(() => {
    clipMiniWinsRef.current = clipMiniWins;
  }, [clipMiniWins]);

  useEffect(() => {
    function onMove(event: PointerEvent) {
      const drag = clipMiniDragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.moved && dx * dx + dy * dy < 36) return;
      drag.moved = true;
      const win = clipMiniWinsRef.current.find((w) => w.stageId === drag.stageId);
      const width = win?.w ?? CLIP_MINI_W;
      const height = win?.h ?? CLIP_MINI_H;
      const maxX = Math.max(8, window.innerWidth - width - 8);
      const maxY = Math.max(8, window.innerHeight - height - 8);
      const nextX = Math.min(maxX, Math.max(8, drag.originX + dx));
      const nextY = Math.min(maxY, Math.max(8, drag.originY + dy));
      setClipMiniWins((prev) =>
        prev.map((w) =>
          w.stageId === drag.stageId ? { ...w, x: nextX, y: nextY } : w,
        ),
      );
    }

    function onUp(event: PointerEvent) {
      const drag = clipMiniDragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const moved = drag.moved;
      clipMiniDragRef.current = null;
      if (moved) {
        clipMiniSkipClickRef.current = true;
        setClipMiniWins((prev) =>
          prev.map((w) =>
            w.stageId === drag.stageId ? { ...w, locked: true } : w,
          ),
        );
      }
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  useEffect(() => {
    audioWinPosRef.current = audioWinPos;
  }, [audioWinPos]);

  useEffect(() => {
    function onMove(event: PointerEvent) {
      // Resize has its own listeners; ignore here.
      if (audioWinResizeRef.current) return;

      const drag = audioWinDragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      if (audioWinLockedRef.current) {
        audioWinDragRef.current = null;
        return;
      }
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.moved && dx * dx + dy * dy < 36) return;
      drag.moved = true;
      const el = audioWinRef.current;
      const width = el?.offsetWidth ?? AUDIO_WIN_W_DEFAULT;
      const height = el?.offsetHeight ?? AUDIO_WIN_H_DEFAULT;
      const maxX = Math.max(8, window.innerWidth - width - 8);
      const maxY = Math.max(8, window.innerHeight - height - 8);
      setAudioWinPos({
        x: Math.min(maxX, Math.max(8, drag.originX + dx)),
        y: Math.min(maxY, Math.max(8, drag.originY + dy)),
      });
    }

    function onUp(event: PointerEvent) {
      if (audioWinResizeRef.current) return;
      const drag = audioWinDragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      const moved = drag.moved;
      audioWinDragRef.current = null;
      if (moved) {
        audioWinSkipClickRef.current = true;
        audioWinLockedRef.current = true;
        setAudioWinLocked(true);
      }
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  function handleAudioWinPointerDown(event: React.PointerEvent<HTMLElement>) {
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;
    if (target.closest("button, input, label, a, .lab-room__audio-win-resize")) {
      return;
    }
    // Locked: no drag. Unlock happens on click only.
    if (audioWinLockedRef.current) return;
    const el = audioWinRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    audioWinDragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      originX: rect.left,
      originY: rect.top,
      moved: false,
      pointerId: event.pointerId,
    };
  }

  function handleAudioWinTitleClick(event: React.MouseEvent<HTMLElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("button, input, label, a, .lab-room__audio-win-resize")) {
      return;
    }
    if (audioWinSkipClickRef.current) {
      audioWinSkipClickRef.current = false;
      return;
    }
    setAudioWinLocked((prev) => {
      const next = !prev;
      audioWinLockedRef.current = next;
      return next;
    });
  }

  function handleAudioWinResizePointerDown(
    edge: AudioWinResizeEdge,
    event: React.PointerEvent<HTMLElement>,
  ) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const el = audioWinRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    audioWinDragRef.current = null;

    const startX = event.clientX;
    const startY = event.clientY;
    const originW = rect.width;
    const originH = rect.height;
    const originLeft = rect.left;
    const originTop = rect.top;
    const pointerId = event.pointerId;

    // Anchor with left/top so width/height grow from the top-left corner.
    if (!audioWinPosRef.current) {
      const pos = { x: originLeft, y: originTop };
      audioWinPosRef.current = pos;
      setAudioWinPos(pos);
    }

    function onMove(ev: PointerEvent) {
      if (ev.pointerId !== pointerId) return;
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const maxW = Math.max(AUDIO_WIN_W_MIN, window.innerWidth - 24);
      const maxH = Math.max(AUDIO_WIN_H_MIN, window.innerHeight - 24);
      let nextW = originW;
      let nextH = originH;
      if (edge === "e" || edge === "se") {
        nextW = Math.min(maxW, Math.max(AUDIO_WIN_W_MIN, originW + dx));
      }
      if (edge === "s" || edge === "se") {
        nextH = Math.min(maxH, Math.max(AUDIO_WIN_H_MIN, originH + dy));
      }
      setAudioWinSize({ w: Math.round(nextW), h: Math.round(nextH) });
    }

    function onUp(ev: PointerEvent) {
      if (ev.pointerId !== pointerId) return;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      audioWinResizeRef.current = null;
    }

    audioWinResizeRef.current = {
      edge,
      startX,
      startY,
      originW,
      originH,
      originLeft,
      originTop,
      pointerId,
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }

  const activeEqBands = eqByTrack[eqTargetId] ?? LAB_EQ_DEFAULTS;

  function setActiveEqBand(index: number, value: number) {
    setEqByTrack((prev) => {
      const current = [...(prev[eqTargetId] ?? LAB_EQ_DEFAULTS)];
      current[index] = value;
      return { ...prev, [eqTargetId]: current };
    });
  }

  function applyEqPreset(preset: keyof typeof EQ_PRESETS) {
    setEqByTrack((prev) => ({
      ...prev,
      [eqTargetId]: [...EQ_PRESETS[preset]],
    }));
  }

  function channelDimmed(trackId: string): boolean {
    if (mixerMutes[trackId]) return true;
    if (anySolo && !mixerSolos[trackId]) return true;
    return false;
  }

  function formatPanLabel(value: number): string {
    if (value === 0) return room.mixerPanCenter;
    if (value < 0) return `L${Math.abs(value)}`;
    return `R${value}`;
  }

  /** Premiere-style filmstrip: more frames for longer clips. */
  function videoFrameCount(widthPct: number): number {
    return Math.max(2, Math.min(20, Math.round(widthPct / 3.5)));
  }

  function videoFrameStyle(clipId: string, frameIndex: number): React.CSSProperties {
    let hash = 0;
    for (let i = 0; i < clipId.length; i += 1) {
      hash = (hash + clipId.charCodeAt(i) * (i + 3)) % 360;
    }
    const hue = (hash + frameIndex * 14) % 360;
    const light = 28 + ((frameIndex * 7) % 18);
    return {
      background: `linear-gradient(145deg, hsl(${hue} 32% ${light + 10}%), hsl(${(hue + 28) % 360} 40% ${light}%))`,
    };
  }

  function removeClipFromTimeline(clipId: string) {
    setTracks((prev) =>
      prev.map((track) => ({
        ...track,
        clips: track.clips.filter((clip) => clip.id !== clipId),
      })),
    );
    setSelectedClipId((id) => (id === clipId ? null : id));
  }

  function restoreAssetToFolder(item: {
    assetId: string;
    folderId: string;
    name: string;
    ext: string;
    assetKind: LabDemoAsset["kind"];
    url?: string | null;
  }) {
    setAssetList((prev) => {
      if (prev.some((asset) => asset.id === item.assetId)) return prev;
      const folderExists = folderList.some((folder) => folder.id === item.folderId);
      return [
        ...prev,
        {
          id: item.assetId,
          name: item.name,
          ext: item.ext,
          kind: item.assetKind,
          folderId: folderExists ? item.folderId : folderList[0]?.id ?? "audio",
          url: item.url ?? null,
        },
      ];
    });
  }

  function parseLabelParts(label: string): { name: string; ext: string } {
    return parseAssetLabel(label);
  }

  /** Return staged item to shared folder (not delete). */
  function returnStagedToFolder(stageId: string) {
    const target = stagedFiles.find((item) => item.id === stageId);
    if (!target) return;
    if (target.clipId) {
      removeClipFromTimeline(target.clipId);
    }
    restoreAssetToFolder(target);
    setStagedFiles((prev) => prev.filter((item) => item.id !== stageId));
    setSelectedStageId((id) => (id === stageId ? null : id));
    closeClipMiniWin(stageId);
  }

  /** Return selected timeline clip to shared folder (not delete). */
  function returnSelectedClipToFolder() {
    if (!selectedClipId) return;
    const clipId = selectedClipId;
    const linked = stagedFiles.find((item) => item.clipId === clipId);

    if (linked) {
      returnStagedToFolder(linked.id);
      return;
    }

    let label = "";
    for (const track of tracks) {
      const clip = track.clips.find((c) => c.id === clipId);
      if (clip) {
        label = clip.label;
        break;
      }
    }
    if (!label) return;

    const { name, ext } = parseLabelParts(label);
    const lower = label.toLowerCase();
    const isAudio = /\.(mp3|wav|flac|aac|m4a|ogg)$/.test(lower);
    restoreAssetToFolder({
      assetId: `restored-${clipId}`,
      folderId: isAudio ? "audio" : "project",
      name,
      ext,
      assetKind: isAudio ? "audio" : "video",
    });
    setStagedFiles((prev) =>
      prev.map((item) =>
        item.clipId === clipId
          ? { ...item, expanded: false, clipId: null }
          : item,
      ),
    );
    removeClipFromTimeline(clipId);
  }

  function stageFile(
    label: string,
    kind: LabTimelineTrackKind,
    asset?: LabDemoAsset,
  ) {
    const existing = stagedFiles.find(
      (item) => item.label === label && !item.expanded,
    );
    if (existing) {
      setSelectedStageId(existing.id);
      setOpenFile(null);
      setModalError(null);
      return;
    }

    const { name, ext } = asset
      ? { name: asset.name, ext: asset.ext }
      : parseLabelParts(label);
    const assetId = asset?.id ?? `staged-asset-${crypto.randomUUID().slice(0, 8)}`;
    const folderId =
      asset?.folderId ?? (kind === "audio" ? "audio" : "project");
    const assetKind: LabDemoAsset["kind"] =
      asset?.kind ?? (kind === "audio" ? "audio" : kind === "video" ? "video" : "other");
    const url = asset?.url ?? null;

    if (asset) {
      setAssetList((prev) => prev.filter((a) => a.id !== asset.id));
    } else {
      setAssetList((prev) => prev.filter((a) => `${a.name}.${a.ext}` !== label));
    }

    const id = `stage-${crypto.randomUUID().slice(0, 8)}`;
    setStagedFiles((prev) => [
      ...prev,
      {
        id,
        label,
        kind,
        expanded: false,
        clipId: null,
        assetId,
        folderId,
        name,
        ext,
        assetKind,
        url,
      },
    ]);
    setSelectedStageId(id);
    setOpenFile(null);
    setModalError(null);
    setAudioNotice(null);
  }

  async function toggleStageExpand(stageId: string, expand: boolean) {
    const target = stagedFiles.find((item) => item.id === stageId);
    if (!target) return;

    if (expand && !target.expanded) {
      const clipId = `drop-${crypto.randomUUID().slice(0, 8)}`;
      let mediaDur: number | undefined;
      if (
        target.assetKind !== "image" &&
        (target.kind === "audio" || target.kind === "video") &&
        target.url
      ) {
        mediaDur = (await probeMediaDuration(target.url)) ?? undefined;
      }
      addClipToTimeline(target.label, target.kind, clipId, mediaDur);
      setStagedFiles((prev) =>
        prev.map((item) =>
          item.id === stageId ? { ...item, expanded: true, clipId } : item,
        ),
      );
      setSelectedStageId(stageId);
      setSelectedClipId(clipId);
      openClipMiniWin(stageId);
      return;
    }

    if (!expand && target.expanded && target.clipId) {
      removeClipFromTimeline(target.clipId);
      setStagedFiles((prev) =>
        prev.map((item) =>
          item.id === stageId ? { ...item, expanded: false, clipId: null } : item,
        ),
      );
      closeClipMiniWin(stageId);
    }
  }

  function handleAssetDragStart(
    event: React.DragEvent<HTMLButtonElement>,
    asset: LabDemoAsset,
  ) {
    const payload = JSON.stringify(asset);
    event.dataTransfer.setData("application/x-eldonia-lab-asset", payload);
    event.dataTransfer.setData("text/plain", `${asset.name}.${asset.ext}`);
    event.dataTransfer.effectAllowed = "copy";
  }

  function handleWorkspaceDragOver(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    if (!workspaceDropActive) setWorkspaceDropActive(true);
  }

  function handleWorkspaceDragLeave(event: React.DragEvent<HTMLElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    setWorkspaceDropActive(false);
  }

  function handleWorkspaceDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    setWorkspaceDropActive(false);

    const raw = event.dataTransfer.getData("application/x-eldonia-lab-asset");
    if (raw) {
      try {
        const asset = JSON.parse(raw) as LabDemoAsset;
        if (asset?.name && asset?.ext && asset?.kind) {
          stageFile(`${asset.name}.${asset.ext}`, trackKindForAsset(asset), asset);
          return;
        }
      } catch {
        /* fall through */
      }
    }

    const plain = event.dataTransfer.getData("text/plain")?.trim();
    if (plain) {
      const matched = assetList.find(
        (asset) => `${asset.name}.${asset.ext}`.toLowerCase() === plain.toLowerCase(),
      );
      if (matched) {
        stageFile(`${matched.name}.${matched.ext}`, trackKindForAsset(matched), matched);
        return;
      }
      const lower = plain.toLowerCase();
      const kind: LabTimelineTrackKind =
        /\.(mp3|wav|flac|aac|m4a|ogg)$/.test(lower) ? "audio" : "video";
      stageFile(plain, kind);
      return;
    }

    const file = event.dataTransfer.files?.[0];
    if (file) {
      void stageDroppedOsFile(file);
    }
  }

  async function stageDroppedOsFile(file: File) {
    const assetKind = guessAssetKind(file);
    const kind: LabTimelineTrackKind =
      assetKind === "audio" ? "audio" : "video";
    const parts = file.name.split(".");
    const ext = parts.length > 1 ? (parts.pop() as string) : "bin";
    const name = parts.join(".") || file.name;

    let url: string | null = URL.createObjectURL(file);
    let storagePath: string | null = null;
    let assetId = `local-${crypto.randomUUID().slice(0, 8)}`;

    if (!preview && (assetKind === "audio" || assetKind === "image" || assetKind === "video")) {
      try {
        const supabase = createClient();
        const uploaded = await uploadLabChatShare(
          supabase,
          userId,
          labData.lab.id,
          file,
        );
        URL.revokeObjectURL(url);
        url = uploaded.publicUrl;
        storagePath = uploaded.storagePath;
        if (selectedFolderId) {
          const saved = await insertLabAsset(supabase, {
            labId: labData.lab.id,
            folderId: selectedFolderId,
            userId,
            name,
            ext,
            kind: assetKind,
            storagePath,
            publicUrl: url,
          });
          if (saved) {
            assetId = saved.id;
            url = saved.url ?? url;
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : room.fileUploadFailed;
        setAudioNotice(
          message === "FILE_TOO_LARGE" ? room.fileTooLarge : message || room.fileUploadFailed,
        );
        // Keep object URL so preview playback still works locally.
      }
    }

    stageFile(file.name, kind, {
      id: assetId,
      name,
      ext,
      kind: assetKind,
      folderId: selectedFolderId || (assetKind === "audio" ? "audio" : "project"),
      url,
      storagePath,
    });
  }

  function handleFolderAssetClick(asset: LabDemoAsset) {
    stageFile(`${asset.name}.${asset.ext}`, trackKindForAsset(asset), asset);
  }

  function selectStageItem(item: WorkspaceStagedFile) {
    setSelectedStageId(item.id);
    if (item.clipId) setSelectedClipId(item.clipId);
    if (item.expanded) openClipMiniWin(item.id);
  }

  function clipMiniMediaKind(
    item: WorkspaceStagedFile,
  ): "image" | "video" | "audio" | "other" {
    if (
      item.assetKind === "image" ||
      /\.(png|jpe?g|gif|webp|bmp|psd)$/i.test(item.ext)
    ) {
      return "image";
    }
    if (item.assetKind === "audio" || item.kind === "audio") return "audio";
    if (item.assetKind === "video" || item.kind === "video") return "video";
    return "other";
  }

  function openClipMiniWin(stageId: string) {
    setClipMiniWins((prev) => {
      clipMiniZRef.current += 1;
      const z = clipMiniZRef.current;
      const existing = prev.find((w) => w.stageId === stageId);
      if (existing) {
        return prev.map((w) => (w.stageId === stageId ? { ...w, z } : w));
      }
      const offset = prev.length * CLIP_MINI_CASCADE;
      return [
        ...prev,
        {
          stageId,
          x: 56 + offset,
          y: 88 + offset,
          w: CLIP_MINI_W,
          h: CLIP_MINI_H,
          locked: true,
          z,
        },
      ];
    });
  }

  function closeClipMiniWin(stageId: string) {
    setClipMiniWins((prev) => prev.filter((w) => w.stageId !== stageId));
  }

  function bringClipMiniToFront(stageId: string) {
    clipMiniZRef.current += 1;
    const z = clipMiniZRef.current;
    setClipMiniWins((prev) =>
      prev.map((w) => (w.stageId === stageId ? { ...w, z } : w)),
    );
  }

  function handleClipMiniPointerDown(
    stageId: string,
    event: React.PointerEvent<HTMLElement>,
  ) {
    const target = event.target as HTMLElement;
    if (target.closest("button, input, label, a, video, audio")) return;
    const win = clipMiniWins.find((w) => w.stageId === stageId);
    if (!win || win.locked) {
      bringClipMiniToFront(stageId);
      return;
    }
    event.preventDefault();
    clipMiniDragRef.current = {
      stageId,
      startX: event.clientX,
      startY: event.clientY,
      originX: win.x,
      originY: win.y,
      moved: false,
      pointerId: event.pointerId,
    };
    bringClipMiniToFront(stageId);
  }

  function handleClipMiniTitleClick(stageId: string, event: React.MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;
    if (clipMiniSkipClickRef.current) {
      clipMiniSkipClickRef.current = false;
      return;
    }
    setClipMiniWins((prev) =>
      prev.map((w) =>
        w.stageId === stageId ? { ...w, locked: !w.locked } : w,
      ),
    );
  }

  function moveClipStart(clipId: string, startPct: number) {
    setTracks((prev) =>
      prev.map((track) => ({
        ...track,
        clips: track.clips.map((clip) =>
          clip.id === clipId ? { ...clip, startPct } : clip,
        ),
      })),
    );
  }

  function handleClipPointerDown(
    event: React.PointerEvent<HTMLButtonElement>,
    clipId: string,
    startPct: number,
    widthPct: number,
    trackKind: LabTimelineTrackKind,
  ) {
    const lane = event.currentTarget.parentElement;
    if (!lane) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedClipId(clipId);
    if (trackKind === "audio" || trackKind === "video") {
      const linked = stagedFiles.find((item) => item.clipId === clipId);
      setSelectedStageId(linked?.id ?? null);
    }
    clipDragRef.current = {
      clipId,
      startX: event.clientX,
      startPct,
      widthPct,
      laneWidth: lane.getBoundingClientRect().width || 1,
      moved: false,
    };
  }

  function handleClipPointerMove(event: React.PointerEvent<HTMLButtonElement>) {
    const drag = clipDragRef.current;
    if (!drag || drag.clipId !== event.currentTarget.dataset.clipId) return;
    const deltaPct = ((event.clientX - drag.startX) / drag.laneWidth) * 100;
    if (Math.abs(deltaPct) > 0.4) drag.moved = true;
    const next = Math.min(
      100 - drag.widthPct,
      Math.max(0, drag.startPct + deltaPct),
    );
    moveClipStart(drag.clipId, Math.round(next * 10) / 10);
  }

  function handleClipPointerUp(
    event: React.PointerEvent<HTMLButtonElement>,
    trackKind: LabTimelineTrackKind,
    trackIndex: number,
    clipLabel: string,
  ) {
    const drag = clipDragRef.current;
    const moved = Boolean(drag?.moved);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    clipDragRef.current = null;
    if (moved) return;
    tryOpenFile({
      id: event.currentTarget.dataset.clipId ?? clipLabel,
      title: clipLabel,
      subtitle: timelineTrackCode(trackKind, trackIndex),
      source: "media",
    });
  }

  function tryOpenFile(file: OpenFile) {
    setModalError(null);
    if (openFile && openFile.id !== file.id) {
      setModalError(room.modalBusy);
      return;
    }
    setOpenFile(file);
  }

  function handleCloseModal() {
    if (!isLeader) {
      setModalError(room.modalLeaderOnly);
      return;
    }
    setOpenFile(null);
    setModalError(null);
  }

  async function publishPost(messageBody: string) {
    if (preview) {
      const now = new Date().toISOString();
      setLocalPosts((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          lab_id: labData.lab.id,
          author_id: userId,
          body: messageBody,
          created_at: now,
          profiles: selfProfile,
        },
      ]);
      return;
    }

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("collab_lab_posts")
      .insert({
        lab_id: labData.lab.id,
        author_id: userId,
        body: messageBody,
      })
      .select("id")
      .single();

    if (insertError || !data) {
      throw new Error(insertError?.message ?? engagement.errCollab);
    }

    await awardUserExp(supabase, "lab.post", data.id);
    requestTranslationWarm({
      entityType: "lab_post",
      entityId: data.id,
      sourceLocale: inferSourceLocale(messageBody),
      fields: [{ fieldName: "body", text: messageBody }],
    });
    router.refresh();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const note = body.trim();
    if (!note && !pendingFile) {
      return;
    }

    setLoading(true);
    try {
      if (pendingFile) {
        if (preview) {
          await publishPost(
            encodeLabChatFile(
              { name: pendingFile.name, url: null },
              note || undefined,
            ),
          );
        } else {
          const supabase = createClient();
          const uploaded = await uploadLabChatShare(
            supabase,
            userId,
            labData.lab.id,
            pendingFile,
          );
          await publishPost(
            encodeLabChatFile(
              { name: uploaded.name, url: uploaded.publicUrl },
              note || undefined,
            ),
          );
        }
        setPendingFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        await publishPost(note);
      }
      setBody("");
    } catch (err) {
      const message = err instanceof Error ? err.message : room.fileUploadFailed;
      if (message === "FILE_TOO_LARGE") {
        setError(room.fileTooLarge);
      } else {
        setError(message || room.fileUploadFailed);
      }
    } finally {
      setLoading(false);
    }
  }

  function timelineTrackCode(kind: LabTimelineTrackKind, index: number): string {
    return kind === "video" ? room.trackVideo(index) : room.trackAudio(index);
  }

  function renderPostBody(postBody: string) {
    const file = parseLabChatFile(postBody);
    if (file) {
      return (
        <div className="lab-room__file-card">
          <p className="lab-room__file-label">{room.fileSentLabel}</p>
          <p className="lab-room__file-name">{file.name}</p>
          {file.note && (
            <p className="mt-1 whitespace-pre-wrap text-sm text-eldonia-text-muted">{file.note}</p>
          )}
          {file.url ? (
            <a
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="eldonia-btn-secondary mt-2 inline-flex text-xs"
            >
              {room.fileOpen}
            </a>
          ) : (
            <p className="eldonia-hint mt-2 text-[10px]">{file.name}</p>
          )}
        </div>
      );
    }

    return <LabChatTranslatedBody text={postBody} />;
  }

  return (
    <div className="lab-room">
      <header className="lab-room__header">
        <div className="lab-room__top-bar">
          <div className="lab-room__title-block">
            <p className="eldonia-eyebrow text-[0.65rem]">LAB</p>
            <h1 className="lab-room__title">{labData.lab.title}</h1>
            <div className="lab-room__links lab-room__desktop-only">
              {!preview && (
                <Link href={`/gallery/${labData.lab.artwork_id}`} className="eldonia-link text-xs">
                  {pages.lab.viewArtwork}
                </Link>
              )}
              {preview && (
                <span className="lab-room__leader-badge">{pages.lab.previewBadge}</span>
              )}
            </div>
          </div>
          <div className="lab-room__top-actions">
            <div className="lab-room__presence" aria-label={room.presenceAria}>
              <ul className="lab-room__members">
                {labData.members.map((member) => {
                  const name = memberLabel(member, t.memberFallback);
                  const presence = presenceByUser.get(member.user_id);
                  const online = presence?.online ?? false;
                  const focus = presence?.focus ?? "idle";
                  const color = presence?.color ?? PRESENCE_COLORS[0];
                  const isSelf = member.user_id === userId;
                  return (
                    <li
                      key={member.user_id}
                      className="lab-room__member"
                      title={room.presenceEditing(
                        isSelf ? room.presenceYou : name,
                        presenceFocusLabel(focus),
                      )}
                    >
                      <span
                        className={
                          online
                            ? "lab-room__avatar lab-room__avatar--online"
                            : "lab-room__avatar lab-room__avatar--away"
                        }
                        style={{ borderColor: online ? color : undefined }}
                      >
                        {member.profiles?.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={member.profiles.avatar_url} alt="" />
                        ) : (
                          <span>{initialOf(name)}</span>
                        )}
                      </span>
                      {member.role === "owner" && (
                        <span className="lab-room__owner-dot" aria-label={t.ownerSuffix} />
                      )}
                      <span
                        className={`lab-room__presence-dot${online ? " is-on" : ""}`}
                        style={online ? { background: color } : undefined}
                        aria-hidden="true"
                      />
                    </li>
                  );
                })}
              </ul>
              <p className="lab-room__presence-feed lab-room__desktop-only">
                {memberPresences
                  .filter((p) => p.online && p.focus !== "idle")
                  .slice(0, 3)
                  .map((p) => {
                    const member = labData.members.find((m) => m.user_id === p.userId);
                    const name =
                      p.userId === userId
                        ? room.presenceYou
                        : member
                          ? memberLabel(member, t.memberFallback)
                          : t.memberFallback;
                    return (
                      <span key={p.userId} style={{ color: p.color }}>
                        {room.presenceEditing(name, presenceFocusLabel(p.focus))}
                      </span>
                    );
                  })}
                {memberPresences.every((p) => !p.online || p.focus === "idle") &&
                  (preview ? (
                    <span>{room.presenceDemoHint}</span>
                  ) : (
                    <span>{room.presenceWaiting}</span>
                  ))}
              </p>
            </div>
            <span className="lab-room__leader-badge lab-room__current-leader">
              {room.currentLeader(leaderName)}
            </span>
            <Link href="/lab" className="lab-room__close" aria-label={room.closeAction}>
              ✕
            </Link>
          </div>
        </div>
      </header>

      <div className="lab-room__grid lab-room__grid--chat-first">
        <aside
          className={`lab-room__panel lab-room__chat${
            memberPresences.some(
              (p) => p.userId !== userId && p.online && p.focus === "chat",
            )
              ? " is-peer-focus"
              : ""
          }${selfFocus === "chat" ? " is-self-focus" : ""}`}
        >
          <p className="lab-room__panel-label lab-room__desktop-only">{room.chatHeading}</p>
          <div className="lab-room__chat-feed">
            {posts.length === 0 ? (
              <p className="eldonia-body text-xs text-eldonia-text-muted">{t.notesEmpty}</p>
            ) : (
              posts.map((post) => {
                const author =
                  post.profiles?.display_name ??
                  post.profiles?.username ??
                  t.memberFallback;
                return (
                  <article key={post.id} className="lab-room__chat-item">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-eldonia-gold">{author}</p>
                      <span className="text-[10px] text-eldonia-text-dim">
                        {formatRelativeTime(post.created_at, locale)}
                      </span>
                    </div>
                    {renderPostBody(post.body)}
                  </article>
                );
              })
            )}
          </div>
          <form onSubmit={handleSubmit} className="lab-room__chat-form">
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0] ?? null;
                setPendingFile(file);
                setError(null);
              }}
            />
            <div className="lab-room__chat-tools lab-room__desktop-only">
              <button
                type="button"
                className="lab-room__chat-tool-btn"
                disabled={loading}
                onClick={() => fileInputRef.current?.click()}
              >
                {room.fileAttach}
              </button>
            </div>
            {pendingFile && (
              <p className="eldonia-hint text-[10px]">
                {room.filePending}: {pendingFile.name}
              </p>
            )}
            {error && <p className="eldonia-alert-error text-[10px]">{error}</p>}
            <div className="lab-room__chat-compose">
              <button
                type="button"
                className="lab-room__chat-attach lab-room__mobile-only"
                disabled={loading}
                aria-label={room.fileAttach}
                onClick={() => fileInputRef.current?.click()}
              >
                +
              </button>
              <textarea
                rows={1}
                maxLength={4000}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                onFocus={() => setChatFocused(true)}
                onBlur={() => setChatFocused(false)}
                placeholder={room.chatPlaceholder}
                className="lab-room__chat-input"
                required={!pendingFile}
              />
              <button
                type="submit"
                disabled={loading || (!body.trim() && !pendingFile)}
                className="lab-room__chat-send disabled:opacity-60"
              >
                {loading ? t.postSending : room.chatSubmit}
              </button>
            </div>
          </form>
        </aside>

        <aside
          className={`lab-room__panel lab-room__folders lab-room__desktop-only${
            memberPresences.some(
              (p) => p.userId !== userId && p.online && p.focus === "folders",
            )
              ? " is-peer-focus"
              : ""
          }${selfFocus === "folders" ? " is-self-focus" : ""}`}
        >
          <p className="lab-room__panel-label">{room.foldersHeading}</p>
          <ul className="lab-room__folder-list">
            {folderList.map((folder) => (
              <li key={folder.id} className="lab-room__folder-row">
                <button
                  type="button"
                  className={
                    selectedFolderId === folder.id
                      ? "lab-room__folder lab-room__folder--active"
                      : "lab-room__folder"
                  }
                  onClick={() => setSelectedFolderId(folder.id)}
                >
                  <span className="lab-room__folder-name">{folder.name}</span>
                  <span className="lab-room__folder-count">
                    {folderAssetCount(folder.id)}
                  </span>
                </button>
                {isLeader && (
                  <button
                    type="button"
                    className="lab-room__folder-delete"
                    title={room.deleteFolder}
                    aria-label={`${room.deleteFolder}: ${folder.name}`}
                    onClick={() => handleDeleteFolder(folder.id)}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
          <p className="eldonia-hint mt-3 text-[10px]">{room.foldersHint}</p>
          <ul className="lab-room__asset-list mt-3">
            {folderAssets.map((asset) => (
              <li key={asset.id} className="lab-room__asset-row-wrap">
                <button
                  type="button"
                  className="lab-room__asset-row"
                  draggable
                  onDragStart={(event) => handleAssetDragStart(event, asset)}
                  onClick={() => handleFolderAssetClick(asset)}
                  title={room.workspaceDropHint}
                >
                  <span>
                    {asset.name}.{asset.ext}
                  </span>
                  {asset.isCanonical && (
                    <span className="lab-room__canon">{room.canonicalBadge}</span>
                  )}
                </button>
                {isLeader && (
                  <button
                    type="button"
                    className="lab-room__asset-delete"
                    title={room.deleteFile}
                    aria-label={`${room.deleteFile}: ${asset.name}.${asset.ext}`}
                    onClick={() => handleDeleteAsset(asset.id)}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>

          <div className="lab-room__folder-upload">
            <input
              ref={folderUploadInputRef}
              type="file"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleFolderUpload(file);
              }}
            />
            <button
              type="button"
              className="lab-room__folder-upload-btn"
              disabled={folderUploadLoading || !selectedFolderId}
              onClick={() => folderUploadInputRef.current?.click()}
            >
              {folderUploadLoading ? room.folderUploading : room.folderUpload}
            </button>
            <p className="eldonia-hint text-[10px]">{room.folderUploadHint}</p>
            <p className="eldonia-hint text-[10px]">{room.folderPermHint}</p>
            {folderUploadError && (
              <p className="eldonia-alert-error text-[10px]">{folderUploadError}</p>
            )}
          </div>
        </aside>

        <section
          className={`lab-room__panel lab-room__workspace lab-room__desktop-only${
            workspaceDropActive ? " lab-room__workspace--drop" : ""
          }${
            memberPresences.some(
              (p) => p.userId !== userId && p.online && p.focus === "workspace",
            )
              ? " is-peer-focus"
              : ""
          }${selfFocus === "workspace" ? " is-self-focus" : ""}`}
          onDragOver={handleWorkspaceDragOver}
          onDragLeave={handleWorkspaceDragLeave}
          onDrop={handleWorkspaceDrop}
        >
          <p className="lab-room__panel-label text-center">{room.workspaceHeading}</p>
          <div className="lab-room__workspace-body">
            {workspaceDropActive ? (
              <p className="eldonia-hint text-sm text-eldonia-gold-light">
                {room.workspaceDropHint}
              </p>
            ) : (
              <div className="lab-room__workspace-stack">
                {stagedFiles.length > 0 ? (
                  <div className="lab-room__stage">
                    <p className="lab-room__stage-hint">{room.workspaceStageHint}</p>

                    {timelineStageFiles.length > 0 && (
                      <>
                        <p className="lab-room__stage-section">{room.timelineFilesHeading}</p>
                        <ul className="lab-room__stage-list">
                          {timelineStageFiles.map((item) => (
                            <li
                              key={item.id}
                              className={`lab-room__stage-item${
                                (selectedStageId === item.id ||
                                  selectedClipId === item.clipId) &&
                                operateItem?.id === item.id
                                  ? " is-selected"
                                  : ""
                              }`}
                            >
                              <label className="lab-room__stage-check">
                                <input
                                  type="checkbox"
                                  checked={item.expanded}
                                  aria-label={`${room.workspaceExpand}: ${item.label}`}
                                  onChange={(event) =>
                                    toggleStageExpand(item.id, event.target.checked)
                                  }
                                />
                                <button
                                  type="button"
                                  className="lab-room__stage-name-btn"
                                  title={room.waveformSelect}
                                  onClick={() => selectStageItem(item)}
                                >
                                  {item.label}
                                </button>
                              </label>
                              <div className="lab-room__stage-aside">
                                <span
                                  className={`lab-room__stage-kind lab-room__stage-kind--${item.kind}`}
                                >
                                  {room.workspaceOnTimeline}
                                </span>
                                <button
                                  type="button"
                                  className="lab-room__stage-exclude"
                                  title={room.stageExcludeHint}
                                  aria-label={`${room.stageExclude}: ${item.label}`}
                                  onClick={() => returnStagedToFolder(item.id)}
                                >
                                  {room.stageExclude}
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {pendingStageFiles.length > 0 && (
                      <>
                        <p className="lab-room__stage-section">{room.pendingFilesHeading}</p>
                        <ul className="lab-room__stage-list">
                          {pendingStageFiles.map((item) => (
                            <li
                              key={item.id}
                              className={`lab-room__stage-item${
                                selectedStageId === item.id ? " is-selected" : ""
                              }`}
                            >
                              <label className="lab-room__stage-check">
                                <input
                                  type="checkbox"
                                  checked={item.expanded}
                                  aria-label={`${room.workspaceExpand}: ${item.label}`}
                                  onChange={(event) =>
                                    toggleStageExpand(item.id, event.target.checked)
                                  }
                                />
                                <button
                                  type="button"
                                  className="lab-room__stage-name-btn"
                                  onClick={() => selectStageItem(item)}
                                >
                                  {item.label}
                                </button>
                              </label>
                              <div className="lab-room__stage-aside">
                                <span
                                  className={`lab-room__stage-kind lab-room__stage-kind--${item.kind}`}
                                >
                                  {item.kind === "audio"
                                    ? room.trackAudio(1)
                                    : room.trackVideo(1)}
                                </span>
                                <button
                                  type="button"
                                  className="lab-room__stage-exclude"
                                  title={room.stageExcludeHint}
                                  aria-label={`${room.stageExclude}: ${item.label}`}
                                  onClick={() => returnStagedToFolder(item.id)}
                                >
                                  {room.stageExclude}
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {selectedClipId && (
                      <button
                        type="button"
                        className="lab-room__clip-exclude"
                        onClick={returnSelectedClipToFolder}
                      >
                        {room.clipExclude}
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="eldonia-body text-sm text-eldonia-text-muted">
                    {room.workspaceEmpty}
                  </p>
                )}

                {operateItem && waveformTarget && (
                  <div className="lab-room__waveform" aria-label={room.waveformHeading}>
                    <div className="lab-room__waveform-head">
                      <p className="lab-room__waveform-title">
                        {room.operateHint} · {room.waveformHeading}
                      </p>
                      <p className="lab-room__waveform-file">{waveformTarget.label}</p>
                    </div>
                    <div
                      ref={waveformCanvasRef}
                      className="lab-room__waveform-canvas"
                      title={room.waveformScrub}
                      onPointerDown={handleWaveformPointerDown}
                      onPointerMove={handleWaveformPointerMove}
                      onPointerUp={handleWaveformPointerUp}
                      onPointerCancel={handleWaveformPointerUp}
                    >
                      <div
                        className="lab-room__waveform-playhead"
                        style={{ left: `${waveformPlayheadPct}%` }}
                        aria-hidden="true"
                      />
                      <div className="lab-room__waveform-bars">
                        {waveBars.map((amp, index) => (
                          <span
                            key={`${waveformTarget.id}-${index}`}
                            className="lab-room__waveform-bar"
                            style={{
                              height: `${Math.max(6, Math.round(amp * 58))}px`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="lab-room__waveform-foot">
                      <p className="lab-room__waveform-hint">
                        {room.waveformSynced}
                        {" · "}
                        {playheadTimecode}
                      </p>
                    </div>
                  </div>
                )}

                {operateItem && operateItem.kind === "video" && !operateItem.url?.trim() && (
                  <div className="lab-room__waveform lab-room__video-preview">
                    <div className="lab-room__waveform-head">
                      <p className="lab-room__waveform-title">
                        {room.operateHint} · {room.videoPreviewHeading}
                      </p>
                      <p className="lab-room__waveform-file">{operateItem.label}</p>
                    </div>
                    <div className="lab-room__video-preview-strip" aria-hidden="true">
                      {videoPreviewFrames.map((frameIndex) => (
                        <span
                          key={frameIndex}
                          className="lab-room__nle-frame lab-room__video-preview-frame"
                          style={videoFrameStyle(operateItem.id, frameIndex)}
                        >
                          <span className="lab-room__nle-frame-num">{frameIndex + 1}</span>
                        </span>
                      ))}
                    </div>
                    <p className="lab-room__waveform-hint">
                      {playheadTimecode}
                    </p>
                  </div>
                )}

                {!operateItem && pendingStageFiles.length > 0 && (
                  <p className="eldonia-hint text-xs">{room.waveformHint}</p>
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      <footer
        className={`lab-room__nle lab-room__desktop-only${
          memberPresences.some(
            (p) => p.userId !== userId && p.online && p.focus === "timeline",
          )
            ? " is-peer-focus"
            : ""
        }${selfFocus === "timeline" ? " is-self-focus" : ""}`}
        style={{ height: nleHeight }}
      >
        <div
          className="lab-room__nle-resize"
          role="separator"
          aria-orientation="horizontal"
          aria-label={room.resizeTimeline}
          aria-valuemin={NLE_HEIGHT_MIN}
          aria-valuemax={NLE_HEIGHT_MAX}
          aria-valuenow={nleHeight}
          onPointerDown={handleNleResizePointerDown}
          onPointerMove={handleNleResizePointerMove}
          onPointerUp={handleNleResizePointerUp}
          onPointerCancel={handleNleResizePointerUp}
        />
        <div className="lab-room__nle-toolbar">
          <div className="lab-room__nle-transport" aria-label={room.mediaHeading}>
            <button
              type="button"
              className={`lab-room__nle-btn${isPlaying ? " is-active" : ""}`}
              title={room.timelinePlay}
              aria-pressed={isPlaying}
              onClick={() => startTimelinePlayback()}
            >
              ▶
            </button>
            <button
              type="button"
              className="lab-room__nle-btn"
              title={room.timelinePause}
              onClick={() => setIsPlaying(false)}
            >
              ■
            </button>
            <span className="lab-room__nle-tc" title={room.timelinePlayhead}>
              {playheadTimecode}
            </span>
            {audioNotice && (
              <span className="eldonia-hint text-[10px] text-eldonia-gold-light">
                {audioNotice}
              </span>
            )}
            <button
              type="button"
              className="lab-room__nle-console-btn"
              onClick={() => {
                setAudioConsoleTab("mixer");
                audioWinLockedRef.current = true;
                setAudioWinLocked(true);
                setAudioConsoleOpen(true);
              }}
            >
              {room.audioConsoleOpen}
            </button>
            <button
              type="button"
              className="lab-room__nle-console-btn"
              aria-pressed={snapshotPanelOpen}
              onClick={() => {
                setSnapshotNotice(null);
                setSnapshotPanelOpen((open) => !open);
              }}
            >
              {room.snapshotOpen}
            </button>
          </div>
          <p className="eldonia-hint text-[10px]">{room.timelineHint}</p>
        </div>

        <div className="lab-room__nle-body">
          <div className="lab-room__nle-board" aria-label={room.mediaHeading}>
            <div className="lab-room__nle-headers">
              <div className="lab-room__nle-corner" />
              {tracks.map((track) => (
                <div
                  key={`h-${track.id}`}
                  className={`lab-room__nle-header lab-room__nle-header--${track.kind} lab-room__nle-header--${track.height}`}
                >
                  <span className="lab-room__nle-code">
                    {timelineTrackCode(track.kind, track.index)}
                  </span>
                  <span className="lab-room__nle-mute">M</span>
                  <span className="lab-room__nle-lock">L</span>
                </div>
              ))}
            </div>

            <div className="lab-room__nle-canvas" ref={canvasRef}>
              <div
                className="lab-room__nle-ruler"
                title={room.timelineScrub}
                onPointerDown={handleRulerPointerDown}
                onPointerMove={handlePlayheadPointerMove}
                onPointerUp={handlePlayheadPointerUp}
                onPointerCancel={handlePlayheadPointerUp}
              >
                {LAB_TIMELINE_MARKERS.map((mark) => (
                  <span key={mark} className="lab-room__nle-tick">
                    <i />
                    {mark}
                  </span>
                ))}
              </div>

              <div
                className="lab-room__nle-playhead"
                style={{ left: `${playheadPct}%` }}
                title={room.timelinePlayhead}
              >
                <span
                  className="lab-room__nle-playhead-head"
                  role="slider"
                  tabIndex={0}
                  aria-label={room.timelinePlayhead}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(playheadPct)}
                  aria-valuetext={playheadTimecode}
                  onPointerDown={handlePlayheadPointerDown}
                  onPointerMove={handlePlayheadPointerMove}
                  onPointerUp={handlePlayheadPointerUp}
                  onPointerCancel={handlePlayheadPointerUp}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowLeft") {
                      event.preventDefault();
                      setIsPlaying(false);
                      setPlayheadPct((p) => Math.max(0, p - 1));
                    } else if (event.key === "ArrowRight") {
                      event.preventDefault();
                      setIsPlaying(false);
                      setPlayheadPct((p) => Math.min(100, p + 1));
                    }
                  }}
                />
              </div>

              {remoteTimelinePeers.map((peer) => {
                const member = labData.members.find((m) => m.user_id === peer.userId);
                const name = member
                  ? memberLabel(member, t.memberFallback)
                  : t.memberFallback;
                return (
                  <div
                    key={`peer-${peer.userId}`}
                    className="lab-room__nle-peerhead"
                    style={{
                      left: `${peer.playheadPct}%`,
                      ["--peer-color" as string]: peer.color,
                    }}
                    title={room.presenceEditing(name, room.presenceFocusTimeline)}
                  >
                    <span>{initialOf(name)}</span>
                  </div>
                );
              })}

              {tracks.map((track) => (
                <div
                  key={track.id}
                  className={`lab-room__nle-lane lab-room__nle-lane--${track.kind} lab-room__nle-lane--${track.height}`}
                >
                  {track.clips.map((clip) => (
                    <button
                      key={clip.id}
                      type="button"
                      data-clip-id={clip.id}
                      title={room.clipDragHint}
                      className={`lab-room__nle-clip lab-room__nle-clip--${track.kind}${
                        selectedClipId === clip.id ? " is-selected" : ""
                      }`}
                      style={{ left: `${clip.startPct}%`, width: `${clip.widthPct}%` }}
                      onPointerDown={(event) =>
                        handleClipPointerDown(
                          event,
                          clip.id,
                          clip.startPct,
                          clip.widthPct,
                          track.kind,
                        )
                      }
                      onPointerMove={handleClipPointerMove}
                      onPointerUp={(event) =>
                        handleClipPointerUp(
                          event,
                          track.kind,
                          track.index,
                          clip.label,
                        )
                      }
                      onPointerCancel={(event) => {
                        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                          event.currentTarget.releasePointerCapture(event.pointerId);
                        }
                        clipDragRef.current = null;
                      }}
                    >
                      {track.kind === "video" && (
                        <span className="lab-room__nle-filmstrip" aria-hidden="true">
                          {Array.from(
                            { length: videoFrameCount(clip.widthPct) },
                            (_, frameIndex) => (
                              <span
                                key={frameIndex}
                                className="lab-room__nle-frame"
                                style={videoFrameStyle(clip.id, frameIndex)}
                              >
                                <span className="lab-room__nle-frame-num">
                                  {frameIndex + 1}
                                </span>
                              </span>
                            ),
                          )}
                        </span>
                      )}
                      <span className="lab-room__nle-clip-label">{clip.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {!preview && (
        <div className="lab-room__nle-downloads lab-room__desktop-only">
          <LabArtworkDownloads
            artworkId={labData.artwork.id}
            title={labData.artwork.title}
            mediaType={labData.artwork.media_type}
            hasThumbnail={Boolean(
              labData.artwork.thumbnail_url &&
                labData.artwork.thumbnail_url !== labData.artwork.media_url,
            )}
          />
        </div>
      )}

      {snapshotPanelOpen && (
        <div
          className="lab-room__snapshot-panel lab-room__desktop-only"
          role="dialog"
          aria-modal="false"
          aria-label={room.snapshotTitle}
        >
          <header className="lab-room__snapshot-head">
            <div>
              <p className="lab-room__snapshot-eyebrow">{room.snapshotTitle}</p>
              <p className="lab-room__snapshot-sub">{room.snapshotLead}</p>
            </div>
            <button
              type="button"
              className="lab-room__audio-win-close"
              onClick={() => setSnapshotPanelOpen(false)}
            >
              ✕
            </button>
          </header>

          <div className="lab-room__snapshot-body">
            <label className="lab-room__snapshot-label">
              <span>{room.snapshotName}</span>
              <input
                type="text"
                value={snapshotLabelDraft}
                maxLength={120}
                placeholder={formatSnapshotDefaultLabel()}
                onChange={(event) => setSnapshotLabelDraft(event.target.value)}
              />
            </label>
            <div className="lab-room__snapshot-actions">
              <button
                type="button"
                className="lab-room__audio-action"
                onClick={() => handleSaveSnapshot("snapshot")}
              >
                {room.snapshotSave}
              </button>
              <button
                type="button"
                className="lab-room__audio-action"
                onClick={() => handleSaveSnapshot("publish")}
                disabled={!preview && !isLeader}
                title={!preview && !isLeader ? room.snapshotLeaderOnly : undefined}
              >
                {room.snapshotPublish}
              </button>
            </div>
            {snapshotNotice && (
              <p className="lab-room__snapshot-notice">{snapshotNotice}</p>
            )}
            <p className="lab-room__snapshot-hint">{room.snapshotHint}</p>

            <ul className="lab-room__snapshot-list">
              {visibleSnapshots.length === 0 ? (
                <li className="lab-room__snapshot-empty">{room.snapshotEmpty}</li>
              ) : (
                visibleSnapshots.map((snap) => (
                  <li key={snap.id} className="lab-room__snapshot-item">
                    <div className="lab-room__snapshot-item-main">
                      <span
                        className={`lab-room__snapshot-kind lab-room__snapshot-kind--${snap.kind}`}
                      >
                        {snap.kind === "publish"
                          ? room.snapshotKindPublish
                          : room.snapshotKindSnapshot}
                      </span>
                      <strong>{snap.label}</strong>
                      <span className="lab-room__snapshot-meta">
                        {new Date(snap.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="lab-room__snapshot-item-actions">
                      <button
                        type="button"
                        className="lab-room__audio-action"
                        onClick={() => handleRestoreSnapshot(snap.id)}
                        disabled={!preview && !isLeader}
                      >
                        {room.snapshotRestore}
                      </button>
                      <button
                        type="button"
                        className="lab-room__audio-action"
                        onClick={() => handleArchiveSnapshot(snap.id)}
                        disabled={!preview && !isLeader}
                      >
                        {room.snapshotArchive}
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {clipMiniWins.map((win) => {
        const item = stagedFiles.find((s) => s.id === win.stageId);
        if (!item) return null;
        const media = clipMiniMediaKind(item);
        const url = item.url?.trim() || null;
        return (
          <div
            key={win.stageId}
            className="lab-room__clip-mini lab-room__desktop-only"
            role="dialog"
            aria-modal="false"
            aria-label={item.label}
            style={{
              left: win.x,
              top: win.y,
              width: win.w,
              height: win.h,
              zIndex: win.z,
              minWidth: CLIP_MINI_W_MIN,
              minHeight: CLIP_MINI_H_MIN,
            }}
            onPointerDown={() => bringClipMiniToFront(win.stageId)}
          >
            <header
              className={`lab-room__clip-mini-head${
                win.locked ? " is-locked" : " is-movable"
              }`}
              title={
                win.locked ? room.audioWinUnlockHint : room.audioWinLockHint
              }
              onPointerDown={(event) =>
                handleClipMiniPointerDown(win.stageId, event)
              }
              onClick={(event) => handleClipMiniTitleClick(win.stageId, event)}
            >
              <div className="lab-room__clip-mini-title">
                <span className="lab-room__clip-mini-grip" aria-hidden="true" />
                <div>
                  <p className="lab-room__clip-mini-eyebrow">
                    {room.videoPreviewHeading}
                  </p>
                  <p className="lab-room__clip-mini-name">{item.label}</p>
                </div>
              </div>
              <button
                type="button"
                className="lab-room__audio-win-close"
                aria-label={room.closeAction}
                onClick={() => closeClipMiniWin(win.stageId)}
              >
                ✕
              </button>
            </header>
            <div className="lab-room__clip-mini-body">
              {media === "image" && url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={item.label}
                  className="lab-room__clip-mini-media"
                />
              ) : media === "video" && url ? (
                <video
                  key={url}
                  src={url}
                  controls
                  playsInline
                  preload="metadata"
                  className="lab-room__clip-mini-media lab-room__clip-mini-video"
                />
              ) : media === "audio" && url ? (
                <div className="lab-room__clip-mini-audio">
                  <p className="lab-room__clip-mini-audio-label">{item.label}</p>
                  <audio key={url} src={url} controls preload="metadata" />
                </div>
              ) : (
                <p className="eldonia-hint text-xs">{room.waveformHint}</p>
              )}
            </div>
          </div>
        );
      })}

      {audioConsoleOpen && (
        <div
          ref={audioWinRef}
          className="lab-room__audio-win lab-room__desktop-only"
          role="dialog"
          aria-modal="false"
          aria-label={room.audioConsoleTitle}
          style={{
            width: audioWinSize.w,
            height: audioWinSize.h,
            ...(audioWinPos
              ? {
                  left: audioWinPos.x,
                  top: audioWinPos.y,
                  right: "auto",
                  bottom: "auto",
                }
              : null),
          }}
        >
          <header
            className={`lab-room__audio-win-head${
              audioWinLocked ? " is-locked" : " is-movable"
            }`}
            title={
              audioWinLocked
                ? room.audioWinUnlockHint
                : room.audioWinLockHint
            }
            onPointerDown={handleAudioWinPointerDown}
            onClick={handleAudioWinTitleClick}
          >
            <div className="lab-room__audio-win-title">
              <span className="lab-room__audio-win-grip" aria-hidden="true" />
              <div>
                <p className="lab-room__audio-win-eyebrow">{room.audioConsoleTitle}</p>
                <p className="lab-room__audio-win-sub">{room.audioConsoleLead}</p>
              </div>
            </div>
            <div className="lab-room__audio-win-tabs" role="tablist">
              {(
                [
                  ["mixer", room.panelMixer],
                  ["eq", room.panelEq],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={audioConsoleTab === id}
                  className={`lab-room__audio-win-tab${
                    audioConsoleTab === id ? " is-active" : ""
                  }`}
                  onClick={() => setAudioConsoleTab(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="lab-room__audio-win-close"
              onClick={() => setAudioConsoleOpen(false)}
            >
              ✕
            </button>
          </header>

            {audioConsoleTab === "mixer" && (
              <div className="lab-room__audio-mixer">
                <div className="lab-room__audio-mixer-toolbar">
                  <p className="lab-room__audio-hint">{room.mixerHint}</p>
                  <button
                    type="button"
                    className="lab-room__audio-action"
                    onClick={addAudioTrack}
                  >
                    {room.addAudioTrack}
                  </button>
                </div>
                <div className="lab-room__audio-strips">
                  {audioTracks.map((track) => {
                    const code = timelineTrackCode(track.kind, track.index);
                    const dimmed = channelDimmed(track.id);
                    return (
                      <div
                        key={track.id}
                        className={`lab-room__audio-strip${dimmed ? " is-dimmed" : ""}`}
                      >
                        <div className="lab-room__audio-strip-top">
                          <button
                            type="button"
                            className={`lab-room__audio-chip${
                              mixerMutes[track.id] ? " is-on" : ""
                            }`}
                            onClick={() =>
                              setMixerMutes((prev) => ({
                                ...prev,
                                [track.id]: !prev[track.id],
                              }))
                            }
                          >
                            {room.mixerMute}
                          </button>
                          <button
                            type="button"
                            className={`lab-room__audio-chip lab-room__audio-chip--solo${
                              mixerSolos[track.id] ? " is-on" : ""
                            }`}
                            onClick={() =>
                              setMixerSolos((prev) => ({
                                ...prev,
                                [track.id]: !prev[track.id],
                              }))
                            }
                          >
                            {room.mixerSolo}
                          </button>
                        </div>
                        <div className="lab-room__audio-strip-fader">
                          <span className="lab-room__nle-fader-meter" aria-hidden="true">
                            <i style={{ height: `${mixerLevels[track.id] ?? 50}%` }} />
                          </span>
                          <input
                            type="range"
                            className="lab-room__nle-fader-level"
                            min={0}
                            max={100}
                            value={mixerLevels[track.id] ?? 50}
                            aria-label={`${code} ${room.mixerGain}`}
                            onChange={(e) =>
                              setMixerLevels((prev) => ({
                                ...prev,
                                [track.id]: Number(e.target.value),
                              }))
                            }
                          />
                        </div>
                        <span className="lab-room__audio-strip-code">{code}</span>
                        <label className="lab-room__nle-pan">
                          <span className="lab-room__nle-pan-value">
                            {formatPanLabel(mixerPans[track.id] ?? 0)}
                          </span>
                          <input
                            type="range"
                            min={-50}
                            max={50}
                            value={mixerPans[track.id] ?? 0}
                            aria-label={`${room.mixerPan} ${code}`}
                            onChange={(e) =>
                              setMixerPans((prev) => ({
                                ...prev,
                                [track.id]: Number(e.target.value),
                              }))
                            }
                          />
                          <span className="lab-room__nle-pan-caption">{room.mixerPan}</span>
                        </label>
                        <label className="lab-room__audio-send">
                          <span>{room.mixerSend}</span>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={mixerSends[track.id] ?? 0}
                            onChange={(e) =>
                              setMixerSends((prev) => ({
                                ...prev,
                                [track.id]: Number(e.target.value),
                              }))
                            }
                          />
                        </label>
                        <button
                          type="button"
                          className="lab-room__audio-eq-jump"
                          onClick={() => {
                            setEqTargetId(track.id);
                            setAudioConsoleTab("eq");
                          }}
                        >
                          EQ
                        </button>
                      </div>
                    );
                  })}

                  <div className="lab-room__audio-strip lab-room__audio-strip--master">
                    <div className="lab-room__audio-strip-top">
                      <span className="lab-room__audio-chip is-on">{room.mixerMaster}</span>
                    </div>
                    <div className="lab-room__audio-strip-fader">
                      <span className="lab-room__nle-fader-meter" aria-hidden="true">
                        <i style={{ height: `${mixerLevels.master ?? 78}%` }} />
                      </span>
                      <input
                        type="range"
                        className="lab-room__nle-fader-level"
                        min={0}
                        max={100}
                        value={mixerLevels.master ?? 78}
                        aria-label={room.mixerMaster}
                        onChange={(e) =>
                          setMixerLevels((prev) => ({
                            ...prev,
                            master: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <span className="lab-room__audio-strip-code">{room.mixerMaster}</span>
                    <label className="lab-room__nle-pan">
                      <span className="lab-room__nle-pan-value">
                        {formatPanLabel(mixerPans.master ?? 0)}
                      </span>
                      <input
                        type="range"
                        min={-50}
                        max={50}
                        value={mixerPans.master ?? 0}
                        aria-label={`${room.mixerPan} ${room.mixerMaster}`}
                        onChange={(e) =>
                          setMixerPans((prev) => ({
                            ...prev,
                            master: Number(e.target.value),
                          }))
                        }
                      />
                      <span className="lab-room__nle-pan-caption">{room.mixerPan}</span>
                    </label>
                    <label className="lab-room__audio-send">
                      <span>{room.mixerLimiter}</span>
                      <input
                        type="range"
                        min={20}
                        max={100}
                        value={masterLimiter}
                        onChange={(e) => setMasterLimiter(Number(e.target.value))}
                      />
                    </label>
                    <button
                      type="button"
                      className="lab-room__audio-eq-jump"
                      onClick={() => {
                        setEqTargetId("master");
                        setAudioConsoleTab("eq");
                      }}
                    >
                      EQ
                    </button>
                  </div>
                </div>
              </div>
            )}

            {audioConsoleTab === "eq" && (
              <div className="lab-room__audio-eq">
                <div className="lab-room__audio-eq-toolbar">
                  <p className="lab-room__audio-hint">{room.eqHint}</p>
                  <div className="lab-room__audio-eq-targets">
                    {audioTracks.map((track) => (
                      <button
                        key={track.id}
                        type="button"
                        className={`lab-room__audio-chip${
                          eqTargetId === track.id ? " is-on" : ""
                        }`}
                        onClick={() => setEqTargetId(track.id)}
                      >
                        {timelineTrackCode(track.kind, track.index)}
                      </button>
                    ))}
                    <button
                      type="button"
                      className={`lab-room__audio-chip${
                        eqTargetId === "master" ? " is-on" : ""
                      }`}
                      onClick={() => setEqTargetId("master")}
                    >
                      {room.mixerMaster}
                    </button>
                  </div>
                  <div className="lab-room__audio-eq-presets">
                    {(
                      [
                        ["flat", room.eqPresetFlat],
                        ["voice", room.eqPresetVoice],
                        ["music", room.eqPresetMusic],
                        ["bass", room.eqPresetBass],
                      ] as const
                    ).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        className="lab-room__audio-action"
                        onClick={() => applyEqPreset(key)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="lab-room__audio-eq-graph">
                  <div className="lab-room__audio-eq-curve" aria-hidden="true">
                    {activeEqBands.map((gain, i) => (
                      <i
                        key={LAB_EQ_BANDS[i]}
                        style={{
                          height: `${Math.max(8, gain)}%`,
                          opacity: 0.35 + (gain / 100) * 0.65,
                        }}
                      />
                    ))}
                  </div>
                  <div className="lab-room__audio-eq-bands">
                    {LAB_EQ_BANDS.map((band, i) => (
                      <label key={band} className="lab-room__audio-eq-band">
                        <input
                          type="range"
                          min={8}
                          max={100}
                          value={activeEqBands[i] ?? 50}
                          aria-label={room.eqBand(band)}
                          onChange={(e) =>
                            setActiveEqBand(i, Number(e.target.value))
                          }
                        />
                        <span
                          className="lab-room__nle-eq-bar"
                          aria-hidden="true"
                          style={{ height: `${activeEqBands[i] ?? 50}%` }}
                        />
                        <span className="lab-room__nle-eq-label">
                          {room.eqBand(band)}
                        </span>
                        <span className="lab-room__audio-eq-db">
                          {Math.round(((activeEqBands[i] ?? 50) - 50) / 4)}dB
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="lab-room__audio-eq-extras">
                  <label className="lab-room__audio-toggle">
                    <input
                      type="checkbox"
                      checked={eqLowCut}
                      onChange={(e) => setEqLowCut(e.target.checked)}
                    />
                    {room.eqLowCut}
                  </label>
                  <label className="lab-room__audio-toggle">
                    <input
                      type="checkbox"
                      checked={eqHighCut}
                      onChange={(e) => setEqHighCut(e.target.checked)}
                    />
                    {room.eqHighCut}
                  </label>
                  <label className="lab-room__audio-send lab-room__audio-send--inline">
                    <span>{room.eqQ}</span>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={eqQ}
                      onChange={(e) => setEqQ(Number(e.target.value))}
                    />
                  </label>
                </div>
              </div>
            )}
          <button
            type="button"
            className="lab-room__audio-win-resize lab-room__audio-win-resize--e"
            title={room.audioWinResize}
            aria-label={`${room.audioWinResize} (W)`}
            onPointerDown={(event) => handleAudioWinResizePointerDown("e", event)}
          />
          <button
            type="button"
            className="lab-room__audio-win-resize lab-room__audio-win-resize--s"
            title={room.audioWinResize}
            aria-label={`${room.audioWinResize} (H)`}
            onPointerDown={(event) => handleAudioWinResizePointerDown("s", event)}
          />
          <button
            type="button"
            className="lab-room__audio-win-resize lab-room__audio-win-resize--se"
            title={room.audioWinResize}
            aria-label={room.audioWinResize}
            onPointerDown={(event) => handleAudioWinResizePointerDown("se", event)}
          />
        </div>
      )}

      {openFile && (
        <div className="lab-room__modal lab-room__desktop-only" role="dialog" aria-modal="true">
          <div className="lab-room__modal-backdrop" />
          <div className="lab-room__modal-panel">
            <p className="eldonia-eyebrow text-[0.65rem]">{room.modalHeading}</p>
            <h2 className="mt-2 font-display text-lg text-eldonia-gold-light">{openFile.title}</h2>
            <p className="eldonia-hint mt-1 text-xs">{openFile.subtitle}</p>
            <p className="eldonia-body mt-4 text-sm text-eldonia-text-muted">
              {room.modalBody}
            </p>
            {modalError && <p className="eldonia-alert-error mt-3 text-xs">{modalError}</p>}
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" className="eldonia-btn-secondary text-xs" disabled>
                {room.downloadAction}
              </button>
              <button
                type="button"
                className="eldonia-btn-primary text-xs"
                onClick={handleCloseModal}
              >
                {isLeader ? room.closeAction : room.closeLeaderOnly}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
