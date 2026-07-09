import type { UiLocale } from "@/lib/i18n/locale";

function L(
  ja: string,
  en: string,
  ko: string,
  zh: string,
): Record<UiLocale, string> {
  return { ja, en, ko, "zh-CN": zh };
}

type TaxonomyEntry = Record<UiLocale, string>;

function taxonomyLabel(
  map: Record<string, TaxonomyEntry>,
  value: string,
  locale: UiLocale,
): string {
  return map[value]?.[locale] ?? map[value]?.ja ?? value;
}

export const ARTWORK_CATEGORY_LABELS: Record<string, TaxonomyEntry> = {
  illustration: L("イラスト", "Illustration", "일러스트", "插画"),
  manga: L("漫画", "Manga", "만화", "漫画"),
  photo: L("写真", "Photo", "사진", "摄影"),
  story: L("ストーリー", "Story", "스토리", "故事"),
  video: L("動画", "Video", "영상", "视频"),
  music: L("音楽", "Music", "음악", "音乐"),
  document: L("ドキュメント", "Document", "문서", "文档"),
  other: L("その他", "Other", "기타", "其他"),
};

export const CREATOR_DISCIPLINE_LABELS: Record<string, TaxonomyEntry> = {
  illustrator: L("イラストレーター", "Illustrator", "일러스트레이터", "插画师"),
  manga_artist: L("漫画家", "Manga artist", "만화가", "漫画家"),
  photographer: L("写真家", "Photographer", "사진작가", "摄影师"),
  writer: L("作家・シナリオ", "Writer / Script", "작가·시나리오", "作家·编剧"),
  musician: L("音楽", "Musician", "음악", "音乐人"),
  filmmaker: L("映像作家", "Filmmaker", "영상 작가", "影像创作者"),
  designer: L("デザイナー", "Designer", "디자이너", "设计师"),
  other: L("その他", "Other", "기타", "其他"),
};

export const GALLERY_REALM_LABELS: Record<string, TaxonomyEntry> = {
  all: L("すべて", "All", "전체", "全部"),
  illustration: L("イラスト", "Illustration", "일러스트", "插画"),
  manga: L("漫画", "Manga", "만화", "漫画"),
  photo: L("写真", "Photo", "사진", "摄影"),
  story: L("ストーリー", "Story", "스토리", "故事"),
  video: L("動画", "Video", "영상", "视频"),
  music: L("音楽", "Music", "음악", "音乐"),
};

export const EVENT_REALM_LABELS: Record<string, TaxonomyEntry> = {
  all: L("すべての領域", "All realms", "모든 영역", "全部领域"),
  concert: L("ライブ・演奏", "Live & Performance", "라이브·연주", "现场·演奏"),
  workshop: L("ワークショップ", "Workshop", "워크숍", "工作坊"),
  meetup: L("交流会・サミット", "Meetup & Summit", "교류회·서밋", "交流会·峰会"),
  exhibition: L("展示・展覧会", "Exhibition", "전시·展覧会", "展览"),
  streaming: L("配信・オンライン", "Streaming & Online", "스트리밍·온라인", "直播·线上"),
  competition: L("コンテスト", "Competition", "콘테스트", "竞赛"),
};

export const EVENT_FORMAT_LABELS: Record<string, TaxonomyEntry> = {
  online: L("オンライン", "Online", "온라인", "线上"),
  hybrid: L("ハイブリッド", "Hybrid", "하이브리드", "混合"),
  offline: L("会場", "In-person", "현장", "线下"),
};

export const SHOP_REALM_LABELS: Record<string, TaxonomyEntry> = {
  all: L("すべての領域", "All realms", "모든 영역", "全部领域"),
  apparel: L("アパレル", "Apparel", "의류", "服饰"),
  digital: L("デジタル", "Digital", "디지털", "数字"),
  goods: L("グッズ", "Goods", "굿즈", "周边"),
  tools: L("クリエイターツール", "Creator Tools", "크리에이터 도구", "创作工具"),
  books: L("書籍・資料", "Books & Resources", "서적·자료", "书籍·资料"),
};

export const JOB_TYPE_LABELS: Record<string, TaxonomyEntry> = {
  freelance: L("フリーランス", "Freelance", "프리랜서", "自由职业"),
  full_time: L("正社員", "Full-time", "정규직", "全职"),
  part_time: L("パート・アルバイト", "Part-time", "파트·알바", "兼职"),
  collab: L("協業・コラボ", "Collaboration", "협업·콜라보", "协作·联名"),
};

export const SUPPORT_TICKET_CATEGORY_LABELS: Record<string, TaxonomyEntry> = {
  account: L("アカウント", "Account", "계정", "账户"),
  billing: L("請求・お支払い", "Billing", "청구·결제", "账单·支付"),
  gallery: L("GALLERY（作品）", "GALLERY (Artwork)", "GALLERY（작품）", "GALLERY（作品）"),
  shop: L("SHOP（ショップ）", "SHOP", "SHOP", "SHOP"),
  events: L("EVENTS（イベント）", "EVENTS", "EVENTS", "EVENTS"),
  community: L("COMMUNITY", "COMMUNITY", "COMMUNITY", "COMMUNITY"),
  works: L("WORKS（求人）", "WORKS (Jobs)", "WORKS（구인）", "WORKS（招聘）"),
  technical: L("技術的な問題", "Technical issue", "기술 문제", "技术问题"),
  other: L("その他", "Other", "기타", "其他"),
};

export function artworkCategoryLabel(value: string, locale: UiLocale): string {
  return taxonomyLabel(ARTWORK_CATEGORY_LABELS, value, locale);
}

export function creatorDisciplineLabel(value: string, locale: UiLocale): string {
  return taxonomyLabel(CREATOR_DISCIPLINE_LABELS, value, locale);
}

export function galleryRealmLabel(value: string, locale: UiLocale): string {
  return taxonomyLabel(GALLERY_REALM_LABELS, value, locale);
}

export function eventRealmLabel(value: string, locale: UiLocale): string {
  return taxonomyLabel(EVENT_REALM_LABELS, value, locale);
}

export function eventFormatLabel(value: string, locale: UiLocale): string {
  return taxonomyLabel(EVENT_FORMAT_LABELS, value, locale);
}

export function shopRealmLabel(value: string, locale: UiLocale): string {
  return taxonomyLabel(SHOP_REALM_LABELS, value, locale);
}

export function jobTypeLabel(value: string, locale: UiLocale): string {
  return taxonomyLabel(JOB_TYPE_LABELS, value, locale);
}

export const FAQ_CATEGORY_LABELS: Record<string, TaxonomyEntry> = {
  getting_started: L("はじめに", "Getting started", "시작하기", "入门"),
  account: L("アカウント", "Account", "계정", "账户"),
  gallery: L("GALLERY", "GALLERY", "GALLERY", "GALLERY"),
  billing: L("請求・お支払い", "Billing", "청구·결제", "账单"),
  technical: L("トラブルシューティング", "Troubleshooting", "문제 해결", "故障排除"),
  support: L("サポート", "Support", "지원", "支持"),
};

export function portfolioVisibilityLabel(value: string, locale: UiLocale): string {
  const map: Record<string, TaxonomyEntry> = {
    public: L("公開", "Public", "공개", "公开"),
    employers_only: L("求人主のみ", "Employers only", "구인자만", "仅招聘方"),
    private: L("非公開", "Private", "비공개", "非公开"),
  };
  return taxonomyLabel(map, value, locale);
}

export function portfolioVisibilityOptions(locale: UiLocale) {
  return (["public", "employers_only", "private"] as const).map((value) => ({
    value,
    label: portfolioVisibilityLabel(value, locale),
  }));
}

export function faqCategoryLabel(value: string, locale: UiLocale): string {
  return taxonomyLabel(FAQ_CATEGORY_LABELS, value, locale);
}

export function supportTicketCategoryLabel(value: string, locale: UiLocale): string {
  return taxonomyLabel(SUPPORT_TICKET_CATEGORY_LABELS, value, locale);
}

export const SUPPORT_TICKET_STATUS_LABELS: Record<string, TaxonomyEntry> = {
  open: L("受付済み", "Open", "접수됨", "已受理"),
  in_progress: L("対応中", "In progress", "처리 중", "处理中"),
  waiting_user: L("返信待ち", "Awaiting reply", "답변 대기", "等待回复"),
  resolved: L("解決済み", "Resolved", "해결됨", "已解决"),
  closed: L("クローズ", "Closed", "종료", "已关闭"),
};

export function supportTicketStatusLabel(value: string, locale: UiLocale): string {
  return taxonomyLabel(SUPPORT_TICKET_STATUS_LABELS, value, locale);
}

export const NOTIFICATION_KIND_LABELS: Record<string, TaxonomyEntry> = {
  collab_request: L("コラボ申請", "Collab request", "콜라보 신청", "合作申请"),
  collab_accepted: L("コラボ承認", "Collab accepted", "콜라보 승인", "合作已同意"),
  collab_declined: L("コラボについて", "Collab update", "콜라보 알림", "合作通知"),
  announcement: L("告知", "Announcement", "공지", "公告"),
  fan_registered: L("ファン登録", "New fan", "팬 등록", "新粉丝"),
  artwork_liked: L("いいね", "Like", "좋아요", "点赞"),
  artwork_commented: L("コメント", "Comment", "댓글", "评论"),
  lab_post: L("Lab", "Lab", "Lab", "Lab"),
  order_paid: L("注文", "Order", "주문", "订单"),
  support_reply: L("サポート", "Support", "지원", "支持"),
  notification: L("通知", "Notification", "알림", "通知"),
};

export function notificationKindLabel(kind: string, locale: UiLocale): string {
  return taxonomyLabel(NOTIFICATION_KIND_LABELS, kind, locale);
}

export const NOTIFICATION_FILTER_LABELS: Record<string, TaxonomyEntry> = {
  all: L("すべて", "All", "전체", "全部"),
  collab: L("コラボ", "Collab", "콜라보", "合作"),
  engagement: L("ファン・いいね・コメント", "Fans & engagement", "팬·좋아요·댓글", "粉丝·互动"),
  announcement: L("告知", "Announcements", "공지", "公告"),
  system: L("注文・サポート", "Orders & support", "주문·지원", "订单·支持"),
};

export function notificationFilterLabel(value: string, locale: UiLocale): string {
  return taxonomyLabel(NOTIFICATION_FILTER_LABELS, value, locale);
}

export function formatFreePrice(locale: UiLocale): string {
  return L("無料", "Free", "무료", "免费")[locale];
}

export function formatYenPrice(yen: number, locale: UiLocale): string {
  const amount = yen.toLocaleString(locale === "ja" ? "ja-JP" : "en-US");
  return `¥${amount}`;
}

export function ticketsRemainingLabel(remaining: number, locale: UiLocale): string {
  const templates: Record<UiLocale, string> = {
    ja: `残り ${remaining} 席`,
    en: `${remaining} seats left`,
    ko: `${remaining}석 남음`,
    "zh-CN": `剩余 ${remaining} 席`,
  };
  return templates[locale];
}

export function intlDateTag(locale: UiLocale): string {
  switch (locale) {
    case "ja":
      return "ja-JP";
    case "ko":
      return "ko-KR";
    case "zh-CN":
      return "zh-CN";
    default:
      return "en-US";
  }
}

export function eventRealmOptions(locale: UiLocale) {
  return (["all", "concert", "workshop", "meetup", "exhibition", "streaming", "competition"] as const).map(
    (value) => ({ value, label: eventRealmLabel(value, locale) }),
  );
}

export function shopRealmOptions(locale: UiLocale) {
  return (["all", "apparel", "digital", "goods", "tools", "books"] as const).map(
    (value) => ({ value, label: shopRealmLabel(value, locale) }),
  );
}

export function jobTypeOptions(locale: UiLocale) {
  return (["freelance", "full_time", "part_time", "collab"] as const).map(
    (value) => ({ value, label: jobTypeLabel(value, locale) }),
  );
}

export function artworkCategoryOptions(
  values: readonly string[],
  locale: UiLocale,
) {
  return values.map((value) => ({
    value,
    label: artworkCategoryLabel(value, locale),
  }));
}
