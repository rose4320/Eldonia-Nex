/* jshint esversion: 11, node: true */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const TEXTBOOK_ID = "e305dbc6-bb63-4eb2-8f96-a3a94965068b";

function loadEnv() {
  const env = {};
  for (const file of [".env.local", ".env.production.supabase", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      if (!(key in env)) {
        env[key] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      }
    }
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const secret = env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY ?? "";
if (!url || !secret) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error } = await supabase
  .from("artworks")
  .update({ bgm_url: null })
  .eq("id", TEXTBOOK_ID);

if (error) {
  console.error(error);
  process.exit(1);
}

console.log("Textbook BGM cleared (if any).");
