import type { UiLocale } from "@/lib/i18n/locale";

export type FooterPartnerRole = {
  ja: string;
  en: string;
  ko: string;
  "zh-CN": string;
};

export type FooterPartnerItem = {
  id?: number;
  name: string;
  role: FooterPartnerRole;
  /** When false, name is plain text even if url is stored. */
  link_enabled?: boolean;
  url?: string | null;
  sort_order?: number;
};

/** Fallback when Django API is unreachable or empty. */
export const DEFAULT_FOOTER_PARTNERS: FooterPartnerItem[] = [
  {
    name: "Nexus Cloud",
    role: { ja: "インフラ協力", en: "Infrastructure", ko: "인프라", "zh-CN": "基础设施" },
  },
  {
    name: "Creator Guild",
    role: {
      ja: "コミュニティ協力",
      en: "Community Partner",
      ko: "커뮤니티",
      "zh-CN": "社区合作",
    },
  },
  {
    name: "Gold Sponsor Slot",
    role: { ja: "スポンサー枠", en: "Sponsor Slot", ko: "스폰서", "zh-CN": "赞助位" },
  },
];

function djangoApiBaseUrl(): string {
  return (
    process.env.DJANGO_API_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://127.0.0.1:8000/api/v1"
  ).replace(/\/$/, "");
}

type DjangoFooterPartnersResponse = {
  partners?: Array<{
    id: number;
    name: string;
    role?: Partial<FooterPartnerRole> & { ja?: string };
    link_enabled?: boolean;
    url?: string | null;
    sort_order?: number;
  }>;
};

function normalizePartner(
  raw: NonNullable<DjangoFooterPartnersResponse["partners"]>[number],
): FooterPartnerItem | null {
  const name = (raw.name ?? "").trim();
  const ja = (raw.role?.ja ?? "").trim();
  if (!name || !ja) return null;
  const url = raw.url?.trim() || null;
  const linkEnabled = Boolean(raw.link_enabled) && Boolean(url);
  return {
    id: raw.id,
    name,
    role: {
      ja,
      en: (raw.role?.en ?? ja).trim() || ja,
      ko: (raw.role?.ko ?? ja).trim() || ja,
      "zh-CN": (raw.role?.["zh-CN"] ?? ja).trim() || ja,
    },
    link_enabled: linkEnabled,
    url: linkEnabled ? url : null,
    sort_order: raw.sort_order ?? 0,
  };
}

/**
 * Fetch footer partners from Django Admin–managed API.
 * Falls back to DEFAULT_FOOTER_PARTNERS on error / empty.
 */
export async function getFooterPartners(): Promise<FooterPartnerItem[]> {
  const headers: HeadersInit = {};
  if (process.env.INTERNAL_API_TOKEN) {
    headers["x-internal-api-token"] = process.env.INTERNAL_API_TOKEN;
  }

  try {
    const response = await fetch(`${djangoApiBaseUrl()}/footer/partners/`, {
      headers,
      next: { revalidate: 60 },
    });
    if (!response.ok) return DEFAULT_FOOTER_PARTNERS;

    const data = (await response.json()) as DjangoFooterPartnersResponse;
    const partners = (data.partners ?? [])
      .map(normalizePartner)
      .filter((p): p is FooterPartnerItem => p != null);

    return partners.length > 0 ? partners : DEFAULT_FOOTER_PARTNERS;
  } catch {
    return DEFAULT_FOOTER_PARTNERS;
  }
}

export function localizedPartnerRole(
  role: FooterPartnerRole,
  locale: UiLocale,
): string {
  return role[locale] ?? role.ja;
}
