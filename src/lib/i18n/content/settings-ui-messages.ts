import type { UiLocale } from "@/lib/i18n/locale";

export type SettingsUiContent = {
  sectionRecommendations: string;
  sectionReferral: string;
  sectionShop: string;
  recommendationsHeading: string;
  recommendationsGo: string;
  postHubHeading: string;
  postHubLead: string;
  postHubGo: string;
  postArtwork: { label: string; description: string };
  postProduct: { label: string; description: string };
  postEvent: { label: string; description: string };
  shopManagement: {
    heading: string;
    lead: string;
    registerProduct: string;
    registerLink: string;
    browseShop: string;
    empty: string;
    creatorRequired: string;
    typePhysical: string;
    typeDigital: string;
    stock: (n: number) => string;
    activeBadge: string;
    inactiveBadge: string;
    viewProduct: string;
    downloadProduct: string;
    downloadUnavailable: string;
    deleteProduct: string;
    deleteConfirm: (title: string) => string;
    republishProduct: string;
    processing: string;
    deleteFailed: string;
  };
  artworkManagement: {
    heading: string;
    lead: string;
    empty: string;
    postLink: string;
    publicBadge: string;
    privateBadge: string;
    unpublish: string;
    republish: string;
    processing: string;
    err: string;
    downloadImage: string;
    downloadVideo: string;
    downloadAudio: string;
    downloadPdf: string;
    downloadModel: string;
    downloadThumbnail: string;
    sellOnShop: string;
  };
  basics: {
    publicProfile: string;
    avatar: string;
    avatarHint: string;
    avatarRemove: string;
    avatarErrFormat: string;
    avatarErrSize: string;
    avatarUploadSkipped: string;
    basicsExpGranted: (exp: number) => string;
    basicsExpHint: string;
    basicsExpIncomplete: string;
    basicsExpFailed: string;
    displayName: string;
    username: string;
    email: string;
    emailReadonlyHint: string;
    bio: string;
    creatorToggle: string;
    identityBank: string;
    legalName: string;
    country: string;
    phone: string;
    address: string;
    addressPlaceholder: string;
    address2: string;
    bankName: string;
    bankBranch: string;
    bankType: string;
    bankTypeSavings: string;
    bankTypeChecking: string;
    bankNumber: string;
    bankHolder: string;
    saved: string;
    saving: string;
    submit: string;
    currentPlanLabel: string;
    changePlanLink: string;
    expandSection: string;
    collapseSection: string;
    disciplinesLabel: string;
    disciplinesHint: string;
  };
  plan: {
    eyebrow: string;
    title: string;
    lead: string;
    testPhaseLead: string;
    currentLabel: string;
    pendingPayment: string;
    apply: string;
    changing: string;
    changed: string;
    unchanged: string;
    changeFailed: string;
    redirectingHome: string;
    changeLink: string;
    backToBasics: string;
    checkoutSuccess: string;
    checkoutCancelled: string;
  };
  finance: {
    heading: string;
    spentTotal: string;
    paidOrders: (n: number) => string;
    estimatedIncome: string;
    estimatedHint: string;
    listedProducts: string;
    postProduct: string;
    hostedEvents: string;
    postEvent: string;
    viewOrders: string;
  };
  portfolio: {
    heading: string;
    headlineUnset: string;
    summaryEmpty: string;
    visibility: (v: string, exp: number, level: number) => string;
    unset: string;
    edit: string;
  };
  notificationPrefs: {
    heading: string;
    lead: string;
    saved: string;
    saving: string;
    submit: string;
    fan: { label: string; description: string };
    like: { label: string; description: string };
    comment: { label: string; description: string };
    collab: { label: string; description: string };
    lab: { label: string; description: string };
    order: { label: string; description: string };
    support: { label: string; description: string };
    announcement: { label: string; description: string };
  };
  expNext: string;
  avatarSettings: (name: string) => string;
  recommendations: {
    basics: { title: string; description: string };
    artwork: { title: string; description: string };
    portfolio: { title: string; description: string };
    product: { title: string; description: string };
    event: { title: string; description: string };
    unread: (n: number) => string;
    unreadDesc: string;
    tickets: (n: number) => string;
    ticketsDesc: string;
    explore: { title: string; description: string };
  };
  referral: {
    heading: string;
    title: string;
    body: string;
    codeLabel: string;
    urlLabel: string;
    copyUrl: string;
    copyCode: string;
    copied: string;
    qrLabel: string;
    mobileScanLead: string;
    tapToEnlarge: string;
    shareLink: string;
    shareTitle: string;
    shareText: string;
    showQrFullscreen: string;
    fullscreenTitle: string;
    fullscreenHint: string;
    closeQr: string;
  };
};

const SETTINGS_UI_JA: SettingsUiContent = {
  sectionRecommendations: "おすすめ",
  sectionReferral: "紹介コード",
  sectionShop: "ショップ",
  recommendationsHeading: "次にやること",
  recommendationsGo: "進む →",
  postHubHeading: "投稿",
  postHubLead: "すべての投稿はここから行います。作品・商品・イベントを Nexus に公開できます。",
  postHubGo: "投稿画面へ →",
  postArtwork: { label: "作品を投稿", description: "GALLERY に画像・動画・音声・PDF・3D（GLB）を公開" },
  postProduct: { label: "商品を登録", description: "SHOP にデジタル・物理商品を出品（設定から登録）" },
  postEvent: { label: "イベントを投稿", description: "ライブ・WS・展示などのイベントを作成" },
  shopManagement: {
    heading: "商品管理",
    lead: "SHOP への出品・登録商品の確認はここから行います。無料配布も ¥0 で登録できます。",
    registerProduct: "商品を登録",
    registerLink: "最初の商品を登録する →",
    browseShop: "SHOP を見る →",
    empty: "まだ登録した商品がありません。",
    creatorRequired: "商品登録には、基本情報で「クリエイターとして活動する」を有効にしてください。",
    typePhysical: "物販",
    typeDigital: "デジタル",
    stock: (n) => `在庫 ${n}`,
    activeBadge: "公開中",
    inactiveBadge: "非公開",
    viewProduct: "商品ページを見る →",
    downloadProduct: "ダウンロード",
    downloadUnavailable: "配布ファイル未設定",
    deleteProduct: "削除",
    deleteConfirm: (title) => `「${title}」を SHOP から削除（非公開）しますか？データは保持されます。`,
    republishProduct: "再公開",
    processing: "更新中...",
    deleteFailed: "商品の更新に失敗しました。",
  },
  artworkManagement: {
    heading: "作品管理",
    lead: "投稿した GALLERY 作品の公開・非公開の切り替えと、元ファイルのダウンロードができます。「SHOP で販売」から有料・無料（¥0）どちらも Shop に登録できます。",
    empty: "まだ作品がありません。",
    postLink: "作品を投稿する →",
    publicBadge: "公開中",
    privateBadge: "非公開",
    unpublish: "公開を停止",
    republish: "再公開",
    processing: "更新中...",
    err: "公開設定の更新に失敗しました。",
    downloadImage: "画像をダウンロード",
    downloadVideo: "動画をダウンロード",
    downloadAudio: "音声をダウンロード",
    downloadPdf: "PDF をダウンロード",
    downloadModel: "3Dモデルをダウンロード",
    downloadThumbnail: "サムネイル",
    sellOnShop: "SHOP で販売",
  },
  basics: {
    publicProfile: "公開プロフィール",
    avatar: "アバター画像",
    avatarHint: "JPG / PNG / GIF / WebP、5MB まで",
    avatarRemove: "アバターを削除",
    avatarErrFormat: "アバターは JPG / PNG / GIF / WebP を選択してください。",
    avatarErrSize: "アバターは 5MB 以下の画像を選択してください。",
    avatarUploadSkipped: "アバター画像は保存できませんでした。基本情報は保存済みです。",
    basicsExpGranted: (exp) => `基本情報の登録ボーナスとして EXP +${exp} を付与しました。`,
    basicsExpHint:
      "EXP +100 ボーナス: 表示名・氏名・電話番号・住所・口座名義（カナ）をすべて入力して保存すると付与されます。",
    basicsExpIncomplete:
      "保存しました。EXP ボーナスは表示名・氏名・電話番号・住所・口座名義（カナ）がすべて入力されたときに付与されます。",
    basicsExpFailed: "EXP の付与に失敗しました。時間をおいて再度保存してください。",
    displayName: "表示名",
    username: "ユーザー名",
    email: "メールアドレス",
    emailReadonlyHint: "メールアドレスはログイン認証に使用されます。",
    bio: "自己紹介",
    creatorToggle: "クリエイターとして活動する（商品・イベント出品が有効）",
    identityBank: "本人情報・振込先",
    legalName: "氏名（本名）",
    country: "国",
    phone: "電話番号",
    address: "住所",
    addressPlaceholder: "都道府県・市区町村・番地",
    address2: "建物名・部屋番号",
    bankName: "振込先銀行",
    bankBranch: "支店名",
    bankType: "口座種別",
    bankTypeSavings: "普通",
    bankTypeChecking: "当座",
    bankNumber: "口座番号",
    bankHolder: "口座名義（カナ）",
    saved: "基本情報を保存しました。",
    saving: "保存中...",
    submit: "基本情報を保存",
    currentPlanLabel: "現在のプラン",
    changePlanLink: "プラン変更へ →",
    expandSection: "表示する",
    collapseSection: "閉じる",
    disciplinesLabel: "活動領域",
    disciplinesHint: "最大4つまで選べます（漫画家・写真家・作家など）",
  },
  plan: {
    eyebrow: "Plan",
    title: "利用プラン",
    lead: "プランはいつでも変更できます。Free は即時反映、有料プランは Stripe 決済後に反映されます。",
    testPhaseLead:
      "テスト運用中のため、決済なしですべてのプランが即時反映されます。変更後はホーム画面へ移動します。",
    currentLabel: "現在のプラン",
    pendingPayment: "決済確認待ち",
    apply: "プランを変更してホームへ",
    changing: "変更中...",
    changed: "プランを更新しました。",
    unchanged: "選択中のプランは現在と同じです。",
    changeFailed: "プラン変更に失敗しました。",
    redirectingHome: "反映中...",
    changeLink: "プラン変更へ →",
    backToBasics: "← 基本情報に戻る",
    checkoutSuccess: "決済が完了しました。プランが更新されました。",
    checkoutCancelled: "決済がキャンセルされました。",
  },
  finance: {
    heading: "収支状況",
    spentTotal: "支出合計（購入）",
    paidOrders: (n) => `${n} 件の決済`,
    estimatedIncome: "収入見込み",
    estimatedHint: "出品・開催に基づく概算",
    listedProducts: "出品商品",
    postProduct: "商品を登録 →",
    hostedEvents: "開催イベント",
    postEvent: "イベントを投稿 →",
    viewOrders: "注文履歴の詳細を見る →",
  },
  portfolio: {
    heading: "ポートフォリオ",
    headlineUnset: "見出し未設定",
    summaryEmpty: "概要がまだありません。",
    visibility: (v, exp, level) => `公開設定: ${v} · EXP ${exp} · Lv.${level}`,
    unset: "ポートフォリオが未作成です。WORKS 応募用に設定しましょう。",
    edit: "ポートフォリオを編集",
  },
  notificationPrefs: {
    heading: "通知設定",
    lead: "受け取りたい通知の種類を選べます。OFF にした種類は 🔔 に届きません。",
    saved: "通知設定を保存しました。",
    saving: "保存中...",
    submit: "通知設定を保存",
    fan: { label: "ファン登録", description: "誰かがあなたをファン登録したとき" },
    like: { label: "いいね", description: "作品へのいいね" },
    comment: { label: "コメント", description: "作品へのコメント" },
    collab: { label: "コラボ申請", description: "コラボの申請・承認・却下" },
    lab: { label: "Lab メモ", description: "共同作業 Lab 内の新しいメモ" },
    order: { label: "注文・決済", description: "お支払い完了など" },
    support: { label: "サポート返信", description: "問い合わせチケットへの返信" },
    announcement: { label: "運営からの告知", description: "Eldonia-Nex からのお知らせ" },
  },
  expNext: "次のレベルまで",
  avatarSettings: (name) => `${name} の設定画面`,
  recommendations: {
    basics: { title: "基本情報を登録する", description: "氏名・住所・振込先を設定すると出品・報酬受取がスムーズになります。" },
    artwork: { title: "最初の作品を投稿する", description: "GALLERY に作品を公開してクリエイター活動を始めましょう。" },
    portfolio: { title: "ポートフォリオを整える", description: "WORKS 応募時に自動添付されるプロフィールを設定します。" },
    product: { title: "商品を登録する", description: "設定のショップから SHOP にデジタル・物理商品を登録できます。" },
    event: { title: "イベントを開催する", description: "ライブ・ワークショップ・展示などのイベントを作成します。" },
    unread: (n) => `未読の通知が ${n} 件`,
    unreadDesc: "運営からの告知やアクティビティ通知を確認してください。",
    tickets: (n) => `対応中のサポートチケットが ${n} 件`,
    ticketsDesc: "ヘルプデスクからの返信を確認しましょう。",
    explore: { title: "コミュニティを探索する", description: "すべての設定が完了しています。掲示板やイベントをチェックしましょう。" },
  },
  referral: {
    heading: "紹介プログラム",
    title: "紹介コード / QR",
    body: "サブスクプランが Free 以外の会員には、サインイン確定後に紹介コードが付与されます。紹介成立から3か月目以降、日本の紹介は10%、日本以外は15%を還元します。",
    codeLabel: "紹介コード",
    urlLabel: "紹介URL",
    copyUrl: "紹介URLをコピー",
    copyCode: "紹介コードをコピー",
    copied: "コピーしました",
    qrLabel: "紹介URLのQRコード",
    mobileScanLead: "友達にQRコードを見せて、サインアップ画面へ誘導できます",
    tapToEnlarge: "タップして大きく表示",
    shareLink: "招待リンクを共有",
    shareTitle: "Eldonia Nex に参加",
    shareText: "Eldonia Nex へ招待します。QRまたはリンクからサインアップできます。",
    showQrFullscreen: "QRコードを全画面表示",
    fullscreenTitle: "友達に読み取ってもらう",
    fullscreenHint: "スマホのカメラで読み取るとサインアップ画面が開きます",
    closeQr: "閉じる",
  },
};

const SETTINGS_UI_EN: SettingsUiContent = {
  sectionRecommendations: "Recommended",
  sectionReferral: "Referral",
  sectionShop: "Shop",
  recommendationsHeading: "Next steps",
  recommendationsGo: "Go →",
  postHubHeading: "Posts",
  postHubLead: "Publish artwork, products, and events to the Nexus from here.",
  postHubGo: "Open post page →",
  postArtwork: { label: "Post artwork", description: "Publish image, video, audio, PDF, or 3D (GLB) to GALLERY" },
  postProduct: { label: "Register product", description: "List digital or physical items on SHOP (via Settings)" },
  postEvent: { label: "Create event", description: "Live shows, workshops, exhibitions, and more" },
  shopManagement: {
    heading: "Product management",
    lead: "Register and review SHOP listings here. Free distribution is supported at ¥0.",
    registerProduct: "Register product",
    registerLink: "Register your first product →",
    browseShop: "Browse SHOP →",
    empty: "No products registered yet.",
    creatorRequired: "Enable “Act as a creator” in Basics to register products.",
    typePhysical: "Physical",
    typeDigital: "Digital",
    stock: (n) => `Stock ${n}`,
    activeBadge: "Live",
    inactiveBadge: "Hidden",
    viewProduct: "View product page →",
    downloadProduct: "Download",
    downloadUnavailable: "No file configured",
    deleteProduct: "Remove",
    deleteConfirm: (title) => `Remove “${title}” from SHOP (unlist)? The listing data will be kept.`,
    republishProduct: "Publish again",
    processing: "Updating…",
    deleteFailed: "Could not update the product.",
  },
  artworkManagement: {
    heading: "Artwork management",
    lead: "Toggle Gallery visibility and download original files. Use “Sell on SHOP” to list paid or free (¥0) products.",
    empty: "No artworks yet.",
    postLink: "Post an artwork →",
    publicBadge: "Public",
    privateBadge: "Unpublished",
    unpublish: "Unpublish",
    republish: "Publish again",
    processing: "Updating…",
    err: "Could not update visibility.",
    downloadImage: "Download image",
    downloadVideo: "Download video",
    downloadAudio: "Download audio",
    downloadPdf: "Download PDF",
    downloadModel: "Download 3D model",
    downloadThumbnail: "Thumbnail",
    sellOnShop: "Sell on SHOP",
  },
  basics: {
    publicProfile: "Public profile",
    avatar: "Avatar image",
    avatarHint: "JPG / PNG / GIF / WebP, up to 5MB",
    avatarRemove: "Remove avatar",
    avatarErrFormat: "Choose a JPG, PNG, GIF, or WebP avatar.",
    avatarErrSize: "Choose an avatar image up to 5MB.",
    avatarUploadSkipped: "Avatar image could not be saved. Profile details were saved.",
    basicsExpGranted: (exp) => `Granted EXP +${exp} for completing your profile.`,
    basicsExpHint:
      "EXP +100 bonus: fill display name, legal name, phone, address, and account holder (kana), then save.",
    basicsExpIncomplete:
      "Saved. The EXP bonus is granted when display name, legal name, phone, address, and account holder are all filled in.",
    basicsExpFailed: "Could not grant EXP. Please save again in a moment.",
    displayName: "Display name",
    username: "Username",
    email: "Email",
    emailReadonlyHint: "This email is used for account authentication.",
    bio: "Bio",
    creatorToggle: "Act as a creator (enables product & event listings)",
    identityBank: "Identity & payout",
    legalName: "Legal name",
    country: "Country",
    phone: "Phone",
    address: "Address",
    addressPlaceholder: "City, street, number",
    address2: "Building / unit",
    bankName: "Bank name",
    bankBranch: "Branch",
    bankType: "Account type",
    bankTypeSavings: "Savings",
    bankTypeChecking: "Checking",
    bankNumber: "Account number",
    bankHolder: "Account holder (kana)",
    saved: "Profile saved.",
    saving: "Saving…",
    submit: "Save profile",
    currentPlanLabel: "Current plan",
    changePlanLink: "Change plan →",
    expandSection: "Show",
    collapseSection: "Hide",
    disciplinesLabel: "Creative disciplines",
    disciplinesHint: "Choose up to 4 (manga artist, photographer, writer, etc.)",
  },
  plan: {
    eyebrow: "Plan",
    title: "Subscription plan",
    lead: "Change anytime. Free applies immediately; paid plans apply after Stripe checkout.",
    testPhaseLead:
      "Test mode: all plans apply immediately without payment. You will return to the home page after changing.",
    currentLabel: "Current plan",
    pendingPayment: "Payment pending",
    apply: "Change plan and go home",
    changing: "Updating…",
    changed: "Plan updated.",
    unchanged: "This is already your current plan.",
    changeFailed: "Could not change plan.",
    redirectingHome: "Applying…",
    changeLink: "Change plan →",
    backToBasics: "← Back to basics",
    checkoutSuccess: "Payment complete. Your plan has been updated.",
    checkoutCancelled: "Checkout was cancelled.",
  },
  finance: {
    heading: "Finance",
    spentTotal: "Total spent (purchases)",
    paidOrders: (n) => `${n} paid order${n === 1 ? "" : "s"}`,
    estimatedIncome: "Estimated earnings",
    estimatedHint: "Rough estimate from listings & events",
    listedProducts: "Listed products",
    postProduct: "Register product →",
    hostedEvents: "Hosted events",
    postEvent: "Create event →",
    viewOrders: "View order history →",
  },
  portfolio: {
    heading: "Portfolio",
    headlineUnset: "No headline yet",
    summaryEmpty: "No summary yet.",
    visibility: (v, exp, level) => `Visibility: ${v} · EXP ${exp} · Lv.${level}`,
    unset: "No portfolio yet. Set one up for WORKS applications.",
    edit: "Edit portfolio",
  },
  notificationPrefs: {
    heading: "Notification preferences",
    lead: "Choose which notifications you receive. Disabled types won't appear in 🔔.",
    saved: "Notification preferences saved.",
    saving: "Saving…",
    submit: "Save preferences",
    fan: { label: "Fan signup", description: "When someone follows you as a fan" },
    like: { label: "Likes", description: "Likes on your artwork" },
    comment: { label: "Comments", description: "Comments on your artwork" },
    collab: { label: "Collab requests", description: "Collab requests, acceptances, declines" },
    lab: { label: "Lab notes", description: "New notes in Collab Lab" },
    order: { label: "Orders & payments", description: "Payment confirmations, etc." },
    support: { label: "Support replies", description: "Replies to support tickets" },
    announcement: { label: "Announcements", description: "News from Eldonia-Nex" },
  },
  expNext: "to next level",
  avatarSettings: (name) => `${name} — settings`,
  recommendations: {
    basics: { title: "Complete your profile", description: "Add legal name, address, and payout info for smoother selling." },
    artwork: { title: "Post your first artwork", description: "Publish to GALLERY and start creating." },
    portfolio: { title: "Set up portfolio", description: "Auto-attached when you apply on WORKS." },
    product: { title: "Register a product", description: "Add digital or physical items to SHOP from Settings." },
    event: { title: "Host an event", description: "Create live shows, workshops, or exhibitions." },
    unread: (n) => `${n} unread notification${n === 1 ? "" : "s"}`,
    unreadDesc: "Check announcements and activity updates.",
    tickets: (n) => `${n} open support ticket${n === 1 ? "" : "s"}`,
    ticketsDesc: "Review replies from the help desk.",
    explore: { title: "Explore the community", description: "You're all set. Browse boards and events." },
  },
  referral: {
    heading: "Referral program",
    title: "Referral code / QR",
    body: "Paid members (non-Free plans) receive a referral code after sign-in. From the third month after a successful referral, Japan referrals earn 10% and international referrals earn 15%.",
    codeLabel: "Referral code",
    urlLabel: "Referral URL",
    copyUrl: "Copy referral URL",
    copyCode: "Copy referral code",
    copied: "Copied",
    qrLabel: "QR code for referral URL",
    mobileScanLead: "Show this QR to friends to open the sign-up page",
    tapToEnlarge: "Tap to enlarge",
    shareLink: "Share invite link",
    shareTitle: "Join Eldonia Nex",
    shareText: "You're invited to Eldonia Nex. Scan the QR or use the link to sign up.",
    showQrFullscreen: "Show QR fullscreen",
    fullscreenTitle: "Have your friend scan this",
    fullscreenHint: "Their camera opens the sign-up page with your referral code",
    closeQr: "Close",
  },
};

export const SETTINGS_UI_CONTENT: Record<UiLocale, SettingsUiContent> = {
  ja: SETTINGS_UI_JA,
  en: SETTINGS_UI_EN,
  ko: {
    ...SETTINGS_UI_EN,
    sectionRecommendations: "추천",
    sectionReferral: "추천 코드",
    sectionShop: "샵",
    recommendationsHeading: "다음 단계",
    postHubHeading: "게시",
    basics: {
      ...SETTINGS_UI_EN.basics,
      avatar: "아바타 이미지",
      avatarHint: "JPG / PNG / GIF / WebP, 최대 5MB",
      avatarRemove: "아바타 삭제",
      avatarErrFormat: "JPG / PNG / GIF / WebP 아바타를 선택하세요.",
      avatarErrSize: "5MB 이하의 아바타 이미지를 선택하세요.",
      avatarUploadSkipped: "아바타 이미지는 저장하지 못했습니다. 기본 정보는 저장되었습니다.",
      basicsExpGranted: (exp) => `기본 정보 등록 보너스로 EXP +${exp} 지급.`,
      submit: "기본 정보 저장",
      saved: "저장되었습니다.",
      saving: "저장 중…",
    },
    finance: { ...SETTINGS_UI_EN.finance, heading: "수입·지출", viewOrders: "주문 내역 →" },
    portfolio: { ...SETTINGS_UI_EN.portfolio, edit: "포트폴리오 편집" },
    notificationPrefs: { ...SETTINGS_UI_EN.notificationPrefs, heading: "알림 설정", submit: "알림 설정 저장" },
    expNext: "다음 레벨까지",
  },
  "zh-CN": {
    ...SETTINGS_UI_EN,
    sectionRecommendations: "推荐",
    sectionReferral: "推荐码",
    sectionShop: "商店",
    recommendationsHeading: "下一步",
    postHubHeading: "发布",
    basics: {
      ...SETTINGS_UI_EN.basics,
      avatar: "头像图片",
      avatarHint: "JPG / PNG / GIF / WebP，最大 5MB",
      avatarRemove: "删除头像",
      avatarErrFormat: "请选择 JPG / PNG / GIF / WebP 头像。",
      avatarErrSize: "请选择 5MB 以下的头像图片。",
      avatarUploadSkipped: "头像图片未能保存。基本信息已保存。",
      basicsExpGranted: (exp) => `完成基本信息奖励 EXP +${exp}。`,
      submit: "保存基本信息",
      saved: "已保存。",
      saving: "保存中…",
    },
    finance: { ...SETTINGS_UI_EN.finance, heading: "收支", viewOrders: "查看订单 →" },
    portfolio: { ...SETTINGS_UI_EN.portfolio, edit: "编辑作品集" },
    notificationPrefs: { ...SETTINGS_UI_EN.notificationPrefs, heading: "通知设置", submit: "保存通知设置" },
    expNext: "距下一级",
  },
};
