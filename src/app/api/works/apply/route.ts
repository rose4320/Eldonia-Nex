import { NextResponse } from "next/server";
import { getPortfolioForUser } from "@/lib/works/get-works";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const body = (await request.json()) as {
    jobId?: string;
    coverMessage?: string;
    attachPortfolio?: boolean;
  };

  if (!body.jobId || !body.coverMessage?.trim()) {
    return NextResponse.json({ error: "入力内容を確認してください。" }, { status: 400 });
  }

  let portfolioSnapshot = null;
  if (body.attachPortfolio) {
    const portfolio = await getPortfolioForUser(user.id);
    if (portfolio && portfolio.visibility !== "private") {
      portfolioSnapshot = {
        headline: portfolio.headline,
        summary: portfolio.summary,
        skills: portfolio.skills,
        level: portfolio.level,
        title_badge: portfolio.title_badge,
        exp_points: portfolio.exp_points,
      };
    }
  }

  const { error } = await supabase.from("job_applications").insert({
    job_id: body.jobId,
    applicant_id: user.id,
    cover_message: body.coverMessage.trim(),
    portfolio_snapshot: portfolioSnapshot,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "すでに応募済みです。" }, { status: 409 });
    }
    return NextResponse.json(
      { ok: true, demo: true, message: "デモモード: 応募を記録しました（DB 未適用時）" },
    );
  }

  return NextResponse.json({ ok: true });
}
