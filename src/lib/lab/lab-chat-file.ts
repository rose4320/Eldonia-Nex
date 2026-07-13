export type LabChatFilePayload = {
  name: string;
  url: string | null;
};

const FILE_MARKER = "[[lab-file]]";

/** Encode a file share into collab_lab_posts.body (max 4000 chars). */
export function encodeLabChatFile(payload: LabChatFilePayload, note?: string): string {
  const lines = [
    FILE_MARKER,
    `name: ${payload.name.slice(0, 200)}`,
    `url: ${payload.url ?? ""}`,
  ];
  if (note?.trim()) {
    lines.push(`note: ${note.trim().slice(0, 500)}`);
  }
  return lines.join("\n").slice(0, 4000);
}

export function parseLabChatFile(body: string): LabChatFilePayload & { note: string | null } | null {
  if (!body.startsWith(FILE_MARKER)) {
    return null;
  }
  const lines = body.split("\n");
  let name = "";
  let url: string | null = null;
  let note: string | null = null;
  for (const line of lines.slice(1)) {
    if (line.startsWith("name: ")) name = line.slice(6).trim();
    else if (line.startsWith("url: ")) {
      const value = line.slice(5).trim();
      url = value || null;
    } else if (line.startsWith("note: ")) note = line.slice(6).trim() || null;
  }
  if (!name) return null;
  return { name, url, note };
}

export function isLabChatFileBody(body: string): boolean {
  return body.startsWith(FILE_MARKER);
}
