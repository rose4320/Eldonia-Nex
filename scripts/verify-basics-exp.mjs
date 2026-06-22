/**
 * 本番: ログイン → award_user_exp(profile.basics) を検証
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
loadEnvFile(".env");

const siteUrl = process.env.PROD_URL ?? "https://eldonia-nex.com";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const email = process.env.PROD_USER_EMAIL ?? "create@eldonia-nex.com";
const password = process.env.PROD_USER_PASSWORD ?? "Ghq007ddkr";

async function main() {
  console.log("=== Basics EXP verify ===");
  console.log("site:", siteUrl);
  console.log("supabase:", supabaseUrl);
  console.log("publishable key:", publishableKey ? "set" : "MISSING");

  if (!supabaseUrl || !publishableKey) {
    console.error("Missing Supabase env");
    process.exit(1);
  }

  const anon = createClient(supabaseUrl, publishableKey);

  const { data: actions, error: actionsError } = await anon
    .from("exp_actions")
    .select("action_type, base_exp, is_active")
    .eq("action_type", "profile.basics");

  if (actionsError) {
    console.error("exp_actions query failed:", actionsError.message);
    console.error("→ migration 020 may not be applied on production");
    process.exit(1);
  }
  console.log("exp_actions profile.basics:", actions);

  const login = await fetch(`${siteUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  console.log("login status:", login.status);
  if (!login.ok) {
    console.error(await login.text());
    process.exit(1);
  }

  const setCookies = login.headers.getSetCookie?.() ?? [];
  const authChunk = setCookies.find((c) => c.includes("auth-token"));
  if (!authChunk) {
    console.error("No auth cookie from login");
    process.exit(1);
  }

  const raw = authChunk.split(";")[0].split("=").slice(1).join("=");
  let accessToken = null;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    accessToken = parsed.access_token ?? parsed[0]?.access_token;
    if (!accessToken && Array.isArray(parsed)) accessToken = parsed[0];
    if (!accessToken && typeof parsed === "object") {
      accessToken = parsed.access_token;
    }
  } catch {
    try {
      const parsed = JSON.parse(raw);
      accessToken = parsed.access_token;
    } catch {
      console.error("Could not parse auth cookie");
      process.exit(1);
    }
  }

  if (!accessToken) {
    console.error("No access_token in cookie");
    process.exit(1);
  }

  const userClient = createClient(supabaseUrl, publishableKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });

  const { data: beforePortfolio } = await userClient
    .from("portfolios")
    .select("exp_points, level")
    .maybeSingle();

  console.log("portfolio before:", beforePortfolio);

  const { data: beforeAwards } = await userClient
    .from("user_exp_awards")
    .select("action_type, exp_gained, created_at")
    .eq("action_type", "profile.basics");

  console.log("existing profile.basics awards:", beforeAwards);

  const { data: gained, error: rpcError } = await userClient.rpc("award_user_exp", {
    p_action_type: "profile.basics",
    p_reference_key: "profile.basics",
  });

  console.log("rpc result:", gained, rpcError?.message ?? "ok");

  const { data: afterPortfolio } = await userClient
    .from("portfolios")
    .select("exp_points, level")
    .maybeSingle();

  console.log("portfolio after:", afterPortfolio);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
