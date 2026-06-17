import { NextResponse } from "next/server";
import { awardUserExp } from "@/lib/exp/award-exp";
import { apiError } from "@/lib/i18n/api-errors";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";
import type { JobStatus, JobType } from "@/types/database";

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
    title?: string;
    description?: string;
    jobType?: JobType;
    location?: string;
    budgetMin?: number | null;
    budgetMax?: number | null;
    skills?: string[];
  };

  if (!body.title?.trim() || !body.description?.trim()) {
    return NextResponse.json(
      { error: apiError("titleRequired", locale), errorKey: "titleRequired" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("job_listings")
    .insert({
      poster_id: user.id,
      title: body.title.trim(),
      description: body.description.trim(),
      job_type: body.jobType ?? "freelance",
      location: body.location?.trim() || null,
      budget_min: body.budgetMin ?? null,
      budget_max: body.budgetMax ?? null,
      skills_required: body.skills ?? [],
      status: "open",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await awardUserExp(supabase, "job.create", data.id);
  return NextResponse.json({ ok: true, id: data.id });
}

export async function PATCH(request: Request) {
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

  const body = (await request.json()) as { jobId?: string; status?: JobStatus };

  if (!body.jobId || !body.status) {
    return NextResponse.json(
      { error: apiError("missingFields", locale), errorKey: "missingFields" },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("job_listings")
    .update({ status: body.status })
    .eq("id", body.jobId)
    .eq("poster_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
