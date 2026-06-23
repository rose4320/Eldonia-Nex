import Image from "next/image";
import Link from "next/link";
import { HomeV2Reveal } from "@/components/home/home-v2-reveal";
import { HOME_V2_ASSETS } from "@/lib/design/home-v2-assets";
import type { HomeV2Content } from "@/lib/i18n/content/home-v2-messages";

type HomeV2InvestorProps = {
  copy: HomeV2Content;
};

export function HomeV2Investor({ copy }: HomeV2InvestorProps) {
  const { investor } = copy;

  return (
    <HomeV2Reveal
      as="section"
      className="home-v2-section home-v2-investor"
      aria-labelledby="home-v2-investor-title"
    >
      <div className="home-v2-investor__copy">
        <p className="home-v2-eyebrow">{investor.eyebrow}</p>
        <h2 id="home-v2-investor-title" className="home-v2-section__title">
          {investor.title}
        </h2>
        <p className="home-v2-section__lead">{investor.lead}</p>
        <ul className="home-v2-investor-perks">
          {investor.perks.map((perk) => (
            <li key={perk.title} className="home-v2-investor-perk">
              <strong>{perk.title}</strong>
              <p>{perk.body}</p>
            </li>
          ))}
        </ul>
        <Link href="/help/contact" className="home-v2-btn home-v2-btn--primary">
          {investor.cta}
        </Link>
      </div>

      <div className="home-v2-investor__visual">
        <Image
          src={HOME_V2_ASSETS.investorPinBadge}
          alt="ELDONIA NEX supporter pin badge"
          width={288}
          height={288}
          className="home-v2-investor__badge"
        />
        <div className="home-v2-serial-box">
          <p className="home-v2-serial-box__title">{investor.serialTitle}</p>
          <p className="home-v2-serial-box__format">{investor.serialFormat}</p>
          <ul className="home-v2-serial-box__parts">
            {investor.serialParts.map((part) => (
              <li key={part.part} className="home-v2-serial-part">
                <code>{part.part}</code>
                <span>{part.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </HomeV2Reveal>
  );
}
