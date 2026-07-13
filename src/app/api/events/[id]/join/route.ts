import { NextResponse } from "next/server";
import { getEvent } from "@/lib/events/get-events";
import { getValidTicketForEvent } from "@/lib/events/event-ticket-access";
import { eventHasStream, getStreamAccessState } from "@/lib/events/stream-access";
import { createAdminClient } from "@/lib/supabase/admin";
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

  const event = await getEvent(eventId);
  if (!event) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (!eventHasStream(event)) {
    return NextResponse.json({ error: "no_stream" }, { status: 400 });
  }

  const ticket = await getValidTicketForEvent(user.id, eventId);
  if (!ticket) {
    return NextResponse.json({ error: "no_ticket" }, { status: 403 });
  }

  const access = getStreamAccessState(event);
  if (!access.canJoin) {
    return NextResponse.json(
      { error: "not_open", phase: access.phase, opensAt: access.opensAt?.toISOString() ?? null },
      { status: 403 },
    );
  }

  const admin = createAdminClient();
  if (admin && !ticket.checked_in_at) {
    await admin
      .from("event_tickets")
      .update({ checked_in_at: new Date().toISOString() })
      .eq("id", ticket.id)
      .eq("holder_user_id", user.id);
  }

  return NextResponse.json({ url: event.online_url!.trim() });
}
