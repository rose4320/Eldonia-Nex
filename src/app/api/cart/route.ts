import { NextResponse } from "next/server";
import { addToCart, clearCart, getCart, removeFromCart } from "@/lib/cart/cookie-cart";
import { cartItemCount } from "@/lib/cart/types";
import type { CartItemKind } from "@/lib/cart/types";
import { getEvent } from "@/lib/events/get-events";

export async function GET() {
  const cart = await getCart();
  return NextResponse.json({ cart, count: cartItemCount(cart) });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    action?: string;
    kind?: CartItemKind;
    id?: string;
    quantity?: number;
  };

  if (body.action === "add" && body.kind && body.id) {
    if (body.kind === "event") {
      const event = await getEvent(body.id);
      if (!event) {
        return NextResponse.json({ error: "event_not_found" }, { status: 404 });
      }
      if (event.ticket_price === 0) {
        return NextResponse.json(
          {
            error: "Free events use instant ticket claim, not the cart.",
            code: "use_event_claim",
            eventId: body.id,
          },
          { status: 400 },
        );
      }
    }

    const cart = await addToCart(body.kind, body.id, body.quantity ?? 1);
    return NextResponse.json({
      ok: true,
      cart,
      count: cartItemCount(cart),
    });
  }

  if (body.action === "remove" && body.kind && body.id) {
    const cart = await removeFromCart(body.kind, body.id);
    return NextResponse.json({ ok: true, cart });
  }

  if (body.action === "clear") {
    await clearCart();
    return NextResponse.json({ ok: true, cart: [], count: 0 });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
