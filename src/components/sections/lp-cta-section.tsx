"use client";

import { useState } from "react";
import { LpButton } from "@/components/ui/lp-button";
import { LpCtaFrame } from "@/components/ui/lp-cta-frame";
import { LpCtaOwl } from "@/components/ui/lp-cta-owl";
import { LP_CTA } from "@/lib/lp/content";

type SubmitStatus = "idle" | "loading" | "success" | "duplicate" | "error";

export function LpCtaSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || status === "loading") return;

    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/prelaunch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          locale: typeof navigator !== "undefined" ? navigator.language : undefined,
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        alreadyRegistered?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        setErrorMessage(payload.error ?? LP_CTA.error);
        setStatus("error");
        return;
      }

      setEmail("");
      setStatus(payload.alreadyRegistered ? "duplicate" : "success");
    } catch {
      setErrorMessage(LP_CTA.error);
      setStatus("error");
    }
  }

  return (
    <section id="start" className="scroll-mt-20 px-3 py-6 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1120px]">
        <LpCtaFrame>
          <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,230px)]">
            <div className="text-center lg:text-left">
              <h2 className="font-display text-xl font-semibold tracking-wide text-[#e8d5a3] sm:text-2xl">
                {LP_CTA.title}
              </h2>
              <p className="mt-2 text-xs leading-6 text-[#9a8b6a] sm:text-sm">{LP_CTA.lead}</p>

              <form
                onSubmit={handleSubmit}
                className="relative mx-auto mt-5 flex max-w-xl flex-col gap-3 lg:mx-0 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={LP_CTA.placeholder}
                  disabled={status === "loading"}
                  className="min-w-0 flex-1 rounded-md border border-[#c5a059]/45 bg-[#060b14]/90 px-4 py-2.5 text-sm text-[#e8d5a3] shadow-[inset_0_1px_0_rgba(120,140,180,0.05)] placeholder:text-[#5c5340] focus:border-[#c5a059] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/25 disabled:opacity-60"
                />
                <LpButton type="submit" className="shrink-0 px-6">
                  {status === "loading" ? LP_CTA.submitting : LP_CTA.submit}
                </LpButton>
              </form>

              {status === "error" && (
                <p className="mt-4 text-sm text-[#e0a3a3]">{errorMessage ?? LP_CTA.error}</p>
              )}
            </div>

            <div className="relative mx-auto w-full max-w-[280px] lg:max-w-none">
              <LpCtaOwl />
            </div>
          </div>
        </LpCtaFrame>
      </div>

      {(status === "success" || status === "duplicate") && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="prelaunch-thanks-title"
          onClick={() => setStatus("idle")}
        >
          <div
            className="lp-cta-thanks relative w-full max-w-md rounded-2xl border border-[#c5a059]/50 bg-[#0a1120]/95 px-7 py-9 text-center shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setStatus("idle")}
              aria-label={LP_CTA.thankClose}
              className="absolute right-4 top-4 text-[#9a8b6a] transition-colors hover:text-[#e8d5a3]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#c5a059]/60 bg-[#c5a059]/10">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#e8d5a3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <h3
              id="prelaunch-thanks-title"
              className="mt-5 font-display text-xl font-semibold tracking-wide text-[#e8d5a3]"
            >
              {status === "duplicate" ? LP_CTA.thankDuplicateTitle : LP_CTA.thankTitle}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#b6a884]">
              {status === "duplicate" ? LP_CTA.thankDuplicateBody : LP_CTA.thankBody}
            </p>

            <p className="mt-4 rounded-lg border border-[#c5a059]/25 bg-[#c5a059]/5 px-4 py-3 text-xs leading-6 text-[#9a8b6a]">
              {LP_CTA.thankCarryOver}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <LpButton
                type="button"
                className="px-8"
                onClick={() => window.location.assign("/home")}
              >
                {LP_CTA.thankGoHome}
              </LpButton>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="rounded-md border border-[#c5a059]/35 px-6 py-2.5 text-sm text-[#b6a884] transition-colors hover:border-[#c5a059]/60 hover:text-[#e8d5a3]"
              >
                {LP_CTA.thankClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


