import { PDFDocument, rgb } from "pdf-lib";
import {
  buildEventTicketDocument,
  type EventTicketDocumentInput,
} from "@/lib/events/build-event-ticket-document";
import { buildEventTicketQrUrl, formatTicketCodeDisplay } from "@/lib/events/event-ticket-qr";
import { embedTicketPdfFonts, type TicketPdfFonts } from "@/lib/events/pdf-fonts";
import QRCode from "qrcode";

const PAGE = { width: 595.28, height: 841.89 };
const MARGIN = 48;
const BOTTOM = 48;
const LINE_H = 13;
const FONT_SIZE = 9;
const QR_SIZE = 120;

export type EventTicketPdfInput = EventTicketDocumentInput & {
  qrToken: string;
};

const COLORS = {
  ink: rgb(0.12, 0.1, 0.08),
  dark: rgb(0.08, 0.06, 0.04),
  gold: rgb(0.79, 0.64, 0.15),
  white: rgb(1, 1, 1),
  border: rgb(0.82, 0.78, 0.72),
};

function wrapLine(text: string, maxChars: number): string[] {
  const trimmed = text.trimEnd();
  if (!trimmed) return [""];
  if (trimmed.length <= maxChars) return [trimmed];

  const lines: string[] = [];
  let rest = trimmed;
  while (rest.length > 0) {
    if (rest.length <= maxChars) {
      lines.push(rest);
      break;
    }
    const slice = rest.slice(0, maxChars + 1);
    let breakAt = -1;
    for (const ch of ["、", "。", "）", "・", " ", "—", "-", "："]) {
      const idx = slice.lastIndexOf(ch);
      if (idx > breakAt) breakAt = idx;
    }
    if (breakAt < Math.floor(maxChars * 0.45)) breakAt = maxChars - 1;
    lines.push(rest.slice(0, breakAt + 1).trimEnd());
    rest = rest.slice(breakAt + 1).trimStart();
  }
  return lines;
}

async function buildQrPng(ticketCode: string, qrToken: string): Promise<Uint8Array> {
  const buffer = await QRCode.toBuffer(
    buildEventTicketQrUrl({ ticket_code: ticketCode, qr_token: qrToken }),
    {
      type: "png",
      width: 360,
      margin: 1,
      color: { dark: "#0b0b0b", light: "#ffffff" },
    },
  );
  return new Uint8Array(buffer);
}

function drawJa(
  page: ReturnType<PDFDocument["addPage"]>,
  fonts: TicketPdfFonts,
  text: string,
  x: number,
  y: number,
  size = FONT_SIZE,
) {
  page.drawText(text, {
    x,
    y,
    size,
    font: fonts.japanese,
    color: COLORS.ink,
  });
}

/**
 * Convert the plain-text ticket document into a multi-page PDF.
 * Source of truth: buildEventTicketDocument() — same text as .txt / print HTML.
 */
export async function generateEventTicketPdf(input: EventTicketPdfInput): Promise<Uint8Array> {
  const doc = buildEventTicketDocument(input);
  const pdf = await PDFDocument.create();
  const fonts = await embedTicketPdfFonts(pdf);
  const qrPng = await buildQrPng(input.ticketCode, input.qrToken);
  const qrImage = await pdf.embedPng(qrPng);
  const code = formatTicketCodeDisplay(input.ticketCode);

  let page = pdf.addPage([PAGE.width, PAGE.height]);
  let cursorY = PAGE.height - MARGIN;
  let isFirstPage = true;

  page.drawRectangle({
    x: 0,
    y: PAGE.height - 56,
    width: PAGE.width,
    height: 56,
    color: COLORS.dark,
  });
  page.drawText("ELDONIA NEX", {
    x: MARGIN,
    y: PAGE.height - 34,
    size: 14,
    font: fonts.latinBold,
    color: COLORS.gold,
  });
  drawJa(page, fonts, doc.lines[0] ?? "Chronicle ticket", MARGIN, PAGE.height - 50, 9);
  cursorY = PAGE.height - 72;

  const qrX = PAGE.width - MARGIN - QR_SIZE;
  const qrBottom = cursorY - QR_SIZE - 20;
  page.drawRectangle({
    x: qrX - 6,
    y: qrBottom,
    width: QR_SIZE + 12,
    height: QR_SIZE + 28,
    color: COLORS.white,
    borderColor: COLORS.border,
    borderWidth: 1,
  });
  page.drawImage(qrImage, {
    x: qrX,
    y: qrBottom + 20,
    width: QR_SIZE,
    height: QR_SIZE,
  });
  page.drawText(code, {
    x: qrX,
    y: qrBottom + 4,
    size: 11,
    font: fonts.latinBold,
    color: COLORS.ink,
  });

  // Skip duplicate header line already drawn in bar
  const bodyLines = doc.lines.slice(1);

  for (const raw of bodyLines) {
    const besideQr = isFirstPage && cursorY > qrBottom - 8;
    const maxChars = besideQr ? 36 : 54;
    const wrapped = wrapLine(raw, maxChars);

    for (const line of wrapped) {
      if (cursorY < BOTTOM) {
        page = pdf.addPage([PAGE.width, PAGE.height]);
        cursorY = PAGE.height - MARGIN;
        isFirstPage = false;
      }
      if (line.length > 0) {
        drawJa(page, fonts, line, MARGIN, cursorY, FONT_SIZE);
      }
      cursorY -= LINE_H;
    }
  }

  return pdf.save();
}

export function eventTicketPdfFilename(ticketCode: string): string {
  return `eldonia-ticket-${formatTicketCodeDisplay(ticketCode)}.pdf`;
}
