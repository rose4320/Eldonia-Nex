import type { UiLocale } from "@/lib/i18n/locale";

export type InvestorPageContent = {
  seo: { metaTitle: string; metaDescription: string };
  hero: { eyebrow: string; title: string; lead: string };
  vision: { title: string; quote: string; body: string };
  horizon: {
    title: string;
    lead: string;
    targetLabel: string;
    kpiLabel: string;
    disclaimer: string;
    steps: {
      num: string;
      title: string;
      body: string;
      targetYear: string;
      kpis: string[];
    }[];
    closing: string;
  };
  governance: {
    title: string;
    lead: string;
    items: { title: string; body: string }[];
    disclaimer: string;
  };
  business: {
    title: string;
    lead: string;
    moduleBadge: string;
    pillars: { title: string; body: string }[];
  };
  revenue: {
    title: string;
    lead: string;
    steps: { num: string; title: string; body: string }[];
    referralTitle: string;
    referralNote: string;
  };
  market: {
    title: string;
    lead: string;
    points: { title: string; body: string }[];
  };
  moat: {
    title: string;
    badge: string;
    items: { title: string; body: string }[];
  };
  roadmap: {
    title: string;
    phases: { phase: string; title: string; body: string }[];
  };
  exit: {
    title: string;
    lead: string;
    badge: string;
    paths: { title: string; body: string }[];
  };
  benefits: {
    title: string;
    items: { title: string; body: string }[];
  };
  categories: {
    title: string;
    lead: string;
    items: { num: string; label: string; description: string }[];
  };
  risks: {
    title: string;
    items: { title: string; body: string }[];
  };
  faq: {
    title: string;
    items: { q: string; a: string }[];
  };
  cta: {
    title: string;
    lead: string;
    primary: string;
    secondary: string;
    contactNote: string;
  };
};

const INVESTOR_JA: InvestorPageContent = {
  seo: {
    metaTitle: "投資家・共創パートナーの皆様へ｜Eldonia-Nex",
    metaDescription:
      "Eldonia-Nexの事業内容、長期展望（1,000万人参加・GPUレンタル・フランチャイズ・UBIまで）、出口戦略、投資メリットをご紹介。",
  },
  hero: {
    eyebrow: "For Investors & Partners",
    title: "クリエイター経済の循環を、ひとつのNexusで",
    lead:
      "Eldonia-Nexは、イラスト・VTuber・ゲームクリエイター向けの作品公開・求人・販売・イベント・コミュニティを統合したプラットフォームです。広告依存ではなく、クリエイターの成功に連動する収益モデルで持続的な成長を目指します。",
  },
  vision: {
    title: "ビジョン",
    quote: "創作の力を、デジタルからリアル、そして社会基盤へ。",
    body:
      "Eldonia-Nexはクリエイター向けプラットフォームから始まり、GPUインフラ・物理拠点・オフラインアクセス・災害支援ロボットまで段階的に拡張します。最終的には、創作経済の成果をスーパーベーシックインカムとして還元し、誰もが参加できる社会を目指します。",
  },
  horizon: {
    title: "Eldonia-Nexの展望",
    lead:
      "サイトの充実を起点に、参加規模・インフラ・物理展開・社会還元へと連鎖する長期ロードマップです。",
    targetLabel: "目標時期",
    kpiLabel: "目標KPI",
    disclaimer:
      "※以下の時期・数値は現時点の目標値（インディカティブ）です。市場環境・規制・資金調達状況に応じて見直します。",
    steps: [
      {
        num: "01",
        title: "サイトの充実と1,000万人参加",
        body:
          "6モジュールの機能深化とUX改善を続け、国内外のクリエイター・ファン・企業が参加する大規模Nexusを形成します。",
        targetYear: "2026〜2029年",
        kpis: [
          "登録参加者 1,000万人",
          "月間アクティブ（MAU）300万人",
          "有料クリエイター 5万人",
          "年間GMV 50億円",
        ],
      },
      {
        num: "02",
        title: "レンタルGPU",
        body:
          "高価なGPUを持たないクリエイターにもAI制作・レンダリングの機会を提供。Lab基盤をクラウドGPUレンタルへ拡張します。",
        targetYear: "2029〜2030年",
        kpis: [
          "GPUレンタル月間利用 10万時間",
          "Lab経由のAI作品投稿 100万件/年",
          "GPU利用クリエイター 20万人",
        ],
      },
      {
        num: "03",
        title: "Eldonia-Nexフランチャイズ化",
        body:
          "カラオケボックスや漫画喫茶のように、誰でもEldonia-Nexを体感できる物理拠点を展開。貧困層やデジタルデバイド下の地域にも創作・学習・収益化のチャンスを届けます。",
        targetYear: "2030〜2032年",
        kpis: [
          "国内Nexus拠点 100店舗",
          "低所得・過疎地域への重点出店 30%",
          "拠点経由の新規クリエイター 5万人/年",
        ],
      },
      {
        num: "04",
        title: "USBによるEldonia-Nexアクセス圏",
        body:
          "インターネット環境が限られた地域でも、USB等のポータブル媒体でNexusの一部機能にアクセスできる圏域を構築します。",
        targetYear: "2031〜2033年",
        kpis: [
          "USBアクセスキット配布 50万本",
          "オフライン同期拠点 500箇所",
          "アクセス圏内の新規参加 100万人",
        ],
      },
      {
        num: "05",
        title: "災害地へのAIロボット出動",
        body:
          "被災地の情報収集・物資配送・遠隔支援にAIロボットを投入。クリエイター・技術コミュニティと連携した社会インフラとしての役割を担います。",
        targetYear: "2032〜2034年",
        kpis: [
          "災害協定自治体 50団体",
          "年間出動可能ロボット 200台",
          "被災地支援稼働 5,000時間/年",
        ],
      },
      {
        num: "06",
        title: "AIロボットの配布",
        body:
          "災害支援で培った技術を一般化し、家庭・地域・拠点へAIロボットを広く配布。創作・教育・福祉・労働支援の現場へ展開します。",
        targetYear: "2034〜2036年",
        kpis: [
          "一般配布・リース 1万台",
          "Nexus拠点常設ロボット 500台",
          "教育・福祉連携プログラム 200件",
        ],
      },
      {
        num: "07",
        title: "スーパーベーシックインカム",
        body:
          "プラットフォーム・インフラ・フランチャイズが生む経済成果を、参加者全体へ還元するスーパーベーシックインカムの実現を目指します。",
        targetYear: "2036年〜",
        kpis: [
          "還元原資プール 年間100億円規模",
          "パイロット参加者 10万人",
          "還元対象コミュニティ 全国50地域",
        ],
      },
    ],
    closing:
      "各フェーズは前段の成功を前提とし、クリエイター経済から社会インフラへと段階的にスケールします。",
  },
  governance: {
    title: "法務・ガバナンス",
    lead:
      "フランチャイズ展開・ロボット配布・スーパーベーシックインカムなど大規模フェーズに向け、コンプライアンスと透明性を段階的に整備します。",
    items: [
      {
        title: "フランチャイズ展開",
        body:
          "フランチャイズ契約の適正化（フランチャイズ契約に関する法規等）、個人情報保護法の遵守、出店地域の消防・建築・通信関連規制の確認。加盟店選定基準と反社会的勢力排除条項を契約に明記します。",
      },
      {
        title: "スーパーベーシックインカム",
        body:
          "還元原資の会計上の区分と開示、利益相反管理、税務・社会保険上の取扱いを専門家と設計。パイロット段階では対象・金額・頻度を限定し、ステークホルダー（投資家・参加者・地域パートナー）への説明責任を果たします。",
      },
      {
        title: "AIロボット・災害支援",
        body:
          "製品安全（PSE等）、データ取扱い、被災地での責任分界（自治体・運営・技術パートナー）を契約で定義。出動プロトコルと倫理ガイドラインを策定し、人の安全を最優先します。",
      },
      {
        title: "USB・オフラインアクセス",
        body:
          "配布媒体のセキュリティ（暗号化・更新機構）、著作権・コンテンツライセンス、不正利用防止を技術と規約の両面で管理。個人情報のオフライン/sync時取扱いを明文化します。",
      },
      {
        title: "ガバナンス体制",
        body:
          "フェーズ移行ごとにKPIレビューとリスク評価を実施。外部監査・法務アドバイザー・地域パートナーとの協議会を設置し、意思決定の透明性を確保します。",
      },
    ],
    disclaimer:
      "詳細な規約・契約書・パイロット設計は、各フェーズの直前に専門家レビューを経て公開・共有します。",
  },
  business: {
    title: "事業内容",
    lead:
      "6つのモジュールが相互に導線を持ち、クリエイターの活動サイクル全体をカバーします。",
    moduleBadge: "Module",
    pillars: [
      {
        title: "Gallery",
        body: "イラスト・漫画・3D・AI作品の投稿とタグ検索。ポートフォリオとして信用を可視化し、Shop・Eventsへの導線を生む。",
      },
      {
        title: "Quest",
        body: "管理者が投げかける挑戦。ログインでEXP、企業案件では現金・PC・商品などの賞品付き創作Quest。参加実績はポートフォリオに記録。",
      },
      {
        title: "Works",
        body: "ポートフォリオ管理とQuest参加実績の拠点。Gallery作品・挑戦履歴・受賞を一覧化。",
      },
      {
        title: "Shop",
        body: "同人グッズ・デジタル商品の販売。Gallery作品から自然に商品化し、Stripe決済で完結。",
      },
      {
        title: "Events",
        body: "VTuber配信・ワークショップ・展示などのオンライン/オフラインイベント。チケット・参加管理を内包。",
      },
      {
        title: "Community",
        body: "掲示板・スレッド型ディスカッション。多言語UIで国内外のファン・クリエイターを接続。",
      },
      {
        title: "Lab & Nexus",
        body: "AI翻訳・制作支援などの拡張機能。クリエイターの制作効率とリーチを底上げする技術基盤。",
      },
    ],
  },
  revenue: {
    title: "収益モデル",
    lead: "クリエイターが稼ぐほどプラットフォームも成長する、連動型の収益構造です。",
    steps: [
      {
        num: "01",
        title: "サブスクリプション",
        body: "クリエイター向け有料プラン（投稿上限解除・分析・優先表示等）。安定したMRRの基盤。",
      },
      {
        num: "02",
        title: "マーケットプレイス手数料",
        body: "Shop・Events・スポンサーQuest（企業案件）の取引・手数料。GMV連動でスケール。",
      },
      {
        num: "03",
        title: "エンタープライズ・広告枠",
        body: "企業向けQuest案件・ブランドスポンサー・特集枠。UXを損なわない限定的な収益源。",
      },
    ],
    referralTitle: "紹介プログラム",
    referralNote:
      "有料会員向け紹介プログラムにより、口コミ経由の獲得コストを抑制し、LTV/CAC比の改善を図ります。",
  },
  market: {
    title: "市場機会",
    lead: "グローバルなクリエイター経済は拡大を続けており、日本の同人・VTuber・インディーゲーム文化は独自の強みを持ちます。",
    points: [
      {
        title: "クリエイター人口の増加",
        body: "副業・フリーランス化、AI支援ツールの普及により、作品公開から収益化までを一気通貫で支援する需要が拡大。",
      },
      {
        title: "ツール分散の課題",
        body: "多くのクリエイターがSNS・BOOTH・イベントサイト・Discord等を使い分けており、統合プラットフォームへのニーズが顕在化。",
      },
      {
        title: "日本発の文化輸出力",
        body: "アニメ・ゲーム・VTuber文化を背景に、国内外双方への展開余地。多言語対応済みの基盤を活用。",
      },
    ],
  },
  moat: {
    title: "競争優位",
    badge: "Edge",
    items: [
      {
        title: "6モジュール統合",
        body: "単機能SNSやEC単体では再現しにくい、作品→Quest→販売→イベントの循環設計。",
      },
      {
        title: "ブランド体験",
        body: "Dark Fantasy調の一貫したUI/UX。ファンコミュニティの帰属意識とリテンションを強化。",
      },
      {
        title: "データ・信用の蓄積",
        body: "閲覧数・評価・Quest参加実績・取引履歴がポートフォリオ信用として蓄積され、スイッチングコストを形成。",
      },
      {
        title: "技術スタック",
        body: "Next.js 16 + Supabase + Stripe + Django Admin。スケーラブルかつ運用コストを抑えた構成。",
      },
    ],
  },
  roadmap: {
    title: "現在〜中期の実行計画",
    phases: [
      {
        phase: "Now",
        title: "プロダクト確立",
        body: "6モジュールの基盤リリース、初期クリエイター獲得、SEO・コミュニティ形成。",
      },
      {
        phase: "Next",
        title: "収益化の加速",
        body: "有料プラン本格展開、Shop/Events GMV拡大、紹介プログラムによるオーガニック成長。",
      },
      {
        phase: "Scale",
        title: "参加規模の拡大",
        body: "ユーザー・取引・コンテンツの急拡大。GPUレンタルとパートナー連携の準備。",
      },
      {
        phase: "Expand",
        title: "物理・社会展開へ",
        body: "フランチャイズ試験導入、オフラインアクセス研究、長期展望フェーズへの移行。",
      },
    ],
  },
  exit: {
    title: "出口戦略",
    lead:
      "中長期で複数の出口シナリオを想定し、投資家・経営陣が柔軟に選択できる構造を目指します。",
    badge: "Exit",
    paths: [
      {
        title: "戦略的M&A",
        body: "エンタメ・ゲーム・EC・クリエイター向けSaaS企業等への売却。6モジュール統合とユーザーベースが買い手にとっての相乗効果源。",
      },
      {
        title: "IPO / 上場準備",
        body: "GMV・MRR・MAUの成長に伴い、東証グロース等での上場を選択肢として検討。ガバナンス・財務開示体制を段階的に整備。",
      },
      {
        title: "事業分割・ライセンス",
        body: "特定モジュール（Shop・Events等）のスピンオフや、ホワイトラベル提供によるEnterprise収益。部分Exitも視野に。",
      },
      {
        title: "配当・還元モデル",
        body: "急拡大よりも安定収益を優先する場合、利益配分・支援者還元プログラムによるリターン設計も可能。",
      },
    ],
  },
  benefits: {
    title: "投資・参画のメリット",
    items: [
      {
        title: "早期参画の優位性",
        body: "ローンチ初期からプロダクト方向性・収益設計に関与。後発投資家より有利な条件での参画機会。",
      },
      {
        title: "限定コミュニティ",
        body: "支援者・投資家向けディスカッションへの招待。四半期ごとの進捗共有（KPI・ロードマップ）。",
      },
      {
        title: "シリアル番号入りピンバッジ",
        body: "初期支援者には「24-01-0001」形式のシリアル番号入りピンバッジを贈呈。コレクター価値と帰属意識の象徴。",
      },
      {
        title: "還元・特典の優先案内",
        body: "将来の利益還元・イベント招待・限定機能アクセス等を、支援カテゴリに応じて優先提供。",
      },
      {
        title: "ネットワーク効果への早期アクセス",
        body: "クリエイター・パートナー・メディアとの接点を早期から獲得。共創パートナーとしてのブランディング機会。",
      },
    ],
  },
  categories: {
    title: "支援カテゴリ",
    lead: "目的や関与度に応じて、以下のカテゴリでご参画いただけます。",
    items: [
      {
        num: "01",
        label: "Investor",
        description: "資金提供・エクイティ/convertible等の投資。経営・成長戦略への助言も歓迎。",
      },
      {
        num: "02",
        label: "Partner",
        description: "技術・インフラ・流通・メディア等、事業提携による共創。",
      },
      {
        num: "03",
        label: "Advisor",
        description: "業界知見・法務・財務・マーケティング等の助言役。",
      },
      {
        num: "04",
        label: "Media",
        description: "取材・特集・クリエイター紹介等、認知拡大の協力。",
      },
      {
        num: "05",
        label: "Community",
        description: "初期ユーザーコミュニティの形成・ファンアンバサダーとしての支援。",
      },
    ],
  },
  risks: {
    title: "主要リスクと対策",
    items: [
      {
        title: "競合・代替サービス",
        body: "統合UXとブランド体験で差別化。特定モジュール単体ではなく循環全体の価値を訴求。",
      },
      {
        title: "クリエイター獲得",
        body: "紹介プログラム・Quest・イベント連携で初期供給側を確保。SEOとコミュニティ運営を並行。",
      },
      {
        title: "規制・決済リスク",
        body: "Stripe準拠、利用規約・プライバシーポリシーの整備、Django Adminによる運用監視。",
      },
    ],
  },
  faq: {
    title: "よくあるご質問",
    items: [
      {
        q: "最低投資額はありますか？",
        a: "カテゴリ・関与度により異なります。まずはお問い合わせいただき、個別にご相談ください。",
      },
      {
        q: "NDAの締結は可能ですか？",
        a: "はい。詳細な財務・KPI資料の共有前にNDAを締結できます。",
      },
      {
        q: "海外からの投資は受け付けていますか？",
        a: "はい。英語での資料提供・打ち合わせにも対応可能です。",
      },
      {
        q: "ピッチデックや財務モデルはありますか？",
        a: "関心をお持ちの投資家・パートナー向けに、NDA締結後に共有いたします。",
      },
    ],
  },
  cta: {
    title: "ご関心をお持ちの方へ",
    lead:
      "事業概要・詳細資料・打ち合わせのご希望は、お問い合わせフォームよりご連絡ください。件名に「投資・共創のご相談」とご記載いただけるとスムーズです。",
    primary: "お問い合わせする",
    secondary: "トップページへ戻る",
    contactNote: "通常1〜2営業日以内にご返信いたします。",
  },
};

const INVESTOR_EN: InvestorPageContent = {
  seo: {
    metaTitle: "For Investors & Partners | Eldonia-Nex",
    metaDescription:
      "Business overview, revenue model, growth strategy, exit options, and investment benefits for Eldonia-Nex — an integrated creator economy platform.",
  },
  hero: {
    eyebrow: "For Investors & Partners",
    title: "One Nexus for the creator economy loop",
    lead:
      "Eldonia-Nex integrates publishing, jobs, commerce, events, and community for illustrators, VTubers, and game creators. We grow with creator success — not ad dependency.",
  },
  vision: {
    title: "Vision",
    quote: "From creation online to physical presence — and into shared prosperity.",
    body:
      "Eldonia-Nex begins as a creator platform and expands through GPU infrastructure, physical Nexus locations, offline access, and disaster-response robotics. The long-term goal is to return platform value through super basic income so everyone can participate.",
  },
  horizon: {
    title: "The Eldonia-Nex Horizon",
    lead:
      "Starting with a richer platform, we scale participation, infrastructure, physical presence, and social returns in sequence.",
    targetLabel: "Target period",
    kpiLabel: "Target KPIs",
    disclaimer:
      "Timelines and figures are indicative targets as of today and may be revised based on market, regulatory, and funding conditions.",
    steps: [
      {
        num: "01",
        title: "Platform maturity & 10M participants",
        body:
          "Deepen all six modules and grow a global Nexus of creators, fans, and partners.",
        targetYear: "2026–2029",
        kpis: [
          "10M registered participants",
          "3M monthly active users (MAU)",
          "50K paid creators",
          "¥5B annual GMV",
        ],
      },
      {
        num: "02",
        title: "Rental GPU",
        body:
          "Offer cloud GPU rental so creators without expensive hardware can access AI production through Lab.",
        targetYear: "2029–2030",
        kpis: [
          "100K GPU rental hours/month",
          "1M AI-assisted uploads/year via Lab",
          "200K creators using GPU rental",
        ],
      },
      {
        num: "03",
        title: "Eldonia-Nex franchising",
        body:
          "Open physical Nexus spaces — like karaoke boxes or manga cafes — including underserved communities.",
        targetYear: "2030–2032",
        kpis: [
          "100 domestic Nexus locations",
          "30% focused on low-income / rural areas",
          "50K new creators/year via locations",
        ],
      },
      {
        num: "04",
        title: "USB access sphere",
        body:
          "Enable portable USB-based access to core Nexus features where internet is limited.",
        targetYear: "2031–2033",
        kpis: [
          "500K USB access kits distributed",
          "500 offline sync hubs",
          "1M new participants in access sphere",
        ],
      },
      {
        num: "05",
        title: "AI robots for disaster areas",
        body:
          "Deploy AI robots for reconnaissance, logistics, and remote support in disaster zones.",
        targetYear: "2032–2034",
        kpis: [
          "50 municipal disaster agreements",
          "200 deployable robots/year",
          "5,000 support hours/year in disaster zones",
        ],
      },
      {
        num: "06",
        title: "AI robot distribution",
        body:
          "Generalize disaster-response technology for homes, regions, and Nexus locations.",
        targetYear: "2034–2036",
        kpis: [
          "10K robots distributed or leased",
          "500 robots at Nexus locations",
          "200 education / welfare programs",
        ],
      },
      {
        num: "07",
        title: "Super basic income",
        body:
          "Return economic value from the platform, infrastructure, and franchise network to participants.",
        targetYear: "2036+",
        kpis: [
          "¥10B/year return pool (target scale)",
          "100K pilot participants",
          "50 regional communities in pilot",
        ],
      },
    ],
    closing:
      "Each phase builds on the last, scaling from creator economy to social infrastructure.",
  },
  governance: {
    title: "Legal & Governance",
    lead:
      "We build compliance and transparency ahead of large-scale phases — franchising, robotics, and super basic income.",
    items: [
      {
        title: "Franchise rollout",
        body:
          "Proper franchise agreements (including applicable franchise laws), privacy compliance, and local fire/building/telecom rules. Clear partner criteria and anti-organized-crime clauses in contracts.",
      },
      {
        title: "Super basic income",
        body:
          "Accounting treatment and disclosure of return pools, conflict-of-interest controls, and tax/social-security design with experts. Pilots start with limited scope, amount, and frequency — with accountability to investors, participants, and regional partners.",
      },
      {
        title: "AI robots & disaster support",
        body:
          "Product safety, data handling, and liability boundaries (municipality, operator, tech partner) defined in agreements. Deployment protocols and ethics guidelines prioritize human safety.",
      },
      {
        title: "USB & offline access",
        body:
          "Media security (encryption, updates), copyright/licensing, and abuse prevention via tech and terms. Clear rules for offline and sync-time personal data.",
      },
      {
        title: "Governance structure",
        body:
          "KPI review and risk assessment at each phase transition. External audit, legal advisors, and regional partner councils to ensure transparent decision-making.",
      },
    ],
    disclaimer:
      "Detailed terms, contracts, and pilot designs will be published and shared with expert review before each phase launch.",
  },
  business: {
    title: "What We Do",
    lead: "Six interconnected modules cover the full creator activity cycle.",
    moduleBadge: "Module",
    pillars: [
      { title: "Gallery", body: "Publish art with tag discovery; build portfolio credibility and funnel to Shop and Events." },
      { title: "Quest", body: "Admin-published challenges — daily login EXP, brand campaigns with cash/PC/prize rewards, portfolio records for all participants." },
      { title: "Works", body: "Portfolio hub aggregating Gallery work, Quest history, and awards." },
      { title: "Shop", body: "Fan goods and digital sales, linked from Gallery work via Stripe checkout." },
      { title: "Events", body: "VTuber streams, workshops, exhibitions — online and offline." },
      { title: "Community", body: "Forums and threads with multilingual UI for global audiences." },
      { title: "Lab & Nexus", body: "AI translation and production tools that expand reach and efficiency." },
    ],
  },
  revenue: {
    title: "Revenue Model",
    lead: "Platform revenue scales as creators earn.",
    steps: [
      { num: "01", title: "Subscriptions", body: "Creator plans — higher limits, analytics, visibility. Stable MRR foundation." },
      { num: "02", title: "Marketplace fees", body: "Take rate on Shop, Events, and sponsored brand Quests. Scales with GMV." },
      { num: "03", title: "Enterprise & sponsors", body: "Corporate Quest campaigns, brand slots, and featured placements — limited, UX-safe monetization." },
    ],
    referralTitle: "Referral Program",
    referralNote: "Referral program for paid members improves LTV/CAC through organic growth.",
  },
  market: {
    title: "Market Opportunity",
    lead: "The global creator economy keeps expanding; Japan's doujin, VTuber, and indie game culture is a unique strength.",
    points: [
      { title: "Growing creator base", body: "Side careers, freelancing, and AI tools increase demand for end-to-end platforms." },
      { title: "Tool fragmentation", body: "Creators juggle many services — integrated platforms address clear pain." },
      { title: "Japan-origin culture export", body: "Anime, games, and VTubers enable domestic and international expansion on multilingual infrastructure." },
    ],
  },
  moat: {
    title: "Competitive Edge",
    badge: "Edge",
    items: [
      { title: "Six-module integration", body: "Hard to replicate with single-purpose SNS or e-commerce alone." },
      { title: "Brand experience", body: "Consistent Dark Fantasy UI drives belonging and retention." },
      { title: "Trust data", body: "Views, ratings, transactions, and Quest history build switching costs." },
      { title: "Tech stack", body: "Next.js 16, Supabase, Stripe, Django Admin — scalable and operationally lean." },
    ],
  },
  roadmap: {
    title: "Near- to Mid-Term Execution",
    phases: [
      { phase: "Now", title: "Product foundation", body: "Launch six modules, acquire early creators, SEO and community." },
      { phase: "Next", title: "Monetization", body: "Paid plans, GMV growth in Shop/Events, referral-driven acquisition." },
      { phase: "Scale", title: "Participation growth", body: "Rapid user, transaction, and content growth; prepare GPU rental and partners." },
      { phase: "Expand", title: "Physical & social rollout", body: "Franchise pilots, offline access R&D, transition to long-term horizon phases." },
    ],
  },
  exit: {
    title: "Exit Strategy",
    lead: "We plan for multiple long-term exit paths so investors and leadership can choose flexibly.",
    badge: "Exit",
    paths: [
      { title: "Strategic M&A", body: "Acquisition by entertainment, gaming, e-commerce, or creator SaaS — integrated modules and user base as synergy." },
      { title: "IPO readiness", body: "As GMV, MRR, and MAU grow, consider listings such as TSE Growth with staged governance." },
      { title: "Spin-off & licensing", body: "Module spin-offs or white-label enterprise offerings as partial exits." },
      { title: "Dividends & returns", body: "If stable cash flow is prioritized, profit sharing and supporter return programs are viable." },
    ],
  },
  benefits: {
    title: "Why Join Early",
    items: [
      { title: "Early participation", body: "Shape product and revenue design from launch phase on favorable terms." },
      { title: "Private community", body: "Investor/supporter discussions and quarterly KPI updates." },
      { title: "Serial pin badge", body: "Numbered supporter badges (e.g. 24-01-0001) for collectors and belonging." },
      { title: "Priority perks", body: "Future returns, event invites, and feature access by support tier." },
      { title: "Network access", body: "Early connections with creators, partners, and media as co-builders." },
    ],
  },
  categories: {
    title: "Support Categories",
    lead: "Choose the level of involvement that fits your goals.",
    items: [
      { num: "01", label: "Investor", description: "Capital and equity/convertible investment with optional strategic input." },
      { num: "02", label: "Partner", description: "Co-build through tech, infra, distribution, or media partnerships." },
      { num: "03", label: "Advisor", description: "Industry, legal, finance, or marketing advisory roles." },
      { num: "04", label: "Media", description: "Coverage, features, and creator introductions for awareness." },
      { num: "05", label: "Community", description: "Early user community and ambassador support." },
    ],
  },
  risks: {
    title: "Key Risks & Mitigations",
    items: [
      { title: "Competition", body: "Differentiate through integrated UX and brand, not single modules alone." },
      { title: "Creator acquisition", body: "Referrals, Quests, events, SEO, and community in parallel." },
      { title: "Regulatory & payments", body: "Stripe compliance, policies, and Django Admin operational oversight." },
    ],
  },
  faq: {
    title: "FAQ",
    items: [
      { q: "Is there a minimum investment?", a: "It varies by category. Contact us to discuss individually." },
      { q: "Can we sign an NDA?", a: "Yes — before sharing detailed financials and KPI materials." },
      { q: "Do you accept international investors?", a: "Yes. Materials and meetings in English are available." },
      { q: "Do you have a pitch deck?", a: "Shared with interested investors/partners after NDA." },
    ],
  },
  cta: {
    title: "Get in Touch",
    lead: "For overview materials or meetings, use the contact form. Please include “Investment inquiry” in the subject.",
    primary: "Contact us",
    secondary: "Back to home",
    contactNote: "We typically respond within 1–2 business days.",
  },
};

export const INVESTOR_CONTENT: Record<UiLocale, InvestorPageContent> = {
  ja: INVESTOR_JA,
  en: INVESTOR_EN,
  ko: INVESTOR_EN,
  "zh-CN": INVESTOR_EN,
};

export function getInvestorContent(locale: UiLocale): InvestorPageContent {
  return INVESTOR_CONTENT[locale] ?? INVESTOR_JA;
}
