import type { SupportTicketStatus } from "@/lib/support/constants";
import { TICKET_STATUS_LABELS } from "@/lib/support/constants";

const STATUS_STYLES: Record<SupportTicketStatus, string> = {
  open: "border-eldonia-gold/40 bg-eldonia-gold/10 text-eldonia-gold-light",
  in_progress: "border-amber-600/40 bg-amber-900/20 text-amber-200",
  waiting_user: "border-eldonia-gold/30 bg-eldonia-surface-elevated text-eldonia-text-muted",
  resolved: "border-emerald-700/40 bg-emerald-950/30 text-emerald-200",
  closed: "border-eldonia-border bg-transparent text-eldonia-text-dim",
};

type TicketStatusBadgeProps = {
  status: SupportTicketStatus;
};

export function TicketStatusBadge({ status }: TicketStatusBadgeProps) {
  return (
    <span
      className={`eldonia-badge border ${STATUS_STYLES[status]}`}
    >
      {TICKET_STATUS_LABELS[status]}
    </span>
  );
}
