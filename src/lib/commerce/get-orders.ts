import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/types/database";
import { parseOrderItemsPayload, type OrderLineItem } from "@/lib/cart/order-items";

export type OrderItem = OrderLineItem;

export function parseOrderItems(items: unknown): OrderItem[] {
  return parseOrderItemsPayload(items).lines;
}

import { orderStatusLabel as orderStatusLabelForLocale } from "@/lib/i18n/taxonomy";
import type { UiLocale } from "@/lib/i18n/locale";

export function orderStatusLabel(status: string, locale: UiLocale = "ja"): string {
  return orderStatusLabelForLocale(status, locale);
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
