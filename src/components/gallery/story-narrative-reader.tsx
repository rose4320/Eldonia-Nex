"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { intlLocale } from "@/lib/i18n/content/messages";
import {
  countStoryParagraphs,
  getStoryProgressServerSnapshot,
  getStoryProgressSnapshot,
  parseParagraphSegments,
  parseStorySections,
  paragraphSpeechText,
  progressPercent,
  saveStoryProgress,
  subscribeStoryProgress,
  type StoryInlineSegment,
  type StoryProgress,
  type StorySection,
} from "@/lib/gallery/parse-story-sections";

type NarrationState = "idle" | "playing" | "paused";

type StoryNarrativeReaderProps = {
  artworkId: string;
  title: string;
  excerpt: string | null;
  body: string;
};

function flattenParagraphs(sections: StorySection[]) {
  return sections.flatMap((section, sectionIndex) =>
    section.paragraphs.map((text, paragraphIndex) => ({
      sectionIndex,
      paragraphIndex,
      text,
      key: `${section.id}-p${paragraphIndex}`,
    })),
  );
}

function subscribeSpeechSupport() {
  return () => {};
}

function getSpeechSupportedSnapshot() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function getSpeechSupportedServerSnapshot() {
  return false;
}

export function StoryNarrativeReader({
  artworkId,
  title,
  excerpt,
  body,
}: StoryNarrativeReaderProps) {
  const locale = useLocale();
  const { pages } = useContent();
  const gallery = pages.gallery;
  const sections = useMemo(
    () =>
      parseStorySections(body, {
        untitledFallback: gallery.storyUntitledSection,
      }),
    [body, gallery.storyUntitledSection],
  );
  const flat = useMemo(() => flattenParagraphs(sections), [sections]);
  const totalParagraphs = countStoryParagraphs(sections);

  const progress = useSyncExternalStore(
    (onStoreChange) => subscribeStoryProgress(artworkId, locale, onStoreChange),
    () => getStoryProgressSnapshot(artworkId, locale),
    getStoryProgressServerSnapshot,
  );

  const speechSupported = useSyncExternalStore(
    subscribeSpeechSupport,
    getSpeechSupportedSnapshot,
    getSpeechSupportedServerSnapshot,
  );

  const [narration, setNarration] = useState<NarrationState>("idle");
  const [speechIndex, setSpeechIndex] = useState<number | null>(null);

  const paragraphRefs = useRef<Map<string, HTMLParagraphElement>>(new Map());
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const speechQueueRef = useRef<number>(0);
  const restoredRef = useRef(false);
  const playParagraphRef = useRef<(flatIndex: number) => void>(() => {});

  const percent = progressPercent(sections, progress);

  const updateProgress = useCallback(
    (next: StoryProgress) => {
      saveStoryProgress(artworkId, next, locale);
    },
    [artworkId, locale],
  );

  const scrollToParagraph = useCallback((sectionIndex: number, paragraphIndex: number) => {
    const key = `${sections[sectionIndex]?.id}-p${paragraphIndex}`;
    const node = paragraphRefs.current.get(key);
    node?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [sections]);

  const stopNarration = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    speechQueueRef.current = 0;
    setSpeechIndex(null);
    setNarration("idle");
  }, []);

  const playParagraph = useCallback(
    (flatIndex: number) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        return;
      }

      const item = flat[flatIndex];
      if (!item) {
        stopNarration();
        return;
      }

      window.speechSynthesis.cancel();
      speechQueueRef.current = flatIndex;
      setSpeechIndex(flatIndex);
      setNarration("playing");
      updateProgress({
        sectionIndex: item.sectionIndex,
        paragraphIndex: item.paragraphIndex,
      });
      scrollToParagraph(item.sectionIndex, item.paragraphIndex);

      const utterance = new SpeechSynthesisUtterance(paragraphSpeechText(item.text));
      utterance.lang = intlLocale(locale);
      utterance.rate = 0.92;
      utterance.pitch = 1;

      utterance.onend = () => {
        if (speechQueueRef.current !== flatIndex) return;
        const nextIndex = flatIndex + 1;
        if (nextIndex < flat.length) {
          playParagraphRef.current(nextIndex);
        } else {
          stopNarration();
        }
      };

      utterance.onerror = () => {
        if (speechQueueRef.current === flatIndex) {
          stopNarration();
        }
      };

      window.speechSynthesis.speak(utterance);
    },
    [flat, locale, scrollToParagraph, stopNarration, updateProgress],
  );

  useEffect(() => {
    playParagraphRef.current = playParagraph;
  }, [playParagraph]);

  const startNarration = useCallback(() => {
    const startFlatIndex = flat.findIndex(
      (item) =>
        item.sectionIndex > progress.sectionIndex ||
        (item.sectionIndex === progress.sectionIndex &&
          item.paragraphIndex >= progress.paragraphIndex),
    );
    playParagraph(startFlatIndex >= 0 ? startFlatIndex : 0);
  }, [flat, playParagraph, progress.paragraphIndex, progress.sectionIndex]);

  const toggleNarration = useCallback(() => {
    if (narration === "playing") {
      window.speechSynthesis?.pause();
      setNarration("paused");
      return;
    }
    if (narration === "paused") {
      window.speechSynthesis?.resume();
      setNarration("playing");
      return;
    }
    startNarration();
  }, [narration, startNarration]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    restoredRef.current = false;
  }, [artworkId, locale]);

  useEffect(() => {
    if (restoredRef.current || flat.length === 0) return;
    if (progress.sectionIndex === 0 && progress.paragraphIndex === 0) {
      restoredRef.current = true;
      return;
    }
    restoredRef.current = true;
    scrollToParagraph(progress.sectionIndex, progress.paragraphIndex);
  }, [
    flat.length,
    progress.paragraphIndex,
    progress.sectionIndex,
    scrollToParagraph,
  ]);

  useEffect(() => {
    const nodes = Array.from(paragraphRefs.current.values());
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;

        const sectionIndex = Number(visible.target.getAttribute("data-section-index"));
        const paragraphIndex = Number(visible.target.getAttribute("data-paragraph-index"));
        if (Number.isNaN(sectionIndex) || Number.isNaN(paragraphIndex)) return;

        const current = getStoryProgressSnapshot(artworkId, locale);
        const isAhead =
          sectionIndex > current.sectionIndex ||
          (sectionIndex === current.sectionIndex && paragraphIndex > current.paragraphIndex);
        if (!isAhead) return;
        saveStoryProgress(artworkId, { sectionIndex, paragraphIndex }, locale);
      },
      { threshold: [0.45, 0.6, 0.75] },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [artworkId, locale, sections]);

  function isParagraphRead(sectionIndex: number, paragraphIndex: number): boolean {
    return (
      sectionIndex < progress.sectionIndex ||
      (sectionIndex === progress.sectionIndex && paragraphIndex < progress.paragraphIndex)
    );
  }

  function isParagraphReading(sectionIndex: number, paragraphIndex: number): boolean {
    if (speechIndex == null) {
      return (
        sectionIndex === progress.sectionIndex && paragraphIndex === progress.paragraphIndex
      );
    }
    const current = flat[speechIndex];
    return (
      current?.sectionIndex === sectionIndex && current.paragraphIndex === paragraphIndex
    );
  }

  function handleChapterClick(sectionIndex: number) {
    stopNarration();
    updateProgress({ sectionIndex, paragraphIndex: 0 });
    const section = sections[sectionIndex];
    sectionRefs.current.get(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="story-reader">
      <header className="story-reader__header">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-6">
          <p className="eldonia-label text-sm">{gallery.storyReaderHeading}</p>
          <p className="text-xs text-eldonia-text-muted">
            {gallery.storyProgressLabel(percent)}
          </p>
        </div>

        <div className="story-reader__progress-track mx-4 sm:mx-6" aria-hidden>
          <div className="story-reader__progress-fill" style={{ width: `${percent}%` }} />
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 pb-3 pt-2 sm:px-6">
          {speechSupported ? (
            <>
              <button
                type="button"
                onClick={toggleNarration}
                className="eldonia-btn-secondary px-2 py-1 text-xs"
              >
                {narration === "playing"
                  ? gallery.storyNarrationPause
                  : narration === "paused"
                    ? gallery.storyNarrationResume
                    : gallery.storyNarrationPlay}
              </button>
              <button
                type="button"
                onClick={stopNarration}
                disabled={narration === "idle"}
                className="eldonia-btn-secondary px-2 py-1 text-xs disabled:opacity-50"
              >
                {gallery.storyNarrationStop}
              </button>
            </>
          ) : (
            <p className="text-xs text-eldonia-text-muted">{gallery.storyNarrationUnsupported}</p>
          )}
        </div>
      </header>

      <div className="story-reader__layout">
        <aside className="story-reader__chapters" aria-label={gallery.storyChapterListAria}>
          <p className="story-reader__chapters-label">{gallery.storyChapterList}</p>
          <ol className="story-reader__chapter-list">
            {sections.map((section, sectionIndex) => {
              const done = sectionIndex < progress.sectionIndex;
              const active = sectionIndex === progress.sectionIndex;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => handleChapterClick(sectionIndex)}
                    className={`story-reader__chapter-btn${done ? " is-done" : ""}${
                      active ? " is-active" : ""
                    }`}
                    aria-current={active ? "true" : undefined}
                  >
                    <span className="story-reader__chapter-marker" aria-hidden>
                      {done ? "✓" : active ? "▶" : "○"}
                    </span>
                    <span>{section.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className="story-reader__meta text-xs text-eldonia-text-muted">
            {gallery.storyReadingMeta(progress.sectionIndex + 1, sections.length, totalParagraphs)}
          </p>
        </aside>

        <article className="story-reader__body" aria-label={title}>
          {excerpt && (
            <p className="story-reader__excerpt">{excerpt}</p>
          )}

          {sections.map((section, sectionIndex) => (
            <section
              key={section.id}
              ref={(node) => {
                if (node) sectionRefs.current.set(section.id, node);
              }}
              className="story-reader__section"
            >
              <h2 className="story-reader__section-title">{section.title}</h2>
              {section.paragraphs.map((paragraph, paragraphIndex) => {
                const key = `${section.id}-p${paragraphIndex}`;
                const read = isParagraphRead(sectionIndex, paragraphIndex);
                const reading = isParagraphReading(sectionIndex, paragraphIndex);
                return (
                  <p
                    key={key}
                    ref={(node) => {
                      if (node) paragraphRefs.current.set(key, node);
                    }}
                    data-section-index={sectionIndex}
                    data-paragraph-index={paragraphIndex}
                    className={`story-reader__paragraph${
                      read ? " is-read" : ""
                    }${reading ? " is-reading" : ""}`}
                    onClick={() => {
                      stopNarration();
                      updateProgress({ sectionIndex, paragraphIndex });
                    }}
                  >
                    <StoryParagraphContent
                      text={paragraph}
                      sfxHint={gallery.storySfxSoon}
                    />
                  </p>
                );
              })}
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}

function StoryParagraphContent({
  text,
  sfxHint,
}: {
  text: string;
  sfxHint: string;
}) {
  const segments = parseParagraphSegments(text);
  return (
    <>
      {segments.map((segment, index) => (
        <StoryInlineSegmentView key={`${index}-${segment.kind}`} segment={segment} sfxHint={sfxHint} />
      ))}
    </>
  );
}

function StoryInlineSegmentView({
  segment,
  sfxHint,
}: {
  segment: StoryInlineSegment;
  sfxHint: string;
}) {
  if (segment.kind === "text") {
    return <span>{segment.value}</span>;
  }

  const label = segment.label ?? segment.id;
  return (
    <span
      className="story-reader__sfx"
      data-sfx={segment.id}
      title={sfxHint}
      aria-label={`${label} (${sfxHint})`}
    >
      ◈{label}
    </span>
  );
}
