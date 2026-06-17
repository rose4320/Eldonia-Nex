"use client";

import { createContext, useContext } from "react";
import { getContent } from "@/lib/i18n/content/messages";
import type { ContentCatalog } from "@/lib/i18n/content/types";
import type { UiLocale } from "@/lib/i18n/locale";

const LocaleContext = createContext<UiLocale>("ja");

type LocaleProviderProps = {
  locale: UiLocale;
  children: React.ReactNode;
};

export function LocaleProvider({ locale, children }: LocaleProviderProps) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): UiLocale {
  return useContext(LocaleContext);
}

export function useContent(): ContentCatalog {
  return getContent(useLocale());
}
