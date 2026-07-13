import type { UiLocale } from "@/lib/i18n/locale";

export type GuideSection = {
  title: string;
  steps: string[];
  link: { href: string; label: string };
};

export type GuidesContent = {
  title: string;
  lead: string;
  sections: GuideSection[];
};

export const GUIDES_CONTENT: Record<UiLocale, GuidesContent> = {
  ja: {
    title: "利用ガイド",
    lead: "アカウント作成から Gallery・Shop・Lab・Works までの基本的な使い方です。",
    sections: [
      {
        title: "1. アカウントを作成する",
        steps: [
          "トップまたは「新規登録」からメールアドレスとパスワードを入力（OAuth も可）",
          "確認メールが届いた場合はリンクを開いて登録を完了",
          "ログイン後、必要に応じて料金プランを選択",
        ],
        link: { href: "/auth/signup", label: "新規登録へ" },
      },
      {
        title: "2. プロフィールを整える",
        steps: [
          "設定（/settings）の「基本情報」を開く",
          "表示名・ユーザー名（@handle）・自己紹介・アバターを入力",
          "クリエイターとして活動する場合は該当オプションをオン",
        ],
        link: { href: "/settings#basics", label: "プロフィール編集へ" },
      },
      {
        title: "3. 作品を GALLERY に投稿する",
        steps: [
          "設定 → 投稿 →「作品を投稿」、または Gallery の投稿導線を開く",
          "画像・動画・音声・PDF・3D（GLB/GLTF）などをアップロード",
          "タイトル・説明・公開設定を確認して投稿（必要ならサムネイルを設定）",
        ],
        link: { href: "/settings/post/artwork", label: "作品投稿へ" },
      },
      {
        title: "4. 作品を Shop に出す",
        steps: [
          "有料プラン（Standard 以上）で Shop 出品が可能です",
          "設定 → 投稿 →「商品を登録」から新規出品、または Gallery 作品詳細の「Shop で販売」から作品を商品化",
          "価格・在庫（物販）・ダウンロード用ファイル（デジタル）・カバー画像を設定して公開",
          "¥0 の無料配布も登録できます。有料販売は Stripe 決済になります",
        ],
        link: { href: "/settings/post/product", label: "商品登録へ" },
      },
      {
        title: "5. Lab の使い方",
        steps: [
          "Lab は共同制作ルームです。コラボ申請が作者に承認されるとチームと Lab ルームが作成されます",
          "Lab 一覧（/lab）から参加中のルームを開き、チャット・アセット共有などで制作を進めます",
          "成果は Gallery / Shop / Events / Works などへ展開できます",
        ],
        link: { href: "/lab", label: "LAB へ" },
      },
      {
        title: "6. コラボ申請の方法・手順",
        steps: [
          "Gallery でコラボしたい作品の詳細ページを開く",
          "「コラボ申請」からメッセージや希望役割を送る",
          "作品の作者が承認するとチームが結成され、Lab ルームが利用可能になります",
          "拒否・保留の場合は通知やステータスで確認できます。マナーを守り、権利・クレジットは事前に合意しましょう",
        ],
        link: { href: "/gallery", label: "GALLERY へ" },
      },
      {
        title: "7. Works の使い方（仕事・募集）",
        steps: [
          "Works（/works）で Quest（制作依頼・協業募集）の一覧を閲覧できます",
          "興味のある Quest を開き、参加・応募の手順に沿ってエントリーします",
          "依頼側・管理者は Works の管理画面から Quest を作成・公開できます（権限がある場合）",
          "コラボ募集と Gallery からのコラボ申請は併用できます。条件・報酬・納期は Quest 説明をよく読んでください",
        ],
        link: { href: "/works", label: "WORKS へ" },
      },
      {
        title: "8. 困ったときはサポートへ",
        steps: [
          "まず FAQ・本ガイドで同様の事例がないか確認",
          "解決しない場合はお問い合わせフォームからチケット作成",
          "ログイン済みならマイチケットで進捗確認・追加返信が可能",
        ],
        link: { href: "/help/contact", label: "お問い合わせへ" },
      },
    ],
  },
  en: {
    title: "Guides",
    lead: "From signup to Gallery, Shop, Lab, and Works — the basics.",
    sections: [
      {
        title: "1. Create an account",
        steps: [
          "Sign up with email/password (or OAuth) from the home page",
          "Open the verification link if an email is sent",
          "After login, choose a plan if needed",
        ],
        link: { href: "/auth/signup", label: "Go to sign up" },
      },
      {
        title: "2. Set up your profile",
        steps: [
          "Open Settings (/settings) → Basics",
          "Add display name, @handle, bio, and avatar",
          "Enable creator options if you plan to publish or sell",
        ],
        link: { href: "/settings#basics", label: "Edit profile" },
      },
      {
        title: "3. Post to GALLERY",
        steps: [
          "Settings → Post → Artwork, or use Gallery’s post flow",
          "Upload image, video, audio, PDF, or 3D (GLB/GLTF)",
          "Add title, description, visibility (and thumbnail if required)",
        ],
        link: { href: "/settings/post/artwork", label: "Post artwork" },
      },
      {
        title: "4. List a work on Shop",
        steps: [
          "Shop listing requires a paid plan (Standard or higher)",
          "Settings → Post → Product, or use “Sell on Shop” on a Gallery artwork",
          "Set price, stock (physical), download file (digital), and cover, then publish",
          "¥0 free downloads are allowed; paid sales use Stripe checkout",
        ],
        link: { href: "/settings/post/product", label: "Register a product" },
      },
      {
        title: "5. How to use Lab",
        steps: [
          "Lab is a collab studio. When a collab proposal is accepted, a team and Lab room are created",
          "Open /lab to enter your rooms and work via chat, assets, and shared tools",
          "Ship outcomes to Gallery, Shop, Events, or Works",
        ],
        link: { href: "/lab", label: "Open LAB" },
      },
      {
        title: "6. Collab proposals — how it works",
        steps: [
          "Open the Gallery artwork you want to collaborate on",
          "Send a collab proposal with your message and preferred role",
          "When the author accepts, a team forms and the Lab room becomes available",
          "Check notifications/status if pending or declined. Agree on rights and credits up front",
        ],
        link: { href: "/gallery", label: "Open GALLERY" },
      },
      {
        title: "7. How to use Works (jobs & quests)",
        steps: [
          "Browse Quests (commissions / collab calls) on /works",
          "Open a Quest and follow the participate/apply steps",
          "Requesters/admins with permission can create Quests from Works manage",
          "Works Quests can sit alongside Gallery collab proposals — read reward, scope, and deadlines carefully",
        ],
        link: { href: "/works", label: "Open WORKS" },
      },
      {
        title: "8. Need help?",
        steps: [
          "Check FAQ and these guides first",
          "Open a ticket via the contact form if unresolved",
          "When logged in, follow up in My Tickets",
        ],
        link: { href: "/help/contact", label: "Contact support" },
      },
    ],
  },
  ko: {
    title: "가이드",
    lead: "가입부터 Gallery·Shop·Lab·Works까지의 기본 사용법입니다.",
    sections: [
      {
        title: "1. 계정 만들기",
        steps: [
          "홈에서 이메일·비밀번호(또는 OAuth)로 가입",
          "확인 메일이 오면 링크를 열어 완료",
          "로그인 후 필요 시 요금 플랜 선택",
        ],
        link: { href: "/auth/signup", label: "가입하기" },
      },
      {
        title: "2. 프로필 설정",
        steps: [
          "설정(/settings) → 기본 정보",
          "표시 이름·@handle·소개·아바타 입력",
          "크리에이터 활동 시 옵션 켜기",
        ],
        link: { href: "/settings#basics", label: "프로필 편집" },
      },
      {
        title: "3. GALLERY에 작품 게시",
        steps: [
          "설정 → 게시 → 작품, 또는 Gallery 게시 흐름",
          "이미지·영상·음성·PDF·3D(GLB/GLTF) 업로드",
          "제목·설명·공개 설정(필요 시 썸네일) 후 게시",
        ],
        link: { href: "/settings/post/artwork", label: "작품 게시" },
      },
      {
        title: "4. 작품을 Shop에 올리기",
        steps: [
          "Shop 출품은 유료 플랜(Standard 이상)에서 가능",
          "설정 → 게시 → 상품 등록, 또는 Gallery 작품의 ‘Shop에서 판매’",
          "가격·재고(실물)·다운로드 파일(디지털)·커버 설정 후 공개",
          "¥0 무료 배포 가능, 유료는 Stripe 결제",
        ],
        link: { href: "/settings/post/product", label: "상품 등록" },
      },
      {
        title: "5. Lab 사용법",
        steps: [
          "Lab은 공동 제작 룸입니다. 콜라보 신청이 승인되면 팀과 Lab이 생성됩니다",
          "/lab에서 참여 중 룸을 열고 채팅·에셋 공유로 진행",
          "결과물은 Gallery·Shop·Events·Works로 전개할 수 있습니다",
        ],
        link: { href: "/lab", label: "LAB 열기" },
      },
      {
        title: "6. 콜라보 신청 방법·절차",
        steps: [
          "Gallery에서 원하는 작품 상세를 엽니다",
          "‘콜라보 신청’으로 메시지·희망 역할을 보냅니다",
          "작가가 승인하면 팀이 결성되고 Lab을 사용할 수 있습니다",
          "보류/거절은 알림·상태로 확인. 권리·크레딧은 미리 합의하세요",
        ],
        link: { href: "/gallery", label: "GALLERY 열기" },
      },
      {
        title: "7. Works 사용법(일·모집)",
        steps: [
          "/works에서 Quest(제작 의뢰·협업 모집) 목록을 봅니다",
          "Quest를 열고 참여·지원 절차를 따릅니다",
          "권한이 있으면 Works 관리에서 Quest를 만들 수 있습니다",
          "Gallery 콜라보 신청과 병행 가능 — 보상·범위·기한을 확인하세요",
        ],
        link: { href: "/works", label: "WORKS 열기" },
      },
      {
        title: "8. 도움이 필요할 때",
        steps: [
          "FAQ와 본 가이드 확인",
          "해결되지 않으면 문의 양식",
          "로그인 시 내 티켓에서 진행 확인",
        ],
        link: { href: "/help/contact", label: "문의하기" },
      },
    ],
  },
  "zh-CN": {
    title: "使用指南",
    lead: "从注册到 Gallery、Shop、Lab、Works 的基本用法。",
    sections: [
      {
        title: "1. 创建账户",
        steps: [
          "在首页用邮箱密码（或 OAuth）注册",
          "如收到确认邮件，打开链接完成注册",
          "登录后按需选择方案",
        ],
        link: { href: "/auth/signup", label: "前往注册" },
      },
      {
        title: "2. 完善资料",
        steps: [
          "打开设置（/settings）→ 基本信息",
          "填写显示名、@handle、简介与头像",
          "若作为创作者发布/销售，请开启相应选项",
        ],
        link: { href: "/settings#basics", label: "编辑资料" },
      },
      {
        title: "3. 发布到 GALLERY",
        steps: [
          "设置 → 发布 → 作品，或使用 Gallery 发布入口",
          "上传图片/视频/音频/PDF/3D（GLB/GLTF）",
          "填写标题、说明、公开设置（必要时添加缩略图）后发布",
        ],
        link: { href: "/settings/post/artwork", label: "发布作品" },
      },
      {
        title: "4. 将作品放到 Shop",
        steps: [
          "Shop 上架需要付费方案（Standard 及以上）",
          "设置 → 发布 → 登记商品，或在 Gallery 作品页使用「在 Shop 销售」",
          "设置价格、库存（实体）、下载文件（数字）、封面后发布",
          "支持 ¥0 免费发放；付费销售走 Stripe 结账",
        ],
        link: { href: "/settings/post/product", label: "登记商品" },
      },
      {
        title: "5. Lab 用法",
        steps: [
          "Lab 是协作工作室。协作申请被作者通过后，会创建团队与 Lab 房间",
          "在 /lab 打开参与中的房间，通过聊天与资源共享推进创作",
          "成果可发布到 Gallery / Shop / Events / Works",
        ],
        link: { href: "/lab", label: "打开 LAB" },
      },
      {
        title: "6. 协作申请方法与步骤",
        steps: [
          "打开想协作的 Gallery 作品详情",
          "通过「协作申请」发送留言与期望角色",
          "作者通过后组建团队，并可使用 Lab 房间",
          "待处理/拒绝可在通知或状态中查看。请事先约定权利与署名",
        ],
        link: { href: "/gallery", label: "打开 GALLERY" },
      },
      {
        title: "7. Works 用法（工作与招募）",
        steps: [
          "在 /works 浏览 Quest（委托/协作招募）",
          "打开 Quest 并按参与/应征流程操作",
          "有权限时可在 Works 管理中创建 Quest",
          "可与 Gallery 协作申请并用 — 请仔细阅读报酬、范围与期限",
        ],
        link: { href: "/works", label: "打开 WORKS" },
      },
      {
        title: "8. 需要帮助",
        steps: [
          "先查阅 FAQ 与本指南",
          "仍无法解决则提交工单",
          "登录后可在我的工单跟进",
        ],
        link: { href: "/help/contact", label: "联系支持" },
      },
    ],
  },
};
