import { NextResponse } from "next/server";
import { claimFreeEventTicket } from "@/lib/events/claim-free-event-ticket";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  const { id: eventId } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "login_required" }, { status: 401 });
  }

  const result = await claimFreeEventTicket(user.id, eventId);

  if (!result.ok) {
    const status =
      result.code === "not_found"
        ? 404
        : result.code === "paid_event_use_cart"
          ? 400
          : result.code === "sold_out"
            ? 409
            : 500;
    return NextResponse.json({ error: result.code }, { status });
  }

  return NextResponse.json({
    ok: true,
    alreadyOwned: result.alreadyOwned,
    orderId: "orderId" in result ? result.orderId : undefined,
    redirect: result.redirect,
  });
}
