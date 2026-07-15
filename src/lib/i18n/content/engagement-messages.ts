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
    room: {
      membersAria: string;
      presenceAria: string;
      presenceYou: string;
      presenceDemoHint: string;
      presenceWaiting: string;
      presenceEditing: (name: string, area: string) => string;
      presenceFocusChat: string;
      presenceFocusFolders: string;
      presenceFocusWorkspace: string;
      presenceFocusTimeline: string;
      presenceFocusMixer: string;
      presenceFocusIdle: string;
      snapshotOpen: string;
      snapshotTitle: string;
      snapshotLead: string;
      snapshotName: string;
      snapshotSave: string;
      snapshotPublish: string;
      snapshotHint: string;
      snapshotEmpty: string;
      snapshotRestore: string;
      snapshotArchive: string;
      snapshotKindSnapshot: string;
      snapshotKindPublish: string;
      snapshotLeaderOnly: string;
      snapshotSaved: (label: string) => string;
      snapshotPublishSaved: (label: string) => string;
      snapshotRestored: (label: string) => string;
      snapshotArchived: string;
      snapshotSaveFailed: string;
      snapshotRestoreConfirm: (label: string) => string;
      snapshotPublishDefault: (n: number) => string;
      youAreLeader: string;
      currentLeader: (name: string) => string;
      foldersHeading: string;
      foldersHint: string;
      folderUpload: string;
      folderUploading: string;
      folderUploadHint: string;
      folderPermHint: string;
      deleteFile: string;
      deleteFolder: string;
      deleteLeaderOnly: string;
      workspaceHeading: string;
      workspaceEmpty: string;
      workspaceDropHint: string;
      workspaceDropped: (name: string) => string;
      workspaceStageHint: string;
      workspaceExpand: string;
      workspaceOnTimeline: string;
      timelineFilesHeading: string;
      pendingFilesHeading: string;
      operateHint: string;
      stageExclude: string;
      stageExcludeHint: string;
      clipExclude: string;
      clipDragHint: string;
      waveformHeading: string;
      waveformHint: string;
      waveformSelect: string;
      waveformScrub: string;
      waveformSynced: string;
      videoPreviewHeading: string;
      workspaceOpenHint: (name: string) => string;
      chatHeading: string;
      chatPlaceholder: string;
      chatSubmit: string;
      mediaHeading: string;
      uploadChip: string;
      playlistChip: string;
      assetsChip: string;
      downloadNote: string;
      videoTimeline: string;
      audioTimeline: string;
      bgmTimeline: string;
      overlayTimeline: string;
      timelineHint: string;
      timelinePlayhead: string;
      timelineTimecode: string;
      timelinePlay: string;
      timelinePause: string;
      timelineScrub: string;
      timelineAudioNeedsUrl: string;
      timelineAudioMovePlayhead: string;
      panelMixer: string;
      panelEq: string;
      audioConsoleOpen: string;
      audioConsoleTitle: string;
      audioConsoleLead: string;
      audioWinLockHint: string;
      audioWinUnlockHint: string;
      audioWinResize: string;
      mixerMaster: string;
      mixerHint: string;
      addAudioTrack: string;
      mixerPan: string;
      mixerPanCenter: string;
      mixerMute: string;
      mixerSolo: string;
      mixerGain: string;
      mixerSend: string;
      mixerLimiter: string;
      eqHint: string;
      eqBand: (label: string) => string;
      eqPresetFlat: string;
      eqPresetVoice: string;
      eqPresetMusic: string;
      eqPresetBass: string;
      eqLowCut: string;
      eqHighCut: string;
      eqQ: string;
      resizeTimeline: string;
      trackVideo: (n: number) => string;
      trackAudio: (n: number) => string;
      canonicalBadge: string;
      modalHeading: string;
      modalBody: string;
      modalBusy: string;
      modalLeaderOnly: string;
      downloadAction: string;
      closeAction: string;
      closeLeaderOnly: string;
      mobilePcHint: string;
      mobileConfirmHeading: string;
      mobileConfirmArtwork: string;
      mobileConfirmLatest: string;
      mobileConfirmEmpty: string;
      fileAttach: string;
      fileSendShared: string;
      filePending: string;
      fileOpen: string;
      fileSentLabel: string;
      fileTooLarge: string;
      fileUploadFailed: string;
    };
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
    room: {
      membersAria: "参加メンバー",
      presenceAria: "同時編集の状態",
      presenceYou: "あなた",
      presenceDemoHint: "メンバーの作業エリアを表示（デモ）",
      presenceWaiting: "他メンバーの作業エリアはリアルタイム接続後に表示",
      presenceEditing: (name, area) => `${name} · ${area}`,
      presenceFocusChat: "チャット",
      presenceFocusFolders: "共有フォルダ",
      presenceFocusWorkspace: "ステージ",
      presenceFocusTimeline: "タイムライン",
      presenceFocusMixer: "Mixer / EQ",
      presenceFocusIdle: "待機",
      snapshotOpen: "Versions",
      snapshotTitle: "Versions",
      snapshotLead: "Snapshot＝復元点 / Publish＝Gallery・Works 向け版",
      snapshotName: "名前",
      snapshotSave: "Snapshot 保存",
      snapshotPublish: "Publish Version",
      snapshotHint: "Snapshot / Publish は lab_snapshots に保存されます（リロード後も復元可）",
      snapshotEmpty: "まだバージョンがありません",
      snapshotRestore: "復元",
      snapshotArchive: "アーカイブ",
      snapshotKindSnapshot: "Snapshot",
      snapshotKindPublish: "Publish",
      snapshotLeaderOnly: "復元・Publish・アーカイブはリーダーのみです",
      snapshotSaved: (label) => `保存しました: ${label}`,
      snapshotPublishSaved: (label) => `Publish 版を作成: ${label}`,
      snapshotRestored: (label) => `復元しました: ${label}`,
      snapshotArchived: "アーカイブしました（非表示・削除ではありません）",
      snapshotSaveFailed: "バージョンの保存に失敗しました。もう一度お試しください。",
      snapshotRestoreConfirm: (label) =>
        `「${label}」に復元します。いまの未保存の変更は失われます。よろしいですか？`,
      snapshotPublishDefault: (n) => `Publish v${n}`,
      youAreLeader: "リーダー",
      currentLeader: (name) => `現行リーダー: ${name}`,
      foldersHeading: "共有フォルダ",
      foldersHint: "共有フォルダにファイルをアップロードできます。中央へドラッグして確認",
      folderUpload: "ファイルをアップロード",
      folderUploading: "アップロード中…",
      folderUploadHint: "この部屋のメンバー全員がアップロードできます",
      folderPermHint: "アップロード・中央ドラッグ: 全員 / 消去: リーダーのみ",
      deleteFile: "消去",
      deleteFolder: "フォルダ消去",
      deleteLeaderOnly: "消去はリーダーのみです",
      workspaceHeading: "共同作業場",
      workspaceEmpty: "共有フォルダのファイルをクリック → チェックで下にステージング → ミニウィンドウで展開",
      workspaceDropHint: "ドロップで中央候補に追加",
      workspaceDropped: (name) => `タイムライン上: ${name}`,
      workspaceStageHint: "チェック＝下のタイムラインへ。ステージングするとミニウィンドウが重なって開きます",
      workspaceExpand: "下にステージング",
      workspaceOnTimeline: "ステージング中",
      timelineFilesHeading: "タイムライン上（ミニウィンドウ）",
      pendingFilesHeading: "候補（チェックで下へ）",
      operateHint: "選択中のタイムライン素材",
      stageExclude: "共有フォルダに戻す",
      stageExcludeHint: "中央とタイムラインから外し、左の共有フォルダへ戻します（全員可）",
      clipExclude: "選択クリップを共有フォルダに戻す",
      clipDragHint: "ドラッグでタイミング調整",
      waveformHeading: "波形",
      waveformHint: "チェックを入れて下にステージングすると、ミニウィンドウで操作できます",
      waveformSelect: "選択してミニウィンドウを開く",
      waveformScrub: "波形をドラッグしてスクラブ（下の再生ヘッドと連動）",
      waveformSynced: "クリップ内位置＝下のタイムライン再生ヘッドと同期",
      videoPreviewHeading: "プレビュー",
      workspaceOpenHint: (name) => `展開中: ${name}`,
      chatHeading: "翻訳チャット",
      chatPlaceholder: "メッセージを入力…（翻訳＋原文併記）",
      chatSubmit: "送信",
      mediaHeading: "タイムライン",
      uploadChip: "UPLOAD",
      playlistChip: "PLAYLIST",
      assetsChip: "ASSETS",
      downloadNote: "リーダー・メンバーともにダウンロード可。中央モーダルは同時に1つ。閉じるのはリーダーのみ。",
      videoTimeline: "動画タイムライン",
      audioTimeline: "音声タイムライン",
      bgmTimeline: "BGM タイムライン",
      overlayTimeline: "オーバーレイ",
      timelineHint: "再生ヘッドをドラッグしてスクラブ。▶で実音声を再生（URL付きクリップ）",
      timelinePlayhead: "再生ヘッド",
      timelineTimecode: "00:00:34:12",
      timelinePlay: "再生",
      timelinePause: "停止",
      timelineScrub: "クリックまたはドラッグでスクラブ",
      timelineAudioNeedsUrl:
        "音が出ません。共有フォルダへアップロードした音声をステージへ入れてください（デモクリップは無音です）",
      timelineAudioMovePlayhead:
        "再生ヘッドを音声クリップの上に合わせてから ▶ を押してください",
      panelMixer: "ミキサー",
      panelEq: "EQ",
      audioConsoleOpen: "Mixer / EQ",
      audioConsoleTitle: "Audio Console",
      audioConsoleLead: "固定中。動かす→タイトルクリック→ドラッグ→離すと再固定",
      audioWinLockHint: "ドラッグで移動／クリックで固定",
      audioWinUnlockHint: "クリックで移動モードへ",
      audioWinResize: "サイズ変更",
      mixerMaster: "Master",
      mixerHint: "フェーダーは A トラック単位。Solo 中は Solo のみ、Mute は無音扱いです",
      addAudioTrack: "+ A トラック",
      mixerPan: "Pan",
      mixerPanCenter: "C",
      mixerMute: "M",
      mixerSolo: "S",
      mixerGain: "Gain",
      mixerSend: "Send",
      mixerLimiter: "Limiter",
      eqHint: "トラック別 7 バンド EQ。プリセットと Low/High Cut、Q を調整できます",
      eqBand: (label) => label,
      eqPresetFlat: "Flat",
      eqPresetVoice: "Voice",
      eqPresetMusic: "Music",
      eqPresetBass: "Bass",
      eqLowCut: "Low Cut",
      eqHighCut: "High Cut",
      eqQ: "Q",
      resizeTimeline: "タイムラインの高さを調整",
      trackVideo: (n) => `V${n}`,
      trackAudio: (n) => `A${n}`,
      canonicalBadge: "現行",
      modalHeading: "ファイル展開",
      modalBody: "Phase 1 プレビューです。実ファイルのプレビュー／編集は Phase 2 以降で接続します。",
      modalBusy: "別のファイルが展開中です。リーダーが閉じてから開けます。",
      modalLeaderOnly: "閉じる操作はリーダーのみです。",
      downloadAction: "ダウンロード",
      closeAction: "閉じる",
      closeLeaderOnly: "閉じる（リーダーのみ）",
      mobilePcHint:
        "スマホはチャットがメインです。ファイルはここから送れます。フォルダ作業は PC 向けです。",
      mobileConfirmHeading: "状況確認",
      mobileConfirmArtwork: "対象作品",
      mobileConfirmLatest: "共有ファイル（確認）",
      mobileConfirmEmpty: "まだ共有メモはありません。",
      fileAttach: "ファイルを添付",
      fileSendShared: "共有ファイルを送る",
      filePending: "添付中",
      fileOpen: "開く / 保存",
      fileSentLabel: "ファイル送信",
      fileTooLarge: "ファイルが大きすぎます（上限 25MB）。",
      fileUploadFailed: "ファイルの送信に失敗しました。",
    },
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
    room: {
      membersAria: "Participants",
      presenceAria: "Live collaboration presence",
      presenceYou: "You",
      presenceDemoHint: "Showing member work areas (demo)",
      presenceWaiting: "Teammate work areas appear after realtime sync",
      presenceEditing: (name, area) => `${name} · ${area}`,
      presenceFocusChat: "Chat",
      presenceFocusFolders: "Folders",
      presenceFocusWorkspace: "Stage",
      presenceFocusTimeline: "Timeline",
      presenceFocusMixer: "Mixer / EQ",
      presenceFocusIdle: "Idle",
      snapshotOpen: "Versions",
      snapshotTitle: "Versions",
      snapshotLead: "Snapshot = restore point / Publish = Gallery·Works version",
      snapshotName: "Name",
      snapshotSave: "Save Snapshot",
      snapshotPublish: "Publish Version",
      snapshotHint: "Snapshots and Publish versions are saved to lab_snapshots (restore after reload).",
      snapshotEmpty: "No versions yet",
      snapshotRestore: "Restore",
      snapshotArchive: "Archive",
      snapshotKindSnapshot: "Snapshot",
      snapshotKindPublish: "Publish",
      snapshotLeaderOnly: "Restore, publish, and archive are leader-only",
      snapshotSaved: (label) => `Saved: ${label}`,
      snapshotPublishSaved: (label) => `Publish version created: ${label}`,
      snapshotRestored: (label) => `Restored: ${label}`,
      snapshotArchived: "Archived (hidden, not deleted)",
      snapshotSaveFailed: "Could not save version. Please try again.",
      snapshotRestoreConfirm: (label) =>
        `Restore “${label}”? Unsaved changes will be lost.`,
      snapshotPublishDefault: (n) => `Publish v${n}`,
      youAreLeader: "Leader",
      currentLeader: (name) => `Current leader: ${name}`,
      foldersHeading: "Shared folders",
      foldersHint: "Upload shared files to folders. Drag to the center stage to inspect.",
      folderUpload: "Upload file",
      folderUploading: "Uploading…",
      folderUploadHint: "All room members can upload",
      folderPermHint: "Upload & center drag: everyone / Delete: leader only",
      deleteFile: "Delete",
      deleteFolder: "Delete folder",
      deleteLeaderOnly: "Only the leader can delete",
      workspaceHeading: "Workspace",
      workspaceEmpty: "Click a shared-folder file → check to stage on the bottom timeline → opens as a mini window",
      workspaceDropHint: "Drop to add as a center candidate",
      workspaceDropped: (name) => `On timeline: ${name}`,
      workspaceStageHint: "Check = stage to the bottom timeline. Staged files open as cascading mini windows.",
      workspaceExpand: "Stage to bottom",
      workspaceOnTimeline: "Staged",
      timelineFilesHeading: "On timeline (mini windows)",
      pendingFilesHeading: "Candidates (check to stage below)",
      operateHint: "Selected timeline media",
      stageExclude: "Return to folder",
      stageExcludeHint: "Remove from center/timeline and put back in the shared folder (everyone)",
      clipExclude: "Return selected clip to shared folder",
      clipDragHint: "Drag to adjust timing",
      waveformHeading: "Waveform",
      waveformHint: "Check to stage on the bottom timeline — media opens in a mini window",
      waveformSelect: "Select to open mini window",
      waveformScrub: "Drag waveform to scrub (syncs with the bottom playhead)",
      waveformSynced: "In-clip position synced with the bottom timeline playhead",
      videoPreviewHeading: "Preview",
      workspaceOpenHint: (name) => `Open: ${name}`,
      chatHeading: "Live translation chat",
      chatPlaceholder: "Write a message… (translation + original)",
      chatSubmit: "Send",
      mediaHeading: "Timeline",
      uploadChip: "UPLOAD",
      playlistChip: "PLAYLIST",
      assetsChip: "ASSETS",
      downloadNote: "Leaders and members can download. One modal at a time; only the leader can close it.",
      videoTimeline: "Video timeline",
      audioTimeline: "Audio timeline",
      bgmTimeline: "BGM timeline",
      overlayTimeline: "Overlay",
      timelineHint: "Drag the playhead to scrub. ▶ plays real audio for clips with a URL.",
      timelinePlayhead: "Playhead",
      timelineTimecode: "00:00:34:12",
      timelinePlay: "Play",
      timelinePause: "Stop",
      timelineScrub: "Click or drag to scrub",
      timelineAudioNeedsUrl:
        "No sound — stage an uploaded audio file (demo clips are silent).",
      timelineAudioMovePlayhead:
        "Move the playhead onto an audio clip, then press ▶",
      panelMixer: "Mixer",
      panelEq: "EQ",
      audioConsoleOpen: "Mixer / EQ",
      audioConsoleTitle: "Audio Console",
      audioConsoleLead: "Locked. Click title → drag → release to lock again",
      audioWinLockHint: "Drag to move / click to lock",
      audioWinUnlockHint: "Click to unlock for moving",
      audioWinResize: "Resize",
      mixerMaster: "Master",
      mixerHint: "One fader per A track. Solo isolates; Mute silences the channel.",
      addAudioTrack: "+ A track",
      mixerPan: "Pan",
      mixerPanCenter: "C",
      mixerMute: "M",
      mixerSolo: "S",
      mixerGain: "Gain",
      mixerSend: "Send",
      mixerLimiter: "Limiter",
      eqHint: "Per-track 7-band EQ with presets, Low/High Cut, and Q",
      eqBand: (label) => label,
      eqPresetFlat: "Flat",
      eqPresetVoice: "Voice",
      eqPresetMusic: "Music",
      eqPresetBass: "Bass",
      eqLowCut: "Low Cut",
      eqHighCut: "High Cut",
      eqQ: "Q",
      resizeTimeline: "Resize timeline height",
      trackVideo: (n) => `V${n}`,
      trackAudio: (n) => `A${n}`,
      canonicalBadge: "Current",
      modalHeading: "File view",
      modalBody: "Phase 1 preview. Real preview/edit connects in Phase 2+.",
      modalBusy: "Another file is open. Ask the leader to close it first.",
      modalLeaderOnly: "Only the leader can close this.",
      downloadAction: "Download",
      closeAction: "Close",
      closeLeaderOnly: "Close (leader only)",
      mobilePcHint:
        "Chat is the main view on mobile. Send files here. Folder work is best on PC.",
      mobileConfirmHeading: "Status check",
      mobileConfirmArtwork: "Artwork",
      mobileConfirmLatest: "Shared files (view)",
      mobileConfirmEmpty: "No shared notes yet.",
      fileAttach: "Attach file",
      fileSendShared: "Send shared file",
      filePending: "Attached",
      fileOpen: "Open / save",
      fileSentLabel: "File share",
      fileTooLarge: "File is too large (max 25MB).",
      fileUploadFailed: "Could not send the file.",
    },
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
