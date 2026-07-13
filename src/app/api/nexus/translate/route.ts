import { NextResponse } from "next/server";
import {
  normalizeNexusLocale,
  translateNexusDemo,
} from "@/lib/nexus-translate/translate";
import { translateTextWithGoogle } from "@/lib/translation/google";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    text?: string;
    target?: string;
    source?: string;
  };

  if (!body.text?.trim()) {
    return NextResponse.json({ error: "text が必要です。" }, { status: 400 });
  }

  const target = normalizeNexusLocale(body.target ?? "en");
  const source = normalizeNexusLocale(body.source);

  if (source === target) {
    return NextResponse.json({
      translated: body.text.trim(),
      target,
      mode: "passthrough",
    });
  }

  try {
    const google = await translateTextWithGoogle({
      text: body.text,
      sourceLocale: source,
      targetLocale: target,
    });
    return NextResponse.json({
      translated: google.translatedText,
      target,
      mode: "google",
    });
  } catch {
    const result = translateNexusDemo(body.text, target, source);
    return NextResponse.json({
      translated: result.text,
      target,
      mode: result.mode,
    });
  }
}
