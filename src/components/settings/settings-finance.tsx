"use client";

import Link from "next/link";
import { useContent, useLocale } from "@/components/providers/locale-provider";
import { intlLocale } from "@/lib/i18n/content/messages";
import type { SettingsFinanceSummary } from "@/lib/settings/get-settings-data";

type SettingsFinanceProps = {
  finance: SettingsFinanceSummary;
};

export function SettingsFinance({ finance }: SettingsFinanceProps) {
  const locale = useLocale();
  const { settingsUi } = useContent();
  const financeCopy = settingsUi.finance;
  const numberLocale = intlLocale(locale);

  return (
    <section id="finance" className="scroll-mt-24 space-y-4">
      <h2 className="eldonia-eyebrow">{financeCopy.heading}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <article className="eldonia-card">
          <p className="eldonia-hint">{financeCopy.spentTotal}</p>
          <p className="mt-2 font-display text-2xl font-bold text-eldonia-gold-light">
            ¥{finance.totalSpent.toLocaleString(numberLocale)}
          </p>
          <p className="eldonia-hint mt-1">{financeCopy.paidOrders(finance.paidOrderCount)}</p>
        </article>
        <article className="eldonia-card">
          <p className="eldonia-hint">{financeCopy.estimatedIncome}</p>
          <p className="mt-2 font-display text-2xl font-bold text-eldonia-gold-light">
            ¥{finance.estimatedEarnings.toLocaleString(numberLocale)}
          </p>
          <p className="eldonia-hint mt-1">{financeCopy.estimatedHint}</p>
        </article>
        <article className="eldonia-card">
          <p className="eldonia-hint">{financeCopy.listedProducts}</p>
          <p className="mt-2 font-display text-2xl font-bold text-eldonia-gold-light">
            {finance.productCount}
          </p>
          <Link href="/settings/post/product" className="eldonia-link mt-2 inline-block text-xs">
            {financeCopy.postProduct}
          </Link>
        </article>
        <article className="eldonia-card">
          <p className="eldonia-hint">{financeCopy.hostedEvents}</p>
          <p className="mt-2 font-display text-2xl font-bold text-eldonia-gold-light">
            {finance.eventCount}
          </p>
          <Link href="/settings/post/event" className="eldonia-link mt-2 inline-block text-xs">
            {financeCopy.postEvent}
          </Link>
        </article>
      </div>
      <Link href="/dashboard/orders" className="eldonia-link text-sm">
        {financeCopy.viewOrders}
      </Link>
    </section>
  );
}
