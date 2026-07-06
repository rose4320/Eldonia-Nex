import { NextResponse } from "next/server";
import { healthHttpStatus, runHealthChecks } from "@/lib/health/check-health";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const includeSupabase = url.searchParams.get("supabase") !== "0";

  const report = await runHealthChecks({ includeSupabase });
  const status = healthHttpStatus(report);

  return NextResponse.json(report, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "Server-Timing": `health;dur=${report.totalLatencyMs}`,
    },
  });
}
