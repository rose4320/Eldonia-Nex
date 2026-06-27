import { NextResponse, type NextRequest } from "next/server";
import { isQuestAdmin } from "@/lib/quests/is-quest-admin";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";
import type { QuestKind, QuestStatus } from "@/types/database";

type CreateQuestBody = {
  title?: string;
  description?: string;
  kind?: QuestKind;
  status?: QuestStatus;
  expReward?: number;
  prizeSummary?: string;
  submissionHint?: string;
  isFeatured?: boolean;
};

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ ok: true });
  const supabase = createRouteHandlerClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  if (!(await isQuestAdmin(user.id))) {
    return NextResponse.json({ error: "Quest管理権限がありません。" }, { status: 403 });
  }

  const body = (await request.json()) as CreateQuestBody;
  const title = body.title?.trim() ?? "";
  const description = body.description?.trim() ?? "";

  if (!title || !description) {
    return NextResponse.json({ error: "タイトルと説明は必須です。" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("quests")
    .insert({
      title,
      description,
      kind: body.kind ?? "brand",
      status: body.status ?? "open",
      exp_reward: body.expReward ?? 25,
      prize_summary: body.prizeSummary?.trim() || null,
      submission_hint: body.submissionHint?.trim() || null,
      is_featured: body.isFeatured ?? false,
      published_by: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: error?.message ?? "Quest作成に失敗しました。" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, questId: data.id });
}
