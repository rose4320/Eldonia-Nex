import type { UiLocale } from "@/lib/i18n/locale";
import { PLAN_CATALOG, type CatalogPlanId } from "@/lib/plans/catalog";

export type SignupPlanId = CatalogPlanId;

export type SignupPlan = {
  id: SignupPlanId;
  name: string;
  price: string;
  lead: string;
  features: string[];
  checkout?: "free" | "stripe" | "contact";
};

export type SignupConsent = {
  type: string;
  title: string;
  version: string;
  lead: string;
  body: string[];
  requiredLabel: string;
};

export type SignupContent = {
  steps: { basic: string; plan: string; payment: string; consent: string };
  basic: {
    displayName: string;
    username: string;
    legalName: string;
    country: string;
    phone: string;
    creatorToggle: string;
    submit: string;
    rulesTitle: string;
    hints: {
      displayName: string;
      username: string;
      email: string;
      password: string;
      legalName: string;
      country: string;
      phone: string;
    };
  };
  plan: {
    eyebrow: string;
    title: string;
    lead: string;
    back: string;
    toPayment: string;
  };
  payment: {
    eyebrow: string;
    titleConfirm: (planName: string) => string;
    leadSelected: (price: string) => string;
    backToPlan: string;
    preparing: string;
    toConsentFree: string;
    toStripe: string;
    sessionMissing: string;
  };
  consent: {
    progress: (current: number, total: number) => string;
    back: string;
    saving: string;
    finish: string;
    next: string;
  };
  complete: {
    eyebrow: string;
    title: string;
    lead: string;
    start: string;
    settings: string;
  };
  messages: {
    basicSaved: string;
    resumeSignedIn: string;
    confirmEmailContinue: string;
    paymentComplete: string;
    freePlanSelected: string;
    paymentSkipped: string;
    checkoutFailed: string;
    consentRequired: string;
    consentSaveFailed: string;
    flowComplete: string;
    usernameTaken: string;
  };
  plans: SignupPlan[];
  consents: SignupConsent[];
};

const CONSENT_VERSION = "2026-06-19";

const SIGNUP_JA: SignupContent = {
  steps: {
    basic: "1 基本情報",
    plan: "2 プラン",
    payment: "3 決済",
    consent: "4 規約",
  },
  basic: {
    displayName: "表示名",
    username: "ユーザー名",
    legalName: "氏名・法人名（任意）",
    country: "国",
    phone: "電話番号（任意）",
    creatorToggle: "クリエイターとして作品投稿・販売・イベント参加を始める",
    submit: "基本情報を保存して次へ",
    rulesTitle: "入力ルール",
    hints: {
      displayName: "必須。サイト上に表示される名前です。",
      username: "必須。3〜30文字。半角英小文字・数字・アンダースコア（a-z, 0-9, _）のみ。他ユーザーと重複不可。",
      email: "必須。有効なメール形式。ログインと確認メールに使用します。",
      password: "必須。8文字以上。",
      legalName: "任意。請求・本人確認で使用する場合があります。",
      country: "国コード2文字（例: JP, US）。確認メールの言語判定に使用します。",
      phone: "任意。ハイフンあり・なしどちらでも入力できます。",
    },
  },
  plan: {
    eyebrow: "Plan Selection",
    title: "利用プランを選択",
    lead: "いつでも変更できます。Free は決済なしで規約確認へ進みます。",
    back: "戻る",
    toPayment: "決済ステップへ",
  },
  payment: {
    eyebrow: "Payment",
    titleConfirm: (name) => `${name} プランの確認`,
    leadSelected: (price) =>
      `選択中: ${price}。有料プランは Stripe の安全な決済画面へ移動します。`,
    backToPlan: "プラン選択へ戻る",
    preparing: "決済準備中...",
    toConsentFree: "決済なしで規約へ",
    toStripe: "Stripe 決済へ進む",
    sessionMissing: "ログインセッションが確認できません。基本情報入力からやり直してください。",
  },
  consent: {
    progress: (c, t) => `Consent ${c} / ${t}`,
    back: "戻る",
    saving: "保存中...",
    finish: "承認して登録完了",
    next: "次の規約へ",
  },
  complete: {
    eyebrow: "Welcome",
    title: "登録が完了しました",
    lead: "基本情報、プラン選択、決済確認、規約承認を保存しました。",
    start: "はじめる",
    settings: "設定を開く",
  },
  messages: {
    basicSaved: "基本情報を保存しました。次にプランを選択してください。",
    resumeSignedIn:
      "ログイン済みです。プランを選択して登録を完了すると、ホームに移動できます。",
    confirmEmailContinue:
      "確認メールを送信しました。メール内のリンクを開くと、プラン選択から登録を続けられます（別途ログインは不要です）。",
    paymentComplete: "決済が完了しました。最後に規約を項目ごとに確認してください。",
    freePlanSelected: "Free プランを選択しました。規約を項目ごとに確認してください。",
    paymentSkipped: "登録フロー確認のため、決済をスキップして規約確認へ進みます。",
    checkoutFailed: "決済セッションの作成に失敗しました。",
    consentRequired: "この項目を理解したチェックを入れてから次へ進んでください。",
    consentSaveFailed: "規約承認の保存に失敗しました。",
    flowComplete: "登録フローが完了しました。Eldonia-Nex へようこそ。",
    usernameTaken: "このユーザー名は既に使われています。別のユーザー名を入力してください。",
  },
  plans: PLAN_CATALOG.map((plan) => ({
    id: plan.id,
    name: plan.name,
    price: plan.priceLabelJa,
    lead: plan.leadJa,
    features: plan.featuresJa,
    checkout: plan.checkout,
  })),
  consents: [
    {
      type: "terms_of_service",
      title: "利用規約",
      version: CONSENT_VERSION,
      lead: "Eldonia-Nex を利用するための基本ルールです。",
      body: [
        "アカウントは本人が管理し、第三者への譲渡や不正利用を行わないでください。",
        "サービス上での投稿・販売・交流は、法令とプラットフォームルールに従う必要があります。",
        "【重要】誹謗中傷、名誉毀損、嫌がらせ、脅迫、差別的発言、その他他者の権利・尊厳を侵害する言動は固く禁止されています。",
        "【重要】詐欺、なりすまし、虚偽情報の流布、不正な勧誘、第三者のなりすましアカウント作成などの行為は、アカウント永久停止および関係機関への通報の対象となります。",
        "違反が確認された場合、投稿の制限、アカウント停止、取引の保留、損害賠償請求の検討を行うことがあります。",
      ],
      requiredLabel:
        "利用規約を読み、誹謗中傷・詐欺行為を含む禁止事項を理解し、遵守することに同意しました",
    },
    {
      type: "privacy_policy",
      title: "プライバシーポリシー",
      version: CONSENT_VERSION,
      lead: "登録情報・決済情報・利用履歴の取り扱いについてです。",
      body: [
        "登録情報は認証、本人確認、サポート、通知、サービス改善のために利用します。",
        "決済に必要な情報は Stripe 等の決済事業者と連携して処理します。",
        "法令に基づく場合を除き、必要な範囲を超えて個人情報を第三者へ提供しません。",
      ],
      requiredLabel: "個人情報の利用目的と管理方針を理解しました",
    },
    {
      type: "subscription_terms",
      title: "サブスクリプション・決済条件",
      version: CONSENT_VERSION,
      lead: "有料プランの課金、自動更新、解約に関する確認です。",
      body: [
        "有料プランは選択した周期で自動更新され、解約するまで請求が継続します。",
        "プラン変更や解約の反映タイミングは、決済事業者とサービス設定に従います。",
        "無料プランを選んだ場合、この項目は将来の有料化時の確認事項として扱います。",
      ],
      requiredLabel: "課金・自動更新・解約条件を理解しました",
    },
    {
      type: "creator_guidelines",
      title: "投稿・コンテンツガイドライン",
      version: CONSENT_VERSION,
      lead: "作品投稿、販売、コミュニティ活動で守る内容です。",
      body: [
        "権利を保有していない作品、盗用、無断転載、権利侵害コンテンツは投稿できません。",
        "【重要】特定個人・団体への誹謗中傷、根拠のない批判、晒し行為、執拗な嫌がらせは投稿・コメント・メッセージ等すべての場面で禁止です。",
        "年齢制限が必要な表現、暴力的・差別的な表現は適切な分類と制限が必要です。",
        "購入者や参加者に誤解を与える説明、価格表示、納品条件の記載を避けてください。",
      ],
      requiredLabel:
        "誹謗中傷を含む投稿ルールと禁止事項を理解し、他者への侵害行為を行わないことに同意しました",
    },
    {
      type: "commerce_terms",
      title: "取引・返金・収益化条件",
      version: CONSENT_VERSION,
      lead: "販売、イベント、仕事依頼など金銭を伴う活動の確認です。",
      body: [
        "販売・受注・イベント開催では、提供内容、価格、納期、キャンセル条件を明確にしてください。",
        "【重要】虚偽の商品説明、存在しないサービスの販売、前払い詐欺、なりすまし販売、不正な紹介報酬の勧誘などの詐欺行為は厳禁です。",
        "【重要】詐欺・不正取引が確認された場合、取引の即時停止、アカウント永久停止、関係機関への通報、損害賠償請求を行うことがあります。",
        "返金や紛争対応は、各取引の状態、決済状況、運営判断に基づいて処理されます。",
        "収益の支払いには本人情報、振込先、税務上必要な情報の確認が必要になる場合があります。",
      ],
      requiredLabel:
        "詐欺行為を含む取引禁止事項を理解し、誠実な取引のみ行うことに同意しました",
    },
  ],
};

const SIGNUP_EN: SignupContent = {
  steps: {
    basic: "1 Basics",
    plan: "2 Plan",
    payment: "3 Payment",
    consent: "4 Terms",
  },
  basic: {
    displayName: "Display name",
    username: "Username",
    legalName: "Legal name (optional)",
    country: "Country",
    phone: "Phone (optional)",
    creatorToggle: "Act as a creator — post artwork, sell, and host events",
    submit: "Save & continue",
    rulesTitle: "Input rules",
    hints: {
      displayName: "Required. Shown publicly on your profile.",
      username:
        "Required. 3–30 characters. Lowercase letters, digits, and underscores (a-z, 0-9, _) only. Must be unique.",
      email: "Required. Valid email format. Used for login and confirmation emails.",
      password: "Required. At least 8 characters.",
      legalName: "Optional. Used for billing or identity verification when needed.",
      country: "2-letter country code (e.g. JP, US). Used to choose confirmation email language.",
      phone: "Optional. Hyphens are allowed.",
    },
  },
  plan: {
    eyebrow: "Plan Selection",
    title: "Choose a plan",
    lead: "Change anytime. Free skips payment and goes to terms.",
    back: "Back",
    toPayment: "Continue to payment",
  },
  payment: {
    eyebrow: "Payment",
    titleConfirm: (name) => `Confirm ${name} plan`,
    leadSelected: (price) =>
      `Selected: ${price}. Paid plans redirect to Stripe secure checkout.`,
    backToPlan: "Back to plans",
    preparing: "Preparing checkout…",
    toConsentFree: "Continue without payment",
    toStripe: "Pay with Stripe",
    sessionMissing: "Session not found. Please restart from basics.",
  },
  consent: {
    progress: (c, t) => `Consent ${c} / ${t}`,
    back: "Back",
    saving: "Saving…",
    finish: "Accept & finish signup",
    next: "Next agreement",
  },
  complete: {
    eyebrow: "Welcome",
    title: "Signup complete",
    lead: "Basics, plan, payment, and agreements are saved.",
    start: "Get started",
    settings: "Open settings",
  },
  messages: {
    basicSaved: "Profile saved. Choose a plan next.",
    resumeSignedIn:
      "You're signed in. Choose a plan to finish signup and continue to your home.",
    confirmEmailContinue:
      "We sent a confirmation email. Open the link inside to continue signup from plan selection—no separate login step.",
    paymentComplete: "Payment complete. Review each agreement to finish.",
    freePlanSelected: "Free plan selected. Review each agreement to finish.",
    paymentSkipped: "Payment is skipped for signup flow testing. Review agreements to finish.",
    checkoutFailed: "Could not start checkout.",
    consentRequired: "Check that you understand this item before continuing.",
    consentSaveFailed: "Could not save agreement.",
    flowComplete: "Welcome to Eldonia-Nex!",
    usernameTaken: "This username is already taken. Please choose another username.",
  },
  plans: PLAN_CATALOG.map((plan) => ({
    id: plan.id,
    name: plan.name,
    price: plan.priceLabelEn,
    lead: plan.leadEn,
    features: plan.featuresEn,
    checkout: plan.checkout,
  })),
  consents: SIGNUP_JA.consents.map((c) => ({
    ...c,
    title: c.type === "terms_of_service" ? "Terms of Service" : c.title,
  })).map((item) => {
    const enMap: Record<string, Omit<SignupConsent, "type" | "version">> = {
      terms_of_service: {
        title: "Terms of Service",
        lead: "Basic rules for using Eldonia-Nex.",
        body: [
          "You are responsible for your account; do not transfer or misuse it.",
          "Posts, sales, and community activity must follow laws and platform rules.",
          "[Important] Defamation, harassment, threats, discrimination, and any conduct that infringes others' rights or dignity are strictly prohibited.",
          "[Important] Fraud, impersonation, spreading false information, deceptive solicitation, and creating fake accounts may result in permanent suspension and reporting to authorities.",
          "Violations may lead to restrictions, suspension, held transactions, or pursuit of damages.",
        ],
        requiredLabel:
          "I have read the Terms of Service and agree to comply, including prohibitions on defamation and fraud",
      },
      privacy_policy: {
        title: "Privacy Policy",
        lead: "How we handle registration, payment, and usage data.",
        body: [
          "We use registration data for auth, verification, support, notifications, and improvements.",
          "Payment data is processed via Stripe and other payment providers.",
          "We do not share personal data beyond what is legally required.",
        ],
        requiredLabel: "I understand how personal data is used and managed",
      },
      subscription_terms: {
        title: "Subscription & billing",
        lead: "Billing, auto-renewal, and cancellation for paid plans.",
        body: [
          "Paid plans auto-renew until you cancel.",
          "Plan changes and cancellation timing follow the payment provider and settings.",
          "For Free, this applies when you upgrade later.",
        ],
        requiredLabel: "I understand billing, auto-renewal, and cancellation",
      },
      creator_guidelines: {
        title: "Content guidelines",
        lead: "Rules for posting, selling, and community activity.",
        body: [
          "Do not post content you do not own or that infringes rights.",
          "[Important] Defamation, baseless attacks, doxxing, and persistent harassment are prohibited in posts, comments, and messages.",
          "Age-restricted or harmful content must be classified and limited appropriately.",
          "Avoid misleading descriptions, pricing, or delivery terms.",
        ],
        requiredLabel:
          "I understand posting rules including defamation bans and will not harm others",
      },
      commerce_terms: {
        title: "Commerce & payouts",
        lead: "Sales, events, jobs, and other paid activity.",
        body: [
          "Clearly state what you offer, price, timeline, and cancellation terms.",
          "[Important] Fraudulent listings, selling non-existent services, advance-payment scams, impersonation sales, and deceptive referral schemes are strictly forbidden.",
          "[Important] Confirmed fraud may result in immediate transaction holds, permanent suspension, reporting to authorities, and pursuit of damages.",
          "Refunds and disputes are handled per transaction state and platform policy.",
          "Payouts may require identity and tax information.",
        ],
        requiredLabel:
          "I understand commerce rules including fraud prohibitions and will trade honestly",
      },
    };
    const en = enMap[item.type];
    return en ? { type: item.type, version: item.version, ...en } : item;
  }),
};

export const SIGNUP_CONTENT: Record<UiLocale, SignupContent> = {
  ja: SIGNUP_JA,
  en: SIGNUP_EN,
  ko: {
    ...SIGNUP_EN,
    steps: { basic: "1 기본 정보", plan: "2 플랜", payment: "3 결제", consent: "4 약관" },
    basic: { ...SIGNUP_EN.basic, submit: "저장 후 계속" },
    plan: { ...SIGNUP_EN.plan, title: "플랜 선택", toPayment: "결제 단계로" },
    complete: { ...SIGNUP_EN.complete, title: "가입 완료", start: "시작하기" },
    messages: {
      ...SIGNUP_EN.messages,
      basicSaved: "저장되었습니다. 플랜을 선택하세요.",
      confirmEmailContinue:
        "확인 메일을 보냈습니다. 메일의 링크를 열면 별도 로그인 없이 플랜 선택부터 가입을 이어갈 수 있습니다.",
      flowComplete: "Eldonia-Nex에 오신 것을 환영합니다!",
    },
  },
  "zh-CN": {
    ...SIGNUP_EN,
    steps: { basic: "1 基本信息", plan: "2 方案", payment: "3 支付", consent: "4 条款" },
    basic: { ...SIGNUP_EN.basic, submit: "保存并继续" },
    plan: { ...SIGNUP_EN.plan, title: "选择方案", toPayment: "前往支付" },
    complete: { ...SIGNUP_EN.complete, title: "注册完成", start: "开始使用" },
    messages: {
      ...SIGNUP_EN.messages,
      basicSaved: "已保存。请选择方案。",
      confirmEmailContinue:
        "已发送确认邮件。点击邮件中的链接即可从方案选择继续注册，无需另行登录。",
      flowComplete: "欢迎来到 Eldonia-Nex！",
    },
  },
};
