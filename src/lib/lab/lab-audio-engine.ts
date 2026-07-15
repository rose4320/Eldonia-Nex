/**
 * Lab timeline audio playback — syncs HTMLAudioElement(s) to playhead + mixer.
 */

export type LabPlayableClip = {
  clipId: string;
  trackId: string;
  url: string;
  startPct: number;
  widthPct: number;
};

type MixerState = {
  levels: Record<string, number>;
  mutes: Record<string, boolean>;
  solos: Record<string, boolean>;
  masterLimiter: number;
};

type SyncOptions = {
  isPlaying: boolean;
  playheadPct: number;
  durationSec: number;
  playSpeed: number;
  clips: LabPlayableClip[];
  mixer: MixerState;
  /** Force seek (play start / scrub). Do not seek every animation frame. */
  forceSeek?: boolean;
};

export type LabAudioSyncResult = {
  playingCount: number;
  error: string | null;
};

export class LabAudioEngine {
  private nodes = new Map<string, HTMLAudioElement>();
  private activeClipIds = new Set<string>();
  private lastPlayError: string | null = null;

  dispose() {
    for (const audio of this.nodes.values()) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    this.nodes.clear();
    this.activeClipIds.clear();
  }

  private getOrCreate(clipId: string, url: string): HTMLAudioElement {
    let audio = this.nodes.get(clipId);
    if (!audio) {
      audio = new Audio();
      audio.preload = "auto";
      // Do not set crossOrigin — Supabase public URLs often lack CORS for media elements.
      this.nodes.set(clipId, audio);
    }
    if (audio.dataset.url !== url) {
      audio.src = url;
      audio.dataset.url = url;
    }
    return audio;
  }

  private seekToPlayhead(
    audio: HTMLAudioElement,
    clip: LabPlayableClip,
    playheadPct: number,
    durationSec: number,
  ) {
    const localFrac = Math.min(
      0.999,
      Math.max(0, (playheadPct - clip.startPct) / Math.max(0.001, clip.widthPct)),
    );
    // 1:1 with timeline seconds so a clip sized to media duration plays in full.
    const clipTimelineSec = Math.max(0.05, (clip.widthPct / 100) * durationSec);
    const apply = () => {
      const mediaDur =
        Number.isFinite(audio.duration) && audio.duration > 0
          ? audio.duration
          : clipTimelineSec;
      const elapsed = localFrac * clipTimelineSec;
      audio.currentTime = Math.min(Math.max(0, mediaDur - 0.05), elapsed);
    };
    if (audio.readyState >= 1) apply();
    else audio.onloadedmetadata = () => apply();
  }

  sync(opts: SyncOptions): LabAudioSyncResult {
    const { isPlaying, playheadPct, durationSec, playSpeed, clips, mixer, forceSeek } =
      opts;
    const anySolo = Object.values(mixer.solos).some(Boolean);
    const master = Math.min(1, Math.max(0, mixer.masterLimiter / 100));
    const nextActive = new Set<string>();
    this.lastPlayError = null;

    for (const clip of clips) {
      const muted = Boolean(mixer.mutes[clip.trackId]);
      const soloed = Boolean(mixer.solos[clip.trackId]);
      if (muted || (anySolo && !soloed)) continue;

      const end = clip.startPct + clip.widthPct;
      const inRange = playheadPct >= clip.startPct && playheadPct < end;
      if (!inRange) continue;

      nextActive.add(clip.clipId);
      const audio = this.getOrCreate(clip.clipId, clip.url);
      const level = (mixer.levels[clip.trackId] ?? 70) / 100;
      audio.volume = Math.min(1, Math.max(0, level * master));
      audio.playbackRate = Math.min(4, Math.max(0.5, playSpeed));

      const newlyEntered = !this.activeClipIds.has(clip.clipId);
      if (forceSeek || newlyEntered || !isPlaying) {
        this.seekToPlayhead(audio, clip, playheadPct, durationSec);
      }

      if (isPlaying && audio.paused) {
        void audio.play().then(
          () => {
            /* ok */
          },
          (err: unknown) => {
            const message =
              err instanceof Error ? err.message : "Audio play blocked";
            this.lastPlayError = message;
          },
        );
      }
    }

    for (const [clipId, audio] of this.nodes) {
      if (!nextActive.has(clipId) || !isPlaying) {
        if (!audio.paused) audio.pause();
      }
    }

    this.activeClipIds = nextActive;

    const keep = new Set(clips.map((c) => c.clipId));
    for (const [clipId, audio] of this.nodes) {
      if (!keep.has(clipId)) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        this.nodes.delete(clipId);
      }
    }

    return {
      playingCount: nextActive.size,
      error: this.lastPlayError,
    };
  }
}
