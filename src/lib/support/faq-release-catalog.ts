import type { UiLocale } from "@/lib/i18n/locale";

export type FaqReleaseArticle = {
  id: string;
  category: string;
  sortOrder: number;
  question: Record<UiLocale, string>;
  answer: Record<UiLocale, string>;
};

/**
 * Production FAQ — Layer 1 source of truth (ja/en/ko/zh-CN).
 * Keep in sync with plan catalog, referral policy, gallery formats, SLA.
 */
export const FAQ_RELEASE_ARTICLES: FaqReleaseArticle[] = [
  {
    id: "faq-what-is",
    category: "getting_started",
    sortOrder: 1,
    question: {
      ja: "Eldonia-Nex とは何ですか？",
      en: "What is Eldonia-Nex?",
      ko: "Eldonia-Nex란 무엇인가요?",
      "zh-CN": "什么是 Eldonia-Nex？",
    },
    answer: {
      ja: "Eldonia-Nex（エルドニア・ネクス）は、クリエイターとファンのための創作プラットフォームです。Gallery で作品を公開し、Lab で共同制作し、Shop で販売し、Events でチケット付きの催しを開き、Community で交流し、Works で Quest（制作依頼・協業）に挑戦できます。多言語表示と活動の可視化（EXP 等）を通じて、創作が次の機会や収益につながる Nexus を目指しています。",
      en: "Eldonia-Nex is a creation platform for creators and fans. Publish in Gallery, collaborate in Lab, sell in Shop, host ticketed Events, talk in Community, and take on Quests in Works. With multilingual display and visible activity (such as EXP), we aim for a Nexus where creation leads to the next opportunity and revenue.",
      ko: "Eldonia-Nex는 크리에이터와 팬을 위한 창작 플랫폼입니다. Gallery에서 작품을 공개하고, Lab에서 공동 제작하며, Shop에서 판매하고, Events에서 티켓 행사를 열고, Community에서 교류하며, Works에서 Quest(제작 의뢰·협업)에 도전할 수 있습니다. 다국어 표시와 활동 가시화(EXP 등)를 통해 창작이 다음 기회와 수익으로 이어지는 Nexus를 지향합니다.",
      "zh-CN":
        "Eldonia-Nex 是面向创作者与粉丝的创作平台。可在 Gallery 发布作品、在 Lab 协作、在 Shop 销售、在 Events 举办带票活动、在 Community 交流，并在 Works 挑战 Quest（委托与协作）。通过多语言展示与活动可视化（如 EXP），目标是让创作通向下一次机会与收益的 Nexus。",
    },
  },
  {
    id: "faq-free-signup",
    category: "getting_started",
    sortOrder: 2,
    question: {
      ja: "アカウント登録は無料ですか？",
      en: "Is account registration free?",
      ko: "계정 등록은 무료인가요?",
      "zh-CN": "注册账号免费吗？",
    },
    answer: {
      ja: "はい。Free プランでアカウントを作成でき、作品公開（上限あり）やコミュニティ参加など基本機能を利用できます。より多くの公開枠・Shop・イベント主催・Works などは Standard / Premium / Business の有料プランで拡張できます。プランの詳細は設定の「料金プラン」またはサインアップ時のプラン選択をご確認ください。",
      en: "Yes. You can create an account on the Free plan and use core features such as publishing (with limits) and Community. Unlimited publishing, Shop, event hosting, Works, and more are available on Standard, Premium, or Business. See Plans in Settings or during signup.",
      ko: "네. Free 플랜으로 계정을 만들고 작품 공개(한도 있음)·커뮤니티 등 기본 기능을 이용할 수 있습니다. 더 많은 공개·Shop·이벤트 주최·Works 등은 Standard / Premium / Business 유료 플랜에서 확장됩니다. 상세는 설정의 요금 플랜 또는 가입 시 플랜 선택을 확인하세요.",
      "zh-CN":
        "可以。使用 Free 方案即可注册，并使用作品发布（有上限）、社区等基础功能。更多发布额度、Shop、活动主办、Works 等可通过 Standard / Premium / Business 付费方案扩展。详情见设置中的「方案」或注册时的方案选择。",
    },
  },
  {
    id: "faq-plans",
    category: "billing",
    sortOrder: 1,
    question: {
      ja: "料金プランには何がありますか？",
      en: "What plans are available?",
      ko: "요금 플랜에는 어떤 것이 있나요?",
      "zh-CN": "有哪些收费方案？",
    },
    answer: {
      ja: "主なプランは次のとおりです（税込表示の目安。最新は設定の料金プランをご確認ください）。\n\n・Free（¥0/月）: 作品公開（3点まで）、コミュニティ、基本プロフィール\n・Standard（¥800/月）: 無制限公開、Shop（手数料5%）、イベント参加・主催、カスタムプロフィール\n・Premium（¥2,980/月）: Standard のすべて、Shop 手数料3%、Works の依頼・応募、分析、優先サポート\n・Business（¥10,000/月）: 法人・チーム向け。導入はお問い合わせ\n\n有料プランの支払いは Stripe 等の決済を利用します。料金・特典は告知により調整される場合があります。",
      en: "Main plans (indicative; confirm in Settings → Plans):\n\n· Free (¥0/mo): publish up to 3 works, Community, basic profile\n· Standard (¥800/mo): unlimited publishing, Shop (5% fee), join/host events, custom profile\n· Premium (¥2,980/mo): everything in Standard, Shop 3% fee, Works requests/applications, analytics, priority support\n· Business (¥10,000/mo): teams/orgs — contact us\n\nPaid plans use Stripe (or similar). Fees and benefits may be adjusted with notice.",
      ko: "주요 플랜은 다음과 같습니다(안내 기준, 최신은 설정→요금 플랜 확인).\n\n· Free(¥0/월): 작품 공개 최대 3점, 커뮤니티, 기본 프로필\n· Standard(¥800/월): 무제한 공개, Shop(수수료 5%), 이벤트 참가·주최, 커스텀 프로필\n· Premium(¥2,980/월): Standard 전부, Shop 3%, Works 의뢰·지원, 분석, 우선 지원\n· Business(¥10,000/월): 법인·팀 — 문의\n\n유료 결제는 Stripe 등을 사용합니다. 요금·특전은 공지로 조정될 수 있습니다.",
      "zh-CN":
        "主要方案如下（仅供参考，请以设置→方案为准）：\n\n· Free（¥0/月）：最多发布 3 件作品、社区、基础资料\n· Standard（¥800/月）：无限发布、Shop（手续费 5%）、参加/主办活动、自定义资料\n· Premium（¥2,980/月）：含 Standard 全部、Shop 3%、Works 委托/应征、分析、优先支持\n· Business（¥10,000/月）：团队/企业 — 请联系我们\n\n付费方案通过 Stripe 等结算。资费与权益可能经公告调整。",
    },
  },
  {
    id: "faq-revenue",
    category: "getting_started",
    sortOrder: 3,
    question: {
      ja: "クリエイターはどうやって収益を得られますか？",
      en: "How can creators earn revenue?",
      ko: "크리에이터는 어떻게 수익을 얻나요?",
      "zh-CN": "创作者如何获得收益？",
    },
    answer: {
      ja: "主な収益の柱は次のとおりです。\n\n・Shop: デジタル商品・グッズ等の販売（有料プランで出品。手数料は Standard 5% / Premium・Business 3%）\n・Events: 有料チケットの販売（無料チケットも発行可）\n・Works / Quest: 制作依頼・協業の報酬\n・紹介プログラム: 有料会員が条件を満たす紹介で還元（詳細は紹介 FAQ・利用規約）\n\n実績は EXP やポートフォリオ等で可視化され、次の依頼・販売につながります。出金・本人確認が必要な場合があります。",
      en: "Main ways to earn:\n\n· Shop: sell digital goods and merch (paid plans; fees Standard 5% / Premium & Business 3%)\n· Events: sell paid tickets (free tickets also available)\n· Works / Quests: commissions and collab payouts\n· Referral program: paid members may earn referral fees when conditions are met (see referral FAQ and Terms)\n\nEXP and portfolios help surface credibility for the next job or sale. Payouts may require identity verification.",
      ko: "주요 수익 축은 다음과 같습니다.\n\n· Shop: 디지털 상품·굿즈 판매(유료 플랜, 수수료 Standard 5% / Premium·Business 3%)\n· Events: 유료 티켓 판매(무료 티켓도 가능)\n· Works / Quest: 제작 의뢰·협업 보수\n· 소개 프로그램: 유료 회원이 조건을 충족하면 환원(소개 FAQ·약관 참고)\n\nEXP·포트폴리오로 실적이 보이며 다음 의뢰·판매로 이어집니다. 지급에는 본인 확인이 필요할 수 있습니다.",
      "zh-CN":
        "主要收益方式：\n\n· Shop：销售数字商品与周边（付费方案；手续费 Standard 5% / Premium与Business 3%）\n· Events：销售付费门票（也可发放免费票）\n· Works / Quest：委托与协作报酬\n· 推荐计划：付费会员在满足条件时可获介绍费（见介绍 FAQ 与条款）\n\nEXP 与作品集有助于展示信誉并带来下一单。打款可能需要身份核实。",
    },
  },
  {
    id: "faq-referral",
    category: "billing",
    sortOrder: 2,
    question: {
      ja: "紹介プログラム（紹介料）はどうなりますか？",
      en: "How does the referral program work?",
      ko: "소개 프로그램(소개료)은 어떻게 되나요?",
      "zh-CN": "推荐计划（介绍费）如何运作？",
    },
    answer: {
      ja: "Free 以外の有料プラン会員には、サインイン確定後に紹介コード・URL・QR が設定画面（紹介コード）で付与されます。\n\n現行の還元方針: 紹介が成立し、被紹介者の対象となる有料利用が続く場合、紹介成立から3か月目以降、日本国内向けは対象額の10%、日本以外向けは15%を還元します（「永久」は条件を満たす期間に限ります）。\n\n【重要】振込先（銀行口座等）が設定に入力されていない場合、紹介料の振込は実行できません。設定の基本情報・振込先項目を登録してください。本人確認や税務上の情報が追加で必要な場合もあります。\n\n自作自演・循環紹介などの不正は禁止で、還元取消やアカウント措置の対象です。詳細は利用規約の紹介料条項と設定画面の表示を優先してください。",
      en: "Non-Free paid members receive a referral code, URL, and QR in Settings after confirmed sign-in.\n\nCurrent policy: after a successful referral, from the third month onward while the referred user’s qualifying paid use continues, Japan referrals earn 10% and international referrals earn 15% of the defined base (“perpetual” only while conditions are met).\n\n[Important] Referral fee transfers cannot be made if you have not entered payout bank details in Settings. Register your payout information under Settings. Identity or tax information may also be required.\n\nSelf-referrals and similar abuse are prohibited and may void fees or lead to account action. The Terms and Settings display take precedence.",
      ko: "Free가 아닌 유료 플랜 회원은 로그인 확정 후 설정(소개 코드)에서 코드·URL·QR을 받습니다.\n\n현행 방침: 소개가 성립하고 피소개자의 대상 유료 이용이 이어지면, 성립 후 3개월째부터 국내 10%·해외 15%를 환원합니다(‘영구’는 조건 충족 기간에 한함).\n\n[중요] 설정에 입금 계좌(이체처)가 입력되어 있지 않으면 소개료 이체를 실행할 수 없습니다. 설정의 기본 정보·이체처를 등록하세요. 본인 확인·세무 정보가 추가로 필요할 수 있습니다.\n\n자작·순환 소개 등 부정은 금지이며 환원 취소·계정 조치 대상입니다. 약관과 설정 표시가 우선합니다.",
      "zh-CN":
        "非 Free 的付费会员在确认登录后，可在设置（推荐码）获得推荐码、链接与二维码。\n\n现行方针：推荐成功且被推荐人持续产生符合条件的付费使用时，自第3个月起国内 10%、海外 15% 返还（“永久”仅在满足条件期间）。\n\n【重要】若未在设置中填写收款账户（汇款信息），将无法执行介绍费汇款。请在设置中登记收款信息。可能还需身份或税务信息。\n\n禁止自推自介等作弊，可能导致取消返还或账户处理。以条款与设置页显示为准。",
    },
  },
  {
    id: "faq-login",
    category: "account",
    sortOrder: 1,
    question: {
      ja: "ログインできない場合はどうすればよいですか？",
      en: "What should I do if I cannot log in?",
      ko: "로그인할 수 없으면 어떻게 하나요?",
      "zh-CN": "无法登录时怎么办？",
    },
    answer: {
      ja: "メールアドレスとパスワードが正しいか、大文字・小文字や全角・半角の違いをご確認ください。パスワードをお忘れの場合は、ログイン画面の「パスワードをお忘れの方」から再設定メールを送信できます。OAuth（Google / Discord / X 等）で登録した場合は、同じ方法でログインしてください。解決しない場合はお問い合わせフォームから「アカウント」カテゴリでご連絡ください。",
      en: "Check that your email and password are correct, including letter case and full-width/half-width characters. If you forgot your password, use “Forgot password” on the login page to receive a reset email. If you signed up with OAuth (Google / Discord / X, etc.), use the same method. If it still fails, contact Support under Account.",
      ko: "이메일과 비밀번호가 맞는지, 대소문자·전각/반각을 확인하세요. 비밀번호를 잊었다면 로그인 화면의 ‘비밀번호를 잊으셨나요’에서 재설정 메일을 보낼 수 있습니다. OAuth(Google / Discord / X 등)로 가입했다면 같은 방법으로 로그인하세요. 해결되지 않으면 문의에서 ‘계정’ 카테고리로 연락해 주세요.",
      "zh-CN":
        "请确认邮箱与密码正确，注意大小写及全角/半角。若忘记密码，可在登录页使用「忘记密码」发送重置邮件。若使用 OAuth（Google / Discord / X 等）注册，请用相同方式登录。仍无法解决时，请通过联系表单选择「账户」类别联系支持。",
    },
  },
  {
    id: "faq-profile",
    category: "account",
    sortOrder: 2,
    question: {
      ja: "プロフィールはどこで編集できますか？",
      en: "Where can I edit my profile?",
      ko: "프로필은 어디서 편집하나요?",
      "zh-CN": "在哪里编辑个人资料？",
    },
    answer: {
      ja: "ログイン後、設定（/settings）の「基本情報」から、表示名・ユーザー名・自己紹介・アバターなどを編集できます。旧ダッシュボードのプロフィール編集は設定へ統合されています。",
      en: "After logging in, open Settings (/settings) → Basics to edit display name, username, bio, avatar, and more. Legacy dashboard profile editing redirects to Settings.",
      ko: "로그인 후 설정(/settings)의 ‘기본 정보’에서 표시 이름·사용자 이름·소개·아바타 등을 편집할 수 있습니다. 예전 대시보드 프로필 편집은 설정으로 통합되었습니다.",
      "zh-CN":
        "登录后，在设置（/settings）的「基本信息」中可编辑显示名、用户名、简介、头像等。原仪表盘资料编辑已合并到设置。",
    },
  },
  {
    id: "faq-formats",
    category: "gallery",
    sortOrder: 1,
    question: {
      ja: "作品はどのような形式で投稿できますか？",
      en: "What formats can I upload for artworks?",
      ko: "작품은 어떤 형식으로 올릴 수 있나요?",
      "zh-CN": "作品可以上传哪些格式？",
    },
    answer: {
      ja: "対応形式の例は次のとおりです。\n\n・画像: JPEG / PNG / GIF / WebP（端末により HEIC 等）\n・動画: MP4 / MOV / WebM\n・音声: MP3 / WAV / FLAC / M4A\n・文書: PDF\n・3D: GLB / GLTF\n\n目安の上限: 通常ファイル約50MB、3Dモデル約100MB、サムネイル約5MB。投稿は設定の投稿ハブ、または Gallery の投稿導線から行えます。非ビジュアル作品ではサムネイルが必要な場合があります。",
      en: "Supported formats include:\n\n· Images: JPEG / PNG / GIF / WebP (HEIC on some devices)\n· Video: MP4 / MOV / WebM\n· Audio: MP3 / WAV / FLAC / M4A\n· Documents: PDF\n· 3D: GLB / GLTF\n\nTypical limits: ~50MB for most files, ~100MB for 3D, ~5MB for thumbnails. Post from Settings → Post hub or Gallery. Non-visual works may require a thumbnail.",
      ko: "지원 형식 예:\n\n· 이미지: JPEG / PNG / GIF / WebP(기기에 따라 HEIC 등)\n· 동영상: MP4 / MOV / WebM\n· 오디오: MP3 / WAV / FLAC / M4A\n· 문서: PDF\n· 3D: GLB / GLTF\n\n대략 한도: 일반 ~50MB, 3D ~100MB, 썸네일 ~5MB. 설정의 게시 허브 또는 Gallery에서 올릴 수 있습니다. 비시각 작품은 썸네일이 필요할 수 있습니다.",
      "zh-CN":
        "支持格式包括：\n\n· 图片：JPEG / PNG / GIF / WebP（部分设备含 HEIC）\n· 视频：MP4 / MOV / WebM\n· 音频：MP3 / WAV / FLAC / M4A\n· 文档：PDF\n· 3D：GLB / GLTF\n\n大致上限：普通约 50MB、3D 约 100MB、缩略图约 5MB。可通过设置→发布中心或 Gallery 上传。非视觉作品可能需要缩略图。",
    },
  },
  {
    id: "faq-gallery-missing",
    category: "gallery",
    sortOrder: 2,
    question: {
      ja: "投稿した作品がギャラリーに表示されません",
      en: "My uploaded artwork does not appear in the Gallery",
      ko: "올린 작품이 Gallery에 보이지 않아요",
      "zh-CN": "上传的作品没有出现在 Gallery",
    },
    answer: {
      ja: "作品の公開設定がオンか、下書きのままになっていないかご確認ください。反映に数秒かかる場合があります。形式・容量上限、必須のサムネイル、プランの公開点数上限（Free は3点まで）もご確認ください。解決しない場合はお問い合わせから「GALLERY（作品）」カテゴリでご連絡ください。",
      en: "Check that the work is set to public (not a draft). It may take a few seconds to appear. Also verify format/size limits, required thumbnails, and plan publish limits (Free: up to 3). If it still fails, contact Support under Gallery.",
      ko: "공개 설정이 켜져 있는지, 초안 상태가 아닌지 확인하세요. 반영에 몇 초가 걸릴 수 있습니다. 형식·용량, 필수 썸네일, 플랜 공개 한도(Free 최대 3점)도 확인하세요. 해결되지 않으면 문의에서 ‘GALLERY’로 연락해 주세요.",
      "zh-CN":
        "请确认作品已设为公开（非草稿）。显示可能需要数秒。同时检查格式/大小、必要缩略图，以及方案发布上限（Free 最多 3 件）。仍无法解决时，请通过联系表单选择 Gallery 类别。",
    },
  },
  {
    id: "faq-payments",
    category: "billing",
    sortOrder: 3,
    question: {
      ja: "支払い方法は何が使えますか？",
      en: "What payment methods are available?",
      ko: "어떤 결제 수단을 쓸 수 있나요?",
      "zh-CN": "可以使用哪些支付方式？",
    },
    answer: {
      ja: "有料プラン、Shop の有料商品、有料イベントチケットなどは、Stripe 経由のカード決済などに対応しています（利用可能なカードブランドはチェックアウト画面の表示に従います）。¥0 のデジタル商品や無料イベントチケットは、Stripe を使わず取得できる場合があります。料金・領収の詳細は「請求・お支払い」カテゴリでお問い合わせください。",
      en: "Paid plans, paid Shop products, and paid event tickets are processed via Stripe card checkout (available brands appear on the checkout page). ¥0 digital goods and free event tickets may be obtained without Stripe. For billing questions, contact Support under Billing.",
      ko: "유료 플랜, Shop 유료 상품, 유료 이벤트 티켓 등은 Stripe 카드 결제 등을 사용합니다(사용 가능 카드는 결제 화면 표시 기준). ¥0 디지털 상품·무료 티켓은 Stripe 없이 받을 수 있는 경우가 있습니다. 요금·영수증은 ‘청구·결제’ 카테고리로 문의해 주세요.",
      "zh-CN":
        "付费方案、Shop 付费商品、付费活动门票等通过 Stripe 银行卡结账等处理（可用卡种以结账页为准）。¥0 数字商品与免费活动票可能无需 Stripe。费用与收据问题请通过「账单与支付」类别联系。",
    },
  },
  {
    id: "faq-events",
    category: "billing",
    sortOrder: 4,
    question: {
      ja: "イベントチケットはどう購入・取得しますか？",
      en: "How do I buy or get event tickets?",
      ko: "이벤트 티켓은 어떻게 구매·받나요?",
      "zh-CN": "如何购买或获取活动门票？",
    },
    answer: {
      ja: "イベント詳細ページから取得します。無料イベントは「無料チケットを取得」で即時発行されます。有料イベントはカート経由で Stripe 決済後に発行されます。取得済みチケットは「マイチケット」から確認・PDF 等の出力ができます。主催は設定の投稿からイベントを作成できます。",
      en: "Open the event page. Free events use “Get free ticket” for instant issue. Paid events go through cart and Stripe checkout before tickets are issued. View tickets under My Tickets (PDF/export where available). Hosts create events from Settings → Post.",
      ko: "이벤트 상세에서 받습니다. 무료는 ‘무료 티켓 받기’로 즉시 발급되고, 유료는 장바구니·Stripe 결제 후 발급됩니다. 받은 티켓은 ‘내 티켓’에서 확인·PDF 등 출력이 가능합니다. 주최는 설정의 게시에서 이벤트를 만들 수 있습니다.",
      "zh-CN":
        "在活动详情页获取。免费活动点击「领取免费票」即时发放；付费活动经购物车与 Stripe 支付后发放。已领门票可在「我的门票」查看并导出 PDF 等。主办方可在设置→发布中创建活动。",
    },
  },
  {
    id: "faq-page-error",
    category: "technical",
    sortOrder: 1,
    question: {
      ja: "ページが表示されない・エラーが出る",
      en: "A page will not load or shows an error",
      ko: "페이지가 안 보이거나 오류가 나요",
      "zh-CN": "页面无法显示或出现错误",
    },
    answer: {
      ja: "ブラウザのキャッシュを削除するか、別のブラウザ・シークレット（プライベート）ウィンドウで再度お試しください。インターネット接続を確認し、ページを再読み込みしてください。問題が続く場合は、表示されているエラーメッセージ・URL・発生時刻とあわせてお問い合わせフォームから「技術的な問題」カテゴリでご連絡ください。",
      en: "Clear the browser cache, or try another browser / private window. Check your connection and reload. If it continues, contact Support under Technical issues with the error message, URL, and time.",
      ko: "브라우저 캐시를 지우거나 다른 브라우저·시크릿 창에서 다시 시도하세요. 연결을 확인하고 새로고침하세요. 계속되면 오류 메시지·URL·발생 시각과 함께 ‘기술적 문제’로 문의해 주세요.",
      "zh-CN":
        "请清除浏览器缓存，或换用其他浏览器／无痕窗口。检查网络并刷新。若仍有问题，请附带错误信息、URL 与时间，通过「技术问题」类别联系支持。",
    },
  },
  {
    id: "faq-browsers",
    category: "technical",
    sortOrder: 2,
    question: {
      ja: "対応ブラウザは？",
      en: "Which browsers are supported?",
      ko: "지원 브라우저는?",
      "zh-CN": "支持哪些浏览器？",
    },
    answer: {
      ja: "最新版の Google Chrome、Mozilla Firefox、Apple Safari、Microsoft Edge を推奨しています。Internet Explorer には対応していません。",
      en: "We recommend the latest Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge. Internet Explorer is not supported.",
      ko: "최신 Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge를 권장합니다. Internet Explorer는 지원하지 않습니다.",
      "zh-CN":
        "建议使用最新版 Google Chrome、Mozilla Firefox、Apple Safari 与 Microsoft Edge。不支持 Internet Explorer。",
    },
  },
  {
    id: "faq-sla",
    category: "support",
    sortOrder: 1,
    question: {
      ja: "問い合わせ後、どのくらいで返信がありますか？",
      en: "How soon will I get a reply after contacting support?",
      ko: "문의 후 얼마나 걸려 답장이 오나요?",
      "zh-CN": "提交咨询后多久会收到回复？",
    },
    answer: {
      ja: "通常、平日 10:00〜18:00（JST）の受付を目安に、1〜2 営業日以内の初回返信を目指しています。アカウント停止・決済障害など緊急度の高い案件は優先対応します。チケット番号（ENX-YYYYMMDD-XXXXXX）を控えてください。メール: support@eldonia-nex.com",
      en: "We aim for a first reply within 1–2 business days during weekday hours 10:00–18:00 (JST). Urgent cases (account lockouts, payment failures) are prioritized. Keep your ticket number (ENX-YYYYMMDD-XXXXXX). Email: support@eldonia-nex.com",
      ko: "평일 10:00–18:00(JST) 기준으로 보통 1–2 영업일 이내 첫 답변을 목표로 합니다. 계정 정지·결제 장애 등 긴급 건은 우선 대응합니다. 티켓 번호(ENX-YYYYMMDD-XXXXXX)를 남겨 두세요. 이메일: support@eldonia-nex.com",
      "zh-CN":
        "我们目标在工作日 10:00–18:00（JST）范围内于 1–2 个工作日内首次回复。账户停用、支付故障等紧急事项优先处理。请保留工单号（ENX-YYYYMMDD-XXXXXX）。邮箱：support@eldonia-nex.com",
    },
  },
  {
    id: "faq-ticket-reply",
    category: "support",
    sortOrder: 2,
    question: {
      ja: "問い合わせ内容を追加・返信したい",
      en: "I want to add details or reply to my ticket",
      ko: "문의 내용을 추가·답장하고 싶어요",
      "zh-CN": "想补充咨询内容或回复工单",
    },
    answer: {
      ja: "ログイン済みの場合は、ヘルプの「マイチケット」（/help/tickets）から該当チケットを開き、追加メッセージを送信できます。未ログインで送信した場合は、同じメールアドレスから再度お問い合わせいただくか、アカウント作成後にサポートへチケット番号をお知らせください。",
      en: "If logged in, open Help → My Tickets (/help/tickets), select the ticket, and send a follow-up. If you contacted us while logged out, use the same email again or create an account and share your ticket number with Support.",
      ko: "로그인한 경우 도움말 ‘내 티켓’(/help/tickets)에서 해당 티켓을 열고 추가 메시지를 보낼 수 있습니다. 비로그인으로 보낸 경우 같은 이메일로 다시 문의하거나, 계정 생성 후 티켓 번호를 지원팀에 알려 주세요.",
      "zh-CN":
        "已登录时可打开帮助 → 我的工单（/help/tickets），选择工单并发送追加消息。若以未登录状态提交，请使用同一邮箱再次联系，或注册后向支持提供工单号。",
    },
  },
];

export function getReleaseFaqArticles(locale: UiLocale): {
  id: string;
  category: string;
  question: string;
  answer: string;
}[] {
  const categoryOrder = [
    "getting_started",
    "account",
    "gallery",
    "billing",
    "technical",
    "support",
  ];

  return [...FAQ_RELEASE_ARTICLES]
    .sort((left, right) => {
      const leftCat = categoryOrder.indexOf(left.category);
      const rightCat = categoryOrder.indexOf(right.category);
      if (leftCat !== rightCat) return leftCat - rightCat;
      return left.sortOrder - right.sortOrder;
    })
    .map((article) => ({
      id: article.id,
      category: article.category,
      question: article.question[locale] ?? article.question.ja,
      answer: article.answer[locale] ?? article.answer.ja,
    }));
}
