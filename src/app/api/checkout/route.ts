import { NextResponse } from "next/server";
import { clearCart, getCart } from "@/lib/cart/cookie-cart";
import { resolveCart } from "@/lib/cart/resolve-cart";
import { getStripe, isStripeConfigured, siteUrl } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Stripe が未設定です。.env.local に STRIPE_SECRET_KEY を設定してください。",
      },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  const cart = await getCart();
  if (cart.length === 0) {
    return NextResponse.json({ error: "カートが空です。" }, { status: 400 });
  }

  const { items, total } = await resolveCart();
  if (items.length === 0) {
    return NextResponse.json({ error: "有効な商品がありません。" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe 初期化に失敗しました。" }, { status: 503 });
  }

  const base = siteUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items: items.map((item) => ({
      quantity: item.line.quantity,
      price_data: {
        currency: "jpy",
        unit_amount: item.unitPrice,
        product_data: {
          name: item.title,
          description: item.subtitle,
        },
      },
    })),
    success_url: `${base}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/shop/cart`,
    metadata: {
      user_id: user.id,
    },
  });

  await supabase.from("orders").insert({
    user_id: user.id,
    stripe_session_id: session.id,
    status: "pending",
    total_amount: total,
    currency: "jpy",
    items: items.map((i) => ({
      kind: i.line.kind,
      id: i.line.id,
      quantity: i.line.quantity,
      unitPrice: i.unitPrice,
    })),
  });

  return NextResponse.json({ url: session.url });
}

export async function DELETE() {
  await clearCart();
  return NextResponse.json({ ok: true });
}
