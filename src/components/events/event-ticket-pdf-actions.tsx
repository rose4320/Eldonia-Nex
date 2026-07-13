"use client";

import { useState } from "react";
import { useContent } from "@/components/providers/locale-provider";

type EventTicketPdfActionsProps = {
  ticketId: string;
  className?: string;
  showHint?: boolean;
  align?: "start" | "center";
};

function parseFilename(contentDisposition: string | null): string | null {
  if (!contentDisposition) return null;
  const match = /filename="([^"]+)"/i.exec(contentDisposition);
  return match?.[1] ?? null;
}

export function EventTicketPdfActions({
  ticketId,
  className = "eldonia-btn-secondary text-xs",
  showHint = true,
  align = "start",
}: EventTicketPdfActionsProps) {
  const { pages } = useContent();
  const t = pages.events;
  const [loading, setLoading] = useState<"pdf" | "text" | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleView() {
    window.open(`/events/tickets/${ticketId}/print`, "_blank", "noopener,noreferrer");
  }

  async function handleDownloadPdf() {
    setLoading("pdf");
    setError(null);
    try {
      const response = await fetch(`/api/events/tickets/${ticketId}/pdf`, {
        credentials: "include",
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        setError(
          payload.error === "login_required"
            ? t.ticketLogin
            : payload.error === "not_found"
              ? t.ticketPdfNotFound
              : t.ticketPdfFailed,
        );
        return;
      }
      const blob = await response.blob();
      if (!blob.type.includes("pdf")) {
        setError(t.ticketPdfFailed);
        return;
      }
      const filename =
        parseFilename(response.headers.get("Content-Disposition")) ??
        `eldonia-ticket-${ticketId.slice(0, 8)}.pdf`;
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      setError(t.ticketPdfFailed);
    } finally {
      setLoading(null);
    }
  }

  async function handleDownloadText() {
    setLoading("text");
    setError(null);
    try {
      const response = await fetch(`/api/events/tickets/${ticketId}/text`, {
        credentials: "include",
      });
      if (!response.ok) {
        setError(t.ticketPdfFailed);
        return;
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `eldonia-ticket-${ticketId.slice(0, 8)}.txt`;
      anchor.click();
      URL.revokeObjectURL(objectUrl);
    } catch {
      setError(t.ticketPdfFailed);
    } finally {
      setLoading(null);
    }
  }

  const alignClass =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-1 ${alignClass}`}>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={className} onClick={handleView}>
          {t.ticketViewPdf}
        </button>
        <button
          type="button"
          className={className}
          disabled={loading !== null}
          onClick={() => void handleDownloadPdf()}
        >
          {loading === "pdf" ? t.ticketPdfGenerating : t.ticketDownloadPdf}
        </button>
        <button
          type="button"
          className={className}
          disabled={loading !== null}
          onClick={() => void handleDownloadText()}
        >
          {loading === "text" ? t.ticketPdfGenerating : t.ticketDownloadText}
        </button>
      </div>
      {showHint && !error && (
        <p className="eldonia-hint text-[10px]">{t.ticketPdfHint}</p>
      )}
      {error && <p className="eldonia-alert-error text-[10px]">{error}</p>}
    </div>
  );
}
