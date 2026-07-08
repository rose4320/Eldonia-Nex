"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useContent } from "@/components/providers/locale-provider";

type SettingsBasicsCollapsibleProps = {
  children: ReactNode;
};

export function SettingsBasicsCollapsible({ children }: SettingsBasicsCollapsibleProps) {
  const { settingsUi, pages } = useContent();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function syncFromHash() {
      if (window.location.hash === "#basics") {
        setOpen(true);
      }
    }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const toggleLabel = open
    ? settingsUi.basics.collapseSection
    : settingsUi.basics.expandSection;

  return (
    <section id="basics" className="scroll-mt-24 space-y-4">
      <div className="eldonia-card overflow-hidden p-0">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-eldonia-gold/5"
        >
          <span className="eldonia-eyebrow">{pages.settings.sectionBasics}</span>
          <span className="flex items-center gap-2 text-sm text-eldonia-text-muted">
            <span className="hidden sm:inline">{toggleLabel}</span>
            <span className="text-eldonia-gold">{open ? "−" : "+"}</span>
          </span>
        </button>
        {open && (
          <div className="border-t border-eldonia-border px-5 py-5">{children}</div>
        )}
      </div>
    </section>
  );
}
