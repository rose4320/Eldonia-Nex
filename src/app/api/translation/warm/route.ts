import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  warmContentTranslations,
  type ContentTranslationEntityType,
} from "@/lib/translation/content-cache";

type WarmBody = {
  entityType?: ContentTranslationEntityType;
  entityId?: string;
  sourceLocale?: string;
  fields?: Array<{ fieldName: string; text: string }>;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
  }

  const body = (await request.json()) as WarmBody;

  if (
    !body.entityType ||
    !body.entityId ||
    !body.sourceLocale ||
    !body.fields?.length
  ) {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (
    body.entityType !== "community_thread" &&
    body.entityType !== "community_reply" &&
    body.entityType !== "lab_post"
  ) {
    return NextResponse.json({ error: "Unsupported entity type." }, { status: 400 });
  }

  const result = await warmContentTranslations({
    entityType: body.entityType,
    entityId: body.entityId,
    sourceLocale: body.sourceLocale,
    fields: body.fields,
  });

  return NextResponse.json({ ok: true, ...result });
}
