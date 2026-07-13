import {
  buildEventTicketQrSvg,
  formatTicketCodeDisplay,
} from "@/lib/events/event-ticket-qr";

type EventTicketQrProps = {
  ticketCode: string;
  qrToken: string;
  codeLabel: string;
  scanHint: string;
  compact?: boolean;
};

export async function EventTicketQr({
  ticketCode,
  qrToken,
  codeLabel,
  scanHint,
  compact = false,
}: EventTicketQrProps) {
  const svg = await buildEventTicketQrSvg({
    ticket_code: ticketCode,
    qr_token: qrToken,
  });

  return (
    <div
      className={
        compact
          ? "eldonia-event-ticket-qr eldonia-event-ticket-qr--compact"
          : "eldonia-event-ticket-qr"
      }
    >
      <div
        className="eldonia-event-ticket-qr__image"
        aria-hidden
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      <p className="eldonia-event-ticket-qr__code">
        {codeLabel}: {formatTicketCodeDisplay(ticketCode)}
      </p>
      <p className="eldonia-event-ticket-qr__hint">{scanHint}</p>
    </div>
  );
}
