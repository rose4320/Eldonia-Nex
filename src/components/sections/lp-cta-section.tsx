"use client";

import { useState } from "react";
import { LpButton } from "@/components/ui/lp-button";
import { LpCtaFrame } from "@/components/ui/lp-cta-frame";
import { LpCtaOwl } from "@/components/ui/lp-cta-owl";
import { LP_CTA } from "@/lib/lp/content";

export function LpCtaSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    window.location.href = `/auth/signup?email=${encodeURIComponent(email.trim())}`;
    setSubmitted(true);
  }

  return (
    <section id="start" className="scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <LpCtaFrame>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,280px)]">
            <div className="text-center lg:text-left">
              <h2 className="font-display text-2xl font-semibold tracking-wide text-[#e8d5a3] sm:text-3xl">
                {LP_CTA.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[#9a8b6a] sm:text-base">{LP_CTA.lead}</p>

              <form
                onSubmit={handleSubmit}
                className="relative mx-auto mt-8 flex max-w-xl flex-col gap-3 lg:mx-0 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={LP_CTA.placeholder}
                  className="min-w-0 flex-1 rounded-md border border-[#c5a059]/45 bg-[#060b14]/90 px-4 py-3 text-sm text-[#e8d5a3] shadow-[inset_0_1px_0_rgba(120,140,180,0.05)] placeholder:text-[#5c5340] focus:border-[#c5a059] focus:outline-none focus:ring-2 focus:ring-[#c5a059]/25"
                />
                <LpButton type="submit" className="shrink-0 px-6">
                  {LP_CTA.submit}
                </LpButton>
              </form>

              {submitted && (
                <p className="mt-4 text-sm text-[#9a8b6a]">登録ページへ移動します…</p>
              )}
            </div>

            <div className="relative mx-auto w-full max-w-[280px] lg:max-w-none">
              <LpCtaOwl />
            </div>
          </div>
        </LpCtaFrame>
      </div>
    </section>
  );
}
