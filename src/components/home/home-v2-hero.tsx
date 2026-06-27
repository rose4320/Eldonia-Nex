import Image from "next/image";
import Link from "next/link";
import { HOME_V2_ASSETS } from "@/lib/design/home-v2-assets";
import {
  formatHomeStatValue,
  type HomePlatformStats,
} from "@/lib/home/get-home-stats";
import type { HomeV2Content } from "@/lib/i18n/content/home-v2-messages";
import type { UiLocale } from "@/lib/i18n/locale";

type HomeV2HeroProps = {
  copy: HomeV2Content;
  stats: HomePlatformStats;
  locale: UiLocale;
};

export function HomeV2Hero({ copy, stats, locale }: HomeV2HeroProps) {
  const { hero, questGuide } = copy;

  return (
    <section
      className="home-v2-hero home-v2-hero--live home-v2-hero--backdrop"
      aria-labelledby="home-v2-hero-title"
    >
      <div className="home-v2-hero__backdrop" aria-hidden="true">
        <Image
          src={HOME_V2_ASSETS.hero}
          alt=""
          fill
          priority
          sizes="100vw"
          className="home-v2-hero__backdrop-image"
        />
      </div>
      <div className="home-v2-hero__scrim" aria-hidden="true" />

      <div className="home-v2-hero__copy">
        <h1 id="home-v2-hero-title" className="home-v2-hero__title home-v2-enter home-v2-enter--1">
          {hero.title}
        </h1>
        <h2 className="home-v2-hero__subtitle home-v2-enter home-v2-enter--2">{hero.subtitle}</h2>
        <p className="home-v2-hero__lead home-v2-enter home-v2-enter--3">{hero.lead}</p>
        <div className="home-v2-hero__actions home-v2-enter home-v2-enter--4">
          <Link href="/auth/signup" className="home-v2-btn home-v2-btn--primary home-v2-btn--lg">
            {hero.ctaPrimary}
          </Link>
          <Link href="/works" className="home-v2-btn home-v2-btn--outline home-v2-btn--lg">
            {hero.ctaSecondary}
          </Link>
        </div>
        <div className="home-v2-hero__stats home-v2-enter home-v2-enter--5">
          {hero.stats.map((stat, index) => (
            <div
              key={stat.key}
              className={`home-v2-hero-stat home-v2-enter home-v2-enter--${6 + index}`}
            >
              <strong>{formatHomeStatValue(stat.key, stats, locale)}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <aside className="home-v2-hero__aside home-v2-enter home-v2-enter--4">
        <p className="home-v2-eyebrow">{questGuide.eyebrow}</p>
        <ol className="home-v2-quest-steps">
          {questGuide.steps.map((step, index) => (
            <li
              key={step.key}
              className={`home-v2-quest-step home-v2-enter home-v2-enter--${5 + index}`}
            >
              <Image
                src={HOME_V2_ASSETS.questFlow[step.key]}
                alt=""
                width={40}
                height={40}
              />
              <div>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <ul className="home-v2-growth-metrics">
          {questGuide.metrics.map((metric) => (
            <li key={metric.key} className="home-v2-growth-metric">
              <Image
                src={HOME_V2_ASSETS.metrics[metric.key]}
                alt=""
                width={36}
                height={36}
              />
              <div>
                <strong>{metric.label}</strong>
                <p>{metric.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
