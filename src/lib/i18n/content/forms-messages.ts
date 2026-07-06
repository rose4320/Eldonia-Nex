import type { UiLocale } from "@/lib/i18n/locale";

export type FormsContent = {
  creatorRequired: string;
  open: string;
  markRead: string;
  ticketListBack: string;
  ticketCreatedBanner: string;
  ticketClosed: (status: string) => string;
  ticketReplyTitle: string;
  ticketReplySubmit: string;
  ticketReplySubmitting: string;
  contact: {
    name: string;
    email: string;
    category: string;
    subject: string;
    body: string;
    bodyPlaceholder: string;
    submit: string;
    submitting: string;
    errSave: string;
  };
  upload: {
    file: string;
    fileHint: string;
    thumbnail: string;
    thumbnailHint: string;
    thumbnailPreview: string;
    typeAuto: (label: string) => string;
    type: string;
    typeHint: (label: string) => string;
    title: string;
    description: string;
    tags: string;
    tagsHint: string;
    submit: string;
    submitting: string;
    errNoFile: string;
    errNoThumbnail: string;
    errFormat: string;
    errSave: string;
  };
  product: {
    title: string;
    description: string;
    category: string;
    type: string;
    typePhysical: string;
    typeDigital: string;
    price: string;
    stock: string;
    imageUrl: string;
    submit: string;
    submitting: string;
    errPrice: string;
    errSave: string;
  };
  event: {
    title: string;
    description: string;
    category: string;
    format: string;
    startsAt: string;
    endsAt: string;
    venueName: string;
    venueAddress: string;
    onlineUrl: string;
    ticketPrice: string;
    capacity: string;
    submit: string;
    submitting: string;
    errStartsAt: string;
    errSave: string;
  };
  job: {
    heading: string;
    titlePh: string;
    descPh: string;
    locationPh: string;
    budgetMinPh: string;
    budgetMaxPh: string;
    skillsPh: string;
    submit: string;
    submitting: string;
    errSave: string;
    remoteDefault: string;
  };
  employer: {
    jobsHeading: (n: number) => string;
    jobsEmpty: string;
    closeListing: string;
    reopenListing: string;
    appsHeading: (n: number) => string;
    appsEmpty: string;
    applicantFallback: string;
    portfolioSnapshotLabel: string;
    updateFailed: string;
  };
  portfolio: {
    headline: string;
    summary: string;
    skills: string;
    exp: string;
    titleBadge: string;
    visibility: string;
    attachOnApply: string;
    saved: string;
    saving: string;
    submit: string;
    novice: string;
  };
  apply: {
    loginToApply: string;
    heading: string;
    portfolioAttach: string;
    attachLabel: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
    errSave: string;
  };
  profile: {
    displayName: string;
    username: string;
    usernameHint: string;
    usernameTitle: string;
    bio: string;
    creatorToggle: string;
    saved: string;
    saving: string;
    submit: string;
  };
  notifications: {
    heading: string;
    markAll: (n: number) => string;
    processing: string;
    emptyAll: string;
    emptyFilter: string;
    viewTickets: string;
    openLab: string;
    open: string;
  };
};

const FORMS_JA: FormsContent = {
  creatorRequired:
    "クリエイター登録が必要です。設定の基本情報で「クリエイターとして活動する」を有効にしてください。",
  open: "開く →",
  markRead: "既読",
  ticketListBack: "← マイチケット一覧",
  ticketCreatedBanner: "お問い合わせを受け付けました。サポートチームからの返信をお待ちください。",
  ticketClosed: (status) =>
    `このチケットは ${status} です。追加のご質問は新規お問い合わせをご利用ください。`,
  ticketReplyTitle: "追加メッセージ",
  ticketReplySubmit: "返信を送信",
  ticketReplySubmitting: "送信中...",
  contact: {
    name: "お名前",
    email: "メールアドレス",
    category: "カテゴリ",
    subject: "件名",
    body: "お問い合わせ内容",
    bodyPlaceholder: "状況・エラーメッセージ・再現手順などを具体的にご記入ください。",
    submit: "問い合わせを送信",
    submitting: "送信中...",
    errSave: "問い合わせの送信に失敗しました。",
  },
  upload: {
    file: "ファイル",
    fileHint: "画像・動画・音声・PDF に対応",
    thumbnail: "サムネイル画像",
    thumbnailHint: "音声・動画・PDF は一覧表示用の画像が必要です（JPEG / PNG / GIF / WebP）",
    thumbnailPreview: "サムネイルプレビュー",
    typeAuto: (label) => `種別: ${label}（ファイル形式から自動判定）`,
    type: "種別",
    typeHint: (label) =>
      `ファイル形式から「${label}」と判定。イラストと写真は変更できます。`,
    title: "タイトル",
    description: "説明",
    tags: "タグ",
    tagsHint: "カンマ区切り（最大10個）",
    submit: "作品を投稿",
    submitting: "投稿中...",
    errNoFile: "ファイルを選択してください。",
    errNoThumbnail: "サムネイル画像を選択してください。",
    errFormat: "対応していないファイル形式です。",
    errSave: "作品の登録に失敗しました。",
  },
  product: {
    title: "商品名",
    description: "説明",
    category: "カテゴリ",
    type: "種別",
    typePhysical: "物理商品",
    typeDigital: "デジタル",
    price: "価格（円）",
    stock: "在庫数",
    imageUrl: "画像 URL（任意）",
    submit: "商品を出品",
    submitting: "登録中...",
    errPrice: "価格を正しく入力してください。",
    errSave: "商品の登録に失敗しました。",
  },
  event: {
    title: "イベント名",
    description: "説明",
    category: "カテゴリ",
    format: "開催形式",
    startsAt: "開始日時",
    endsAt: "終了日時",
    venueName: "会場名",
    venueAddress: "会場住所",
    onlineUrl: "配信 URL",
    ticketPrice: "チケット価格（円）",
    capacity: "定員（任意）",
    submit: "イベントを公開",
    submitting: "登録中...",
    errStartsAt: "開始日時を入力してください。",
    errSave: "イベントの登録に失敗しました。",
  },
  job: {
    heading: "求人を掲載",
    titlePh: "タイトル",
    descPh: "詳細",
    locationPh: "場所",
    budgetMinPh: "予算 min (円)",
    budgetMaxPh: "予算 max (円)",
    skillsPh: "スキル（カンマ区切り）",
    submit: "求人を掲載",
    submitting: "掲載中...",
    errSave: "求人の作成に失敗しました。",
    remoteDefault: "リモート",
  },
  employer: {
    jobsHeading: (n) => `掲載中の求人 (${n})`,
    jobsEmpty: "まだ求人を掲載していません。",
    closeListing: "募集終了",
    reopenListing: "再開",
    appsHeading: (n) => `応募 (${n})`,
    appsEmpty: "応募はまだありません。",
    applicantFallback: "応募者",
    portfolioSnapshotLabel: "Portfolio",
    updateFailed: "更新に失敗しました。時間をおいて再度お試しください。",
  },
  portfolio: {
    headline: "見出し",
    summary: "概要",
    skills: "スキル（カンマ区切り）",
    exp: "EXP",
    titleBadge: "称号",
    visibility: "公開範囲",
    attachOnApply: "応募時にポートフォリオを自動添付",
    saved: "ポートフォリオを保存しました。",
    saving: "保存中...",
    submit: "保存する",
    novice: "Novice",
  },
  apply: {
    loginToApply: "ログインして応募",
    heading: "応募",
    portfolioAttach: "Portfolio 添付",
    attachLabel: "ポートフォリオを添付（ダッシュボード設定に従う）",
    messagePlaceholder: "志望動機・実績...",
    submit: "応募する",
    submitting: "送信中...",
    success: "応募を送信しました。求人主からの連絡をお待ちください。",
    errSave: "応募に失敗しました。",
  },
  profile: {
    displayName: "表示名",
    username: "ユーザー名",
    usernameHint: "3〜30文字（a-z, 0-9, _）",
    usernameTitle: "3〜30文字の半角英小文字・数字・アンダースコア",
    bio: "自己紹介",
    creatorToggle: "クリエイターとして活動する",
    saved: "プロフィールを保存しました。",
    saving: "保存中...",
    submit: "保存する",
  },
  notifications: {
    heading: "告知・通知",
    markAll: (n) => `すべて既読（${n}）`,
    processing: "処理中...",
    emptyAll: "新しい告知・通知はありません。",
    emptyFilter: "このカテゴリの通知はありません。",
    viewTickets: "サポートチケットを確認 →",
    openLab: "Lab を開く",
    open: "開く",
  },
};

const FORMS_EN: FormsContent = {
  creatorRequired:
    "Creator registration required. Enable “Act as a creator” in Settings → Basics.",
  open: "Open →",
  markRead: "Mark read",
  ticketListBack: "← My tickets",
  ticketCreatedBanner: "We received your inquiry. Please wait for support to reply.",
  ticketClosed: (status) =>
    `This ticket is ${status}. For new questions, please open a new inquiry.`,
  ticketReplyTitle: "Add a message",
  ticketReplySubmit: "Send reply",
  ticketReplySubmitting: "Sending…",
  contact: {
    name: "Name",
    email: "Email",
    category: "Category",
    subject: "Subject",
    body: "Message",
    bodyPlaceholder: "Describe the issue, error messages, and steps to reproduce.",
    submit: "Send inquiry",
    submitting: "Sending…",
    errSave: "Could not send your inquiry.",
  },
  upload: {
    file: "File",
    fileHint: "Supports image, video, audio, PDF",
    thumbnail: "Thumbnail image",
    thumbnailHint: "Audio, video, and PDF need a cover image for the gallery (JPEG / PNG / GIF / WebP)",
    thumbnailPreview: "Thumbnail preview",
    typeAuto: (label) => `Type: ${label} (detected from file)`,
    type: "Type",
    typeHint: (label) =>
      `Detected as “${label}”. Illustration and photo can be changed for images.`,
    title: "Title",
    description: "Description",
    tags: "Tags",
    tagsHint: "Comma-separated (max 10)",
    submit: "Publish artwork",
    submitting: "Publishing…",
    errNoFile: "Please select a file.",
    errNoThumbnail: "Please select a thumbnail image.",
    errFormat: "Unsupported file format.",
    errSave: "Could not save artwork.",
  },
  product: {
    title: "Product name",
    description: "Description",
    category: "Category",
    type: "Type",
    typePhysical: "Physical",
    typeDigital: "Digital",
    price: "Price (JPY)",
    stock: "Stock",
    imageUrl: "Image URL (optional)",
    submit: "List product",
    submitting: "Saving…",
    errPrice: "Enter a valid price.",
    errSave: "Could not save product.",
  },
  event: {
    title: "Event name",
    description: "Description",
    category: "Category",
    format: "Format",
    startsAt: "Starts at",
    endsAt: "Ends at",
    venueName: "Venue name",
    venueAddress: "Venue address",
    onlineUrl: "Stream URL",
    ticketPrice: "Ticket price (JPY)",
    capacity: "Capacity (optional)",
    submit: "Publish event",
    submitting: "Saving…",
    errStartsAt: "Enter a start date/time.",
    errSave: "Could not save event.",
  },
  job: {
    heading: "Post a job",
    titlePh: "Title",
    descPh: "Description",
    locationPh: "Location",
    budgetMinPh: "Budget min (JPY)",
    budgetMaxPh: "Budget max (JPY)",
    skillsPh: "Skills (comma-separated)",
    submit: "Post job",
    submitting: "Posting…",
    errSave: "Could not create job.",
    remoteDefault: "Remote",
  },
  employer: {
    jobsHeading: (n) => `Active listings (${n})`,
    jobsEmpty: "No job listings yet.",
    closeListing: "Close listing",
    reopenListing: "Reopen",
    appsHeading: (n) => `Applications (${n})`,
    appsEmpty: "No applications yet.",
    applicantFallback: "Applicant",
    portfolioSnapshotLabel: "Portfolio",
    updateFailed: "Update failed. Please try again.",
  },
  portfolio: {
    headline: "Headline",
    summary: "Summary",
    skills: "Skills (comma-separated)",
    exp: "EXP",
    titleBadge: "Title badge",
    visibility: "Visibility",
    attachOnApply: "Auto-attach portfolio when applying",
    saved: "Portfolio saved.",
    saving: "Saving…",
    submit: "Save",
    novice: "Novice",
  },
  apply: {
    loginToApply: "Log in to apply",
    heading: "Apply",
    portfolioAttach: "Portfolio attached",
    attachLabel: "Attach portfolio (per dashboard settings)",
    messagePlaceholder: "Motivation, experience…",
    submit: "Submit application",
    submitting: "Sending…",
    success: "Application sent. Await a reply from the employer.",
    errSave: "Could not submit application.",
  },
  profile: {
    displayName: "Display name",
    username: "Username",
    usernameHint: "3–30 chars (a-z, 0-9, _)",
    usernameTitle: "3–30 lowercase letters, numbers, underscores",
    bio: "Bio",
    creatorToggle: "Act as a creator",
    saved: "Profile saved.",
    saving: "Saving…",
    submit: "Save",
  },
  notifications: {
    heading: "Announcements & notifications",
    markAll: (n) => `Mark all read (${n})`,
    processing: "Processing…",
    emptyAll: "No new notifications.",
    emptyFilter: "No notifications in this category.",
    viewTickets: "View support tickets →",
    openLab: "Open Lab",
    open: "Open",
  },
};

export const FORMS_CONTENT: Record<UiLocale, FormsContent> = {
  ja: FORMS_JA,
  en: FORMS_EN,
  ko: {
    ...FORMS_EN,
    creatorRequired: "크리에이터 등록이 필요합니다. 설정 → 기본 정보에서 크리에이터 활동을 켜세요.",
    open: "열기 →",
    markRead: "읽음",
    ticketListBack: "← 내 티켓",
    ticketReplyTitle: "추가 메시지",
    ticketReplySubmit: "답변 보내기",
    contact: { ...FORMS_EN.contact, submit: "문의 보내기" },
    upload: {
      ...FORMS_EN.upload,
      file: "파일",
      thumbnail: "썸네일 이미지",
      thumbnailHint: "오디오·동영상·PDF는 갤러리 표시용 이미지가 필요합니다",
      errNoThumbnail: "썸네일 이미지를 선택해 주세요.",
      submit: "작품 게시",
      submitting: "게시 중…",
    },
    product: { ...FORMS_EN.product, submit: "상품 등록" },
    event: { ...FORMS_EN.event, submit: "이벤트 공개" },
    job: { ...FORMS_EN.job, heading: "구인 등록", submit: "구인 등록", remoteDefault: "원격" },
    employer: {
      jobsHeading: (n) => `게시 중 (${n})`,
      jobsEmpty: "구인 없음",
      closeListing: "마감",
      reopenListing: "재개",
      appsHeading: (n) => `지원 (${n})`,
      appsEmpty: "지원 없음",
      applicantFallback: "지원자",
      portfolioSnapshotLabel: "Portfolio",
      updateFailed: "업데이트에 실패했습니다. 잠시 후 다시 시도해 주세요.",
    },
    notifications: { ...FORMS_EN.notifications, heading: "알림", open: "열기" },
    portfolio: { ...FORMS_EN.portfolio, submit: "저장" },
    apply: { ...FORMS_EN.apply, submit: "지원하기", loginToApply: "로그인 후 지원" },
    profile: { ...FORMS_EN.profile, submit: "저장" },
  },
  "zh-CN": {
    ...FORMS_EN,
    creatorRequired: "需要创作者注册。请在设置 → 基本信息中启用创作者。",
    open: "打开 →",
    markRead: "已读",
    ticketListBack: "← 我的工单",
    ticketReplyTitle: "追加消息",
    ticketReplySubmit: "发送回复",
    contact: { ...FORMS_EN.contact, submit: "发送咨询" },
    upload: {
      ...FORMS_EN.upload,
      file: "文件",
      thumbnail: "缩略图",
      thumbnailHint: "音频·视频·PDF 需要封面图用于画廊展示",
      errNoThumbnail: "请选择缩略图。",
      submit: "发布作品",
      submitting: "发布中…",
    },
    product: { ...FORMS_EN.product, submit: "上架商品" },
    event: { ...FORMS_EN.event, submit: "发布活动" },
    job: { ...FORMS_EN.job, heading: "发布招聘", submit: "发布招聘", remoteDefault: "远程" },
    employer: {
      jobsHeading: (n) => `在招职位 (${n})`,
      jobsEmpty: "暂无职位",
      closeListing: "结束招聘",
      reopenListing: "重新开放",
      appsHeading: (n) => `申请 (${n})`,
      appsEmpty: "暂无申请",
      applicantFallback: "申请者",
      portfolioSnapshotLabel: "Portfolio",
      updateFailed: "更新失败，请稍后重试。",
    },
    notifications: { ...FORMS_EN.notifications, heading: "通知", open: "打开" },
    portfolio: { ...FORMS_EN.portfolio, submit: "保存" },
    apply: { ...FORMS_EN.apply, submit: "提交申请", loginToApply: "登录后申请" },
    profile: { ...FORMS_EN.profile, submit: "保存" },
  },
};
