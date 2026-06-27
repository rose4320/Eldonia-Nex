import Link from "next/link";
import { HomeV2Reveal } from "@/components/home/home-v2-reveal";
import {
  HOME_MODULE_HREFS,
  type HomeV2Content,
} from "@/lib/i18n/content/home-v2-messages";

type HomeV2SeoOverviewProps = {
  copy: HomeV2Content;
};

export function HomeV2SeoOverview({ copy }: HomeV2SeoOverviewProps) {
  const { seo } = copy;

  return (
    <HomeV2Reveal
      as="section"
      id="about"
      className="home-v2-section home-v2-seo"
      aria-labelledby="home-v2-seo-platform-title"
    >
      <header className="home-v2-section__head">
        <h2 id="home-v2-seo-platform-title" className="home-v2-section__title">
          {seo.platformHeading}
        </h2>
        <p className="home-v2-section__lead">{seo.platformBody}</p>
      </header>

      <div className="home-v2-seo__modules">
        <h2 className="home-v2-section__title home-v2-section__title--sm">
          {seo.modulesHeading}
        </h2>
        <div className="home-v2-seo__grid">
          {seo.moduleDetails.map((mod, index) => (
            <article
              key={mod.key}
              className={`home-v2-seo__item home-v2-stagger home-v2-stagger--${index + 1}`}
            >
              <h3 className="home-v2-seo__heading">{mod.heading}</h3>
              <p className="home-v2-seo__body">{mod.body}</p>
              <Link href={HOME_MODULE_HREFS[mod.key]} className="home-v2-link">
                {mod.linkLabel}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </HomeV2Reveal>
  );
}
