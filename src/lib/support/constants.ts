export type SupportTicketCategory =
  | "account"
  | "billing"
  | "gallery"
  | "shop"
  | "events"
  | "community"
  | "works"
  | "technical"
  | "other";

export type SupportTicketPriority = "low" | "normal" | "high" | "urgent";

export type SupportTicketStatus =
  | "open"
  | "in_progress"
  | "waiting_user"
  | "resolved"
  | "closed";

export const TICKET_CATEGORIES: {
  value: SupportTicketCategory;
  label: string;
}[] = [
  { value: "account", label: "アカウント" },
  { value: "billing", label: "請求・お支払い" },
  { value: "gallery", label: "GALLEY（作品）" },
  { value: "shop", label: "SHOP（ショップ）" },
  { value: "events", label: "EVENTS（イベント）" },
  { value: "community", label: "COMMUNITY" },
  { value: "works", label: "WORKS（求人）" },
  { value: "technical", label: "技術的な問題" },
  { value: "other", label: "その他" },
];

export const FAQ_CATEGORIES: { value: string; label: string }[] = [
  { value: "getting_started", label: "はじめに" },
  { value: "account", label: "アカウント" },
  { value: "gallery", label: "GALLEY" },
  { value: "billing", label: "請求・お支払い" },
  { value: "technical", label: "トラブルシューティング" },
  { value: "support", label: "サポート" },
];

export const TICKET_STATUS_LABELS: Record<SupportTicketStatus, string> = {
  open: "受付済み",
  in_progress: "対応中",
  waiting_user: "返信待ち",
  resolved: "解決済み",
  closed: "クローズ",
};

export const TICKET_PRIORITY_LABELS: Record<SupportTicketPriority, string> = {
  low: "低",
  normal: "通常",
  high: "高",
  urgent: "緊急",
};

export function categoryLabel(value: string): string {
  return (
    TICKET_CATEGORIES.find((item) => item.value === value)?.label ??
    FAQ_CATEGORIES.find((item) => item.value === value)?.label ??
    value
  );
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export const HELP_LINKS = [
  {
    href: "/help/faq",
    title: "よくある質問",
    description: "アカウント・作品投稿・トラブル対処など",
    icon: "❓",
    requiresAuth: false,
  },
  {
    href: "/help/guides",
    title: "利用ガイド",
    description: "初めての方へのステップバイステップ解説",
    icon: "📖",
    requiresAuth: false,
  },
  {
    href: "/help/contact",
    title: "お問い合わせ",
    description: "解決しない場合はサポートへ連絡",
    icon: "📩",
    requiresAuth: false,
  },
  {
    href: "/help/tickets",
    title: "マイチケット",
    description: "問い合わせ履歴の確認・追加返信",
    icon: "🎫",
    requiresAuth: true,
  },
] as const;

export const SLA_INFO = {
  firstResponse: "1〜2 営業日以内",
  hours: "平日 10:00〜18:00（JST）",
  email: "support@eldonia-nex.com",
};
