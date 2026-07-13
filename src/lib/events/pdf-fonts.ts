import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import fontkit from "@pdf-lib/fontkit";
import type { PDFDocument } from "pdf-lib";
import { StandardFonts } from "pdf-lib";

/** Pre-subsetted TTF (~290KB) — PDF-viewer safe Japanese glyphs. */
const TICKET_TTF = join(
  /* turbopackIgnore: true */ process.cwd(),
  "assets",
  "fonts",
  "NotoSansJP-Ticket.ttf",
);

let cachedJapaneseBytes: Buffer | null = null;

export type TicketPdfFonts = {
  latin: Awaited<ReturnType<PDFDocument["embedFont"]>>;
  latinBold: Awaited<ReturnType<PDFDocument["embedFont"]>>;
  japanese: Awaited<ReturnType<PDFDocument["embedFont"]>>;
};

const JA_RE = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uffef\u4e00-\u9faf]/;

export function textNeedsJapaneseFont(text: string): boolean {
  return JA_RE.test(text);
}

export function pickTicketFont(
  text: string,
  fonts: TicketPdfFonts,
  bold = false,
): TicketPdfFonts["latin"] {
  if (textNeedsJapaneseFont(text)) return fonts.japanese;
  return bold ? fonts.latinBold : fonts.latin;
}

function loadJapaneseFontBytes(): Buffer {
  if (cachedJapaneseBytes) return cachedJapaneseBytes;
  if (!existsSync(TICKET_TTF)) {
    throw new Error("ticket_pdf_font_missing:assets/fonts/NotoSansJP-Ticket.ttf");
  }
  cachedJapaneseBytes = readFileSync(TICKET_TTF);
  return cachedJapaneseBytes;
}

export async function embedTicketPdfFonts(pdf: PDFDocument): Promise<TicketPdfFonts> {
  pdf.registerFontkit(fontkit);

  const latin = await pdf.embedFont(StandardFonts.Helvetica);
  const latinBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  try {
    const japanese = await pdf.embedFont(loadJapaneseFontBytes(), { subset: true });
    return { latin, latinBold, japanese };
  } catch (error) {
    const message = error instanceof Error ? error.message : "embed_failed";
    throw new Error(`ticket_pdf_font_embed_failed:${message}`);
  }
}

export function drawTicketText(
  page: ReturnType<PDFDocument["addPage"]>,
  text: string,
  fonts: TicketPdfFonts,
  opts: {
    x: number;
    y: number;
    size: number;
    color: ReturnType<typeof import("pdf-lib").rgb>;
    bold?: boolean;
  },
): void {
  page.drawText(text, {
    x: opts.x,
    y: opts.y,
    size: opts.size,
    font: pickTicketFont(text, fonts, opts.bold),
    color: opts.color,
  });
}
