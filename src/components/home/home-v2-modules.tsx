import Image from "next/image";
import Link from "next/link";
import { HomeV2Reveal } from "@/components/home/home-v2-reveal";
import { HOME_V2_ASSETS } from "@/lib/design/home-v2-assets";
import {
  HOME_MODULE_HREFS,
  type HomeV2Content,
} from "@/lib/i18n/content/home-v2-messages";

type HomeV2ModulesProps = {
  copy: HomeV2Content;
};

export function HomeV2Modules({ copy }: HomeV2ModulesProps) {
  const { modules } = copy;

  return (
    <HomeV2Reveal as="section" id="modules" className="home-v2-section home-v2-modules" aria-labelledby="home-v2-modules-title">
      <header className="home-v2-section__head">
        <p className="home-v2-eyebrow">{modules.eyebrow}</p>
        <h2 id="home-v2-modules-title" className="home-v2-section__title">
          {modules.title}
        </h2>
      </header>
      <div className="home-v2-module-grid">
        {modules.items.map((mod, index) => (
          <Link
            key={mod.key}
            href={HOME_MODULE_HREFS[mod.key]}
            className={`home-v2-module-card home-v2-stagger home-v2-stagger--${index + 1}`}
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
        ))}
      </div>
    </HomeV2Reveal>
  );
}
