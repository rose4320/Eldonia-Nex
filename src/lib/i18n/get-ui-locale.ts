import { cookies } from "next/headers";
import { parseUiLocale, type UiLocale } from "@/lib/i18n/locale";

export async function getUiLocale(): Promise<UiLocale> {
  const cookieStore = await cookies();
  return parseUiLocale(cookieStore.get("eldonia_locale")?.value);
}
