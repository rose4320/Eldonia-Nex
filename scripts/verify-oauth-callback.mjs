import { existsSync, readFileSync } from "node:fs";

function loadFile(path) {
  const env = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return env;
}

function loadEnv() {
  const merged = { ...process.env };
  for (const file of [".env", ".env.production.supabase", ".env.local"]) {
    if (!existsSync(file)) continue;
    Object.assign(merged, loadFile(file));
  }
  return merged;
}

function exitLater(code) {
  setTimeout(() => process.exit(code), 50);
}

function buildAuthCallbackUrl(siteUrl, redirectTo = "/") {
  const base = siteUrl.replace(/\/$/, "");
  const params = new URLSearchParams({ redirect_to: redirectTo });
  return `${base}/auth/callback?${params.toString()}`;
}

async function main() {
  const env = loadEnv();
  const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "https://eldonia-nex.com";
  const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const publishableKey =
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  let failed = 0;

  function ok(label, detail = "") {
    console.log(`OK  ${label}${detail ? ` — ${detail}` : ""}`);
  }

  function fail(label, detail = "") {
    failed += 1;
    console.log(`FAIL ${label}${detail ? ` — ${detail}` : ""}`);
  }

  function info(label, detail = "") {
    console.log(`INFO ${label}${detail ? ` — ${detail}` : ""}`);
  }

  if (!url || !publishableKey) {
    fail("Supabase env", "NEXT_PUBLIC_SUPABASE_URL / publishable key");
    exitLater(1);
    return;
  }

  ok("Supabase project", url);

  const callbackExamples = [
    buildAuthCallbackUrl(siteUrl, "/"),
    buildAuthCallbackUrl(siteUrl, "/auth/signup?resume=1"),
  ];

  ok("NEXT_PUBLIC_SITE_URL", siteUrl);
  info("App callback (login)", callbackExamples[0]);
  info("App callback (signup resume)", callbackExamples[1]);

  console.log("\nSupabase Dashboard → Authentication → URL Configuration:");
  console.log("  Site URL:", siteUrl);
  console.log("  Redirect URLs must include (wildcard OK):");
  console.log(`    ${siteUrl.replace(/\/$/, "")}/auth/callback**`);
  console.log("    http://localhost:3000/auth/callback**");
  console.log("    http://127.0.0.1:3000/auth/callback**");

  const providers = [
    ["Google", env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED !== "false"],
    ["Facebook", env.NEXT_PUBLIC_AUTH_FACEBOOK_ENABLED === "true"],
    ["X", env.NEXT_PUBLIC_AUTH_TWITTER_ENABLED === "true"],
    ["Discord", env.NEXT_PUBLIC_AUTH_DISCORD_ENABLED === "true"],
  ];

  console.log("\nUI provider flags:");
  for (const [name, enabled] of providers) {
    if (enabled) ok(`${name} UI enabled`);
    else info(`${name} UI disabled`);
  }

  console.log("\nProvider consoles must allow Supabase callback:");
  console.log(`  ${url.replace(/\/$/, "")}/auth/v1/callback`);

  exitLater(failed > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
