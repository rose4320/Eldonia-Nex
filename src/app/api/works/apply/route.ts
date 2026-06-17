import { NextResponse } from "next/server";
import { awardUserExp } from "@/lib/exp/award-exp";
import { apiError } from "@/lib/i18n/api-errors";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { getPortfolioForUser } from "@/lib/works/get-works";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const locale = await getUiLocale();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: apiError("loginRequired", locale), errorKey: "loginRequired" },
      { status: 401 },
    );
  }

  const body = (await request.json()) as {
    jobId?: string;
    coverMessage?: string;
    attachPortfolio?: boolean;
  };

  if (!body.jobId || !body.coverMessage?.trim()) {
    return NextResponse.json(
      { error: apiError("invalidInput", locale), errorKey: "invalidInput" },
      { status: 400 },
    );
  }

  let portfolioSnapshot = null;
  if (body.attachPortfolio) {
    const portfolio = await getPortfolioForUser(user.id, { locale });
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

  const { data: application, error } = await supabase
    .from("job_applications")
    .insert({
      job_id: body.jobId,
      applicant_id: user.id,
      cover_message: body.coverMessage.trim(),
      portfolio_snapshot: portfolioSnapshot,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: apiError("alreadyApplied", locale), errorKey: "alreadyApplied" },
        { status: 409 },
      );
    }
    return NextResponse.json({ ok: true, demo: true });
  }

  if (application) {
    await awardUserExp(supabase, "job.apply", application.id);
  }
  return NextResponse.json({ ok: true });
}
