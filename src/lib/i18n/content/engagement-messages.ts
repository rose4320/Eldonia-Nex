import type { UiLocale } from "@/lib/i18n/locale";

export type EngagementContent = {
  collabStatus: Record<string, string>;
  fanCount: (n: number) => string;
  ownerFans: (name: string, n: number) => string;
  fanRegister: string;
  fanRegistered: string;
  collabRequest: string;
  collabLabel: (status: string) => string;
  collabMessageLabel: string;
  collabMessagePlaceholder: string;
  collabSubmit: string;
  collabSending: string;
  cancel: string;
  processing: string;
  errCollab: string;
  collabAccept: string;
  collabDecline: string;
  openLab: string;
  pendingCollabHeading: (n: number) => string;
  ownerCollabHint: string;
  visibilityHeading: string;
  visibilityPublicLead: string;
  visibilityPrivateLead: string;
  visibilityPublicBadge: string;
  visibilityPrivateBadge: string;
  visibilityUnpublish: string;
  visibilityRepublish: string;
  visibilityAdminNote: string;
  visibilityErr: string;
  lab: {
    lead: string;
    memberFallback: string;
    ownerSuffix: string;
    notesHeading: string;
    notesEmpty: string;
    postPlaceholder: string;
    postSubmit: string;
    postSending: string;
    downloadHeading: string;
    downloadLead: string;
    downloadImage: string;
    downloadVideo: string;
    downloadAudio: string;
    downloadPdf: string;
    downloadModel: string;
    downloadThumbnail: string;
    downloadArtworkTitle: (title: string) => string;
  };
};

const ENGAGEMENT_JA: EngagementContent = {
  collabStatus: {
    pending: "申請済み",
    accepted: "承認済み",
    declined: "辞退済み",
    cancelled: "取り下げ済み",
  },
  fanCount: (n) => `ファン ${n} 人`,
  ownerFans: (name, n) => `${name} · ファン ${n} 人`,
  fanRegister: "ファン登録",
  fanRegistered: "ファン登録済み",
  collabRequest: "コラボ申請",
  collabLabel: (status) => `コラボ: ${status}`,
  collabMessageLabel: "コラボの内容（任意）",
  collabMessagePlaceholder: "依頼内容や希望の進め方を簡潔に...",
  collabSubmit: "申請を送る",
  collabSending: "送信中...",
  cancel: "キャンセル",
  processing: "処理中...",
  errCollab: "コラボ申請に失敗しました。",
  collabAccept: "許可",
  collabDecline: "却下",
  openLab: "Lab を開く",
  pendingCollabHeading: (n) => `コラボ申請（${n}件）`,
  ownerCollabHint: "コラボ申請が届くとここで承認できます。承認後、共同作業用 Lab が作成されます。",
  visibilityHeading: "公開設定",
  visibilityPublicLead: "Gallery に公開中です。非公開にすると一覧から隠れ、URL を知る本人と管理者のみ閲覧できます。",
  visibilityPrivateLead: "非公開です。Gallery 一覧には表示されません。データは保持されます。",
  visibilityPublicBadge: "公開中",
  visibilityPrivateBadge: "非公開",
  visibilityUnpublish: "公開を停止する",
  visibilityRepublish: "再公開する",
  visibilityAdminNote: "管理者として操作しています。",
  visibilityErr: "公開設定の更新に失敗しました。",
  lab: {
    lead: "承認されたメンバーで共同作業できる Lab です。メモや進捗を共有しましょう。",
    memberFallback: "メンバー",
    ownerSuffix: "（オーナー）",
    notesHeading: "共有メモ",
    notesEmpty: "まだメモがありません。最初のメモを残しましょう。",
    postPlaceholder: "進捗・素材メモ・アイデアを共有...",
    postSubmit: "Lab に投稿",
    postSending: "送信中...",
    downloadHeading: "作品ファイル（共同作業者向け）",
    downloadLead: "Lab メンバーのみ、元ファイルをダウンロードできます。Gallery 上での一般ダウンロードは禁止です。",
    downloadImage: "画像をダウンロード",
    downloadVideo: "動画をダウンロード",
    downloadAudio: "音声をダウンロード",
    downloadPdf: "PDF をダウンロード",
    downloadModel: "3Dモデルをダウンロード",
    downloadThumbnail: "サムネイルをダウンロード",
    downloadArtworkTitle: (title) => `対象作品: ${title}`,
  },
};

const ENGAGEMENT_EN: EngagementContent = {
  collabStatus: {
    pending: "Pending",
    accepted: "Accepted",
    declined: "Declined",
    cancelled: "Cancelled",
  },
  fanCount: (n) => `${n} fan${n === 1 ? "" : "s"}`,
  ownerFans: (name, n) => `${name} · ${n} fan${n === 1 ? "" : "s"}`,
  fanRegister: "Become a fan",
  fanRegistered: "Following",
  collabRequest: "Request collab",
  collabLabel: (status) => `Collab: ${status}`,
  collabMessageLabel: "Collab message (optional)",
  collabMessagePlaceholder: "Briefly describe your request or how you'd like to work together…",
  collabSubmit: "Send request",
  collabSending: "Sending…",
  cancel: "Cancel",
  processing: "Processing…",
  errCollab: "Could not send collab request.",
  collabAccept: "Accept",
  collabDecline: "Decline",
  openLab: "Open Lab",
  pendingCollabHeading: (n) => `Collab requests (${n})`,
  ownerCollabHint: "Incoming collab requests appear here. Accepting creates a shared Lab.",
  visibilityHeading: "Visibility",
  visibilityPublicLead: "Published in Gallery. Unpublishing hides it from the feed; only you and admins can open the URL.",
  visibilityPrivateLead: "Unpublished. Hidden from Gallery listings. Data is retained.",
  visibilityPublicBadge: "Public",
  visibilityPrivateBadge: "Unpublished",
  visibilityUnpublish: "Unpublish",
  visibilityRepublish: "Publish again",
  visibilityAdminNote: "You are acting as an administrator.",
  visibilityErr: "Could not update visibility.",
  lab: {
    lead: "Collaborate with approved members. Share notes and progress here.",
    memberFallback: "Member",
    ownerSuffix: "(owner)",
    notesHeading: "Shared notes",
    notesEmpty: "No notes yet. Add the first one.",
    postPlaceholder: "Share progress, assets, or ideas…",
    postSubmit: "Post to Lab",
    postSending: "Sending…",
    downloadHeading: "Artwork files (collaborators)",
    downloadLead: "Lab members can download source files. Public Gallery downloads are not allowed.",
    downloadImage: "Download image",
    downloadVideo: "Download video",
    downloadAudio: "Download audio",
    downloadPdf: "Download PDF",
    downloadModel: "Download 3D model",
    downloadThumbnail: "Download thumbnail",
    downloadArtworkTitle: (title) => `Artwork: ${title}`,
  },
};

export const ENGAGEMENT_CONTENT: Record<UiLocale, EngagementContent> = {
  ja: ENGAGEMENT_JA,
  en: ENGAGEMENT_EN,
  ko: {
    ...ENGAGEMENT_EN,
    fanRegister: "팬 등록",
    fanRegistered: "팬 등록됨",
    collabRequest: "콜라보 신청",
    collabSubmit: "신청 보내기",
    cancel: "취소",
    collabAccept: "승인",
    collabDecline: "거절",
    openLab: "Lab 열기",
    pendingCollabHeading: (n) => `콜라보 신청 (${n}건)`,
    ownerCollabHint: "콜라보 신청이 오면 여기서 승인할 수 있습니다.",
    lab: { ...ENGAGEMENT_EN.lab, notesHeading: "공유 메모", postSubmit: "Lab에 게시" },
  },
  "zh-CN": {
    ...ENGAGEMENT_EN,
    fanRegister: "成为粉丝",
    fanRegistered: "已关注",
    collabRequest: "申请合作",
    collabSubmit: "发送申请",
    cancel: "取消",
    collabAccept: "同意",
    collabDecline: "拒绝",
    openLab: "打开 Lab",
    pendingCollabHeading: (n) => `合作申请（${n}条）`,
    ownerCollabHint: "合作申请将显示在此。同意后创建共享 Lab。",
    lab: { ...ENGAGEMENT_EN.lab, notesHeading: "共享备忘", postSubmit: "发布到 Lab" },
  },
};
