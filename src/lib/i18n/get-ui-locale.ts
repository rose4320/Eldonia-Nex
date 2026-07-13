import { cookies, headers } from "next/headers";
import { resolveUiLocale } from "@/lib/i18n/resolve-ui-locale";
import type { UiLocale } from "@/lib/i18n/locale";

export async function getUiLocale(): Promise<UiLocale> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  return resolveUiLocale(
    cookieStore.get("eldonia_locale")?.value,
    headerStore.get("accept-language"),
  );
}
