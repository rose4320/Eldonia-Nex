import Link from "next/link";
import { getContent } from "@/lib/i18n/content/messages";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { eventFormatOptions, eventRealmOptions } from "@/lib/i18n/taxonomy";

type EventsSidebarProps = {
  activeCategory?: string;
  activeFormat?: string;
  activeWhen?: string;
  query?: string;
};

export async function EventsSidebar({
  activeCategory = "all",
  activeFormat = "all",
  activeWhen = "upcoming",
  query,
}: EventsSidebarProps) {
  const locale = await getUiLocale();
  const t = getContent(locale);
  const realms = eventRealmOptions(locale);
  const formats = eventFormatOptions(locale);

  function hrefFor(category: string, format: string, when: string) {
    const params = new URLSearchParams();
    if (category !== "all") params.set("category", category);
    if (format !== "all") params.set("format", format);
    if (when !== "upcoming") params.set("when", when);
    if (query?.trim()) params.set("q", query.trim());
    const qs = params.toString();
    return qs ? `/events?${qs}` : "/events";
  }

  const whenOptions = [
    { value: "upcoming", label: t.events.whenUpcoming },
    { value: "past", label: t.events.whenPast },
    { value: "all", label: t.events.whenAll },
  ];

  return (
    <aside className="eldonia-events-sidebar space-y-6">
      <div>
        <h2 className="eldonia-label">Realms</h2>
        <p className="eldonia-hint mt-1">{t.events.sidebarRealms}</p>
        <nav className="mt-4 flex flex-col gap-1">
          {realms.map((realm) => {
            const active = activeCategory === realm.value;
            return (
              <Link
                key={realm.value}
                href={hrefFor(realm.value, activeFormat, activeWhen)}
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
        <h2 className="eldonia-label">{t.events.sidebarFormat}</h2>
        <nav className="mt-3 flex flex-col gap-1">
          {formats.map((item) => {
            const active = activeFormat === item.value;
            return (
              <Link
                key={item.value}
                href={hrefFor(activeCategory, item.value, activeWhen)}
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

      <div>
        <h2 className="eldonia-label">{t.events.sidebarWhen}</h2>
        <nav className="mt-3 flex flex-col gap-1">
          {whenOptions.map((item) => {
            const active = activeWhen === item.value;
            return (
              <Link
                key={item.value}
                href={hrefFor(activeCategory, activeFormat, item.value)}
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
