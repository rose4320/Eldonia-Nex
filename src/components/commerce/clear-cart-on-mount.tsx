"use client";

import { useEffect } from "react";

/** 決済完了後にカート Cookie を API 経由でクリアする */
export function ClearCartOnMount() {
  useEffect(() => {
    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "clear" }),
    }).catch(() => {});
  }, []);

  return null;
}
