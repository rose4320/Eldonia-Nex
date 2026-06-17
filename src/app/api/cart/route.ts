import { NextResponse } from "next/server";
import { addToCart, clearCart, getCart, removeFromCart } from "@/lib/cart/cookie-cart";
import type { CartItemKind } from "@/lib/cart/types";

export async function GET() {
  const cart = await getCart();
  return NextResponse.json({ cart, count: cart.reduce((n, l) => n + l.quantity, 0) });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    action?: string;
    kind?: CartItemKind;
    id?: string;
    quantity?: number;
  };

  if (body.action === "add" && body.kind && body.id) {
    const cart = await addToCart(body.kind, body.id, body.quantity ?? 1);
    return NextResponse.json({
      ok: true,
      cart,
      count: cart.reduce((n, l) => n + l.quantity, 0),
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
