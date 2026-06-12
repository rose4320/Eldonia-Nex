export type CartItemKind = "shop" | "event";

export type CartLine = {
  kind: CartItemKind;
  id: string;
  quantity: number;
};

export const CART_COOKIE = "eldonia_cart";

export function parseCart(raw: string | undefined): CartLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartLine[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (line) =>
        (line.kind === "shop" || line.kind === "event") &&
        typeof line.id === "string" &&
        typeof line.quantity === "number" &&
        line.quantity > 0,
    );
  } catch {
    return [];
  }
}

export function serializeCart(lines: CartLine[]): string {
  return JSON.stringify(lines);
}

export function addLine(cart: CartLine[], line: CartLine): CartLine[] {
  const idx = cart.findIndex((l) => l.kind === line.kind && l.id === line.id);
  if (idx >= 0) {
    const next = [...cart];
    next[idx] = { ...next[idx], quantity: next[idx].quantity + line.quantity };
    return next;
  }
  return [...cart, line];
}

export function removeLine(
  cart: CartLine[],
  kind: CartItemKind,
  id: string,
): CartLine[] {
  return cart.filter((l) => !(l.kind === kind && l.id === id));
}
