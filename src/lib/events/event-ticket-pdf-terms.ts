type EventFormat = "online" | "offline" | "hybrid";
type EventLocale = "ja" | "en" | "ko" | "zh-CN";

export type PdfTermsBlock = {
  title: string;
  items: string[];
};

const COMMON: Record<EventLocale, PdfTermsBlock> = {
  ja: {
    title: "共通規約",
    items: [
      "本チケットは購入者本人のみ有効です（1人1枚）。",
      "チケットの転売・譲渡・共有（SNS 等での再配布）は禁止です。",
      "不正利用・偽造が判明した場合、入場拒否・チケット無効化を行います。",
      "イベント中止時の払い戻しは Eldonia-Nex 利用規約および主催者告知に従います。",
    ],
  },
  en: {
    title: "General terms",
    items: [
      "Valid for the ticket holder only (one ticket per person).",
      "Resale, transfer, or redistribution (including on social media) is prohibited.",
      "Fraud or forgery may result in denied entry and ticket cancellation.",
      "Refunds if an event is cancelled follow Eldonia-Nex terms and organizer notices.",
    ],
  },
  ko: {
    title: "공통 규정",
    items: [
      "본 티켓은 구매자 본인만 유효합니다(1인 1매).",
      "티켓 재판매·양도·공유(SNS 재배포 포함)는 금지됩니다.",
      "부정 이용·위조 적발 시 입장 거부 및 티켓 무효 처리됩니다.",
      "행사 취소 시 환불은 Eldonia-Nex 이용약관 및 주최자 공지를 따릅니다.",
    ],
  },
  "zh-CN": {
    title: "通用条款",
    items: [
      "本票仅限购票者本人使用（一人一票）。",
      "禁止转售、转让或分享（含在社交媒体再传播）。",
      "发现欺诈或伪造将拒绝入场并作废票券。",
      "活动取消时的退款依 Eldonia-Nex 条款及主办方公告。",
    ],
  },
};

const VENUE: Record<EventLocale, PdfTermsBlock> = {
  ja: {
    title: "会場での禁止事項・注意事項",
    items: [
      "危険物・火器・刃物・可燃物・酒類の持ち込みは禁止です。",
      "録画・録音機材、大型三脚、ドローン等は主催者許可なく持ち込めません。",
      "飲食物の持ち込みはイベント案内に従ってください（原則禁止の場合あり）。",
      "入場後の再入場はスタッフ指示に従い、場合により不可です。",
      "スタッフの指示に従わない場合、退場または入場拒否となることがあります。",
      "会場内での迷惑行為・大声・撮影フラッシュ等は禁止です。",
    ],
  },
  en: {
    title: "Venue prohibitions & notices",
    items: [
      "No dangerous items, weapons, blades, flammables, or alcohol.",
      "Recording gear, large tripods, and drones require organizer approval.",
      "Outside food and drinks follow the event notice (may be prohibited).",
      "Re-entry after admission may be restricted; follow staff instructions.",
      "Failure to follow staff directions may result in removal or denied entry.",
      "Disruptive behavior, loud noise, and camera flash are prohibited.",
    ],
  },
  ko: {
    title: "현장 금지·유의사항",
    items: [
      "위험물·화기·칼·인화물·주류 반입 금지.",
      "촬영 장비·대형 삼각대·드론은 주최자 허가 없이 반입 불가.",
      "음식물 반입은 행사 안내를 따릅니다(원칙 금지일 수 있음).",
      "입장 후 재입장은 스태프 안내에 따르며 제한될 수 있습니다.",
      "스태프 지시 불이행 시 퇴장 또는 입장 거부될 수 있습니다.",
      "현장 방해 행위·큰 소음·플래시 촬영 금지.",
    ],
  },
  "zh-CN": {
    title: "会场禁止事项与注意事项",
    items: [
      "禁止携带危险物、火器、刀具、易燃物及酒类。",
      "录音录像设备、大型三脚架、无人机等需主办方许可。",
      "饮食带入依活动公告（可能原则上禁止）。",
      "入场后再入场可能受限，请遵从工作人员指示。",
      "不遵从工作人员指示可能被请出或拒绝入场。",
      "禁止扰乱秩序、大声喧哗及闪光拍摄。",
    ],
  },
};

const ONLINE: Record<EventLocale, PdfTermsBlock> = {
  ja: {
    title: "オンライン参加の禁止事項",
    items: [
      "配信 URL・視聴ルームリンクの第三者への共有は禁止です。",
      "配信の録画・録音・スクリーンショットの公開は禁止です。",
      "アカウントの貸し借り・同時視聴による共有は禁止です。",
      "通信環境・端末トラブルによる視聴不能は補償対象外となる場合があります。",
    ],
  },
  en: {
    title: "Online prohibitions",
    items: [
      "Do not share stream URLs or watch-room links with others.",
      "Recording, capturing, or publishing the stream is prohibited.",
      "Account sharing or simultaneous viewing on multiple devices is prohibited.",
      "Viewing issues due to network or device problems may not be compensated.",
    ],
  },
  ko: {
    title: "온라인 참가 금지사항",
    items: [
      "스트리밍 URL·시청실 링크의 제3자 공유 금지.",
      "스트리밍 녹화·녹음·스크린샷 공개 금지.",
      "계정 대여·동시 시청 공유 금지.",
      "통신·기기 문제로 인한 시청 불가는 보상 대상이 아닐 수 있습니다.",
    ],
  },
  "zh-CN": {
    title: "在线参与禁止事项",
    items: [
      "禁止向他人分享流媒体 URL 或观看室链接。",
      "禁止录制、录音或公开直播截图。",
      "禁止账号外借或多端同时观看共享。",
      "因网络或设备问题无法观看可能不在补偿范围内。",
    ],
  },
};

const COMPETITION: Record<EventLocale, PdfTermsBlock> = {
  ja: {
    title: "展示・ピッチイベント向け追加事項",
    items: [
      "出展作品・ピッチ内容の無断撮影・録画・転載・SNS 投稿は禁止です。",
      "デモ端末・展示機材への不正操作・アカウント入力は禁止です。",
      "出展者・審査員への迷惑行為・直接の営業・勧誘は禁止です。",
      "展示物の持ち出し・接触はスタッフ指示がある場合のみ可能です。",
    ],
  },
  en: {
    title: "Showcase & pitch — additional rules",
    items: [
      "Do not photograph, record, repost, or share exhibits or pitches without permission.",
      "Do not tamper with demo devices or enter credentials on exhibit hardware.",
      "Harassment, direct solicitation, or sales pitches to exhibitors or judges are prohibited.",
      "Do not touch or remove exhibits unless staff instruct you to.",
    ],
  },
  ko: {
    title: "전시·피치 행사 추가 사항",
    items: [
      "출품작·피치 내용의 무단 촬영·녹화·전재·SNS 게시 금지.",
      "데모 기기·전시 장비 무단 조작·계정 입력 금지.",
      "출展자·심사위원에 대한 방해·직접 영업·권유 금지.",
      "전시물 반출·접촉은 스태프 안내가 있을 때만 가능.",
    ],
  },
  "zh-CN": {
    title: "展示与 pitch 活动补充事项",
    items: [
      "禁止未经许可拍摄、录制、转载或在社交媒体发布展品与 pitch 内容。",
      "禁止擅自操作演示设备或在展机输入账号。",
      "禁止骚扰参展者或评委，禁止直接推销或 solicitation。",
      "除工作人员指示外，禁止接触或带离展品。",
    ],
  },
};

/** Short highlights shown on page 1 ticket face. */
export function getEventTicketPdfHighlights(
  locale: EventLocale,
  format: EventFormat,
  category: string | null,
): string[] {
  const loc = locale in COMMON ? locale : "ja";
  const items: string[] = [
    locale === "ja"
      ? "転売・譲渡・共有禁止"
      : locale === "ko"
        ? "재판매·양도·공유 금지"
        : locale === "zh-CN"
          ? "禁止转售、转让或分享"
          : "No resale, transfer, or sharing",
  ];

  if (format !== "online") {
    items.push(
      locale === "ja"
        ? "危険物・火器・刃物・酒類の持ち込み禁止"
        : locale === "ko"
          ? "위험물·화기·칼·주류 반입 금지"
          : locale === "zh-CN"
            ? "禁止携带危险物、火器、刀具、酒类"
            : "No weapons, dangerous items, or alcohol",
    );
  }

  if (format !== "offline") {
    items.push(
      locale === "ja"
        ? "配信 URL 共有・録画公開禁止"
        : locale === "ko"
          ? "스트리밍 URL 공유·녹화 공개 금지"
          : locale === "zh-CN"
            ? "禁止分享直播链接或公开录制"
            : "No sharing stream URLs or publishing recordings",
    );
  }

  if (category === "competition") {
    items.push(
      locale === "ja"
        ? "展示・ピッチの無断撮影・転載禁止"
        : locale === "ko"
          ? "전시·피치 무단 촬영·전재 금지"
          : locale === "zh-CN"
            ? "禁止未经许可拍摄或转载展示与 pitch"
            : "No unauthorized photos or reposts of exhibits/pitches",
    );
  }

  items.push(
    locale === "ja"
      ? "詳細は下記の全文をご確認ください"
      : locale === "ko"
        ? "자세한 내용은 아래 전문을 확인하세요"
        : locale === "zh-CN"
          ? "详见下方全文"
          : "See the full terms below",
  );

  return items;
}

export function getEventTicketPdfTerms(
  locale: EventLocale,
  format: EventFormat,
  category: string | null = null,
): PdfTermsBlock[] {
  const loc = locale in COMMON ? locale : "ja";
  const blocks: PdfTermsBlock[] = [COMMON[loc]];

  if (format === "online") {
    blocks.push(ONLINE[loc]);
  } else if (format === "offline") {
    blocks.push(VENUE[loc]);
  } else {
    blocks.push(VENUE[loc], ONLINE[loc]);
  }

  if (category === "competition") {
    blocks.push(COMPETITION[loc]);
  }

  return blocks;
}
