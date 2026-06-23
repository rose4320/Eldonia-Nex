import type { UiLocale } from "@/lib/i18n/locale";

export type PageMessages = {
  userFallback: string;
  anonymous: string;
  creatorFallback: string;
  posterFallback: string;
  prev: string;
  next: string;
  pinned: string;
  featured: string;
  soldOut: string;
  descriptionPending: string;
  loginToAction: (action: string) => string;
  gallery: {
    backToList: string;
    openPdf: string;
    loginToComment: string;
    labBack: string;
    like: string;
    comments: string;
    commentCount: (n: number) => string;
    commentPlaceholder: string;
    commentSubmit: string;
    commentSending: string;
    commentsEmpty: string;
    loginToCommentFull: string;
    showcaseReadOnly: string;
  };
  events: {
    back: string;
    organizer: string;
    venueSection: string;
    labelFormat: string;
    labelRealm: string;
    labelVenue: string;
    labelAddress: string;
    labelOnline: string;
    urlAfterPurchase: string;
    badgeFeatured: string;
    badgeVerified: string;
    toolbarSearch: string;
    toolbarSearchAria: string;
    toolbarOrders: string;
    ticketHeading: string;
    ticketCompare: string;
    ticketPast: string;
    ticketGet: string;
    ticketLogin: string;
    ticketQrNote: string;
    soldOutFull: string;
  };
  works: {
    back: string;
    badgeFeatured: string;
    labelPoster: string;
    labelType: string;
    labelPay: string;
    labelLocation: string;
    toolbarSearch: string;
    toolbarSearchAria: string;
    toolbarPortfolio: string;
    toolbarManage: string;
    manageTitle: string;
    manageLead: string;
    portfolioTitle: string;
    portfolioLead: string;
  };
  community: {
    toolbarSearch: string;
    toolbarSearchAria: string;
    toolbarNexus: string;
    newThread: string;
    threadCount: (n: number) => string;
    threadsEmpty: string;
    loginToPost: string;
    replies: (n: number) => string;
    loginToReply: string;
    threadCreateEyebrow: (slug: string) => string;
    threadTitle: string;
    threadBody: string;
    threadSubmit: string;
    threadSubmitting: string;
    cancel: string;
    replyHeading: string;
    replyPlaceholder: string;
    replySubmit: string;
    replySubmitting: string;
    repliesEmpty: string;
    nexusBadge: string;
    nexusTargetAria: string;
    nexusTranslating: string;
    nexusShow: string;
    nexusRetranslate: string;
    nexusOriginalOnly: string;
    nexusDemoHint: string;
    nexusErr: string;
    nexusSource: (label: string) => string;
    nexusTranslateBtn: string;
    nexusTranslationHeading: (label: string) => string;
    nexusHideOriginal: string;
    nexusShowOriginal: string;
  };
  help: {
    faqTitle: string;
    faqLead: string;
    faqContactLink: string;
    guidesTitle: string;
    guidesLead: string;
    contactTitle: string;
    contactLead: (sla: string) => string;
    contactSidebarTitle: string;
    contactSidebarFaq: string;
    contactSidebarTickets: string;
    contactEmergency: string;
    contactSuccessTitle: string;
    contactSuccessLead: string;
    contactSuccessTicket: string;
    contactSuccessTicketMissing: string;
    contactSuccessFaq: string;
    contactSuccessTickets: string;
    ticketsTitle: string;
    ticketsEmpty: string;
    ticketsNew: string;
    ticketsUpdated: string;
    ticketDetailBack: string;
    ticketDetailCreated: string;
    ticketDetailSupport: string;
    ticketDetailClosed: string;
    ticketDetailResolved: string;
    faqSearch: string;
    faqEmpty: string;
    faqAllCategories: string;
  };
  settings: {
    back: string;
    postArtworkTitle: string;
    postArtworkLead: string;
    postProductTitle: string;
    postProductLead: string;
    postEventTitle: string;
    postEventLead: string;
    creatorOnly: string;
    menuTitle: string;
    sectionBasics: string;
    sectionPost: string;
    sectionFinance: string;
    sectionNotifications: string;
    sectionPortfolio: string;
    avatarSettings: string;
    backHome: string;
  };
  checkout: {
    eyebrow: string;
    title: string;
    body: string;
    backShop: string;
    dashboard: string;
  };
  dashboard: {
    back: string;
    ordersTitle: string;
    ordersEmpty: string;
    ordersBrowse: string;
    orderLabel: string;
  };
  notifications: {
    bellLabel: string;
    empty: string;
    markAllRead: string;
    viewAll: string;
  };
  lab: {
    galleryLink: string;
  };
  shop: {
    badgeBestseller: string;
    badgeChoice: string;
  };
};

const PAGE_JA: PageMessages = {
  userFallback: "ユーザー",
  anonymous: "匿名",
  creatorFallback: "クリエイター",
  posterFallback: "掲載者未設定",
  prev: "前へ",
  next: "次へ",
  pinned: "Pinned",
  featured: "Featured",
  soldOut: "Sold Out",
  descriptionPending: "説明は準備中です。",
  loginToAction: (action) => `ログインして${action}`,
  gallery: {
    backToList: "← ギャラリー一覧",
    openPdf: "PDF を開く",
    loginToComment: "コメントする",
    labBack: "← 作品に戻る",
    like: "いいね！",
    comments: "コメント",
    commentCount: (n) => `${n} 件 · 古い順`,
    commentPlaceholder: "コメントを入力…",
    commentSubmit: "コメントを投稿",
    commentSending: "送信中…",
    commentsEmpty: "まだコメントはありません。",
    loginToCommentFull: "ログインしてコメントする →",
    showcaseReadOnly:
      "公式ショーケース作品のため、いいね・ファン登録・コラボ申請・コメントは利用できません。",
  },
  events: {
    back: "← EVENTS に戻る",
    organizer: "主催",
    venueSection: "会場・参加方法",
    labelFormat: "形式",
    labelRealm: "領域",
    labelVenue: "会場",
    labelAddress: "住所",
    labelOnline: "オンライン",
    urlAfterPurchase: "購入後に URL を表示",
    badgeFeatured: "Chronicle Highlight",
    badgeVerified: "Verified Host",
    toolbarSearch: "Chronicle を検索…",
    toolbarSearchAria: "イベント検索",
    toolbarOrders: "購入履歴",
    ticketHeading: "チケット",
    ticketCompare: "通常",
    ticketPast: "このイベントは終了しました",
    ticketGet: "チケットを取得",
    ticketLogin: "ログインしてチケット取得",
    ticketQrNote: "電子チケット · QR 入場（準備中）",
    soldOutFull: "完売 — Sold Out",
  },
  works: {
    back: "← WORKS",
    badgeFeatured: "Featured Guild Quest",
    labelPoster: "求人主",
    labelType: "種別",
    labelPay: "報酬",
    labelLocation: "場所",
    toolbarSearch: "Guild Quest を検索…",
    toolbarSearchAria: "求人検索",
    toolbarPortfolio: "ポートフォリオ",
    toolbarManage: "Guild 管理",
    manageTitle: "Guild 管理",
    manageLead: "掲載中の求人と応募者を管理します。",
    portfolioTitle: "ポートフォリオ",
    portfolioLead: "EXP / Lv / 称号を整え、応募時に自動添付されます。",
  },
  community: {
    toolbarSearch: "スレッドを検索…",
    toolbarSearchAria: "スレッド検索",
    toolbarNexus: "翻訳 Nexus 対応",
    newThread: "新規スレッド",
    threadCount: (n) => `${n} 件のスレッド`,
    threadsEmpty: "まだスレッドがありません。",
    loginToPost: "ログインして投稿",
    replies: (n) => `${n} 返信`,
    loginToReply: "返信する",
    threadCreateEyebrow: (slug) => `新規スレッド · ${slug}`,
    threadTitle: "タイトル",
    threadBody: "本文",
    threadSubmit: "スレッドを作成",
    threadSubmitting: "投稿中...",
    cancel: "キャンセル",
    replyHeading: "返信する",
    replyPlaceholder: "メッセージを入力...",
    replySubmit: "返信を投稿",
    replySubmitting: "送信中...",
    repliesEmpty: "まだ返信がありません。翻訳 Nexus で多言語返信を読めます。",
    nexusBadge: "翻訳 Nexus",
    nexusTargetAria: "翻訳先言語",
    nexusTranslating: "翻訳中...",
    nexusShow: "翻訳を表示",
    nexusRetranslate: "再翻訳",
    nexusOriginalOnly: "原文のみ",
    nexusDemoHint: "（デモ辞書翻訳）",
    nexusErr: "翻訳に失敗しました。",
    nexusSource: (label) => `原文: ${label}`,
    nexusTranslateBtn: "Nexus で翻訳",
    nexusTranslationHeading: (label) => `Nexus Translation · ${label}`,
    nexusHideOriginal: "原文を隠す",
    nexusShowOriginal: "原文を表示",
  },
  help: {
    faqTitle: "よくある質問",
    faqLead: "解決しない場合は",
    faqContactLink: "お問い合わせフォーム",
    guidesTitle: "利用ガイド",
    guidesLead: "初めての方はこちらのステップから始められます。",
    contactTitle: "お問い合わせ",
    contactLead: (sla) =>
      `サポートデスクへチケットを作成します。初回返信は ${sla} を目安にご連絡いたします。`,
    contactSidebarTitle: "返信前にご確認",
    contactSidebarFaq: "よくある質問",
    contactSidebarTickets: "マイチケット",
    contactEmergency: "緊急のセキュリティ問題は件名に【緊急】と記載してください。",
    contactSuccessTitle: "お問い合わせを受け付けました",
    contactSuccessLead: "チケット番号をメールでもお送りします。",
    contactSuccessTicket: "チケット番号",
    contactSuccessTicketMissing: "（番号を確認できません）",
    contactSuccessFaq: "FAQ を見る",
    contactSuccessTickets: "マイチケット",
    ticketsTitle: "マイチケット",
    ticketsEmpty: "問い合わせ履歴はまだありません。",
    ticketsNew: "新規問い合わせ",
    ticketsUpdated: "更新",
    ticketDetailBack: "← マイチケット",
    ticketDetailCreated: "作成",
    ticketDetailSupport: "サポート",
    ticketDetailClosed: "このチケットはクローズされています。",
    ticketDetailResolved: "解決済み",
    faqSearch: "キーワードで検索…",
    faqEmpty: "該当する FAQ がありません。",
    faqAllCategories: "すべて",
  },
  settings: {
    back: "← 設定に戻る",
    postArtworkTitle: "作品を投稿",
    postArtworkLead: "GALLEY に作品を公開します。",
    postProductTitle: "商品を出品",
    postProductLead: "SHOP に商品を登録します。",
    postEventTitle: "イベントを作成",
    postEventLead: "EVENTS に Chronicle を公開します。",
    creatorOnly: "クリエイター向け機能です。",
    menuTitle: "設定メニュー",
    sectionBasics: "基本情報",
    sectionPost: "投稿",
    sectionFinance: "収支",
    sectionNotifications: "通知",
    sectionPortfolio: "ポートフォリオ",
    avatarSettings: "設定・投稿",
    backHome: "← トップページへ",
  },
  checkout: {
    eyebrow: "Checkout",
    title: "決済完了",
    body: "ご購入ありがとうございます。確認メールをお送りします。",
    backShop: "SHOP に戻る",
    dashboard: "ダッシュボード",
  },
  dashboard: {
    back: "← ダッシュボード",
    ordersTitle: "注文履歴",
    ordersEmpty: "まだ注文がありません。",
    ordersBrowse: "SHOP を見る →",
    orderLabel: "Order",
  },
  notifications: {
    bellLabel: "通知",
    empty: "通知はありません",
    markAllRead: "すべて既読",
    viewAll: "すべて見る",
  },
  lab: {
    galleryLink: "GALLEY →",
  },
  shop: {
    badgeBestseller: "Realm Bestseller",
    badgeChoice: "Nexus Choice",
  },
};

const PAGE_EN: PageMessages = {
  userFallback: "User",
  anonymous: "Anonymous",
  creatorFallback: "Creator",
  posterFallback: "Unlisted poster",
  prev: "Previous",
  next: "Next",
  pinned: "Pinned",
  featured: "Featured",
  soldOut: "Sold Out",
  descriptionPending: "Description coming soon.",
  loginToAction: (action) => `Log in to ${action}`,
  gallery: {
    backToList: "← Back to GALLEY",
    openPdf: "Open PDF",
    loginToComment: "comment",
    labBack: "← Back to artwork",
    like: "Like",
    comments: "Comments",
    commentCount: (n) => `${n} · oldest first`,
    commentPlaceholder: "Write a comment…",
    commentSubmit: "Post comment",
    commentSending: "Sending…",
    commentsEmpty: "No comments yet.",
    loginToCommentFull: "Log in to comment →",
    showcaseReadOnly:
      "Official showcase work — likes, fan signup, collab requests, and comments are not available.",
  },
  events: {
    back: "← Back to EVENTS",
    organizer: "Host",
    venueSection: "Venue & access",
    labelFormat: "Format",
    labelRealm: "Realm",
    labelVenue: "Venue",
    labelAddress: "Address",
    labelOnline: "Online",
    urlAfterPurchase: "URL shown after purchase",
    badgeFeatured: "Chronicle Highlight",
    badgeVerified: "Verified Host",
    toolbarSearch: "Search chronicles…",
    toolbarSearchAria: "Search events",
    toolbarOrders: "Order history",
    ticketHeading: "Tickets",
    ticketCompare: "Regular",
    ticketPast: "This event has ended",
    ticketGet: "Get tickets",
    ticketLogin: "Log in to get tickets",
    ticketQrNote: "E-ticket · QR entry (coming soon)",
    soldOutFull: "Sold out",
  },
  works: {
    back: "← WORKS",
    badgeFeatured: "Featured Guild Quest",
    labelPoster: "Employer",
    labelType: "Type",
    labelPay: "Compensation",
    labelLocation: "Location",
    toolbarSearch: "Search guild quests…",
    toolbarSearchAria: "Search jobs",
    toolbarPortfolio: "Portfolio",
    toolbarManage: "Guild manage",
    manageTitle: "Guild management",
    manageLead: "Manage job listings and applicants.",
    portfolioTitle: "Portfolio",
    portfolioLead: "Set EXP / Lv / title — attached automatically when you apply.",
  },
  community: {
    toolbarSearch: "Search threads…",
    toolbarSearchAria: "Search threads",
    toolbarNexus: "Nexus translation",
    newThread: "New thread",
    threadCount: (n) => `${n} threads`,
    threadsEmpty: "No threads yet.",
    loginToPost: "Log in to post",
    replies: (n) => `${n} replies`,
    loginToReply: "reply",
    threadCreateEyebrow: (slug) => `New thread · ${slug}`,
    threadTitle: "Title",
    threadBody: "Body",
    threadSubmit: "Create thread",
    threadSubmitting: "Posting…",
    cancel: "Cancel",
    replyHeading: "Reply",
    replyPlaceholder: "Write a message…",
    replySubmit: "Post reply",
    replySubmitting: "Sending…",
    repliesEmpty: "No replies yet. Use Nexus translation to read multilingual replies.",
    nexusBadge: "Nexus Translate",
    nexusTargetAria: "Target language",
    nexusTranslating: "Translating…",
    nexusShow: "Show translation",
    nexusRetranslate: "Retranslate",
    nexusOriginalOnly: "Original only",
    nexusDemoHint: "(demo dictionary)",
    nexusErr: "Translation failed.",
    nexusSource: (label) => `Original: ${label}`,
    nexusTranslateBtn: "Translate with Nexus",
    nexusTranslationHeading: (label) => `Nexus Translation · ${label}`,
    nexusHideOriginal: "Hide original",
    nexusShowOriginal: "Show original",
  },
  help: {
    faqTitle: "FAQ",
    faqLead: "If you still need help, use the",
    faqContactLink: "contact form",
    guidesTitle: "Guides",
    guidesLead: "New here? Start with these steps.",
    contactTitle: "Contact",
    contactLead: (sla) =>
      `Open a support ticket. We aim to reply within ${sla}.`,
    contactSidebarTitle: "Before you write",
    contactSidebarFaq: "FAQ",
    contactSidebarTickets: "My tickets",
    contactEmergency: "For urgent security issues, put [URGENT] in the subject.",
    contactSuccessTitle: "Message received",
    contactSuccessLead: "We will email your ticket number.",
    contactSuccessTicket: "Ticket number",
    contactSuccessTicketMissing: "(number unavailable)",
    contactSuccessFaq: "View FAQ",
    contactSuccessTickets: "My tickets",
    ticketsTitle: "My tickets",
    ticketsEmpty: "No support tickets yet.",
    ticketsNew: "New inquiry",
    ticketsUpdated: "Updated",
    ticketDetailBack: "← My tickets",
    ticketDetailCreated: "Created",
    ticketDetailSupport: "Support",
    ticketDetailClosed: "This ticket is closed.",
    ticketDetailResolved: "Resolved",
    faqSearch: "Search keywords…",
    faqEmpty: "No FAQ matches.",
    faqAllCategories: "All",
  },
  settings: {
    back: "← Back to settings",
    postArtworkTitle: "Post artwork",
    postArtworkLead: "Publish to GALLEY.",
    postProductTitle: "List a product",
    postProductLead: "Add an item to SHOP.",
    postEventTitle: "Create event",
    postEventLead: "Publish a Chronicle to EVENTS.",
    creatorOnly: "Creator feature.",
    menuTitle: "Settings menu",
    sectionBasics: "Basics",
    sectionPost: "Post",
    sectionFinance: "Finance",
    sectionNotifications: "Notifications",
    sectionPortfolio: "Portfolio",
    avatarSettings: "Settings & post",
    backHome: "← Home",
  },
  checkout: {
    eyebrow: "Checkout",
    title: "Payment complete",
    body: "Thank you for your purchase. A confirmation email is on the way.",
    backShop: "Back to SHOP",
    dashboard: "Dashboard",
  },
  dashboard: {
    back: "← Dashboard",
    ordersTitle: "Order history",
    ordersEmpty: "No orders yet.",
    ordersBrowse: "Browse SHOP →",
    orderLabel: "Order",
  },
  notifications: {
    bellLabel: "Notifications",
    empty: "No notifications",
    markAllRead: "Mark all read",
    viewAll: "View all",
  },
  lab: {
    galleryLink: "GALLEY →",
  },
  shop: {
    badgeBestseller: "Realm Bestseller",
    badgeChoice: "Nexus Choice",
  },
};

const PAGE_KO: PageMessages = {
  ...PAGE_EN,
  userFallback: "사용자",
  anonymous: "익명",
  creatorFallback: "크리에이터",
  posterFallback: "게시자 미등록",
  prev: "이전",
  next: "다음",
  descriptionPending: "설명 준비 중입니다.",
  loginToAction: (action) => `${action}하려면 로그인`,
  gallery: {
    ...PAGE_EN.gallery,
    backToList: "← GALLEY 목록",
    openPdf: "PDF 열기",
    loginToComment: "댓글",
    labBack: "← 작품으로",
    like: "좋아요",
    comments: "댓글",
    commentCount: (n) => `${n}개 · 오래된 순`,
    commentPlaceholder: "댓글 입력…",
    commentSubmit: "댓글 게시",
    commentSending: "전송 중…",
    commentsEmpty: "아직 댓글이 없습니다.",
    loginToCommentFull: "로그인 후 댓글 →",
    showcaseReadOnly:
      "공식 쇼케이스 작품입니다. 좋아요·팬 등록·콜라보·댓글은 이용할 수 없습니다.",
  },
  events: {
    ...PAGE_EN.events,
    back: "← EVENTS로",
    organizer: "주최",
    venueSection: "장소·참가 방법",
    labelFormat: "형식",
    labelRealm: "영역",
    labelVenue: "장소",
    labelAddress: "주소",
    labelOnline: "온라인",
    urlAfterPurchase: "구매 후 URL 표시",
    toolbarSearch: "Chronicle 검색…",
    toolbarSearchAria: "이벤트 검색",
    toolbarOrders: "구매 내역",
    ticketHeading: "티켓",
    ticketCompare: "정가",
    ticketPast: "종료된 이벤트입니다",
    ticketGet: "티켓 받기",
    ticketLogin: "로그인 후 티켓",
    ticketQrNote: "전자 티켓 · QR 입장 (준비 중)",
    soldOutFull: "매진",
  },
  works: {
    ...PAGE_EN.works,
    back: "← WORKS",
    labelPoster: "구인자",
    labelType: "종류",
    labelPay: "보수",
    labelLocation: "장소",
    toolbarSearch: "Guild Quest 검색…",
    toolbarSearchAria: "구인 검색",
    toolbarPortfolio: "포트폴리오",
    toolbarManage: "Guild 관리",
    manageTitle: "Guild 관리",
    manageLead: "구인 공고와 지원자를 관리합니다.",
    portfolioTitle: "포트폴리오",
    portfolioLead: "EXP/Lv/칭호 — 지원 시 자동 첨부.",
  },
  community: {
    ...PAGE_EN.community,
    toolbarSearch: "스레드 검색…",
    toolbarSearchAria: "스레드 검색",
    toolbarNexus: "Nexus 번역",
    newThread: "새 스레드",
    threadCount: (n) => `${n}개 스레드`,
    threadsEmpty: "스레드가 없습니다.",
    loginToPost: "로그인 후 게시",
    replies: (n) => `${n} 답글`,
    loginToReply: "답글",
  },
  help: {
    ...PAGE_EN.help,
    faqTitle: "FAQ",
    faqLead: "해결되지 않으면",
    faqContactLink: "문의 양식",
    guidesTitle: "가이드",
    guidesLead: "처음이시면 여기서 시작하세요.",
    contactTitle: "문의",
    contactLead: (sla) => `지원 티켓을 생성합니다. 첫 답변은 ${sla} 내 목표입니다.`,
    contactSidebarTitle: "문의 전 확인",
    contactSidebarFaq: "FAQ",
    contactSidebarTickets: "내 티켓",
    contactEmergency: "긴급 보안 문제는 제목에 [긴급]을 표기하세요.",
    contactSuccessTitle: "문의가 접수되었습니다",
    contactSuccessLead: "티켓 번호를 이메일로 보냅니다.",
    contactSuccessTicket: "티켓 번호",
    contactSuccessTicketMissing: "(번호 확인 불가)",
    contactSuccessFaq: "FAQ 보기",
    contactSuccessTickets: "내 티켓",
    ticketsTitle: "내 티켓",
    ticketsEmpty: "문의 내역이 없습니다.",
    ticketsNew: "새 문의",
    ticketsUpdated: "업데이트",
    ticketDetailBack: "← 내 티켓",
    ticketDetailCreated: "생성",
    ticketDetailSupport: "지원",
    ticketDetailClosed: "티켓이 종료되었습니다.",
    ticketDetailResolved: "해결됨",
    faqSearch: "키워드 검색…",
    faqEmpty: "해당 FAQ가 없습니다.",
    faqAllCategories: "전체",
  },
  settings: {
    ...PAGE_EN.settings,
    back: "← 설정으로",
    postArtworkTitle: "작품 게시",
    postArtworkLead: "GALLEY에 공개합니다.",
    postProductTitle: "상품 등록",
    postProductLead: "SHOP에 등록합니다.",
    postEventTitle: "이벤트 생성",
    postEventLead: "EVENTS에 Chronicle을 공개합니다.",
    creatorOnly: "크리에이터 전용 기능입니다.",
    menuTitle: "설정 메뉴",
    sectionBasics: "기본 정보",
    sectionPost: "게시",
    sectionFinance: "수입",
    sectionNotifications: "알림",
    sectionPortfolio: "포트폴리오",
    avatarSettings: "설정·게시",
    backHome: "← 홈",
  },
  checkout: {
    ...PAGE_EN.checkout,
    title: "결제 완료",
    body: "구매해 주셔서 감사합니다. 확인 메일을 보냅니다.",
    backShop: "SHOP으로",
    dashboard: "대시보드",
  },
  dashboard: {
    ...PAGE_EN.dashboard,
    back: "← 대시보드",
    ordersTitle: "주문 내역",
    ordersEmpty: "주문이 없습니다.",
    ordersBrowse: "SHOP 보기 →",
  },
  notifications: {
    ...PAGE_EN.notifications,
    bellLabel: "알림",
    empty: "알림 없음",
    markAllRead: "모두 읽음",
    viewAll: "전체 보기",
  },
};

const PAGE_ZH: PageMessages = {
  ...PAGE_EN,
  userFallback: "用户",
  anonymous: "匿名",
  creatorFallback: "创作者",
  posterFallback: "未登记发布者",
  prev: "上一页",
  next: "下一页",
  descriptionPending: "说明筹备中。",
  loginToAction: (action) => `登录以${action}`,
  gallery: {
    ...PAGE_EN.gallery,
    backToList: "← 返回 GALLEY",
    openPdf: "打开 PDF",
    loginToComment: "评论",
    labBack: "← 返回作品",
    like: "点赞",
    comments: "评论",
    commentCount: (n) => `${n} 条 · 最早优先`,
    commentPlaceholder: "输入评论…",
    commentSubmit: "发表评论",
    commentSending: "发送中…",
    commentsEmpty: "暂无评论。",
    loginToCommentFull: "登录后评论 →",
    showcaseReadOnly: "官方展示作品，暂不支持点赞、粉丝、协作申请与评论。",
  },
  events: {
    ...PAGE_EN.events,
    back: "← 返回 EVENTS",
    organizer: "主办",
    venueSection: "场地与参与方式",
    labelFormat: "形式",
    labelRealm: "领域",
    labelVenue: "场地",
    labelAddress: "地址",
    labelOnline: "线上",
    urlAfterPurchase: "购买后显示 URL",
    toolbarSearch: "搜索 Chronicle…",
    toolbarSearchAria: "搜索活动",
    toolbarOrders: "购买记录",
    ticketHeading: "票务",
    ticketCompare: "原价",
    ticketPast: "活动已结束",
    ticketGet: "获取门票",
    ticketLogin: "登录后购票",
    ticketQrNote: "电子票 · QR 入场（筹备中）",
    soldOutFull: "售罄",
  },
  works: {
    ...PAGE_EN.works,
    labelPoster: "招聘方",
    labelType: "类型",
    labelPay: "报酬",
    labelLocation: "地点",
    toolbarSearch: "搜索 Guild Quest…",
    toolbarSearchAria: "搜索职位",
    toolbarPortfolio: "作品集",
    toolbarManage: "Guild 管理",
    manageTitle: "Guild 管理",
    manageLead: "管理职位与申请。",
    portfolioTitle: "作品集",
    portfolioLead: "设置 EXP/Lv/称号 — 申请时自动附上。",
  },
  community: {
    ...PAGE_EN.community,
    toolbarSearch: "搜索主题…",
    toolbarSearchAria: "搜索主题",
    toolbarNexus: "Nexus 翻译",
    newThread: "新主题",
    threadCount: (n) => `${n} 个主题`,
    threadsEmpty: "暂无主题。",
    loginToPost: "登录后发帖",
    replies: (n) => `${n} 回复`,
    loginToReply: "回复",
  },
  help: {
    ...PAGE_EN.help,
    faqTitle: "常见问题",
    faqLead: "若仍未解决，请使用",
    faqContactLink: "联系表单",
    guidesTitle: "使用指南",
    guidesLead: "新用户请从这里开始。",
    contactTitle: "联系我们",
    contactLead: (sla) => `创建支持工单。首次回复目标：${sla}。`,
    contactSidebarTitle: "提交前请确认",
    contactSidebarFaq: "常见问题",
    contactSidebarTickets: "我的工单",
    contactEmergency: "紧急安全问题请在主题注明【紧急】。",
    contactSuccessTitle: "已收到您的咨询",
    contactSuccessLead: "工单号将发送至邮箱。",
    contactSuccessTicket: "工单号",
    contactSuccessTicketMissing: "（无法确认编号）",
    contactSuccessFaq: "查看 FAQ",
    contactSuccessTickets: "我的工单",
    ticketsTitle: "我的工单",
    ticketsEmpty: "暂无工单。",
    ticketsNew: "新建咨询",
    ticketsUpdated: "更新",
    ticketDetailBack: "← 我的工单",
    ticketDetailCreated: "创建",
    ticketDetailSupport: "支持",
    ticketDetailClosed: "工单已关闭。",
    ticketDetailResolved: "已解决",
    faqSearch: "搜索关键词…",
    faqEmpty: "没有匹配的 FAQ。",
    faqAllCategories: "全部",
  },
  settings: {
    ...PAGE_EN.settings,
    back: "← 返回设置",
    postArtworkTitle: "发布作品",
    postArtworkLead: "公开到 GALLEY。",
    postProductTitle: "上架商品",
    postProductLead: "登记到 SHOP。",
    postEventTitle: "创建活动",
    postEventLead: "发布 Chronicle 到 EVENTS。",
    creatorOnly: "创作者功能。",
    menuTitle: "设置菜单",
    sectionBasics: "基本信息",
    sectionPost: "发布",
    sectionFinance: "收支",
    sectionNotifications: "通知",
    sectionPortfolio: "作品集",
    avatarSettings: "设置与发布",
    backHome: "← 首页",
  },
  checkout: {
    ...PAGE_EN.checkout,
    title: "支付完成",
    body: "感谢您的购买，确认邮件即将发送。",
    backShop: "返回 SHOP",
    dashboard: "控制台",
  },
  dashboard: {
    ...PAGE_EN.dashboard,
    back: "← 控制台",
    ordersTitle: "订单历史",
    ordersEmpty: "暂无订单。",
    ordersBrowse: "浏览 SHOP →",
  },
  notifications: {
    ...PAGE_EN.notifications,
    bellLabel: "通知",
    empty: "暂无通知",
    markAllRead: "全部已读",
    viewAll: "查看全部",
  },
};

export const PAGE_CONTENT: Record<UiLocale, PageMessages> = {
  ja: PAGE_JA,
  en: PAGE_EN,
  ko: PAGE_KO,
  "zh-CN": PAGE_ZH,
};
