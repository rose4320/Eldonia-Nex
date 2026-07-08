"use client";

import { useEffect, useRef, useState } from "react";
import { useContent } from "@/components/providers/locale-provider";

const AMBIENT_VOLUME = 0.38;

type ArtworkAmbientBgmProps = {
  url: string | null | undefined;
  /** Pause BGM when the viewer is paused (e.g. slideshow hover). */
  active?: boolean;
  className?: string;
};

export function ArtworkAmbientBgm({
  url,
  active = true,
  className = "",
}: ArtworkAmbientBgmProps) {
  const { pages } = useContent();
  const gallery = pages.gallery;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = AMBIENT_VOLUME;
    audio.loop = true;
  }, [url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !url) return;
    if (active && enabled) {
      void audio.play().catch(() => {
        audio.pause();
      });
    } else {
      audio.pause();
    }
  }, [active, enabled, url]);

  async function toggle() {
    if (!url) return;
    if (enabled) {
      setEnabled(false);
      audioRef.current?.pause();
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setEnabled(true);
    } catch {
      setEnabled(false);
    }
  }

  if (!url) return null;

  return (
    <>
      <audio ref={audioRef} src={url} loop preload="metadata" className="sr-only" />
      <button
        type="button"
        onClick={() => void toggle()}
        className={`artwork-ambient-bgm ${className}`.trim()}
        aria-pressed={enabled}
        aria-label={enabled ? gallery.bgmMute : gallery.bgmUnmute}
        title={enabled ? gallery.bgmMute : gallery.bgmUnmute}
      >
        <span className="artwork-ambient-bgm__icon" aria-hidden>
          {enabled ? "♫" : "♪"}
        </span>
        <span className="artwork-ambient-bgm__label">
          {enabled ? gallery.bgmOn : gallery.bgmOff}
        </span>
      </button>
    </>
  );
}
