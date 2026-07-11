import { NextResponse } from "next/server";
import { clearCart, getCart } from "@/lib/cart/cookie-cart";
import { buildOrderItemsPayload } from "@/lib/cart/order-items";
import { resolveCart } from "@/lib/cart/resolve-cart";
import { getShopProduct } from "@/lib/shop/get-products";
import { createClient } from "@/lib/supabase/server";
import type { CartLine } from "@/lib/cart/types";

type FreeCheckoutBody = {
  direct?: CartLine;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  let body: FreeCheckoutBody = {};
  try {
    body = (await request.json()) as FreeCheckoutBody;
  } catch {
    // empty body is fine for full-cart free checkout
  }

  if (body.direct) {
    const { kind, id, quantity } = body.direct;
    if (kind !== "shop" || !id || quantity < 1) {
      return NextResponse.json({ error: "無効な商品です。" }, { status: 400 });
    }

    const product = await getShopProduct(id);
    if (!product) {
      return NextResponse.json({ error: "商品が見つかりません。" }, { status: 404 });
    }
    if (product.price !== 0) {
      return NextResponse.json({ error: "有料商品は通常の決済をご利用ください。" }, { status: 400 });
    }
    if (product.product_type !== "digital") {
      return NextResponse.json(
        { error: "無料の物理商品は配送先入力が必要です。カートからお手続きください。" },
        { status: 400 },
      );
    }

    const lines = [
      {
        kind: "shop" as const,
        id,
        quantity,
        unitPrice: 0,
        product_type: product.product_type,
      },
    ];

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        stripe_session_id: null,
        status: "paid",
        total_amount: 0,
        currency: "jpy",
        items: buildOrderItemsPayload(lines),
      })
      .select("id")
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "無料入手の処理に失敗しました。" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      redirect: "/checkout/success?free=1",
    });
  }

  const cart = await getCart();
  if (cart.length === 0) {
    return NextResponse.json({ error: "カートが空です。" }, { status: 400 });
  }

  const summary = await resolveCart();
  if (summary.items.length === 0) {
    return NextResponse.json({ error: "有効な商品がありません。" }, { status: 400 });
  }
  if (!summary.canFreeCheckout) {
    if (summary.requiresShippingPayment) {
      return NextResponse.json(
        { error: "物理商品の送料お支払いが必要です。配送先を入力して決済してください。" },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: "無料で入手できる商品がありません。" }, { status: 400 });
  }
  if (summary.hasPhysical) {
    return NextResponse.json(
      { error: "無料の物理商品は配送先入力が必要です。" },
      { status: 400 },
    );
  }

  const lines = summary.items.map((item) => ({
    kind: item.line.kind,
    id: item.line.id,
    quantity: item.line.quantity,
    unitPrice: item.unitPrice,
    product_type: item.productType,
  }));

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      stripe_session_id: null,
      status: "paid",
      total_amount: 0,
      currency: "jpy",
      items: buildOrderItemsPayload(lines),
    })
    .select("id")
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "無料入手の処理に失敗しました。" }, { status: 500 });
  }

  await clearCart();

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    redirect: "/checkout/success?free=1",
  });
}
