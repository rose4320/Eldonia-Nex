import { cookies } from "next/headers";
import {
  addLine,
  CART_COOKIE,
  parseCart,
  removeLine,
  serializeCart,
  type CartItemKind,
  type CartLine,
} from "./types";

export async function getCart(): Promise<CartLine[]> {
  const store = await cookies();
  return parseCart(store.get(CART_COOKIE)?.value);
}

export async function setCart(lines: CartLine[]): Promise<void> {
  const store = await cookies();
  store.set(CART_COOKIE, serializeCart(lines), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function addToCart(
  kind: CartItemKind,
  id: string,
  quantity = 1,
): Promise<CartLine[]> {
  const cart = await getCart();
  const next = addLine(cart, { kind, id, quantity });
  await setCart(next);
  return next;
}

export async function removeFromCart(
  kind: CartItemKind,
  id: string,
): Promise<CartLine[]> {
  const cart = await getCart();
  const next = removeLine(cart, kind, id);
  await setCart(next);
  return next;
}

export async function clearCart(): Promise<void> {
  await setCart([]);
}
