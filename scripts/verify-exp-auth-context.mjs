/**
 * サーバー createClient（Secret Key + Cookie）経由の RPC を検証
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function loadEnvFile(path) {
  try {
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq);
      const value = trimmed.slice(eq + 1);
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

loadEnvFile(".env.production.supabase");

const siteUrl = "https://eldonia-nex.com";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function parseAccessToken(setCookies) {
  const raw = setCookies[0].split(";")[0].split("=").slice(1).join("=");
  const b64 = raw.startsWith("base64-") ? raw.slice(7) : raw;
  const session = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  return session.access_token;
}

async function testRpc(label, client) {
  const { data, error } = await client.rpc("award_user_exp", {
    p_action_type: "profile.basics",
    p_reference_key: "profile.basics-test-" + label,
  });
  console.log(label, "→", data, error?.message ?? "ok");
}

async function main() {
  const login = await fetch(`${siteUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "create@eldonia-nex.com",
      password: "Ghq007ddkr",
    }),
  });
  const setCookies = login.headers.getSetCookie?.() ?? [];
  const token = parseAccessToken(setCookies);
  const cookieHeader = setCookies.map((c) => c.split(";")[0]).join("; ");

  // Secret key client with user bearer (simulates some server patterns)
  const secretWithBearer = createClient(supabaseUrl, secretKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  await testRpc("secret+bearer", secretWithBearer);

  // Secret key only (no user jwt)
  const secretOnly = createClient(supabaseUrl, secretKey);
  await testRpc("secret-only", secretOnly);

  // Publishable + bearer (browser-like)
  const pubWithBearer = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  await testRpc("publishable+bearer", pubWithBearer);

  // Simulate server route: call site API if we add one
  console.log("cookie header length", cookieHeader.length);
}

main();
