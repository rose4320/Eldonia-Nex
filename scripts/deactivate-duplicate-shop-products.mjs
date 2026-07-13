#!/usr/bin/env node
/**
 * Supabase shop_products の重複 active 行を非公開にする（最新1件を残す）。
 * 用法: node scripts/deactivate-duplicate-shop-products.mjs
 * 要: .env の NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const path = resolve(process.cwd(), ".env");
  const text = readFileSync(path, "utf8");
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
  return env;
}

function dedupeKey(row) {
  const seller = row.seller_id ?? "platform";
  if (row.source_artwork_id) return `artwork:${seller}:${row.source_artwork_id}`;
  const image = (row.image_url || "").trim();
  if (image) return `media:${seller}:${image}`;
  return `title:${seller}:${(row.title || "").trim().toLowerCase()}`;
}

async function main() {
  const env = loadEnv();
  const base = (env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || "").replace(/\/$/, "");
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
  if (!base || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
  }

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };

  const listUrl = `${base}/rest/v1/shop_products?select=id,title,seller_id,image_url,created_at&is_active=eq.true&order=created_at.desc`;
  const response = await fetch(listUrl, { headers });
  if (!response.ok) {
    console.error("Fetch failed:", response.status, await response.text());
    process.exit(1);
  }

  const rows = await response.json();
  if (!Array.isArray(rows)) {
    console.error("Unexpected response:", rows);
    process.exit(1);
  }

  const keepByKey = new Map();
  for (const row of rows) {
    const keyName = dedupeKey(row);
    if (!keepByKey.has(keyName)) keepByKey.set(keyName, row);
  }

  const keepIds = new Set([...keepByKey.values()].map((row) => row.id));
  const deactivate = rows.filter((row) => !keepIds.has(row.id));

  if (deactivate.length === 0) {
    console.log(`OK: ${rows.length} active products, no duplicates.`);
    return;
  }

  console.log(`Found ${deactivate.length} duplicate(s) to deactivate:`);
  for (const row of deactivate) {
    console.log(` - ${row.title} (${row.id})`);
  }

  for (const row of deactivate) {
    const patchUrl = `${base}/rest/v1/shop_products?id=eq.${row.id}`;
    const patch = await fetch(patchUrl, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ is_active: false }),
    });
    if (!patch.ok) {
      console.error(`Failed to deactivate ${row.id}:`, patch.status, await patch.text());
      process.exit(1);
    }
  }

  console.log(`Done. Kept ${keepIds.size} active product(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
