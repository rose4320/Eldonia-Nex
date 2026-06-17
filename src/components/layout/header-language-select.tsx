"use client";

import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, UI_LOCALES, type UiLocale } from "@/lib/i18n/locale";

type HeaderLanguageSelectProps = {
  locale: UiLocale;
};

export function HeaderLanguageSelect({ locale }: HeaderLanguageSelectProps) {
  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value as UiLocale;
    document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
    router.refresh();
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="eldonia-header-lang"
      aria-label="Language"
    >
      {UI_LOCALES.map((item) => (
        <option key={item.value} value={item.value}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
