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
    previewTitle: string;
    previewGallery: string;
    previewUntitled: string;
    previewNoThumbnail: string;
    previewAudio: string;
    previewVideo: string;
    previewDocument: string;
    previewModel: string;
    stepWork: string;
    stepThumbnail: string;
    stepDetails: string;
    thumbnailWaiting: string;
    thumbnailNotNeeded: string;
    previewEmpty: string;
    required: string;
    typeAuto: (label: string) => string;
    type: string;
    typeHint: (label: string) => string;
    title: string;
    description: string;
    descriptionHint: string;
    descriptionPlaceholder: string;
    tags: string;
    tagsHint: string;
    mangaPages: string;
    mangaPagesHint: string;
    photoSeriesPages: string;
    photoSeriesHint: string;
    storyExcerpt: string;
    storyExcerptHint: string;
    bgm: string;
    bgmHint: string;
    submit: string;
    submitting: string;
    errNoFile: string;
    errNoTitle: string;
    errNoThumbnail: string;
    errNoDescription: string;
    errFormat: string;
    errBgmFormat: string;
    errPayloadTooLarge: string;
    errUploadMedia: string;
    errSave: string;
    pickerTitle: string;
    pickerLead: string;
    changeMedia: string;
    stepNext: string;
    stepBack: string;
    stepLabelPick: string;
    stepLabelFile: string;
    stepLabelThumbnail: string;
    stepLabelDetails: string;
    selectedMediaLabel: string;
    errMediaMismatch: string;
    pickerOptions: {
      image: { label: string; description: string };
      video: { label: string; description: string };
      audio: { label: string; description: string };
      document: { label: string; description: string };
      model: { label: string; description: string };
    };
    guideTitle: string;
    guideIntro: string;
    guideTableType: string;
    guideTableFormats: string;
    guideTableThumbnail: string;
    guideTableMaxSize: string;
    guideMaxSizeLabel: (mb: number) => string;
    checklistTitle: string;
    checklistFile: string;
    checklistThumbnail: string;
    checklistThumbnailSkip: string;
    checklistTitleField: string;
    checklistDescription: string;
    checklistReady: string;
    checklistPending: string;
    mediaGuides: {
      image: MediaGuideCopy;
      video: MediaGuideCopy;
      audio: MediaGuideCopy;
      document: MediaGuideCopy;
      model: MediaGuideCopy;
    };
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
    coverImageUrl: string;
    coverImageHint: string;
    downloadUrl: string;
    downloadUrlHint: string;
    errDownloadUrl: string;
    imageUrl: string;
    freeDistribution: string;
    freeDistributionHint: string;
    submit: string;
    submitting: string;
    errPrice: string;
    errSave: string;
    errDuplicate: string;
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

export type MediaGuideCopy = {
  title: string;
  formats: string;
  thumbnailNote: string;
  steps: string[];
  tip: string;
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
    fileHint: "画像・動画・音声・PDF・3D（GLB/GLTF）に対応",
    thumbnail: "サムネイル画像",
    thumbnailHint:
      "音声・動画・PDF・3Dモデルは一覧表示用の画像が必要です（JPEG / PNG / GIF / WebP）",
    thumbnailPreview: "サムネイルプレビュー",
    previewTitle: "プレビュー",
    previewGallery: "ギャラリーでの見え方",
    previewUntitled: "（タイトル未入力）",
    previewNoThumbnail: "サムネイルを選ぶとここに表示されます",
    previewAudio: "音声プレビュー",
    previewVideo: "動画プレビュー",
    previewDocument: "PDF ドキュメント",
    previewModel: "3D モデル（回転・ズームできます）",
    stepWork: "① 作品ファイル",
    stepThumbnail: "② サムネイル画像",
    stepDetails: "③ 作品情報",
    thumbnailWaiting:
      "先に ① の作品ファイルを選んでください。音声・動画・PDF・3D モデルはここでカバー画像を追加します。",
    thumbnailNotNeeded: "画像作品は ① のファイルがギャラリー表示に使われます。サムネイルの追加は不要です。",
    previewEmpty: "ファイルを選ぶとプレビューが表示されます。",
    required: "必須",
    typeAuto: (label) => `種別: ${label}（ファイル形式から自動判定）`,
    type: "種別",
    typeHint: (label) =>
      `ファイル形式から「${label}」と判定。イラストと写真は変更できます。`,
    title: "タイトル",
    description: "説明",
    descriptionHint: "作品の内容・制作背景・使用ツールなどを書いてください（必須）。",
    descriptionPlaceholder: "例: Blender で制作したファンタジー調のランタン。PBR テクスチャ付き。",
    tags: "タグ",
    tagsHint: "カンマ区切り（最大10個）",
    mangaPages: "追加ページ（漫画・複数枚）",
    mangaPagesHint: "漫画は複数画像を選べます。1枚目がカバーになります。",
    photoSeriesPages: "追加写真（シリーズ）",
    photoSeriesHint: "写真カテゴリで複数枚を1作品にまとめられます。",
    storyExcerpt: "あらすじ",
    storyExcerptHint: "ストーリー作品の短い紹介（500文字まで）",
    bgm: "BGM（任意）",
    bgmHint:
      "ゆったりした Instrumental など（MP3 / WAV / FLAC / M4A）。閲覧時に ♪ ボタンでループ再生できます。",
    submit: "作品を投稿",
    submitting: "投稿中...",
    errNoFile: "ファイルを選択してください。",
    errNoTitle: "タイトルを入力してください。",
    errNoThumbnail: "サムネイル画像を選択してください。",
    errNoDescription: "説明を入力してください。",
    errFormat: "対応していないファイル形式です。",
    errBgmFormat: "BGM は MP3 / WAV / FLAC / M4A の音声ファイルにしてください。",
    errPayloadTooLarge: "ファイルが大きすぎます。音声・動画はブラウザから直接アップロードされます。",
    errUploadMedia: "ファイルのアップロードに失敗しました。",
    errSave: "作品の登録に失敗しました。",
    pickerTitle: "何を投稿しますか？",
    pickerLead: "種類を選ぶと、そのメディアに必要な手順だけ案内します。",
    changeMedia: "種類を変更",
    stepNext: "次へ",
    stepBack: "戻る",
    stepLabelPick: "種類",
    stepLabelFile: "ファイル",
    stepLabelThumbnail: "サムネイル",
    stepLabelDetails: "作品情報",
    selectedMediaLabel: "投稿する種類",
    errMediaMismatch: "選んだ種類とファイル形式が一致しません。",
    pickerOptions: {
      image: { label: "画像", description: "イラスト・漫画・写真" },
      video: { label: "動画", description: "MP4 / MOV / WebM" },
      audio: { label: "音声", description: "音楽・ボイスなど" },
      document: { label: "PDF", description: "小説・資料・漫画 PDF" },
      model: { label: "3D", description: "Blender 等（GLB 形式）" },
    },
    guideTitle: "投稿ガイド",
    guideIntro: "選んだメディアの手順に沿って進めてください。",
    guideTableType: "対応メディア一覧",
    guideTableFormats: "形式",
    guideTableThumbnail: "サムネイル",
    guideTableMaxSize: "上限",
    guideMaxSizeLabel: (mb) => `${mb} MB`,
    checklistTitle: "投稿チェックリスト",
    checklistFile: "① 作品ファイルを選択",
    checklistThumbnail: "② サムネイル画像を選択",
    checklistThumbnailSkip: "② サムネイル（画像作品は不要）",
    checklistTitleField: "③ タイトルを入力",
    checklistDescription: "③ 説明を入力",
    checklistReady: "必須項目が揃いました。投稿できます。",
    checklistPending: "未入力の必須項目があります。",
    mediaGuides: {
      image: {
        title: "画像（イラスト・漫画・写真）",
        formats: "JPEG / PNG / GIF / WebP",
        thumbnailNote: "不要（① の画像がカバーになります）",
        steps: [
          "① 画像ファイルを選ぶ",
          "種別（イラスト・漫画・写真など）を確認",
          "③ タイトルと説明を入力して投稿",
        ],
        tip: "漫画・写真シリーズは ③ で追加ページを選べます。",
      },
      video: {
        title: "動画",
        formats: "MP4 / MOV / WebM",
        thumbnailNote: "必須（一覧・カード表示用）",
        steps: [
          "① 動画ファイルを選ぶ",
          "② 代表フレームなどのカバー画像を追加",
          "③ タイトルと説明を入力して投稿",
        ],
        tip: "任意で BGM を添付できます（作品本体とは別ファイル）。",
      },
      audio: {
        title: "音声・音楽",
        formats: "MP3 / WAV / FLAC / M4A",
        thumbnailNote: "必須（ジャケット画像など）",
        steps: [
          "① 音声ファイルを選ぶ",
          "② ジャケット・波形イメージなどの画像を追加",
          "③ タイトルと説明を入力して投稿",
        ],
        tip: "イラスト作品に BGM を付ける場合は、画像を ① に選び ③ の BGM 欄を使います。",
      },
      document: {
        title: "PDF（小説・資料）",
        formats: "PDF",
        thumbnailNote: "必須（表紙画像）",
        steps: [
          "① PDF を選ぶ",
          "② 表紙画像を追加",
          "③ タイトル・説明（ストーリーならあらすじも）を入力",
        ],
        tip: "カテゴリ「ストーリー」を選ぶとあらすじ欄が表示されます。",
      },
      model: {
        title: "3D モデル（Blender など）",
        formats: "GLB / GLTF（.blend は不可）",
        thumbnailNote: "必須（レンダー画像）",
        steps: [
          "Blender 等で GLB 形式にエクスポート",
          "① GLB / GLTF を選ぶ",
          "② レンダー画像をサムネに追加 → ③ タイトルと説明",
        ],
        tip: "Blender: File → Export → glTF 2.0 (.glb)。100 MB までアップロード可能。",
      },
    },
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
    coverImageUrl: "ジャケット / カバー画像 URL",
    coverImageHint: "一覧・詳細に表示する画像。音楽・動画・PDF などは必須です。",
    downloadUrl: "配布ファイル URL",
    downloadUrlHint: "購入者がダウンロードする本体（MP3・PDF・GLB 等）。デジタル商品は必須です。",
    errDownloadUrl: "デジタル商品は配布ファイル URL を入力してください。",
    imageUrl: "画像 URL（物理商品・任意）",
    freeDistribution: "無料配布（¥0）",
    freeDistributionHint: "チェックすると SHOP に無料商品として掲載されます。Gallery 公開と併用できます。",
    submit: "商品を出品",
    submitting: "登録中...",
    errPrice: "価格を正しく入力してください。",
    errSave: "商品の登録に失敗しました。",
    errDuplicate: "同じタイトルの出品中商品が既にあります。設定の Shop 管理から確認してください。",
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
    fileHint: "Supports image, video, audio, PDF, and 3D (GLB/GLTF)",
    thumbnail: "Thumbnail image",
    thumbnailHint:
      "Audio, video, PDF, and 3D models need a cover image for the gallery (JPEG / PNG / GIF / WebP)",
    thumbnailPreview: "Thumbnail preview",
    previewTitle: "Preview",
    previewGallery: "Gallery appearance",
    previewUntitled: "(No title yet)",
    previewNoThumbnail: "Select a thumbnail to preview here",
    previewAudio: "Audio preview",
    previewVideo: "Video preview",
    previewDocument: "PDF document",
    previewModel: "3D model (rotate and zoom)",
    stepWork: "① Artwork file",
    stepThumbnail: "② Thumbnail image",
    stepDetails: "③ Details",
    thumbnailWaiting:
      "Select an artwork file in step ① first. Audio, video, PDF, and 3D models need a cover image here.",
    thumbnailNotNeeded: "For images, step ① is used in the gallery. No separate thumbnail needed.",
    previewEmpty: "Select a file to see a preview here.",
    required: "Required",
    typeAuto: (label) => `Type: ${label} (detected from file)`,
    type: "Type",
    typeHint: (label) =>
      `Detected as “${label}”. Illustration and photo can be changed for images.`,
    title: "Title",
    description: "Description",
    descriptionHint: "Describe the work, process, or tools used (required).",
    descriptionPlaceholder: "e.g. Fantasy lantern modeled in Blender with PBR textures.",
    tags: "Tags",
    tagsHint: "Comma-separated (max 10)",
    mangaPages: "Extra pages (manga / multi-image)",
    mangaPagesHint: "Select multiple images for manga. The first file is the cover.",
    photoSeriesPages: "Extra photos (series)",
    photoSeriesHint: "Combine multiple photos into one work when category is Photo.",
    storyExcerpt: "Synopsis",
    storyExcerptHint: "Short intro for story works (max 500 chars)",
    bgm: "BGM (optional)",
    bgmHint:
      "Slow instrumental loops (MP3 / WAV / FLAC / M4A). Viewers turn them on with the ♪ button.",
    submit: "Publish artwork",
    submitting: "Publishing…",
    errNoFile: "Please select a file.",
    errNoTitle: "Please enter a title.",
    errNoThumbnail: "Please select a thumbnail image.",
    errNoDescription: "Please enter a description.",
    errFormat: "Unsupported file format.",
    errBgmFormat: "BGM must be an MP3 / WAV / FLAC / M4A audio file.",
    errPayloadTooLarge: "The file is too large for a single server upload.",
    errUploadMedia: "Could not upload the file.",
    errSave: "Could not save artwork.",
    pickerTitle: "What are you posting?",
    pickerLead: "Pick a type — we'll only show the steps you need.",
    changeMedia: "Change type",
    stepNext: "Next",
    stepBack: "Back",
    stepLabelPick: "Type",
    stepLabelFile: "File",
    stepLabelThumbnail: "Thumbnail",
    stepLabelDetails: "Details",
    selectedMediaLabel: "Posting as",
    errMediaMismatch: "This file doesn't match the type you selected.",
    pickerOptions: {
      image: { label: "Image", description: "Illustration, manga, photo" },
      video: { label: "Video", description: "MP4 / MOV / WebM" },
      audio: { label: "Audio", description: "Music, voice, etc." },
      document: { label: "PDF", description: "Stories, docs, manga PDF" },
      model: { label: "3D", description: "Blender, etc. (GLB format)" },
    },
    guideTitle: "Upload guide",
    guideIntro: "Follow the steps for your selected media type.",
    guideTableType: "Supported media",
    guideTableFormats: "Formats",
    guideTableThumbnail: "Thumbnail",
    guideTableMaxSize: "Max size",
    guideMaxSizeLabel: (mb) => `${mb} MB`,
    checklistTitle: "Checklist",
    checklistFile: "① Select artwork file",
    checklistThumbnail: "② Select thumbnail image",
    checklistThumbnailSkip: "② Thumbnail (not needed for images)",
    checklistTitleField: "③ Enter title",
    checklistDescription: "③ Enter description",
    checklistReady: "All required fields are filled. You can publish.",
    checklistPending: "Some required fields are still missing.",
    mediaGuides: {
      image: {
        title: "Image (illustration, manga, photo)",
        formats: "JPEG / PNG / GIF / WebP",
        thumbnailNote: "Not needed (step ① is the cover)",
        steps: [
          "Select an image in step ①",
          "Confirm type (illustration, manga, photo, etc.)",
          "Enter title and description in step ③, then publish",
        ],
        tip: "Manga and photo series can add extra pages in step ③.",
      },
      video: {
        title: "Video",
        formats: "MP4 / MOV / WebM",
        thumbnailNote: "Required (gallery card cover)",
        steps: [
          "Select a video in step ①",
          "Add a cover image in step ②",
          "Enter title and description in step ③, then publish",
        ],
        tip: "Optional BGM can be attached separately in step ③.",
      },
      audio: {
        title: "Audio / music",
        formats: "MP3 / WAV / FLAC / M4A",
        thumbnailNote: "Required (jacket art, etc.)",
        steps: [
          "Select an audio file in step ①",
          "Add cover art in step ②",
          "Enter title and description in step ③, then publish",
        ],
        tip: "To add BGM to an illustration, upload an image in ① and use the BGM field in ③.",
      },
      document: {
        title: "PDF (stories, documents)",
        formats: "PDF",
        thumbnailNote: "Required (cover image)",
        steps: [
          "Select a PDF in step ①",
          "Add a cover image in step ②",
          "Enter title, description (and synopsis for stories), then publish",
        ],
        tip: "Choose the Story category to show the synopsis field.",
      },
      model: {
        title: "3D model (Blender, etc.)",
        formats: "GLB / GLTF (.blend not supported)",
        thumbnailNote: "Required (rendered preview)",
        steps: [
          "Export as GLB from Blender or similar",
          "Select GLB / GLTF in step ①",
          "Add a render in step ② → title and description in ③",
        ],
        tip: "Blender: File → Export → glTF 2.0 (.glb). Up to 100 MB.",
      },
    },
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
    coverImageUrl: "Cover / jacket image URL",
    coverImageHint: "Shown on listing and detail pages. Required for music, video, PDF, etc.",
    downloadUrl: "Distribution file URL",
    downloadUrlHint: "The file buyers download (MP3, PDF, GLB, etc.). Required for digital products.",
    errDownloadUrl: "Enter a distribution file URL for digital products.",
    imageUrl: "Image URL (physical, optional)",
    freeDistribution: "Free distribution (¥0)",
    freeDistributionHint: "List on SHOP at no charge. You can still publish the artwork on Gallery.",
    submit: "List product",
    submitting: "Saving…",
    errPrice: "Enter a valid price.",
    errSave: "Could not save product.",
    errDuplicate: "You already have an active product with this title. Check Shop management in Settings.",
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
      previewTitle: "미리보기",
      previewGallery: "갤러리 표시",
      previewUntitled: "(제목 없음)",
      previewNoThumbnail: "썸네일을 선택하면 여기에 표시됩니다",
      stepWork: "① 작품 파일",
      stepThumbnail: "② 썸네일",
      stepDetails: "③ 작품 정보",
      thumbnailWaiting: "먼저 ①에서 작품 파일을 선택하세요.",
      thumbnailNotNeeded: "이미지 작품은 ① 파일이 갤러리 표지로 사용됩니다.",
      previewEmpty: "①에서 파일을 선택하면 미리보기가 표시됩니다.",
      required: "필수",
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
      previewTitle: "预览",
      previewGallery: "画廊展示效果",
      previewUntitled: "（未填写标题）",
      previewNoThumbnail: "选择缩略图后将显示在此处",
      stepWork: "① 作品文件",
      stepThumbnail: "② 缩略图",
      stepDetails: "③ 作品信息",
      thumbnailWaiting: "请先在 ① 中选择作品文件。",
      thumbnailNotNeeded: "图片作品将直接使用 ① 的文件作为封面。",
      previewEmpty: "在 ① 中选择文件后，此处会显示预览。",
      required: "必填",
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
