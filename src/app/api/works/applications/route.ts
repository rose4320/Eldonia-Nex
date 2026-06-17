import { NextResponse } from "next/server";
import { apiError } from "@/lib/i18n/api-errors";
import { getUiLocale } from "@/lib/i18n/get-ui-locale";
import { createClient } from "@/lib/supabase/server";

const ALLOWED = ["pending", "reviewing", "accepted", "rejected"] as const;

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

  const body = (await request.json()) as {
    applicationId?: string;
    status?: string;
  };

  if (!body.applicationId || !body.status) {
    return NextResponse.json(
      { error: apiError("missingFields", locale), errorKey: "missingFields" },
      { status: 400 },
    );
  }

  if (!ALLOWED.includes(body.status as (typeof ALLOWED)[number])) {
    return NextResponse.json(
      { error: apiError("invalidStatus", locale), errorKey: "invalidStatus" },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from("job_applications")
    .update({ status: body.status })
    .eq("id", body.applicationId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
