import {
  getEventTicketPdfHighlights,
  getEventTicketPdfTerms,
} from "@/lib/events/event-ticket-pdf-terms";
import { formatTicketCodeDisplay } from "@/lib/events/event-ticket-qr";

export type EventTicketDocumentInput = {
  locale: "ja" | "en" | "ko" | "zh-CN";
  eventFormat: "online" | "offline" | "hybrid";
  eventCategory: string | null;
  ticketCode: string;
  eventTitle: string;
  eventDateLabel: string;
  formatLabel: string;
  venueLabel: string | null;
  venueAddress: string | null;
  holderName: string | null;
  organizerName: string | null;
};

export type EventTicketDocument = {
  title: string;
  lines: string[];
  plainText: string;
  fileBaseName: string;
};

function header(locale: EventTicketDocumentInput["locale"]): string {
  if (locale === "ko") return "ELDONIA NEX — Chronicle 전자 티켓";
  if (locale === "zh-CN") return "ELDONIA NEX — Chronicle 电子票";
  if (locale === "en") return "ELDONIA NEX — Chronicle E-Ticket";
  return "ELDONIA NEX — Chronicle 電子チケット";
}

function labels(locale: EventTicketDocumentInput["locale"]) {
  if (locale === "en") {
    return {
      event: "Event",
      date: "Date & time",
      format: "Format",
      venue: "Venue",
      attendee: "Attendee",
      host: "Host",
      code: "Ticket code",
      summary: "Prohibitions (summary)",
      terms: "Terms & prohibitions",
      footerOnline: "Join from the watch room.",
      footerHybrid: "Show this QR at the venue or watch room.",
      footerOffline: "Show this QR at the venue entrance.",
    };
  }
  if (locale === "ko") {
    return {
      event: "이벤트",
      date: "일시",
      format: "형식",
      venue: "장소",
      attendee: "참가자",
      host: "주최",
      code: "티켓 번호",
      summary: "금지·유의사항 (요약)",
      terms: "이용 규정·금지사항",
      footerOnline: "시청실에서 참가해 주세요.",
      footerHybrid: "현장 입구 또는 시청실에서 QR을 제시하세요.",
      footerOffline: "현장 입구에서 QR을 제시하세요.",
    };
  }
  if (locale === "zh-CN") {
    return {
      event: "活动",
      date: "日期时间",
      format: "形式",
      venue: "会场",
      attendee: "参与者",
      host: "主办",
      code: "票号",
      summary: "禁止事项（摘要）",
      terms: "使用条款与禁止事项",
      footerOnline: "请从观看室参加。",
      footerHybrid: "请在会场入口或观看室出示 QR。",
      footerOffline: "请在会场入口出示 QR。",
    };
  }
  return {
    event: "イベント",
    date: "日時",
    format: "形式",
    venue: "会場",
    attendee: "参加者",
    host: "主催",
    code: "チケット番号",
    summary: "禁止事項・注意事項（抜粋）",
    terms: "チケット利用規約・禁止事項",
    footerOnline: "配信ルームからご参加ください。",
    footerHybrid: "会場入口または配信ルームで QR を提示してください。",
    footerOffline: "会場入口で QR を提示してください。",
  };
}

/** Single source of truth for ticket printable text (HTML / TXT / future PDF). */
export function buildEventTicketDocument(
  input: EventTicketDocumentInput,
): EventTicketDocument {
  const L = labels(input.locale);
  const code = formatTicketCodeDisplay(input.ticketCode);
  const lines: string[] = [];

  lines.push(header(input.locale));
  lines.push("=".repeat(48));
  lines.push(`${L.event}: ${input.eventTitle}`);
  lines.push(`${L.date}: ${input.eventDateLabel}`);
  lines.push(`${L.format}: ${input.formatLabel}`);
  if (input.venueLabel) {
    lines.push(`${L.venue}: ${input.venueLabel}`);
    if (input.venueAddress) lines.push(`  ${input.venueAddress}`);
  }
  if (input.holderName) lines.push(`${L.attendee}: ${input.holderName}`);
  if (input.organizerName) lines.push(`${L.host}: ${input.organizerName}`);
  lines.push(`${L.code}: ${code}`);
  lines.push("");

  const footer =
    input.eventFormat === "online"
      ? L.footerOnline
      : input.eventFormat === "hybrid"
        ? L.footerHybrid
        : L.footerOffline;
  lines.push(footer);
  lines.push("");

  lines.push(`【${L.summary}】`);
  for (const item of getEventTicketPdfHighlights(
    input.locale,
    input.eventFormat,
    input.eventCategory,
  )) {
    lines.push(`・${item}`);
  }
  lines.push("");

  lines.push(`【${L.terms}】`);
  for (const block of getEventTicketPdfTerms(
    input.locale,
    input.eventFormat,
    input.eventCategory,
  )) {
    lines.push("");
    lines.push(`【${block.title}】`);
    for (const item of block.items) {
      lines.push(`・${item}`);
    }
  }

  lines.push("");
  lines.push("-".repeat(48));
  lines.push("eldonia-nex.com/events/my-tickets");

  return {
    title: `${input.eventTitle} — ${code}`,
    lines,
    plainText: lines.join("\n"),
    fileBaseName: `eldonia-ticket-${code}`,
  };
}
