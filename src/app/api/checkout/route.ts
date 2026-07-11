import { NextResponse } from "next/server";
import { getCart } from "@/lib/cart/cookie-cart";
import { buildOrderItemsPayload } from "@/lib/cart/order-items";
import { resolveCart } from "@/lib/cart/resolve-cart";
import { normalizeShippingInput } from "@/lib/cart/shipping";
import { getStripe, isStripeConfigured, siteUrl } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

type CheckoutBody = {
  shipping?: unknown;
};

export async function POST(request: Request) {
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

  let body: CheckoutBody = {};
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    // optional body
  }

  const summary = await resolveCart();
  if (summary.items.length === 0) {
    return NextResponse.json({ error: "有効な商品がありません。" }, { status: 400 });
  }

  if (summary.canFreeCheckout) {
    return NextResponse.json(
      { error: "無料商品は「無料で入手」をご利用ください。", code: "use_free_checkout" },
      { status: 400 },
    );
  }

  const shipping = summary.requiresShippingAddress
    ? normalizeShippingInput(body.shipping)
    : null;

  if (summary.requiresShippingAddress && !shipping) {
    return NextResponse.json({ error: "配送先情報を入力してください。" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe 初期化に失敗しました。" }, { status: 503 });
  }

  const base = siteUrl();
  const stripeLineItems = summary.items
    .filter((item) => item.unitPrice > 0)
    .map((item) => ({
      quantity: item.line.quantity,
      price_data: {
        currency: "jpy" as const,
        unit_amount: item.unitPrice,
        product_data: {
          name: item.title,
          description: item.subtitle,
        },
      },
    }));

  if (summary.shippingFee > 0) {
    stripeLineItems.push({
      quantity: 1,
      price_data: {
        currency: "jpy" as const,
        unit_amount: summary.shippingFee,
        product_data: {
          name: "配送料",
          description: "SHOP 国内配送（MVP 定額）",
        },
      },
    });
  }

  if (stripeLineItems.length === 0) {
    return NextResponse.json({ error: "決済対象がありません。" }, { status: 400 });
  }

  const orderLines = summary.items.map((item) => ({
    kind: item.line.kind,
    id: item.line.id,
    quantity: item.line.quantity,
    unitPrice: item.unitPrice,
    product_type: item.productType,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: user.email ?? undefined,
    line_items: stripeLineItems,
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
    total_amount: summary.orderTotal,
    currency: "jpy",
    items: buildOrderItemsPayload(orderLines, shipping ?? undefined, summary.shippingFee),
  });

  return NextResponse.json({ url: session.url });
}

export async function DELETE() {
  const { clearCart } = await import("@/lib/cart/cookie-cart");
  await clearCart();
  return NextResponse.json({ ok: true });
}
