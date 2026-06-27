"use client";

import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type {
  HomeV2CirculationStep,
  HomeV2ModuleKey,
} from "@/lib/i18n/content/home-v2-messages";

type HomeV2CirculationProps = {
  eyebrow: string;
  title: string;
  lead: string;
  loopLabel: string;
  steps: HomeV2CirculationStep[];
  moduleLabels: Record<HomeV2ModuleKey, string>;
  activeIndex: number;
  onActiveIndexChange: Dispatch<SetStateAction<number>>;
};

const ROTATE_MS = 4500;

export function HomeV2Circulation({
  eyebrow,
  title,
  lead,
  loopLabel,
  steps,
  moduleLabels,
  activeIndex,
  onActiveIndexChange,
}: HomeV2CirculationProps) {
  const [paused, setPaused] = useState(false);

  const goToStep = useCallback(
    (index: number) => {
      const normalized = ((index % steps.length) + steps.length) % steps.length;
      onActiveIndexChange(normalized);
    },
    [onActiveIndexChange, steps.length],
  );

  useEffect(() => {
    if (paused || steps.length <= 1) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const timer = window.setInterval(() => {
      onActiveIndexChange((current) => (current + 1) % steps.length);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [onActiveIndexChange, paused, steps.length]);

  const activeStep = steps[activeIndex] ?? steps[0];

  return (
    <div
      className="home-v2-circulation"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="home-v2-circulation__intro">
        <p className="home-v2-eyebrow">{eyebrow}</p>
        <h3 className="home-v2-circulation__title">{title}</h3>
        <p className="home-v2-circulation__lead">{lead}</p>
      </div>

      <div
        className="home-v2-circulation__rail"
        role="tablist"
        aria-label={title}
      >
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={step.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`circulation-panel-${step.key}`}
              id={`circulation-tab-${step.key}`}
              className={`home-v2-circulation__node${isActive ? " home-v2-circulation__node--active" : ""}`}
              onClick={() => goToStep(index)}
            >
              <span className="home-v2-circulation__node-index">{index + 1}</span>
              <span className="home-v2-circulation__node-label">{step.title}</span>
            </button>
          );
        })}
        <span className="home-v2-circulation__loop-badge" aria-hidden="true">
          ↻ {loopLabel}
        </span>
      </div>

      {activeStep && (
        <article
          id={`circulation-panel-${activeStep.key}`}
          role="tabpanel"
          aria-labelledby={`circulation-tab-${activeStep.key}`}
          className="home-v2-circulation__panel"
        >
          <p className="home-v2-circulation__panel-eyebrow">
            {String(activeIndex + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
          </p>
          <h4 className="home-v2-circulation__panel-title">{activeStep.title}</h4>
          <p className="home-v2-circulation__panel-body">{activeStep.body}</p>
          <ul className="home-v2-circulation__module-tags">
            {activeStep.modules.map((moduleKey) => (
              <li
                key={moduleKey}
                className="home-v2-circulation__module-tag home-v2-circulation__module-tag--active"
              >
                {moduleLabels[moduleKey] ?? moduleKey}
              </li>
            ))}
          </ul>
        </article>
      )}
    </div>
  );
}
