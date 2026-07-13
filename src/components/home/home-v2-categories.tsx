"use client";

import { HomeV2Reveal } from "@/components/home/home-v2-reveal";
import type { HomeV2Content } from "@/lib/i18n/content/home-v2-messages";

type HomeV2CategoriesProps = {
  copy: HomeV2Content;
};

export function HomeV2Categories({ copy }: HomeV2CategoriesProps) {
  const { categories } = copy;

  return (
    <HomeV2Reveal as="section" id="contact" className="home-v2-section home-v2-categories">
      <h2 className="home-v2-section__title home-v2-section__title--sm">
        {categories.title}
      </h2>
      <div className="home-v2-category-row">
        {categories.items.map((cat, index) => (
          <div
            key={cat.num}
            className={`home-v2-category-box home-v2-stagger home-v2-stagger--${index + 1}`}
          >
            <span>{cat.num}</span>
            <strong>{cat.label}</strong>
          </div>
        ))}
      </div>
    </HomeV2Reveal>
  );
}
