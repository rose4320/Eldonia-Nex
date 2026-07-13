import type { ContentTranslationLocale } from "@/lib/translation/config";
import { createTranslationHash, shouldTranslate } from "@/lib/translation/hash";

const GOOGLE_TRANSLATE_ENDPOINT = "https://translation.googleapis.com/language/translate/v2";

type GoogleTranslateResponse = {
  data?: {
    translations?: Array<{
      translatedText?: string;
      detectedSourceLanguage?: string;
    }>;
  };
  error?: {
    message?: string;
  };
};

export async function translateTextWithGoogle(params: {
  text: string;
  sourceLocale: ContentTranslationLocale;
  targetLocale: ContentTranslationLocale;
  apiKey?: string;
}): Promise<{ translatedText: string; sourceHash: string }> {
  const sourceHash = createTranslationHash({
    sourceLocale: params.sourceLocale,
    targetLocale: params.targetLocale,
    text: params.text,
  });

  if (!shouldTranslate(params)) {
    return { translatedText: params.text, sourceHash };
  }

  const apiKey =
    params.apiKey ??
    process.env.GOOGLE_TRANSLATE_API_KEY ??
    process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_TRANSLATE_API_KEY is not configured.");
  }

  const response = await fetch(`${GOOGLE_TRANSLATE_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: params.text,
      source: params.sourceLocale,
      target: params.targetLocale,
      format: "text",
    }),
  });

  const payload = (await response.json()) as GoogleTranslateResponse;

  if (!response.ok) {
    throw new Error(payload.error?.message ?? "Google Translation API request failed.");
  }

  const translatedText = payload.data?.translations?.[0]?.translatedText;

  if (!translatedText) {
    throw new Error("Google Translation API returned an empty translation.");
  }

  return { translatedText, sourceHash };
}
