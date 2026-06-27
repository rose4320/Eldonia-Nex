import { NextResponse, type NextRequest } from "next/server";
import { awardUserExp } from "@/lib/exp/award-exp";
import { getQuestById, getQuestParticipation } from "@/lib/quests/get-quests";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";
import type { QuestParticipationStatus } from "@/types/database";

type ParticipateBody = {
  submissionUrl?: string;
  submissionNote?: string;
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id: questId } = await context.params;

  if (questId.startsWith("sample-")) {
    return NextResponse.json(
      { error: "デモQuestです。Supabaseマイグレーション025を適用してください。" },
      { status: 503 },
    );
  }

  const response = NextResponse.json({ ok: true });
  const supabase = createRouteHandlerClient(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const quest = await getQuestById(questId);
  if (!quest || quest.status !== "open") {
    return NextResponse.json({ error: "Questが見つからないか、受付終了です。" }, { status: 404 });
  }

  const now = Date.now();
  if (quest.starts_at && Date.parse(quest.starts_at) > now) {
    return NextResponse.json({ error: "Questはまだ開始されていません。" }, { status: 400 });
  }
  if (quest.ends_at && Date.parse(quest.ends_at) < now) {
    return NextResponse.json({ error: "Questは終了しました。" }, { status: 400 });
  }

  const existing = await getQuestParticipation(questId, user.id);
  if (existing) {
    return NextResponse.json(
      { error: "すでに参加済みです。", participationId: existing.id, expAwarded: existing.exp_awarded },
      { status: 409 },
    );
  }

  if (quest.kind === "daily") {
    return NextResponse.json(
      {
        error: "デイリーQuestはログイン時に自動でEXPが付与されます。",
      },
      { status: 400 },
    );
  }

  let body: ParticipateBody = {};
  try {
    body = (await request.json()) as ParticipateBody;
  } catch {
    body = {};
  }

  const submissionUrl = body.submissionUrl?.trim() || null;
  const submissionNote = body.submissionNote?.trim() || null;
  const status: QuestParticipationStatus =
    submissionUrl || submissionNote ? "submitted" : "joined";

  const portfolioEntry = {
    quest_id: quest.id,
    quest_title: quest.title,
    quest_kind: quest.kind,
    prize_summary: quest.prize_summary,
    status,
    joined_at: new Date().toISOString(),
  };

  const { data: participation, error: insertError } = await supabase
    .from("quest_participations")
    .insert({
      quest_id: questId,
      user_id: user.id,
      status,
      submission_url: submissionUrl,
      submission_note: submissionNote,
      portfolio_entry: portfolioEntry,
    })
    .select("id")
    .single();

  if (insertError || !participation) {
    return NextResponse.json(
      { error: insertError?.message ?? "参加の保存に失敗しました。" },
      { status: 500 },
    );
  }

  const expFromAction = await awardUserExp(supabase, "quest.participate", participation.id);
  const expAwarded = Math.max(expFromAction, quest.exp_reward);

  if (expAwarded > 0) {
    await supabase
      .from("quest_participations")
      .update({ exp_awarded: expAwarded })
      .eq("id", participation.id);
  }

  return NextResponse.json({
    ok: true,
    participationId: participation.id,
    expAwarded,
    status,
  });
}
