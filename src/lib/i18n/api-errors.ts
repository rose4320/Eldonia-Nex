import type { UiLocale } from "@/lib/i18n/locale";

export type ApiErrorKey =
  | "loginRequired"
  | "invalidInput"
  | "titleRequired"
  | "invalidStatus"
  | "alreadyApplied"
  | "missingFields";

const API_ERRORS: Record<ApiErrorKey, Record<UiLocale, string>> = {
  loginRequired: {
    ja: "ログインが必要です。",
    en: "Log in required.",
    ko: "로그인이 필요합니다.",
    "zh-CN": "需要登录。",
  },
  invalidInput: {
    ja: "入力内容を確認してください。",
    en: "Please check your input.",
    ko: "입력 내용을 확인하세요.",
    "zh-CN": "请检查输入内容。",
  },
  titleRequired: {
    ja: "タイトルと詳細は必須です。",
    en: "Title and description are required.",
    ko: "제목과 상세 설명은 필수입니다.",
    "zh-CN": "标题和详情为必填项。",
  },
  invalidStatus: {
    ja: "無効なステータスです。",
    en: "Invalid status.",
    ko: "잘못된 상태입니다.",
    "zh-CN": "无效状态。",
  },
  alreadyApplied: {
    ja: "すでに応募済みです。",
    en: "You have already applied.",
    ko: "이미 지원했습니다.",
    "zh-CN": "您已申请过该职位。",
  },
  missingFields: {
    ja: "必要な項目が不足しています。",
    en: "Required fields are missing.",
    ko: "필수 항목이 누락되었습니다.",
    "zh-CN": "缺少必填项。",
  },
};

export function apiError(key: ApiErrorKey, locale: UiLocale): string {
  return API_ERRORS[key][locale] ?? API_ERRORS[key].en;
}
