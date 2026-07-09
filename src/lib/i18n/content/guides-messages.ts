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
    lead: "Eldonia-Nex を始めるための基本的な流れをご案内します。",
    sections: [
      {
        title: "1. アカウントを作成する",
        steps: [
          "トップページの「新規登録」からメールアドレスとパスワードを入力",
          "確認メールが届いた場合はリンクをクリックして登録完了",
          "ログイン後、ダッシュボードからプロフィールを設定",
        ],
        link: { href: "/auth/signup", label: "新規登録へ" },
      },
      {
        title: "2. プロフィールを整える",
        steps: [
          "ダッシュボード → プロフィール編集を開く",
          "表示名・ユーザー名（@handle）・自己紹介を入力",
          "クリエイターとして活動する場合はチェックをオン",
        ],
        link: { href: "/settings#basics", label: "プロフィール編集へ" },
      },
      {
        title: "3. 作品を GALLERY に投稿する",
        steps: [
          "ギャラリー →「作品を投稿」をクリック",
          "画像・動画・音声・PDF をアップロード",
          "タイトル・説明・タグを入力して投稿（画像は種別を変更可能）",
        ],
        link: { href: "/settings/post/artwork", label: "作品投稿へ" },
      },
      {
        title: "4. 困ったときはサポートへ",
        steps: [
          "まず FAQ で同様の事例がないか確認",
          "解決しない場合はお問い合わせフォームからチケット作成",
          "ログイン済みならマイチケットで進捗確認・追加返信が可能",
        ],
        link: { href: "/help/contact", label: "お問い合わせへ" },
      },
    ],
  },
  en: {
    title: "Guides",
    lead: "A step-by-step path to get started on Eldonia-Nex.",
    sections: [
      {
        title: "1. Create an account",
        steps: [
          "Sign up from the home page with email and password",
          "Confirm your email if a verification link is sent",
          "After login, set up your profile from the dashboard",
        ],
        link: { href: "/auth/signup", label: "Go to sign up" },
      },
      {
        title: "2. Set up your profile",
        steps: [
          "Open Dashboard → Profile",
          "Add display name, @handle, and bio",
          "Enable creator mode if you plan to sell or post works",
        ],
        link: { href: "/settings#basics", label: "Edit profile" },
      },
      {
        title: "3. Post to GALLERY",
        steps: [
          "Open GALLERY → Post artwork",
          "Upload image, video, audio, or PDF",
          "Add title, description, and tags (image type can be changed)",
        ],
        link: { href: "/settings/post/artwork", label: "Post artwork" },
      },
      {
        title: "4. Need help?",
        steps: [
          "Check FAQ for similar issues",
          "Open a ticket via the contact form if unresolved",
          "When logged in, follow up in My Tickets",
        ],
        link: { href: "/help/contact", label: "Contact support" },
      },
    ],
  },
  ko: {
    title: "가이드",
    lead: "Eldonia-Nex 시작을 위한 기본 단계입니다.",
    sections: [
      {
        title: "1. 계정 만들기",
        steps: [
          "홈에서 이메일·비밀번호로 가입",
          "확인 메일이 오면 링크 클릭",
          "로그인 후 대시보드에서 프로필 설정",
        ],
        link: { href: "/auth/signup", label: "가입하기" },
      },
      {
        title: "2. 프로필 설정",
        steps: [
          "대시보드 → 프로필 편집",
          "표시 이름·@handle·소개 입력",
          "크리에이터 활동 시 체크",
        ],
        link: { href: "/settings#basics", label: "프로필 편집" },
      },
      {
        title: "3. GALLERY에 작품 게시",
        steps: [
          "GALLERY → 작품 게시",
          "이미지·영상·음성·PDF 업로드",
          "제목·설명·태그 입력",
        ],
        link: { href: "/settings/post/artwork", label: "작품 게시" },
      },
      {
        title: "4. 도움이 필요할 때",
        steps: [
          "FAQ에서 유사 사례 확인",
          "해결되지 않으면 문의 양식",
          "로그인 시 내 티켓에서 진행 확인",
        ],
        link: { href: "/help/contact", label: "문의하기" },
      },
    ],
  },
  "zh-CN": {
    title: "使用指南",
    lead: "Eldonia-Nex 入门基本流程。",
    sections: [
      {
        title: "1. 创建账户",
        steps: [
          "在首页用邮箱与密码注册",
          "收到确认邮件后点击链接",
          "登录后在控制台设置资料",
        ],
        link: { href: "/auth/signup", label: "前往注册" },
      },
      {
        title: "2. 完善资料",
        steps: [
          "控制台 → 编辑资料",
          "填写显示名、@handle、简介",
          "创作者请开启相应选项",
        ],
        link: { href: "/settings#basics", label: "编辑资料" },
      },
      {
        title: "3. 发布到 GALLERY",
        steps: [
          "GALLERY → 发布作品",
          "上传图像/视频/音频/PDF",
          "填写标题、说明与标签",
        ],
        link: { href: "/settings/post/artwork", label: "发布作品" },
      },
      {
        title: "4. 需要帮助",
        steps: [
          "先查 FAQ",
          "无法解决则提交工单",
          "登录后可在我的工单跟进",
        ],
        link: { href: "/help/contact", label: "联系支持" },
      },
    ],
  },
};
