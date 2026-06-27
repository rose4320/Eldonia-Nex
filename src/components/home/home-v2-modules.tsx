"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HomeV2Circulation } from "@/components/home/home-v2-circulation";
import { HomeV2Reveal } from "@/components/home/home-v2-reveal";
import { HOME_V2_ASSETS } from "@/lib/design/home-v2-assets";
import {
  HOME_MODULE_HREFS,
  type HomeV2Content,
  type HomeV2ModuleKey,
} from "@/lib/i18n/content/home-v2-messages";

type HomeV2ModulesProps = {
  copy: HomeV2Content;
};

export function HomeV2Modules({ copy }: HomeV2ModulesProps) {
  const { modules } = copy;
  const [activeIndex, setActiveIndex] = useState(0);

  const activeModules = useMemo(
    () => modules.circulation.steps[activeIndex]?.modules ?? [],
    [activeIndex, modules.circulation.steps],
  );

  const moduleLabels = Object.fromEntries(
    modules.items.map((item) => [item.key, item.name]),
  ) as Record<HomeV2ModuleKey, string>;

  return (
    <HomeV2Reveal
      as="section"
      id="modules"
      className="home-v2-section home-v2-modules"
      aria-labelledby="home-v2-modules-title"
    >
      <header className="home-v2-section__head">
        <p className="home-v2-eyebrow">{modules.eyebrow}</p>
        <h2 id="home-v2-modules-title" className="home-v2-section__title">
          {modules.title}
        </h2>
      </header>

      <HomeV2Circulation
        eyebrow={modules.circulation.eyebrow}
        title={modules.circulation.title}
        lead={modules.circulation.lead}
        loopLabel={modules.circulation.loopLabel}
        steps={modules.circulation.steps}
        moduleLabels={moduleLabels}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
      />

      <div className="home-v2-module-grid">
        {modules.items.map((mod, index) => {
          const isActive = activeModules.includes(mod.key);
          return (
            <Link
              key={mod.key}
              href={HOME_MODULE_HREFS[mod.key]}
              className={`home-v2-module-card home-v2-stagger home-v2-stagger--${index + 1}${isActive ? " home-v2-module-card--circulation-active" : ""}`}
            >
              <Image
                className="home-v2-module-card__icon"
                src={HOME_V2_ASSETS.modules[mod.key]}
                alt=""
                width={48}
                height={48}
              />
              <h3>{mod.name}</h3>
              <p>{mod.body}</p>
              <span className="home-v2-module-card__link">{mod.link}</span>
            </Link>
          );
        })}
      </div>
    </HomeV2Reveal>
  );
}
