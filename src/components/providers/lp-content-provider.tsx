"use client";

import { createContext, useContext } from "react";
import type { LpContent } from "@/lib/i18n/content/lp-messages";

const LpContentContext = createContext<LpContent | null>(null);

type LpContentProviderProps = {
  content: LpContent;
  children: React.ReactNode;
};

export function LpContentProvider({ content, children }: LpContentProviderProps) {
  return <LpContentContext.Provider value={content}>{children}</LpContentContext.Provider>;
}

export function useLpContent(override?: LpContent): LpContent {
  const context = useContext(LpContentContext);
  const resolved = override ?? context;
  if (!resolved) {
    throw new Error("LpContentProvider is required when no content prop is passed");
  }
  return resolved;
}
