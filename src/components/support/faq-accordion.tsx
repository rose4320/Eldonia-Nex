"use client";

import { useMemo, useState } from "react";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { faqCategoryLabel } from "@/lib/i18n/taxonomy";
import { FAQ_CATEGORIES } from "@/lib/support/constants";

type FaqItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  articles: FaqItem[];
  initialQuery?: string;
};

export function FaqAccordion({ articles, initialQuery = "" }: FaqAccordionProps) {
  const locale = useLocale();
  const { pages } = useContent();
  const help = pages.help;
  const [query, setQuery] = useState(initialQuery);
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === "all" || article.category === activeCategory;
      const matchesQuery =
        !normalized ||
        article.question.toLowerCase().includes(normalized) ||
        article.answer.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [articles, query, activeCategory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <input
          type="search"
          placeholder={help.faqSearch}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="eldonia-input flex-1"
        />
        <select
          value={activeCategory}
          onChange={(event) => setActiveCategory(event.target.value)}
          className="eldonia-select"
        >
          <option value="all">{help.faqAllCategories}</option>
          {FAQ_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {faqCategoryLabel(category.value, locale)}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border eldonia-card-dashed px-6 py-10 text-center text-sm text-eldonia-text-muted">
          {help.faqEmpty}
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((article) => {
            const isOpen = openId === article.id;
            return (
              <li key={article.id} className="eldonia-card overflow-hidden p-0">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : article.id)}
                  className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-medium text-eldonia-gold-light">
                    {article.question}
                  </span>
                  <span className="text-eldonia-gold">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="border-t border-eldonia-gold/10 px-5 py-4 eldonia-body text-sm">
                    {article.answer}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
