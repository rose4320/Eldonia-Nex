import type { UiLocale } from "@/lib/i18n/locale";

export type TermsSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type TermsOfServiceDoc = {
  version: string;
  updatedLabel: string;
  lead: string;
  sections: TermsSection[];
  contactNote: string;
};

/** Full Terms for `/terms`. Signup uses a shorter summary of the same version. */
export const TERMS_OF_SERVICE_VERSION = "2026-07-14";

const JA: TermsOfServiceDoc = {
  version: TERMS_OF_SERVICE_VERSION,
  updatedLabel: `最終更新: ${TERMS_OF_SERVICE_VERSION}`,
  lead:
    "本利用規約（以下「本規約」）は、Eldonia–Nex（以下「本サービス」）の利用条件です。特に個人情報の取り扱い、作品・投稿の著作権、および紹介プログラム（紹介料）について、利用者が判断できるよう具体的に定めます。",
  contactNote:
    "本規約・著作権・個人情報・紹介料に関するお問い合わせは、ヘルプのお問い合わせフォームからご連絡ください。権利侵害の申告は「報告」機能またはサポート窓口へ、可能な限り根拠資料を添えてください。",
  sections: [
    {
      id: "agreement",
      title: "1. 合意・適用",
      paragraphs: [
        "本サービスに登録・ログイン・投稿・購入・閲覧等した時点で、本規約および関連ポリシー（プライバシーポリシー、投稿ガイドライン、取引条件等）に同意したものとみなします。",
        "本規約と個別規約が矛盾する場合、個別機能の説明が優先されることがあります。重要な変更はサイト上で告知します。",
      ],
    },
    {
      id: "account",
      title: "2. アカウント",
      paragraphs: [
        "アカウントは本人が管理し、第三者への貸与・譲渡・共有、なりすましは禁止します。",
        "認証情報の管理不備による損害について、当社に故意または重過失がない限り責任を負いません。不正利用の疑いがある場合は直ちにサポートへ連絡してください。",
      ],
    },
    {
      id: "personal-data",
      title: "3. 個人情報の取り扱い（規約上の位置づけ）",
      paragraphs: [
        "個人情報の取得・利用・保管・委託・ユーザーの権利等の詳細は、プライバシーポリシー（/privacy）に定めます。本規約への同意は、当該ポリシーの内容を確認したうえでの利用を前提とします。",
        "利用者は、次の点を理解し、遵守するものとします。",
      ],
      bullets: [
        "自ら登録・公開する情報（氏名に近い表示名、連絡先、プロフィール、肖像を含む画像等）について、公開範囲と第三者による閲覧・保存・転載リスクを自己の責任で判断すること。",
        "他者の個人情報（氏名、住所、連絡先、顔写真、私生活に関する情報等）を、本人の同意なく投稿・拡散・晒し・特定行為に用いないこと。",
        "サポート・本人確認・収益支払いのために求めた情報は、虚偽なく正確に提供すること。",
        "個人情報の開示・訂正・削除・利用停止等の請求は、プライバシーポリシーに従いヘルプ窓口から行うこと。",
        "機械翻訳・多言語表示のため、投稿テキスト等が翻訳処理・キャッシュされる場合があること（詳細はプライバシーポリシー）。",
      ],
    },
    {
      id: "copyright-ownership",
      title: "4. 作品・コンテンツの著作権（帰属）",
      paragraphs: [
        "利用者が本サービスに投稿・アップロードした作品・文章・画像・動画・音声・デザイン・コメントその他のコンテンツ（以下「ユーザーコンテンツ」）の著作権は、法令に別段の定めがある場合を除き、原則として当該利用者（または正当な権利者）に帰属します。",
        "当社は、ユーザーコンテンツの著作権を利用者から買い取るものではありません。共同制作（Lab 等）における権利の按分・共有は、参加者間の合意および当該機能の説明に従います。合意がない場合の紛争は、原則として当事者間で解決するものとします。",
      ],
      bullets: [
        "投稿者は、投稿時点で、当該コンテンツを投稿・公開・販売・ライセンスする正当な権利を有していることを表明・保証します。",
        "第三者の著作物・商標・肖像・パブリシティ権等を含む場合は、必要な許諾を得たうえで投稿してください。",
        "AI 生成物を含む場合は、利用規約・法令・各モデル提供条件を守り、権利関係が不明なまま他人の権利を侵害しないこと。",
      ],
    },
    {
      id: "copyright-license",
      title: "5. 当社への利用許諾（運営に必要な範囲）",
      paragraphs: [
        "サービス提供のため、利用者は当社に対し、ユーザーコンテンツについて、非独占的・無償・世界的・サブライセンス可能な利用許諾を付与します。許諾の範囲は次のとおり、運営に合理的に必要な限度に限ります。",
      ],
      bullets: [
        "本サービス上での表示、配信、キャッシュ、バックアップ、サムネイル生成、形式変換。",
        "セキュリティ、不正検知、モデレーション、サポート対応。",
        "多言語翻訳・字幕等の派生表示（翻訳 Nexus 等）。",
        "本サービスの紹介・広報（例: トップや特集での作品紹介。過度な改変や、販売を装う利用はしません）。",
        "法令・権利侵害対応のために必要な複製・保全。",
      ],
    },
    {
      id: "copyright-limits",
      title: "6. 禁止される著作権・権利侵害行為",
      paragraphs: [
        "次の行為は禁止します。違反が確認された場合、投稿の非公開・削除、アカウント制限・停止、取引保留、関係機関への通報、損害賠償請求等を行うことがあります。",
      ],
      bullets: [
        "盗用、無断転載、トレースの権利侵害利用、権利者の許諾なき二次創作の公開（権利者が許容する範囲を超えるもの）。",
        "他者の個人情報・肖像を同意なく晒す行為、ドキシング。",
        "権利者を偽った申告、なりすまし、権利侵害コンテンツの販売。",
        "本サービスのスクレイピング等による大量収集・再配布（当社が明示許可した場合を除く）。",
      ],
    },
    {
      id: "takedown",
      title: "7. 権利侵害の申告と対応",
      paragraphs: [
        "著作権その他の権利侵害を発見した権利者（または代理人）は、対象 URL、権利の内容、連絡先、申告が正確である旨の表明を添えてサポートへ連絡してください。",
        "当社は、申告内容を確認のうえ、一時非公開・削除・アカウント措置等の暫定対応を行うことがあります。虚偽申告が判明した場合は、申告者に対して措置や請求を検討することがあります。",
      ],
    },
    {
      id: "referral",
      title: "8. 紹介プログラム・紹介料",
      paragraphs: [
        "本サービスは、有料プラン会員向けに紹介プログラムを提供する場合があります。紹介コード・紹介 URL・QR、還元率、支払条件の最新表示は設定画面（紹介コード）および告知に従います。本条はプログラムの基本条件です。",
        "紹介料は、当社が別途定める計算・審査・支払スケジュールに基づき付与されます。表示上の見込みと実際の支払額は、返金・チャージバック・不正判定・為替・税金・端数処理等により異なる場合があります。",
      ],
      bullets: [
        "対象: 原則として Free 以外の有料プラン会員。サインイン確定後に紹介コードが付与されます（資格を満たさない場合はコード非表示または利用不可）。",
        "還元の目安（現行方針）: 紹介が成立し、被紹介者の有料利用が継続する場合、紹介成立から3か月目以降、日本国内向け紹介は対象額の10%、日本以外向け紹介は15%を還元する方針です（「永久還元」は、被紹介者の対象課金が継続し、かつプログラム条件を満たす期間に限ります）。",
        "対象額・起算: 対象となる課金の種類（プラン料金等）、按分、税込/税抜、無料期間・キャンペーンの扱い、3か月目の起算日は、当社が設定画面またはヘルプで定める定義に従います。",
        "支払・本人確認: 紹介料の受取りには、振込先（銀行口座等）の登録が必須です。振込先が未入力の場合、振込は実行できません。加えて本人確認・税務上必要な情報の提供が求められる場合があります。情報が不足・虚偽の場合、支払を保留または拒否することがあります。",
        "変更・終了: 還元率・対象・支払条件は、事業状況に応じて予告のうえ変更・停止・終了することがあります（§22 の料金・手数料変更は運営の承認プロセスを経ます）。既に確定した未払い分の扱いは告知に従います。",
        "【重要】禁止: 自己紹介（自作自演）、複数アカウントによる循環紹介、ボット・購入による架空登録、虚偽の特典勧誘、スパム的な勧誘、その他不正な紹介料取得。確認時は還元取消・アカウント停止・損害賠償・通報の対象となります。",
      ],
    },
    {
      id: "conduct",
      title: "9. 禁止行為（一般）",
      paragraphs: [
        "誹謗中傷、名誉毀損、嫌がらせ、脅迫、差別、詐欺、不正アクセス、サービス妨害、法令違反となる行為は禁止します。",
        "違反時は、投稿制限、アカウント停止、取引保留、通報、損害賠償請求等の対象となります。",
      ],
    },
    {
      id: "platform-ip",
      title: "10. 本サービスの知的財産",
      paragraphs: [
        "本サービスの名称、ロゴ、UI、ドキュメント、当社が作成した素材等の権利は当社または正当な権利者に帰属します。利用者は、本サービスの利用に必要な範囲を超えて複製・改変・再配布してはなりません。",
      ],
    },
    {
      id: "disclaimer",
      title: "11. 免責・責任制限",
      paragraphs: [
        "本サービスは現状有姿で提供されます。ユーザー間の取引・共同制作・権利関係の紛争について、当社に故意または重過失がない限り、当社は責任を負いません。",
        "紹介料・収益の見込み表示は保証ではありません。法令で認められる最大限の範囲で、間接損害・逸失利益等について責任を負いません。消費者契約法等により免責が制限される場合は、その範囲で適用されます。",
      ],
    },
    {
      id: "changes",
      title: "12. 変更・準拠法",
      paragraphs: [
        "本規約は改定されることがあります。重要な変更は告知します。改定後の利用をもって同意とみなすことがあります。",
        "本規約は日本法を準拠法とし、紛争は当社本店所在地を管轄する裁判所を第一審の専属的合意管轄とします（消費者契約に該当する場合は強行法規が優先）。",
      ],
    },
  ],
};

const EN: TermsOfServiceDoc = {
  version: TERMS_OF_SERVICE_VERSION,
  updatedLabel: `Last updated: ${TERMS_OF_SERVICE_VERSION}`,
  lead:
    "These Terms of Service (“Terms”) govern Eldonia–Nex (“the Service”). They explain—especially regarding personal data, artwork copyright, and referral fees—what you agree to when using the Service.",
  contactNote:
    "For questions about these Terms, copyright, personal data, or referral fees, contact Help → Contact. For infringement reports, use reporting tools or Support and include evidence where possible.",
  sections: [
    {
      id: "agreement",
      title: "1. Agreement and scope",
      paragraphs: [
        "By registering, logging in, posting, purchasing, or otherwise using the Service, you agree to these Terms and related policies (Privacy Policy, content guidelines, commerce terms, etc.).",
        "If these Terms conflict with feature-specific terms, the feature terms may prevail. Material changes will be announced on the site.",
      ],
    },
    {
      id: "account",
      title: "2. Accounts",
      paragraphs: [
        "You must keep your account under your control. Lending, transferring, sharing credentials, or impersonation is prohibited.",
        "Unless we act with willful misconduct or gross negligence, we are not liable for losses from compromised credentials. Contact Support immediately if you suspect misuse.",
      ],
    },
    {
      id: "personal-data",
      title: "3. Personal information (relationship to Privacy Policy)",
      paragraphs: [
        "Details on collection, use, retention, processors, and your rights are in the Privacy Policy (/privacy). Agreeing to these Terms assumes you have reviewed that Policy.",
        "You also agree to the following:",
      ],
      bullets: [
        "You decide—at your own risk—what personal or profile information (including images that may identify you) to publish and who can see it.",
        "Do not post, spread, or dox others’ personal data (name, address, contact, likeness, private life) without consent.",
        "Provide accurate information when Support, identity checks, or payouts require it.",
        "Requests for access, correction, deletion, or restriction follow the Privacy Policy via Help.",
        "Posts may be machine-translated and cached for multilingual display (see Privacy Policy).",
      ],
    },
    {
      id: "copyright-ownership",
      title: "4. Copyright in your works (ownership)",
      paragraphs: [
        "Except where law provides otherwise, copyright in content you upload or post (“User Content”) remains with you (or the rightful owner).",
        "We do not buy your copyright. For Lab/collab works, ownership splits follow participant agreements and feature rules; absent agreement, disputes are primarily between the parties.",
      ],
      bullets: [
        "By posting, you represent you have the rights to post, publish, sell, or license the content.",
        "If content includes third-party copyrights, trademarks, or likenesses, obtain required permissions first.",
        "For AI-generated material, follow applicable laws and model terms; do not infringe others’ rights.",
      ],
    },
    {
      id: "copyright-license",
      title: "5. License you grant us (limited to operating the Service)",
      paragraphs: [
        "You grant Eldonia–Nex a non-exclusive, royalty-free, worldwide, sublicensable license to use User Content only as reasonably needed to operate the Service, including:",
      ],
      bullets: [
        "Display, delivery, caching, backup, thumbnails, and format conversion on the Service.",
        "Security, abuse detection, moderation, and support.",
        "Machine translation and related derivative displays (Translation Nexus).",
        "Limited promotion of the Service (e.g. featuring works on the home page)—not misleading commercial exploitation.",
        "Copies retained as needed for legal or infringement handling.",
      ],
    },
    {
      id: "copyright-limits",
      title: "6. Prohibited IP and privacy violations",
      paragraphs: [
        "The following are prohibited. Confirmed violations may lead to unpublishing/removal, account limits or suspension, held transactions, reports to authorities, and claims for damages.",
      ],
      bullets: [
        "Theft, unauthorized reposts, infringing traces, or fan works beyond what rights holders allow.",
        "Doxxing or posting others’ personal data/likeness without consent.",
        "False rights claims, impersonation, or selling infringing content.",
        "Scraping or bulk redistribution of the Service without express permission.",
      ],
    },
    {
      id: "takedown",
      title: "7. Infringement reports",
      paragraphs: [
        "Rights holders (or agents) should contact Support with the URL, description of the right, contact details, and a good-faith statement of accuracy.",
        "We may take provisional steps (unpublish, remove, account action). False reports may lead to measures against the reporter.",
      ],
    },
    {
      id: "referral",
      title: "8. Referral program and referral fees",
      paragraphs: [
        "We may offer a referral program to paid-plan members. Codes, URLs, QR codes, rates, and payout rules shown in Settings (Referral) and announcements control the current offer. This section sets the baseline.",
        "Referral fees are calculated, reviewed, and paid under our schedules. Estimated amounts may differ from actual payouts due to refunds, chargebacks, fraud decisions, FX, taxes, and rounding.",
      ],
      bullets: [
        "Eligibility: generally non-Free paid plans; a referral code is issued after confirmed sign-in (codes may be hidden if ineligible).",
        "Current rate policy: after a successful referral, from the third month onward while the referred user’s qualifying paid use continues, referrals in Japan earn 10% and international referrals earn 15% of the defined base (“perpetual” only while qualifying billing continues and program conditions are met).",
        "Base amount & timing: which charges count, tax treatment, promos/free trials, and how “month 3” is counted follow definitions in Settings or Help.",
        "Payouts / KYC: receiving fees requires payout bank details in Settings — transfers cannot run without them. Identity and tax information may also be required; incomplete or false data may delay or block payout.",
        "Changes: we may change, suspend, or end rates and terms with notice (fee changes follow our approval process). Treatment of already accrued unpaid amounts follows the notice.",
        "[Important] Prohibited: self-referrals, circular multi-accounting, bot/fake signups, deceptive incentive pitches, spam solicitation, or other abuse. Confirmed abuse may void fees and lead to suspension, damages claims, or reports.",
      ],
    },
    {
      id: "conduct",
      title: "9. General prohibited conduct",
      paragraphs: [
        "Defamation, harassment, threats, discrimination, fraud, unauthorized access, disruption, and illegal acts are prohibited.",
        "Violations may result in content limits, suspension, held transactions, reporting, and damages claims.",
      ],
    },
    {
      id: "platform-ip",
      title: "10. Our intellectual property",
      paragraphs: [
        "The Service name, logos, UI, docs, and our materials belong to us or rightful owners. Do not copy, modify, or redistribute beyond what is needed to use the Service.",
      ],
    },
    {
      id: "disclaimer",
      title: "11. Disclaimers and limitation of liability",
      paragraphs: [
        "The Service is provided as available. Except for willful misconduct or gross negligence, we are not responsible for disputes between users over deals, collabs, or rights.",
        "Referral-fee or earnings estimates are not guarantees. To the fullest extent permitted by law, we are not liable for indirect or consequential damages. Mandatory consumer protections still apply where required.",
      ],
    },
    {
      id: "changes",
      title: "12. Changes and governing law",
      paragraphs: [
        "We may update these Terms; material changes will be announced. Continued use may constitute acceptance.",
        "These Terms are governed by Japanese law. Exclusive jurisdiction of courts at our principal place of business applies for the first instance, subject to mandatory consumer rules.",
      ],
    },
  ],
};

const KO: TermsOfServiceDoc = {
  ...EN,
  updatedLabel: `최종 업데이트: ${TERMS_OF_SERVICE_VERSION}`,
  lead:
    "본 이용약관은 Eldonia–Nex 이용 조건입니다. 특히 개인정보, 작품 저작권, 소개 프로그램(소개료)에 대해 이용자가 판단할 수 있도록 구체적으로 정합니다.",
  contactNote:
    "약관·저작권·개인정보·소개료 문의는 도움말 → 문의로 연락해 주세요. 권리 침해 신고는 근거 자료를 함께 제출해 주세요.",
};

const ZH: TermsOfServiceDoc = {
  ...EN,
  updatedLabel: `最后更新: ${TERMS_OF_SERVICE_VERSION}`,
  lead:
    "本使用条款规定 Eldonia–Nex 的使用条件，尤其就个人信息、作品著作权与介绍费（推荐计划）作出便于用户判断的具体约定。",
  contactNote:
    "有关条款、著作权、个人信息或介绍费的问题，请通过帮助 → 联系我们咨询。侵权举报请尽量附上依据材料。",
};

export const TERMS_OF_SERVICE: Record<UiLocale, TermsOfServiceDoc> = {
  ja: JA,
  en: EN,
  ko: KO,
  "zh-CN": ZH,
};

export const TERMS_OF_SERVICE_CONSENT_SUMMARY: Record<
  UiLocale,
  { title: string; lead: string; body: string[]; requiredLabel: string }
> = {
  ja: {
    title: "利用規約",
    lead: "アカウント、個人情報、作品の著作権、紹介料の要点です。全文は /terms を確認してください。",
    body: [
      "アカウントは本人管理。貸与・なりすまし・不正利用は禁止です。",
      "個人情報の詳細はプライバシーポリシー（/privacy）。他者の個人情報の晒し・無断投稿は禁止。公開する自分の情報は自己責任で判断してください。",
      "投稿作品の著作権は原則投稿者（正当な権利者）に帰属します。当社は著作権を買い取りません。",
      "サービス運営に必要な範囲（表示・バックアップ・翻訳・モデレーション・限定的な紹介等）で、非独占の利用許諾を当社に付与します。",
      "紹介プログラム: 有料会員向け。成立から3か月目以降、国内10%・海外15%還元（方針）。不正紹介は禁止。詳細は /terms §8 と設定画面。",
      "盗用・無断転載・権利侵害コンテンツの投稿・販売は禁止。申告があれば非公開・削除等の対応を行うことがあります。",
      "誹謗中傷・詐欺等の禁止事項に違反した場合、制限・停止・通報・損害賠償等の対象となります。",
    ],
    requiredLabel:
      "利用規約（個人情報・著作権・紹介料・禁止事項）を理解し、全文を /terms で確認できることに同意しました",
  },
  en: {
    title: "Terms of Service",
    lead: "Key points on accounts, personal data, artwork copyright, and referral fees. Full text: /terms.",
    body: [
      "You control your account; sharing credentials or impersonation is prohibited.",
      "Personal-data details are in the Privacy Policy (/privacy). Do not dox others; you decide what of your own data to publish.",
      "Copyright in your posts generally stays with you (or the rightful owner). We do not buy your copyright.",
      "You grant us a limited, non-exclusive license to operate the Service (display, backup, translation, moderation, limited featuring).",
      "Referral program: for paid members; from month 3, ~10% (JP) / 15% (intl) while qualifying use continues. Abuse is prohibited. See /terms §8 and Settings.",
      "Infringing uploads/sales are prohibited; we may unpublish or remove content after reports.",
      "Defamation, fraud, and similar violations may lead to limits, suspension, reporting, or damages claims.",
    ],
    requiredLabel:
      "I understand the Terms (personal data, copyright, referral fees, prohibitions) and that the full text is at /terms",
  },
  ko: {
    title: "이용약관",
    lead: "계정·개인정보·작품 저작권·소개료 요점입니다. 전문은 /terms.",
    body: [
      "계정은 본인이 관리하며 대여·사칭·부정 이용은 금지됩니다.",
      "개인정보 세부 사항은 개인정보 처리방침(/privacy). 타인의 개인정보 무단 게시는 금지. 공개할 본인 정보는 스스로 판단하세요.",
      "게시 작품의 저작권은 원칙적으로 게시자(정당한 권리자)에게 귀속되며, 당사는 저작권을 매수하지 않습니다.",
      "서비스 운영에 필요한 범위(표시·백업·번역·모더레이션·한정 소개 등)의 비독점 이용 허락을 부여합니다.",
      "소개 프로그램: 유료 회원 대상. 성립 후 3개월째부터 국내 10%·해외 15% 환원(방침). 부정 소개 금지. 상세는 /terms §8·설정.",
      "도용·무단 전재·권리 침해 콘텐츠 게시·판매는 금지이며, 신고 시 비공개·삭제 등 조치할 수 있습니다.",
      "비방·사기 등 위반 시 제한·정지·신고·손해배상 등의 대상이 됩니다.",
    ],
    requiredLabel:
      "이용약관(개인정보·저작권·소개료·금지사항)을 이해했고 전문은 /terms 에서 확인할 수 있음에 동의합니다",
  },
  "zh-CN": {
    title: "使用条款",
    lead: "关于账户、个人信息、作品著作权与介绍费的要点。全文见 /terms。",
    body: [
      "账户由本人管理，禁止出借、冒充或滥用。",
      "个人信息详见隐私政策（/privacy）。禁止未经同意公开他人信息；您自行判断公开哪些本人信息。",
      "所发作品著作权原则上归发布者（或合法权利人），我们不购买您的著作权。",
      "您授予我们为运营服务所需的有限非独占许可（展示、备份、翻译、审核、有限推荐等）。",
      "推荐计划：面向付费会员；自第3个月起国内约10%/海外15%返还（方针）。禁止作弊。详见 /terms §8 与设置。",
      "禁止盗用、未经授权转载或销售侵权内容；经举报可采取下架等措施。",
      "诽谤、欺诈等违规可能导致限制、停用、通报或索赔。",
    ],
    requiredLabel:
      "我已了解使用条款（个人信息、著作权、介绍费、禁止事项），并确认可在 /terms 查看全文",
  },
};

/** Expanded commerce terms including referral fees. */
export const COMMERCE_TERMS_CONSENT_SUMMARY: Record<
  UiLocale,
  { title: string; lead: string; body: string[]; requiredLabel: string }
> = {
  ja: {
    title: "取引・返金・収益化条件",
    lead: "販売、イベント、仕事依頼、紹介料など金銭を伴う活動の確認です。",
    body: [
      "販売・受注・イベント開催では、提供内容、価格、納期、キャンセル条件を明確にしてください。",
      "紹介料は有料会員向けプログラムの条件（概ね成立3か月目以降・国内10%/海外15%方針）に従い、設定画面の表示と審査・支払手続きが優先されます。振込先未入力では振込できません。見込み額は保証ではありません。",
      "【重要】虚偽の商品説明、存在しないサービスの販売、前払い詐欺、なりすまし販売、不正な紹介報酬の勧誘・自作自演紹介などの詐欺行為は厳禁です。",
      "【重要】詐欺・不正取引・紹介不正が確認された場合、取引の即時停止、還元取消、アカウント永久停止、関係機関への通報、損害賠償請求を行うことがあります。",
      "返金や紛争対応は、各取引の状態、決済状況、運営判断に基づいて処理されます。",
      "収益・紹介料の支払いには本人情報、振込先、税務上必要な情報の確認が必要になる場合があります。",
    ],
    requiredLabel:
      "取引・紹介料を含む収益化条件と詐欺・不正禁止事項を理解し、誠実な取引のみ行うことに同意しました",
  },
  en: {
    title: "Commerce & payouts",
    lead: "Sales, events, jobs, referral fees, and other paid activity.",
    body: [
      "Clearly state what you offer, price, timeline, and cancellation terms.",
      "Referral fees follow the paid-member program (generally from month 3; ~10% JP / 15% intl policy). Settings display and our review/payout process control. Payouts require bank details — no transfer without them. Estimates are not guarantees.",
      "[Important] Fraudulent listings, selling non-existent services, advance-payment scams, impersonation sales, and deceptive or self-referral schemes are strictly forbidden.",
      "[Important] Confirmed fraud or referral abuse may result in immediate holds, voided fees, permanent suspension, reporting to authorities, and pursuit of damages.",
      "Refunds and disputes are handled per transaction state and platform policy.",
      "Payouts of earnings or referral fees may require identity and tax information.",
    ],
    requiredLabel:
      "I understand commerce and referral-fee rules including fraud bans and will trade honestly",
  },
  ko: {
    title: "거래·환불·수익화 조건",
    lead: "판매, 이벤트, 의뢰, 소개료 등 금전이 수반되는 활동 확인입니다.",
    body: [
      "판매·수주·이벤트는 제공 내용, 가격, 납기, 취소 조건을 명확히 하세요.",
      "소개료는 유료 회원 프로그램 조건(대체로 성립 3개월째부터 국내 10%/해외 15% 방침)과 설정 화면·심사·지급 절차가 우선합니다. 예상액은 보장이 아닙니다.",
      "[중요] 허위 상품 설명, 존재하지 않는 서비스 판매, 선입 사기, 사칭 판매, 부정 소개 보수 권유·자작 소개 등 사기는 엄금입니다.",
      "[중요] 사기·부정 거래·소개 부정이 확인되면 거래 정지, 환원 취소, 계정 영구 정지, 신고, 손해배상을 할 수 있습니다.",
      "환불·분쟁은 거래 상태와 결제·운영 판단에 따릅니다.",
      "수익·소개료 지급에는 본인 정보·입금 계좌·세무 정보가 필요할 수 있습니다.",
    ],
    requiredLabel:
      "거래·소개료를 포함한 수익화 조건과 사기·부정 금지를 이해하고 성실한 거래만 하겠습니다",
  },
  "zh-CN": {
    title: "交易、退款与变现条件",
    lead: "销售、活动、委托、介绍费等涉及金钱的活动确认。",
    body: [
      "销售、接单、举办活动时请明确内容、价格、交付与取消条件。",
      "介绍费遵循付费会员计划条件（大致自第3个月起国内10%/海外15%方针），以设置页展示及审核打款流程为准。预估金额不作保证。",
      "[重要] 严禁虚假商品说明、销售不存在的服务、预付款诈骗、冒充销售、以及欺骗性介绍报酬劝诱或自推自介等欺诈。",
      "[重要] 一经确认欺诈、违规交易或介绍作弊，可立即停止交易、取消返还、永久停用、通报并索赔。",
      "退款与争议按交易状态、支付情况与运营判断处理。",
      "收益与介绍费打款可能需要身份、收款账户与税务信息。",
    ],
    requiredLabel: "我已了解含介绍费的变现条件及反欺诈规则，并承诺诚实交易",
  },
};

/** Expanded creator guidelines focusing on copyright. */
export const CREATOR_GUIDELINES_CONSENT_SUMMARY: Record<
  UiLocale,
  { title: string; lead: string; body: string[]; requiredLabel: string }
> = {
  ja: {
    title: "投稿・コンテンツガイドライン",
    lead: "作品投稿・販売・コミュニティで守る著作権・表現ルールです。",
    body: [
      "投稿者は、投稿コンテンツについて必要な著作権・肖像権・商標等の権利を有する（または許諾を得ている）ことを保証します。",
      "盗用、無断転載、権利侵害の二次利用、許諾なき商用利用は禁止です。",
      "共同制作物は、参加者間で権利・クレジット・収益分配を事前に合意してください。",
      "他者の個人情報・肖像を同意なく掲載しないでください。",
      "【重要】誹謗中傷、晒し、執拗な嫌がらせは、投稿・コメント・メッセージすべてで禁止です。",
      "年齢制限が必要な表現は適切に分類し、誤解を招く販売説明を避けてください。",
    ],
    requiredLabel:
      "著作権・肖像・個人情報を含む投稿ルールと禁止事項を理解し、権利侵害を行わないことに同意しました",
  },
  en: {
    title: "Content guidelines",
    lead: "Copyright and conduct rules for posting, selling, and community activity.",
    body: [
      "You warrant you own or have licenses for copyrights, likeness, and trademarks in what you post.",
      "Theft, unauthorized reposts, infringing derivatives, and unlicensed commercial use are prohibited.",
      "For collabs, agree credits, ownership, and revenue splits with participants in advance.",
      "Do not post others’ personal data or likeness without consent.",
      "[Important] Defamation, doxxing, and harassment are banned in posts, comments, and messages.",
      "Classify age-restricted content appropriately and avoid misleading sales descriptions.",
    ],
    requiredLabel:
      "I understand posting rules on copyright, likeness, and personal data, and will not infringe others’ rights",
  },
  ko: {
    title: "게시·콘텐츠 가이드라인",
    lead: "작품 게시·판매·커뮤니티에서 지킬 저작권·표현 규칙입니다.",
    body: [
      "게시자는 게시물에 필요한 저작권·초상권·상표 등 권리를 보유하거나 허락을 받았음을 보증합니다.",
      "도용·무단 전재·권리 침해 2차 이용·무단 상업 이용은 금지입니다.",
      "공동 제작물은 참여자 간 권리·크레딧·수익 배분을 사전에 합의하세요.",
      "타인의 개인정보·초상을 동의 없이 올리지 마세요.",
      "[중요] 비방·도싱·괴롭힘은 게시·댓글·메시지 모두에서 금지입니다.",
      "연령 제한 표현은 적절히 분류하고 오해 소지 있는 판매 설명을 피하세요.",
    ],
    requiredLabel:
      "저작권·초상·개인정보를 포함한 게시 규칙과 금지사항을 이해하고 권리를 침해하지 않겠습니다",
  },
  "zh-CN": {
    title: "内容指南",
    lead: "发布、销售与社区活动中应遵守的著作权与表达规则。",
    body: [
      "发布者保证对所发内容拥有或已获著作权、肖像权、商标等必要权利。",
      "禁止盗用、未经授权转载、侵权二创及无许可商用。",
      "协作作品请事先约定权利、署名与收益分配。",
      "未经同意不得发布他人个人信息或肖像。",
      "[重要] 禁止在帖文、评论、消息中进行诽谤、曝光隐私或骚扰。",
      "需年龄限制的内容应正确分类，避免误导性销售说明。",
    ],
    requiredLabel: "我已了解含著作权、肖像与个人信息的发布规则，并承诺不侵害他人权利",
  },
};
