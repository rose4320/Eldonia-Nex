import { NextResponse } from "next/server";
import {
  NEXUS_LOCALES,
  translateNexusDemo,
  type NexusLocale,
} from "@/lib/nexus-translate/translate";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    text?: string;
    target?: string;
    source?: string;
  };

  if (!body.text?.trim()) {
    return NextResponse.json({ error: "text が必要です。" }, { status: 400 });
  }

  const target = (body.target ?? "en") as NexusLocale;
  const validTarget = NEXUS_LOCALES.some((l) => l.value === target);
  if (!validTarget) {
    return NextResponse.json({ error: "未対応の言語です。" }, { status: 400 });
  }

  const source = body.source as NexusLocale | undefined;
  const result = translateNexusDemo(body.text, target, source);

  return NextResponse.json({
    translated: result.text,
    target,
    mode: result.mode,
  });
}
