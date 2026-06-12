import Link from "next/link";
import { EVENT_REALMS } from "@/lib/events/constants";

type EventsSidebarProps = {
  activeCategory?: string;
  activeWhen?: string;
  query?: string;
};

export function EventsSidebar({
  activeCategory = "all",
  activeWhen = "upcoming",
  query,
}: EventsSidebarProps) {
  function hrefFor(category: string, when: string) {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (when !== "upcoming") params.set("when", when);
    if (query?.trim()) params.set("q", query.trim());
    const qs = params.toString();
    return qs ? `/events?${qs}` : "/events";
  }

  return (
    <aside className="eldonia-events-sidebar space-y-6">
      <div>
        <h2 className="eldonia-label">Realms</h2>
        <p className="eldonia-hint mt-1">領域で探す</p>
        <nav className="mt-4 flex flex-col gap-1">
          {EVENT_REALMS.map((realm) => {
            const active = activeCategory === realm.value;
            return (
              <Link
                key={realm.value}
                href={hrefFor(realm.value, activeWhen)}
                className={`rounded px-3 py-2 text-sm transition-colors ${
                  active
                    ? "border border-[var(--eldonia-border-strong)] bg-[rgba(201,168,76,0.1)] text-[var(--eldonia-gold-light)]"
                    : "text-[var(--eldonia-text-muted)] hover:text-[var(--eldonia-gold)]"
                }`}
              >
                {realm.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <h2 className="eldonia-label">時期</h2>
        <nav className="mt-3 flex flex-col gap-1">
          {[
            { value: "upcoming", label: "開催予定" },
            { value: "past", label: "終了済み" },
            { value: "all", label: "すべて" },
          ].map((item) => {
            const active = activeWhen === item.value;
            return (
              <Link
                key={item.value}
                href={hrefFor(activeCategory, item.value)}
                className={`rounded px-3 py-2 text-sm transition-colors ${
                  active
                    ? "border border-[var(--eldonia-border-strong)] bg-[rgba(201,168,76,0.1)] text-[var(--eldonia-gold-light)]"
                    : "text-[var(--eldonia-text-muted)] hover:text-[var(--eldonia-gold)]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
