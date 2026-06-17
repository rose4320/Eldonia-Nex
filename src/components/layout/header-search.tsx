"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { HEADER_LABELS } from "@/lib/i18n/header-chrome";

export function HeaderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = query.trim();
    if (!q) {
      router.push("/gallery");
      return;
    }
    router.push(`/gallery?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="eldonia-header-search">
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={HEADER_LABELS.searchPlaceholder}
        className="eldonia-header-search-input"
        aria-label={HEADER_LABELS.searchPlaceholder}
      />
      <button type="submit" className="eldonia-header-search-btn">
        {HEADER_LABELS.searchSubmit}
      </button>
    </form>
  );
}
