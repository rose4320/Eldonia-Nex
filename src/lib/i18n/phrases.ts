import type { UiLocale } from "@/lib/i18n/locale";

/** 完全一致フレーズの翻訳（サンプルデータ・タグ・スキル等） */
export const PHRASE_TRANSLATIONS: Record<string, Partial<Record<UiLocale, string>>> = {
  // Event descriptions
  "国内外のクリエイターが集う年次サミット。基調講演・ポートフォリオレビュー・ネットワーキング。":
    {
      en: "Annual summit for creators worldwide. Keynotes, portfolio reviews, and networking.",
      ko: "전 세계 크리에이터가 모이는 연례 서밋. 기조 연설·포트폴리오 리뷰·네트워킹.",
      "zh-CN": "全球创作者年度峰会。主题演讲、作品集点评与交流。",
    },
  "ライブデジタルペイント配信。チャット参加・限定ブラシ配布あり。":
    {
      en: "Live digital painting stream with chat participation and exclusive brush giveaways.",
      ko: "라이브 디지털 페인팅 방송. 채팅 참여·한정 브러시 배포.",
      "zh-CN": "数字绘画直播，可聊天互动并领取限定笔刷。",
    },
  "ゲーム・ファンタジー系楽曲のオーケストラコンサート。VIP席あり。":
    {
      en: "Orchestra concert of game and fantasy music. VIP seats available.",
      ko: "게임·판타지 곡 오케스트라 콘서트. VIP석 있음.",
      "zh-CN": "游戏与奇幻主题管弦乐音乐会，含 VIP 席。",
    },
  "世界観設計・地図制作の実践ワークショップ。少人数制。":
    {
      en: "Hands-on worldbuilding and map-making workshop. Small group.",
      ko: "세계관 설계·지도 제작 실습 워크숍. 소수 정원.",
      "zh-CN": "世界观与地图制作实践工作坊，小班制。",
    },
  "インディーゲーム展示とピッチコンテスト。審査員フィードバック付き。":
    {
      en: "Indie game showcase and pitch contest with judge feedback.",
      ko: "인디 게임 전시 및 피치 콘테스트. 심사 피드백 포함.",
      "zh-CN": "独立游戏展示与路演竞赛，含评委反馈。",
    },
  "GALLERY 出品作家による期間限定展示。入場無料・作品即売あり。":
    {
      en: "Limited exhibition by GALLERY artists. Free entry; works for sale.",
      ko: "GALLERY 작가 기간 한정 전시. 무료 입장·작품 현장 판매.",
      "zh-CN": "GALLERY 作家限时展览，免费入场，现场可购作品。",
    },
  // Event titles (when UI differs from title language)
  "Nexus Creator Summit 2026":
    {
      ja: "ネクサス・クリエイター・サミット 2026",
      ko: "넥서스 크리에이터 서밋 2026",
      "zh-CN": "Nexus 创作者峰会 2026",
    },
  "Golden Ink Live — Digital Art Session":
    {
      ja: "ゴールデン・インク・ライブ — デジタルアートセッション",
      ko: "골든 잉크 라이브 — 디지털 아트 세션",
      "zh-CN": "Golden Ink 直播 — 数字艺术专场",
    },
  "Fantasy Orchestra Night":
    {
      ja: "ファンタジー・オーケストラ・ナイト",
      ko: "판타지 오케스트라 나이트",
      "zh-CN": "奇幻管弦乐之夜",
    },
  "Worldbuilding Workshop — Lore & Maps":
    {
      ja: "世界観ワークショップ — 設定と地図",
      ko: "월드빌딩 워크숍 — 설정과 지도",
      "zh-CN": "世界观工作坊 — 设定与地图",
    },
  "Indie Game Showcase & Pitch":
    {
      ja: "インディーゲーム展示＆ピッチ",
      ko: "인디 게임 쇼케이스 & 피치",
      "zh-CN": "独立游戏展示与路演",
    },
  "Gallery Night — Creator Exhibition":
    {
      ja: "ギャラリー・ナイト — クリエイター展",
      ko: "갤러리 나이트 — 크리에이터 전시",
      "zh-CN": "画廊之夜 — 创作者展览",
    },
  // Tags & skills
  サミット: { en: "Summit", ko: "서밋", "zh-CN": "峰会" },
  ネットワーキング: { en: "Networking", ko: "네트워킹", "zh-CN": "交流" },
  配信: { en: "Streaming", ko: "스트리밍", "zh-CN": "直播" },
  ライブ: { en: "Live", ko: "라이브", "zh-CN": "直播" },
  イラスト: { en: "Illustration", ko: "일러스트", "zh-CN": "插画" },
  コンサート: { en: "Concert", ko: "콘서트", "zh-CN": "音乐会" },
  音楽: { en: "Music", ko: "음악", "zh-CN": "音乐" },
  ワークショップ: { en: "Workshop", ko: "워크숍", "zh-CN": "工作坊" },
  設定: { en: "Worldbuilding", ko: "설정", "zh-CN": "设定" },
  ゲーム: { en: "Game", ko: "게임", "zh-CN": "游戏" },
  コンテスト: { en: "Contest", ko: "콘테스트", "zh-CN": "竞赛" },
  無料: { en: "Free", ko: "무료", "zh-CN": "免费" },
  展示: { en: "Exhibition", ko: "전시", "zh-CN": "展览" },
  デジタル: { en: "Digital", ko: "디지털", "zh-CN": "数字" },
  ブラシ: { en: "Brushes", ko: "브러시", "zh-CN": "笔刷" },
  キャラデザ: { en: "Character design", ko: "캐릭터 디자인", "zh-CN": "角色设计" },
  クリエイター: { en: "Creator", ko: "크리에이터", "zh-CN": "创作者" },
  求人主: { en: "Employer", ko: "구인자", "zh-CN": "招聘方" },
  // WORKS — locations & skills
  リモート: { en: "Remote", ko: "원격", "zh-CN": "远程" },
  ハイブリッド: { en: "Hybrid", ko: "하이브리드", "zh-CN": "混合" },
  Remote: { en: "Remote", ko: "원격", "zh-CN": "远程" },
  Hybrid: { en: "Hybrid", ko: "하이브리드", "zh-CN": "混合" },
  作曲: { en: "Composition", ko: "작곡", "zh-CN": "作曲" },
  DAW: { en: "DAW", ko: "DAW", "zh-CN": "DAW" },
  オーケストラ: { en: "Orchestration", ko: "오케스트라", "zh-CN": "管弦乐" },
  Composition: { en: "Composition", ko: "작곡", "zh-CN": "作曲" },
  Orchestration: { en: "Orchestration", ko: "오케스트라", "zh-CN": "管弦乐" },
  モデレーション: { en: "Moderation", ko: "모더레이션", "zh-CN": "审核" },
  Moderation: { en: "Moderation", ko: "모더레이션", "zh-CN": "审核" },
  英語: { en: "English", ko: "영어", "zh-CN": "英语" },
  English: { en: "English", ko: "영어", "zh-CN": "英语" },
  Illustrator: { en: "Illustrator", ko: "Illustrator", "zh-CN": "Illustrator" },
  Live2D: { en: "Live2D", ko: "Live2D", "zh-CN": "Live2D" },
  Blender: { en: "Blender", ko: "Blender", "zh-CN": "Blender" },
  // WORKS — sample job titles & descriptions (DB シード向けフォールバック)
  "ファンタジーBGMコンポーザー（短期）": {
    en: "Fantasy BGM Composer (Short-term)",
    ko: "판타지 BGM 작곡가 (단기)",
    "zh-CN": "奇幻 BGM 作曲（短期）",
  },
  "TRPG用 BGM 5 曲。ダークファンタジー調。リファレンス共有あり。": {
    en: "Five TRPG background tracks in a dark fantasy style. Reference material provided.",
    ko: "TRPG용 BGM 5곡. 다크 판타지 톤. 레퍼런스 자료 제공.",
    "zh-CN": "TRPG 用 BGM 5 首，暗黑奇幻风格，提供参考素材。",
  },
  "キャラクターデザイナー（協業）": {
    en: "Character Designer (Collaboration)",
    ko: "캐릭터 디자이너 (협업)",
    "zh-CN": "角色设计师（协作）",
  },
  "インディーゲームの主要キャラ 3 体。世界観資料あり。": {
    en: "Three lead characters for an indie game. World bible included.",
    ko: "인디 게임 주요 캐릭터 3명. 세계관 자료 포함.",
    "zh-CN": "独立游戏主要角色 3 名，含世界观资料。",
  },
  ライブ2Dモデラー: {
    en: "Live2D Model Artist",
    ko: "Live2D 모델러",
    "zh-CN": "Live2D 建模师",
  },
  "VTuber 向け Live2D モデル制作。分割納品可。": {
    en: "Live2D model for VTuber use. Milestone deliveries welcome.",
    ko: "VTuber용 Live2D 모델 제작. 분할 납품 가능.",
    "zh-CN": "VTuber 用 Live2D 模型制作，可分阶段交付。",
  },
  "コミュニティモデレーター（パート）": {
    en: "Community Moderator (Part-time)",
    ko: "커뮤니티 모더레이터 (파트)",
    "zh-CN": "社区版主（兼职）",
  },
  "Discord / 掲示板のモデレーション。日本語・英語。": {
    en: "Moderate Discord and forums. Japanese and English.",
    ko: "Discord·게시판 모더레이션. 일본어·영어.",
    "zh-CN": "Discord / 论坛版务，需日语与英语。",
  },
  원격: { en: "Remote", ko: "원격", "zh-CN": "远程" },
  하이브리드: { en: "Hybrid", ko: "하이브리드", "zh-CN": "混合" },
  远程: { en: "Remote", ko: "원격", "zh-CN": "远程" },
  混合: { en: "Hybrid", ko: "하이브리드", "zh-CN": "混合" },
  // Shop — product descriptions
  "漆黒地に金のエンブレムを配した公式パーカー。創作の合間に纏う、Nexus 定番アイテム。":
    {
      en: "Official hoodie with gold emblem on obsidian black — a Nexus staple between creative sessions.",
      ko: "칠흑 바탕에 금색 엠블럼 공식 후드 — 창작 사이 Nexus 필수 아이템.",
      "zh-CN": "玄黑底金纹官方连帽衫，创作间隙的 Nexus 经典单品。",
    },
  "ファンタジー描線向け Procreate / Photoshop ブラシ 48 本。金箔・古羊皮紙テクスチャ付き。":
    {
      en: "48 fantasy line-art brushes for Procreate/Photoshop with gold-leaf and parchment textures.",
      ko: "판타지 선화용 Procreate/Photoshop 브러시 48종. 금박·양피지 텍스처 포함.",
      "zh-CN": "48 支奇幻线稿 Procreate/Photoshop 笔刷，含金箔与羊皮纸纹理。",
    },
  "王国全图をあしらった超大判デスクマット。防水・滑り止め加工。":
    {
      en: "Oversized desk mat featuring the full realm map. Water-resistant with anti-slip backing.",
      ko: "왕국 전도가 그려진 초대형 데스크 매트. 방수·미끄럼 방지.",
      "zh-CN": "王国全图超大桌垫，防水防滑。",
    },
  "Nexus Prime 年間メンバーシップ。送料無料・限定セール早期アクセス・デジタル特典。":
    {
      en: "Nexus Prime annual membership — free shipping, early sale access, digital perks.",
      ko: "Nexus Prime 연간 멤버십. 무료 배송·한정 세일 선행·디지털 혜택.",
      "zh-CN": "Nexus Prime 年度会员：免运费、限定特卖优先、数字特典。",
    },
  "世界観設定資料・キャラクター档案・魔法体系ガイドの PDF 3 冊セット。":
    {
      en: "PDF bundle: worldbuilding bible, character archives, and magic system guide (3 volumes).",
      ko: "세계관 설정·캐릭터档案·마법体系 가이드 PDF 3권 세트.",
      "zh-CN": "世界观设定、角色档案、魔法体系指南 PDF 三册套装。",
    },
  "環境音・魔法効果音 120 点。ゲーム・動画・配信向けロイヤリティフリー。":
    {
      en: "120 ambient and magic SFX — royalty-free for games, video, and streams.",
      ko: "환경음·마법 효과음 120종. 게임·영상·방송용 로열티 프리.",
      "zh-CN": "120 条环境与魔法音效，游戏/视频/直播免版税。",
    },
  // Shop tags
  公式: { en: "Official", ko: "공식", "zh-CN": "官方" },
  アパレル: { en: "Apparel", ko: "의류", "zh-CN": "服饰" },
  限定: { en: "Limited", ko: "한정", "zh-CN": "限定" },
  グッズ: { en: "Goods", ko: "굿즈", "zh-CN": "周边" },
  デスク: { en: "Desk", ko: "데스크", "zh-CN": "桌面" },
  メンバーシップ: { en: "Membership", ko: "멤버십", "zh-CN": "会员" },
  設定資料: { en: "Lore docs", ko: "설정 자료", "zh-CN": "设定资料" },
  音声: { en: "Audio", ko: "음성", "zh-CN": "音频" },
  SFX: { en: "SFX", ko: "SFX", "zh-CN": "音效" },
};

export function phraseTranslation(
  text: string,
  target: UiLocale,
): string | null {
  const trimmed = text.trim();
  const entry = PHRASE_TRANSLATIONS[trimmed];
  const translated = entry?.[target];
  if (!translated || translated === trimmed) return null;
  return translated;
}
