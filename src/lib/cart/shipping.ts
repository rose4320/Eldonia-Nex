/** MVP 国内送料（1 注文あたり）。§3.9 料金マスタ導入後に置き換え。 */
export const DEFAULT_DOMESTIC_SHIPPING_YEN = 770;

export type ShippingAddressInput = {
  legal_name: string;
  country: string;
  address_line1: string;
  address_line2?: string | null;
  phone: string;
};

export type ShippingSnapshot = ShippingAddressInput;

export function calculateDomesticShippingFee(physicalLineCount: number): number {
  if (physicalLineCount <= 0) return 0;
  return DEFAULT_DOMESTIC_SHIPPING_YEN;
}

export function normalizeShippingInput(raw: unknown): ShippingAddressInput | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Record<string, unknown>;
  const legal_name = typeof value.legal_name === "string" ? value.legal_name.trim() : "";
  const country = typeof value.country === "string" ? value.country.trim() : "";
  const address_line1 = typeof value.address_line1 === "string" ? value.address_line1.trim() : "";
  const phone = typeof value.phone === "string" ? value.phone.trim() : "";
  const address_line2 =
    typeof value.address_line2 === "string" ? value.address_line2.trim() : null;

  if (!legal_name || !country || !address_line1 || !phone) {
    return null;
  }

  return {
    legal_name,
    country,
    address_line1,
    address_line2: address_line2 || null,
    phone,
  };
}

export function shippingFromUserSettings(
  settings: {
    legal_name: string | null;
    country: string;
    address_line1: string | null;
    address_line2: string | null;
    phone: string | null;
  } | null,
): ShippingAddressInput | null {
  if (!settings) return null;
  return normalizeShippingInput({
    legal_name: settings.legal_name ?? "",
    country: settings.country,
    address_line1: settings.address_line1 ?? "",
    address_line2: settings.address_line2,
    phone: settings.phone ?? "",
  });
}
