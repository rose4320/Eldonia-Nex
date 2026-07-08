export type StorySection = {
  id: string;
  title: string;
  paragraphs: string[];
};

/** Inline sound-effect marker: [sfx:page-turn] or [sfx:bell|Label for screen readers] */
export type StoryInlineSegment =
  | { kind: "text"; value: string }
  | { kind: "sfx"; id: string; label: string | null };

const SFX_MARKER_PATTERN = /\[sfx:([a-z0-9_-]+)(?:\|([^\]]+))?\]/gi;

export function parseParagraphSegments(paragraph: string): StoryInlineSegment[] {
  const segments: StoryInlineSegment[] = [];
  let lastIndex = 0;

  for (const match of paragraph.matchAll(SFX_MARKER_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      const text = paragraph.slice(lastIndex, index);
      if (text) segments.push({ kind: "text", value: text });
    }
    segments.push({
      kind: "sfx",
      id: match[1],
      label: match[2]?.trim() ?? null,
    });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < paragraph.length) {
    segments.push({ kind: "text", value: paragraph.slice(lastIndex) });
  }

  if (segments.length === 0) {
    return [{ kind: "text", value: paragraph }];
  }

  return segments;
}

/** Text passed to speech synthesis (SFX markers stripped). */
export function paragraphSpeechText(paragraph: string): string {
  return paragraph
    .replace(SFX_MARKER_PATTERN, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseStorySections(body: string): StorySection[] {
  const normalized = body.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const chunks = normalized.split(/\n(?=##\s+)/);
  const sections: StorySection[] = [];

  for (const [index, chunk] of chunks.entries()) {
    const trimmed = chunk.trim();
    if (!trimmed) continue;

    const headingMatch = trimmed.match(/^##\s+(.+?)(?:\n|$)/);
    const title = headingMatch?.[1]?.trim() ?? (index === 0 ? "はじめに" : `Section ${index + 1}`);
    const content = headingMatch ? trimmed.slice(headingMatch[0].length).trim() : trimmed;
    const paragraphs = content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.replace(/\n/g, " ").trim())
      .filter(Boolean);

    if (paragraphs.length === 0 && index === 0 && !headingMatch) continue;

    sections.push({
      id: `section-${index}`,
      title,
      paragraphs: paragraphs.length > 0 ? paragraphs : [content],
    });
  }

  return sections;
}

export function countStoryParagraphs(sections: StorySection[]): number {
  return sections.reduce((total, section) => total + section.paragraphs.length, 0);
}

export function hasNarrativeBody(description: string | null | undefined): boolean {
  if (!description?.trim()) return false;
  return parseStorySections(description).length > 0;
}

export type StoryProgress = {
  sectionIndex: number;
  paragraphIndex: number;
};

export function storyProgressKey(artworkId: string, locale = "ja"): string {
  return `eldonia-story-progress:${artworkId}:${locale}`;
}

export function loadStoryProgress(artworkId: string, locale = "ja"): StoryProgress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storyProgressKey(artworkId, locale));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoryProgress;
    if (
      typeof parsed.sectionIndex === "number" &&
      typeof parsed.paragraphIndex === "number"
    ) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

export function saveStoryProgress(
  artworkId: string,
  progress: StoryProgress,
  locale = "ja",
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storyProgressKey(artworkId, locale), JSON.stringify(progress));
}

export function progressPercent(
  sections: StorySection[],
  progress: StoryProgress,
): number {
  const total = countStoryParagraphs(sections);
  if (total <= 0) return 0;

  let read = 0;
  for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
    const section = sections[sectionIndex];
    if (sectionIndex < progress.sectionIndex) {
      read += section.paragraphs.length;
      continue;
    }
    if (sectionIndex === progress.sectionIndex) {
      read += Math.min(progress.paragraphIndex + 1, section.paragraphs.length);
      break;
    }
  }

  return Math.min(100, Math.round((read / total) * 100));
}
