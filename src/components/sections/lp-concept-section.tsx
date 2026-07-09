"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { LpSectionTitle } from "@/components/ui/lp-section-title";
import { LP_ASSETS } from "@/lib/lp/assets";
import { LP_CONCEPT } from "@/lib/lp/content";

export function LpConceptSection() {
  const [active, setActive] = useState(0);
  const pinZoneRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const steps = LP_CONCEPT.cycle;

  const applyScrollSpacer = useCallback(() => {
    const spacer = spacerRef.current;
    if (!spacer) return;

    const stepVh = window.innerWidth >= 1024 ? 0.32 : 0.26;
    const scrollRange = (steps.length - 1) * stepVh * window.innerHeight;
    spacer.style.height = `${scrollRange}px`;
  }, [steps.length]);

  const updateActiveFromScroll = useCallback(() => {
    const pinZone = pinZoneRef.current;
    if (!pinZone) return;

    const viewport = window.innerHeight;
    const scrollable = pinZone.offsetHeight - viewport;
    if (scrollable <= 0) {
      setActive(0);
      return;
    }

    const sticky = pinZone.querySelector<HTMLElement>(".lp-concept-tree__sticky");
    const stickyTop = sticky ? Number.parseFloat(getComputedStyle(sticky).top) || 0 : 0;
    const rect = pinZone.getBoundingClientRect();
    const scrolled = Math.min(Math.max(0, stickyTop - rect.top), scrollable);
    const progress = scrolled / scrollable;
    const index = Math.min(steps.length - 1, Math.max(0, Math.floor(progress * steps.length)));

    setActive((prev) => (prev === index ? prev : index));
  }, [steps.length]);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveFromScroll);
    };

    const onResize = () => {
      applyScrollSpacer();
      onScroll();
    };

    applyScrollSpacer();
    const pinZone = pinZoneRef.current;
    const sticky = pinZone?.querySelector<HTMLElement>(".lp-concept-tree__sticky");
    const resizeObserver =
      pinZone && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            applyScrollSpacer();
            updateActiveFromScroll();
          })
        : null;

    if (pinZone) resizeObserver?.observe(pinZone);
    if (sticky) resizeObserver?.observe(sticky);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    updateActiveFromScroll();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [applyScrollSpacer, updateActiveFromScroll]);

  return (
    <section id="concept" className="lp-concept-section scroll-mt-24 px-3 py-4 sm:px-5 lg:px-6">
      <div className="mx-auto max-w-[1240px]">
        <div ref={pinZoneRef} className="lp-concept-tree__pin-zone">
          <div className="lp-concept-tree__sticky">
            <div className="lp-concept-tree__sticky-head">
              <LpSectionTitle className="mb-2">{LP_CONCEPT.eyebrow}</LpSectionTitle>
              <p className="lp-concept-tree__sticky-title whitespace-pre-line text-center font-display text-lg font-bold leading-tight tracking-wide text-[#f8f1df] sm:text-xl">
                {LP_CONCEPT.title}
              </p>
              <p className="lp-concept-tree__sticky-lead mx-auto mt-2 max-w-[42rem] text-center text-xs leading-6 text-[#d8c8a8] sm:text-sm">
                {LP_CONCEPT.lead}
              </p>
            </div>

            <div
              className="lp-concept-tree mx-auto w-full"
              aria-live="polite"
              aria-label="世界樹の創造循環アニメーション"
            >
              <div className="lp-concept-tree__frame">
                <div className="lp-concept-tree__canvas">
                  <div className="lp-concept-tree__stage">
                    <Image
                      src={LP_ASSETS.conceptTree}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 680px, (max-width: 1023px) 100vw, 680px"
                      className="lp-concept-tree__art object-contain"
                      priority
                    />
                    <div className="lp-concept-tree__glow" aria-hidden />
                  </div>

                  <ol className="lp-concept-tree__steps">
                    {steps.map((step, index) => {
                      const isActive = active === index;
                      const isHub = "hub" in step && step.hub;

                      return (
                        <li
                          key={step.no}
                          className={`lp-concept-tree__step${isActive ? " is-active" : ""}${isHub ? " is-hub" : ""}`}
                          style={{ left: step.left, top: step.top }}
                          aria-current={isActive ? "step" : undefined}
                        >
                          {isHub ? (
                            <div className="lp-concept-tree__hub">
                              <span className="lp-concept-tree__hub-ring" aria-hidden />
                              <Image
                                src={LP_ASSETS.logo}
                                alt="Eldonia–Nex"
                                width={88}
                                height={88}
                                className="lp-concept-tree__logo"
                              />
                              <span className="lp-concept-tree__node">{step.no}</span>
                            </div>
                          ) : (
                            <span className="lp-concept-tree__node">{step.no}</span>
                          )}

                          <div
                            className="lp-concept-tree__callout lp-concept-tree__callout--node"
                            data-callout={step.callout}
                            role="group"
                            aria-label={`${step.no}. ${step.title}`}
                          >
                            <b className="lp-concept-tree__callout-title">{step.title}</b>
                            <p className="lp-concept-tree__callout-body">{step.body}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>

                <div className="lp-concept-tree__caption" aria-live="polite">
                  <span className="lp-concept-tree__caption-no">{steps[active].no}</span>
                  <div className="lp-concept-tree__caption-text">
                    <b className="lp-concept-tree__callout-title">{steps[active].title}</b>
                    <p className="lp-concept-tree__callout-body">{steps[active].body}</p>
                  </div>
                </div>

                <p className="lp-concept-tree__scroll-hint">{LP_CONCEPT.controls.scrollHint}</p>
              </div>
            </div>
          </div>

          <div
            ref={spacerRef}
            className="lp-concept-tree__scroll-spacer"
            aria-hidden="true"
          />
        </div>

        <p className="mx-auto mt-3 max-w-[40rem] text-center text-[0.72rem] leading-5 text-[#9e927d] sm:text-xs">
          {LP_CONCEPT.note}
        </p>
      </div>
    </section>
  );
}
