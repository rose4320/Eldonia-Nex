import QRCode from "qrcode";

type TicketQrPayload = {
  ticket_code: string;
  qr_token: string;
};

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function formatTicketCodeDisplay(ticketCode: string): string {
  return ticketCode.slice(0, 8).toUpperCase();
}

/** Signed payload URL for venue check-in scanners. */
export function buildEventTicketQrUrl(ticket: TicketQrPayload): string {
  const params = new URLSearchParams({
    code: ticket.ticket_code,
    t: ticket.qr_token,
  });
  return `${siteUrl()}/events/tickets/verify?${params.toString()}`;
}

export async function buildEventTicketQrSvg(ticket: TicketQrPayload): Promise<string> {
  return QRCode.toString(buildEventTicketQrUrl(ticket), {
    type: "svg",
    margin: 2,
    width: 240,
    color: {
      dark: "#0b0b0b",
      light: "#ffffff",
    },
  });
}
