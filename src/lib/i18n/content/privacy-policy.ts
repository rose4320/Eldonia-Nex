import type { UiLocale } from "@/lib/i18n/locale";

export type PrivacyPolicySection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type PrivacyPolicyDoc = {
  version: string;
  updatedLabel: string;
  lead: string;
  sections: PrivacyPolicySection[];
  contactNote: string;
};

/**
 * Full privacy policy for `/privacy`.
 * Signup consent uses a shorter summary derived from the same version.
 * Not a substitute for formal legal review — bump version when publishing material changes.
 */
export const PRIVACY_POLICY_VERSION = "2026-07-14";

const JA: PrivacyPolicyDoc = {
  version: PRIVACY_POLICY_VERSION,
  updatedLabel: `最終更新: ${PRIVACY_POLICY_VERSION}`,
  lead:
    "Eldonia–Nex（以下「本サービス」）は、クリエイターとファンのための創作プラットフォームです。本ポリシーは、どのような情報を、なぜ、どのように取り扱うかを、利用前に判断できるよう具体的に説明します。",
  contactNote:
    "個人情報の開示・訂正・削除・利用停止のご請求、その他プライバシーに関するお問い合わせは、ヘルプのお問い合わせフォームから「アカウント」カテゴリでご連絡ください。本人確認のうえ、合理的な期間内に対応します。",
  sections: [
    {
      id: "scope",
      title: "1. 適用範囲",
      paragraphs: [
        "本ポリシーは、本サービスのウェブサイト、アプリ、API、関連するサポート窓口を通じて取得・処理する情報に適用されます。",
        "外部サイト（決済画面、SNS ログイン、埋め込みコンテンツ等）には、各事業者のポリシーが別途適用されます。遷移前に相手先の説明も確認してください。",
      ],
    },
    {
      id: "data",
      title: "2. 取得する情報",
      paragraphs: [
        "取得する情報の種類と、典型的な取得タイミングは次のとおりです。必須項目は機能ごとに異なり、任意の情報を提供しなくても基本利用は可能な場合があります。",
      ],
      bullets: [
        "アカウント情報: メールアドレス、認証用パスワード（ハッシュ化して保管）、表示名・ユーザー名、ログイン方式（メール / OAuth）。",
        "プロフィール情報: 自己紹介、国・地域、任意の連絡先、クリエイター設定、公開プロフィールに表示する内容。",
        "コンテンツ: Gallery / Lab / Community / Works / Events / Shop 等に投稿・アップロードした作品、コメント、メッセージ、メタデータ（タイトル、説明、タグ等）。",
        "取引・決済関連: 購入・販売・チケット・プラン課金に必要な注文情報、決済ステータス、請求先に関する情報。カード番号等の機微な決済データは Stripe 等の決済事業者が処理し、当社がカード番号を保管しません。",
        "紹介プログラム: 紹介コード、紹介 URL、被紹介との紐付け、還元計算・支払審査に必要な記録。",
        "収益・本人確認（該当時）: 振込先情報、氏名・住所等、法令・送金に必要な確認情報。",
        "利用ログ・技術情報: IP アドレス、ブラウザ/端末情報、アクセス日時、参照元、エラーログ、セキュリティ検知に必要な記録。",
        "サポート情報: お問い合わせ内容、チケット履歴、本人確認のために追加でご提供いただく情報。",
        "翻訳・表示設定: UI 言語、翻訳表示の設定、機械翻訳の処理に必要なテキスト（UGC の翻訳キャッシュを含む）。",
      ],
    },
    {
      id: "user-content",
      title: "2b. ユーザーコンテンツと著作権に関するデータ",
      paragraphs: [
        "作品・コメント等のユーザーコンテンツ自体の著作権は、利用規約に定めるとおり原則として投稿者に帰属します。当社が取得・処理するのは、サービス提供に必要なファイル本体・メタデータ（タイトル、説明、タグ、公開設定）、閲覧・いいね等の利用記録、翻訳キャッシュ等です。",
        "投稿の非公開・削除を申請した場合でも、バックアップ、権利侵害対応、法令・紛争対応のため、一定期間データを保持することがあります。詳細な権利関係（帰属・許諾範囲）は利用規約（/terms）を参照してください。",
      ],
    },
    {
      id: "purpose",
      title: "3. 利用目的",
      paragraphs: ["取得した情報は、次の目的の範囲で利用します。目的外利用は行いません。"],
      bullets: [
        "アカウント登録・認証・セッション維持、不正ログイン防止。",
        "プロフィール・作品・コミュニティ等の表示、共同制作（Lab）、通知の配信。",
        "Shop / Events / プラン課金等の取引処理、領収・履歴表示、紛争対応。",
        "紹介プログラムの資格確認、還元計算、不正検知、支払処理。",
        "カスタマーサポート、問い合わせ対応、障害調査。",
        "セキュリティ、詐欺・滥用の検知と防止、利用規約違反への対応。",
        "サービス改善、品質向上、新機能の検討（個人を特定しない統計・分析を含む）。",
        "法令に基づく対応、権利侵害への対応、公的機関からの適法な要請への対応。",
        "多言語表示・翻訳 Nexus（投稿等の翻訳生成とキャッシュ）。",
      ],
    },
    {
      id: "legal-basis",
      title: "4. 利用の根拠（わかりやすく）",
      paragraphs: [
        "主に次の理由で情報を扱います。(1) 契約の履行（サービス提供に必要）、(2) 正当な利益（セキュリティ・改善・不正防止。利用者の権利を不当に害しない範囲）、(3) 同意（任意項目や一部の通知・翻訳機能等）、(4) 法令上の義務。",
        "同意に基づく処理は、設定やフォームから撤回できる場合があります。撤回後も、法令や契約上必要な記録は保持することがあります。",
      ],
    },
    {
      id: "sharing",
      title: "5. 第三者提供・処理の委託",
      paragraphs: [
        "当社は、販売目的で個人情報を第三者に売却しません。サービス運営のため、次のような事業者に処理を委託・連携する場合があります（いずれも契約および必要な安全管理措置のもと）。",
      ],
      bullets: [
        "インフラ・認証・データベース: Supabase 等（アカウント・コンテンツ・設定の保管）。",
        "ホスティング・配信: Vercel 等（サイト・API の配信）。",
        "決済: Stripe 等（カード決済・サブスクリプション）。",
        "翻訳・言語処理: Google Cloud Translation 等（UGC の翻訳。翻訳結果のキャッシュを含む場合あり）。",
        "メール・通知、監視・分析（導入時）: 到達性確保や障害検知に必要な範囲。",
        "法令に基づく開示: 裁判所・捜査機関等からの適法な要請がある場合。",
        "事業承継: 合併・事業譲渡等で引き継がれる場合（引き継ぎ後も本ポリシーの趣旨に沿って取り扱います）。",
      ],
    },
    {
      id: "cookies",
      title: "6. Cookie・類似技術",
      paragraphs: [
        "ログイン状態の維持、言語設定、セキュリティ、不正防止、基本的な利用状況の把握のために Cookie や類似技術を使用します。",
        "ブラウザ設定で Cookie を拒否できますが、ログインや一部機能が利用できなくなる場合があります。",
      ],
    },
    {
      id: "international",
      title: "7. 国外への移転",
      paragraphs: [
        "クラウド事業者の所在により、データが日本国外（例: 米国等）のサーバで処理・保管される場合があります。",
        "その場合も、契約上の保護措置や各事業者のセキュリティ慣行のもと、必要な範囲でのみ処理します。",
      ],
    },
    {
      id: "retention",
      title: "8. 保管期間",
      paragraphs: [
        "目的達成に必要な期間、または法令で保管が求められる期間、情報を保持します。",
        "アカウント削除や非公開化を申請された場合でも、不正防止・紛争対応・法令対応のため、一定期間ログや取引記録を保持することがあります。原則として物理削除は限定的とし、非公開・アーカイブ・匿名化を優先します。",
      ],
    },
    {
      id: "security",
      title: "9. 安全管理",
      paragraphs: [
        "アクセス制御、通信の暗号化（HTTPS）、権限分離、監査ログ等により、漏えい・滅失・毀損の防止に努めます。",
        "絶対的な安全を保証するものではありません。異常を発見した場合は、影響範囲に応じて通知・是正を行います。",
      ],
    },
    {
      id: "rights",
      title: "10. あなたの権利・選択",
      paragraphs: ["適用法令の範囲で、次のような対応を求めることができます。"],
      bullets: [
        "保有する自分の個人情報の開示・訂正・追加・削除。",
        "利用停止・消去の求め（法令・契約上必要な保管を除く）。",
        "プロフィール公開範囲の変更、通知設定の変更（機能が提供されている範囲）。",
        "OAuth 連携の解除（各プロバイダ側の設定と本サービスの設定の双方が必要な場合があります）。",
      ],
    },
    {
      id: "minors",
      title: "11. 未成年の方へ",
      paragraphs: [
        "保護者の同意なく、未成年者が個人情報を登録・公開しないようお願いします。保護者の方から削除等のご連絡があった場合は、確認のうえ対応します。",
      ],
    },
    {
      id: "changes",
      title: "12. ポリシーの変更",
      paragraphs: [
        "サービス内容や法令の変更に応じて、本ポリシーを改定することがあります。重要な変更は、サイト上での告知や、必要に応じてアプリ内・メール等でお知らせします。",
        "改定後に本サービスを利用した場合、改定後のポリシーに同意したものとみなすことがあります。バージョンはページ上部の「最終更新」で確認できます。",
      ],
    },
  ],
};

const EN: PrivacyPolicyDoc = {
  version: PRIVACY_POLICY_VERSION,
  updatedLabel: `Last updated: ${PRIVACY_POLICY_VERSION}`,
  lead:
    "Eldonia–Nex (“the Service”) is a creation platform for creators and fans. This Policy explains what information we collect, why, and how we handle it—so you can decide before using the Service.",
  contactNote:
    "For access, correction, deletion, restriction requests, or other privacy questions, contact us via Help → Contact (Account category). We will verify identity and respond within a reasonable time.",
  sections: [
    {
      id: "scope",
      title: "1. Scope",
      paragraphs: [
        "This Policy applies to information collected or processed through the Service’s websites, apps, APIs, and support channels.",
        "Third-party sites (checkout, social login, embeds) are governed by their own policies—please review those before leaving our Service.",
      ],
    },
    {
      id: "data",
      title: "2. Information we collect",
      paragraphs: [
        "Categories and typical collection points are listed below. Required fields vary by feature; some optional data can be skipped while still using core features.",
      ],
      bullets: [
        "Account: email, hashed password, display name / username, login method (email / OAuth).",
        "Profile: bio, country/region, optional contact fields, creator settings, public profile content.",
        "Content: artworks, comments, messages, and metadata you post in Gallery, Lab, Community, Works, Events, Shop, etc.",
        "Transactions & payments: order details, payment status, billing-related info. Sensitive card data is handled by Stripe (or similar); we do not store full card numbers.",
        "Referral program: referral codes/URLs, attribution to referred users, and records needed to calculate and review payouts.",
        "Payouts / identity (when applicable): bank details, legal name/address, and information required by law or for transfers.",
        "Logs & technical data: IP address, device/browser info, timestamps, referrers, error and security logs.",
        "Support: inquiry content, ticket history, and information you provide for verification.",
        "Translation & locale: UI language, translation preferences, and text needed to generate/cache translations of UGC.",
      ],
    },
    {
      id: "user-content",
      title: "2b. User content and copyright-related data",
      paragraphs: [
        "Copyright in User Content generally remains with the poster under the Terms. What we process includes files and metadata (title, description, tags, visibility), engagement logs, and translation caches needed to run the Service.",
        "After unpublish or deletion requests, we may retain data for a period for backups, infringement handling, and legal/dispute needs. Ownership and license scope are defined in the Terms (/terms).",
      ],
    },
    {
      id: "purpose",
      title: "3. Purposes of use",
      paragraphs: ["We use information only for the purposes below."],
      bullets: [
        "Registration, authentication, session continuity, and abuse prevention.",
        "Showing profiles, works, community activity, Lab collaboration, and notifications.",
        "Processing Shop / Events / plan billing, receipts, history, and disputes.",
        "Referral eligibility, fee calculation, abuse detection, and payouts.",
        "Customer support, incident investigation, and service reliability.",
        "Security, fraud/abuse detection, and enforcement of Terms.",
        "Product improvement and aggregated analytics that do not identify you unnecessarily.",
        "Legal compliance and responding to lawful requests.",
        "Multilingual display and Translation Nexus (including translation caches).",
      ],
    },
    {
      id: "legal-basis",
      title: "4. Why we process data (plain language)",
      paragraphs: [
        "We typically rely on: (1) contract performance (to provide the Service), (2) legitimate interests (security, improvement, abuse prevention—balanced against your rights), (3) consent (optional fields or certain notifications/translation features), and (4) legal obligations.",
        "Where processing is based on consent, you may withdraw it via settings or forms where available. We may still retain records required by law or contract.",
      ],
    },
    {
      id: "sharing",
      title: "5. Sharing and processors",
      paragraphs: [
        "We do not sell personal data. We use processors/partners as needed to operate the Service under contracts and safeguards, including:",
      ],
      bullets: [
        "Infrastructure / auth / database (e.g. Supabase).",
        "Hosting / delivery (e.g. Vercel).",
        "Payments (e.g. Stripe).",
        "Translation (e.g. Google Cloud Translation), including possible caching of results.",
        "Email/notifications and monitoring/analytics when enabled, limited to what is needed.",
        "Lawful disclosure to courts or authorities when required.",
        "Business transfers (merger/acquisition), with continued protection consistent with this Policy.",
      ],
    },
    {
      id: "cookies",
      title: "6. Cookies and similar technologies",
      paragraphs: [
        "We use cookies/similar tech for login sessions, locale, security, abuse prevention, and basic usage measurement.",
        "You can block cookies in your browser, but login and some features may stop working.",
      ],
    },
    {
      id: "international",
      title: "7. International transfers",
      paragraphs: [
        "Depending on our cloud providers, data may be processed or stored outside Japan (e.g. the United States).",
        "We limit processing to what is needed and rely on contractual and provider security practices.",
      ],
    },
    {
      id: "retention",
      title: "8. Retention",
      paragraphs: [
        "We keep information as long as needed for the purposes above or as required by law.",
        "After account deletion or deactivation requests, we may retain logs and transaction records for a period for security, disputes, and legal compliance. We prefer unpublishing, archiving, or anonymization over physical deletion unless the law requires otherwise.",
      ],
    },
    {
      id: "security",
      title: "9. Security",
      paragraphs: [
        "We apply access controls, HTTPS, least-privilege practices, and audit logging to reduce risks of breach, loss, or damage.",
        "No system is perfectly secure. If an incident occurs, we will notify and remediate as appropriate to the impact.",
      ],
    },
    {
      id: "rights",
      title: "10. Your rights and choices",
      paragraphs: ["Subject to applicable law, you may request:"],
      bullets: [
        "Access, correction, or deletion of your personal data.",
        "Restriction or erasure where legally available (except records we must keep).",
        "Changes to profile visibility and notification settings where offered.",
        "Disconnecting OAuth providers (may require actions on both the provider and the Service).",
      ],
    },
    {
      id: "minors",
      title: "11. Minors",
      paragraphs: [
        "Please do not register or publish personal data as a minor without guardian consent. We will review deletion requests from guardians after verification.",
      ],
    },
    {
      id: "changes",
      title: "12. Changes to this Policy",
      paragraphs: [
        "We may update this Policy as the Service or laws change. Material changes will be announced on the site and, when appropriate, in-product or by email.",
        "Continued use after an update may constitute acceptance of the revised Policy. Check the “Last updated” date at the top of this page.",
      ],
    },
  ],
};

const KO: PrivacyPolicyDoc = {
  ...EN,
  updatedLabel: `최종 업데이트: ${PRIVACY_POLICY_VERSION}`,
  lead:
    "Eldonia–Nex(이하 “본 서비스”)는 크리에이터와 팬을 위한 창작 플랫폼입니다. 본 방침은 어떤 정보를, 왜, 어떻게 다루는지 이용 전에 판단할 수 있도록 구체적으로 설명합니다.",
  contactNote:
    "개인정보 열람·정정·삭제·이용 정지 요청 및 기타 문의는 도움말 → 문의(계정 카테고리)로 연락해 주세요. 본인 확인 후 합리적 기간 내에 대응합니다.",
};

const ZH: PrivacyPolicyDoc = {
  ...EN,
  updatedLabel: `最后更新: ${PRIVACY_POLICY_VERSION}`,
  lead:
    "Eldonia–Nex（下称“本服务”）是面向创作者与粉丝的创作平台。本政策具体说明我们收集哪些信息、出于何种目的、如何处理，便于您在使用前做出判断。",
  contactNote:
    "如需查阅、更正、删除、停止使用个人信息，或其他隐私相关咨询，请通过帮助 → 联系我们（账户类别）联系我们。我们将在核实身份后于合理期限内处理。",
};

export const PRIVACY_POLICY: Record<UiLocale, PrivacyPolicyDoc> = {
  ja: JA,
  en: EN,
  ko: KO,
  "zh-CN": ZH,
};

/** Shorter bullets for signup consent UI (same version). */
export const PRIVACY_POLICY_CONSENT_SUMMARY: Record<
  UiLocale,
  { title: string; lead: string; body: string[]; requiredLabel: string }
> = {
  ja: {
    title: "プライバシーポリシー",
    lead: "登録・決済・投稿・ログ等の取り扱いを、判断しやすいよう要点で確認します。詳細は /privacy を参照してください。",
    body: [
      "取得する主な情報: アカウント（メール等）、プロフィール、投稿コンテンツ、取引・決済ステータス、紹介コード紐付け、端末/IP 等の技術ログ、サポート内容、言語・翻訳設定。",
      "利用目的: 認証、サービス提供、取引処理、紹介還元、通知、サポート、セキュリティ・不正防止、改善分析、法令対応、多言語翻訳。",
      "決済のカード番号等は Stripe 等の決済事業者が処理し、当社はカード番号を保管しません。",
      "運営に必要な範囲で Supabase / Vercel / Stripe / 翻訳事業者等に処理を委託・連携します。販売目的での個人情報の売却はしません。",
      "データは国外クラウドで処理される場合があります。保管は目的・法令に必要な期間とし、削除時も紛争・法令対応のためログ等を一定期間残すことがあります。",
      "開示・訂正・削除・利用停止等はヘルプのお問い合わせから請求できます（本人確認のうえ対応）。詳細・権利の説明はプライバシーポリシー全文を確認してください。",
    ],
    requiredLabel:
      "プライバシーポリシー（取得情報・目的・委託・権利）を理解し、詳細を /privacy で確認できることを確認しました",
  },
  en: {
    title: "Privacy Policy",
    lead: "Key points on registration, payments, posts, and logs. Full details are at /privacy.",
    body: [
      "We collect account data (e.g. email), profile, posts, transaction/payment status, referral attribution, technical logs (device/IP), support content, and locale/translation settings.",
      "We use data for auth, providing the Service, transactions, referral payouts, notifications, support, security/abuse prevention, improvement analytics, legal compliance, and translation.",
      "Card numbers are processed by Stripe (or similar); we do not store full card numbers.",
      "We use processors such as Supabase, Vercel, Stripe, and translation providers as needed. We do not sell personal data.",
      "Data may be processed on overseas cloud infrastructure. We retain data as needed for purposes/law; some logs may remain after deletion for disputes or legal duties.",
      "You may request access, correction, deletion, or restriction via Help → Contact after identity verification. Read the full Policy at /privacy.",
    ],
    requiredLabel:
      "I understand the Privacy Policy (data, purposes, processors, rights) and that full details are at /privacy",
  },
  ko: {
    title: "개인정보 처리방침",
    lead: "등록·결제·게시·로그 처리의 요점입니다. 전문은 /privacy 를 확인하세요.",
    body: [
      "수집 정보: 계정(이메일 등), 프로필, 게시물, 거래·결제 상태, 소개 코드 연결, 기기/IP 등 기술 로그, 지원 내용, 언어·번역 설정.",
      "이용 목적: 인증, 서비스 제공, 거래, 소개 환원, 알림, 지원, 보안·부정 방지, 개선 분석, 법령 준수, 번역.",
      "카드 번호 등은 Stripe 등 결제사가 처리하며, 당사는 카드 번호를 보관하지 않습니다.",
      "Supabase / Vercel / Stripe / 번역 제공자 등에 필요한 범위로 처리를 위탁·연동합니다. 판매 목적의 개인정보 매각은 하지 않습니다.",
      "해외 클라우드에서 처리될 수 있습니다. 보관은 목적·법령에 필요 기간이며, 삭제 후에도 분쟁·법령 대응을 위해 로그를 일정 기간 남길 수 있습니다.",
      "열람·정정·삭제·이용 정지는 도움말 문의로 요청할 수 있습니다. 전문은 /privacy 를 확인하세요.",
    ],
    requiredLabel:
      "개인정보 처리방침(수집·목적·위탁·권리)을 이해했고 전문은 /privacy 에서 확인할 수 있음을 확인했습니다",
  },
  "zh-CN": {
    title: "隐私政策",
    lead: "关于注册、支付、内容与日志处理的要点。全文见 /privacy。",
    body: [
      "收集信息：账户（邮箱等）、资料、发布内容、交易/支付状态、推荐码关联、设备/IP 等技术日志、支持内容、语言与翻译设置。",
      "使用目的：认证、提供服务、交易、介绍费返还、通知、支持、安全与防滥用、改进分析、合规、翻译。",
      "卡号等由 Stripe 等支付机构处理，我们不保存完整卡号。",
      "在必要范围内委托/对接 Supabase、Vercel、Stripe、翻译服务商等。我们不会出售个人信息。",
      "数据可能在境外云上处理。保留期限按目的与法律要求；删除后仍可能为纠纷或合规保留部分日志。",
      "可通过帮助→联系我们申请查阅、更正、删除或限制处理。请阅读 /privacy 全文。",
    ],
    requiredLabel: "我已了解隐私政策（信息、目的、处理方、权利），并确认可在 /privacy 查看全文",
  },
};
