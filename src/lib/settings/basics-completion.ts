import type { Profile, UserSettings } from "@/types/database";

export function isBasicsComplete(
  settings: Pick<
    UserSettings,
    "legal_name" | "phone" | "address_line1" | "bank_account_holder"
  > | null,
  profile: Pick<Profile, "display_name">,
): boolean {
  if (!settings) return false;
  return Boolean(
    profile.display_name?.trim() &&
      settings.legal_name?.trim() &&
      settings.phone?.trim() &&
      settings.address_line1?.trim() &&
      settings.bank_account_holder?.trim(),
  );
}
