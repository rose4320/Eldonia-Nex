import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/types/database";

export type OrderItem = {
  kind: "shop" | "event";
  id: string;
  quantity: number;
  unitPrice: number;
};

export function parseOrderItems(items: unknown): OrderItem[] {
  if (!Array.isArray(items)) return [];
  return items.filter(
    (item): item is OrderItem =>
      typeof item === "object" &&
      item !== null &&
      "kind" in item &&
      "id" in item,
  ) as OrderItem[];
}

export function orderStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: "処理中",
    paid: "支払い済み",
    failed: "失敗",
    refunded: "返金済み",
  };
  return map[status] ?? status;
}

export async function getOrdersForUser(userId: string): Promise<Order[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) return data as Order[];
  } catch {
    // ignore
  }
  return [];
}
