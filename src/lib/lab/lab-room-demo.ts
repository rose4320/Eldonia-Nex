export type LabDemoFolder = {
  id: string;
  name: string;
  itemCount: number;
  kind: "project" | "lore" | "timeline" | "framework" | "media" | "archive";
};

export type LabDemoAsset = {
  id: string;
  name: string;
  ext: string;
  kind: "image" | "audio" | "video" | "doc" | "other";
  folderId: string;
  isCanonical?: boolean;
};

/** Phase 1 placeholder assets — replace with DB in Phase 2. */
export const LAB_DEMO_FOLDERS: LabDemoFolder[] = [
  { id: "audio", name: "Audio", itemCount: 6, kind: "media" },
  { id: "project", name: "Project", itemCount: 8, kind: "project" },
  { id: "framework", name: "Framework", itemCount: 5, kind: "framework" },
  { id: "timeline", name: "Timeline", itemCount: 12, kind: "timeline" },
  { id: "lore", name: "Lore & Story", itemCount: 15, kind: "lore" },
  { id: "character", name: "Character", itemCount: 32, kind: "media" },
  { id: "concept", name: "Concept Art", itemCount: 24, kind: "media" },
  { id: "archive", name: "Archive", itemCount: 7, kind: "archive" },
];

export const LAB_DEMO_ASSETS: LabDemoAsset[] = [
  {
    id: "aud1",
    name: "ambient_theme",
    ext: "mp3",
    kind: "audio",
    folderId: "audio",
  },
  {
    id: "aud2",
    name: "vo_take3",
    ext: "wav",
    kind: "audio",
    folderId: "audio",
  },
  {
    id: "aud3",
    name: "sfx_hit",
    ext: "wav",
    kind: "audio",
    folderId: "audio",
  },
  {
    id: "aud4",
    name: "battle_drums",
    ext: "mp3",
    kind: "audio",
    folderId: "audio",
  },
  {
    id: "aud5",
    name: "wind_loop",
    ext: "wav",
    kind: "audio",
    folderId: "audio",
  },
  {
    id: "aud6",
    name: "choir_pad",
    ext: "mp3",
    kind: "audio",
    folderId: "audio",
  },
  {
    id: "a1",
    name: "world_framework",
    ext: "pdf",
    kind: "doc",
    folderId: "framework",
    isCanonical: true,
  },
  {
    id: "a2",
    name: "timeline_v3",
    ext: "pdf",
    kind: "doc",
    folderId: "timeline",
    isCanonical: true,
  },
  {
    id: "a3",
    name: "lore_canon",
    ext: "pdf",
    kind: "doc",
    folderId: "lore",
    isCanonical: true,
  },
  {
    id: "a4",
    name: "hero_concept",
    ext: "psd",
    kind: "image",
    folderId: "concept",
  },
  {
    id: "a5",
    name: "world_map",
    ext: "jpg",
    kind: "image",
    folderId: "concept",
  },
  {
    id: "a6",
    name: "character_sheet",
    ext: "png",
    kind: "image",
    folderId: "character",
  },
  {
    id: "a8",
    name: "trailer_cut",
    ext: "mp4",
    kind: "video",
    folderId: "project",
  },
];

export type LabTimelineTrackKind = "video" | "audio";

export type LabTimelineClip = {
  id: string;
  label: string;
  startPct: number;
  widthPct: number;
};

export type LabTimelineTrack = {
  id: string;
  kind: LabTimelineTrackKind;
  /** Premiere-style index: V2/V1 or A1/A2 */
  index: number;
  height: "tall" | "short";
  clips: LabTimelineClip[];
};

/**
 * Bottom timeline — Premiere / AE style layout demo.
 * Video tracks stack above the playhead area; audio below.
 */
export const LAB_DEMO_TIMELINE_TRACKS: LabTimelineTrack[] = [
  {
    id: "v2",
    kind: "video",
    index: 2,
    height: "tall",
    clips: [
      { id: "v2a", label: "title_card.png", startPct: 2, widthPct: 12 },
      { id: "v2b", label: "overlay_fx", startPct: 40, widthPct: 18 },
    ],
  },
  {
    id: "v1",
    kind: "video",
    index: 1,
    height: "tall",
    clips: [
      { id: "v1a", label: "trailer_cut.mp4", startPct: 0, widthPct: 36 },
      { id: "v1b", label: "cut_b.mp4", startPct: 36, widthPct: 30 },
      { id: "v1c", label: "outro.mp4", startPct: 68, widthPct: 24 },
    ],
  },
  {
    id: "a1",
    kind: "audio",
    index: 1,
    height: "short",
    clips: [
      { id: "a1a", label: "vo_take3.wav", startPct: 8, widthPct: 40 },
      { id: "a1b", label: "sfx_hit.wav", startPct: 52, widthPct: 10 },
    ],
  },
  {
    id: "a2",
    kind: "audio",
    index: 2,
    height: "short",
    clips: [{ id: "a2a", label: "ambient_theme.mp3", startPct: 0, widthPct: 90 }],
  },
];

export const LAB_TIMELINE_MARKERS = [
  "00:00",
  "00:15",
  "00:30",
  "00:45",
  "01:00",
  "01:15",
  "01:30",
  "01:45",
  "02:00",
];

/** EQ band labels — visual demo only. */
export const LAB_EQ_BANDS = ["60", "150", "400", "1k", "2.5k", "6k", "12k"] as const;

export const LAB_EQ_DEFAULTS = [42, 55, 62, 50, 68, 58, 44];
