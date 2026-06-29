import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const SUPABASE_CALLBACK =
  "https://evrklfqdyptuelulgcdy.supabase.co/auth/v1/callback";

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

  for (const file of [".env.production.supabase", ".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    Object.assign(merged, loadFile(file));
  }

  return merged;
}

function loadAccessToken(env) {
  if (env.SUPABASE_ACCESS_TOKEN) return env.SUPABASE_ACCESS_TOKEN;

  const tokenPath = join(homedir(), ".supabase", "access-token");
  if (existsSync(tokenPath)) {
    return readFileSync(tokenPath, "utf8").trim();
  }

  return "";
}

function loadProjectRef(env) {
  if (env.SUPABASE_PROJECT_REF) return env.SUPABASE_PROJECT_REF;

  const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match?.[1] ?? "";
}

async function main() {
  const env = loadEnv();
  const accessToken = loadAccessToken(env);
  const projectRef = loadProjectRef(env);

  const clientId = env.GOOGLE_OAUTH2_CLIENT_ID ?? env.EXTERNAL_GOOGLE_CLIENT_ID ?? "";
  const clientSecret =
    env.GOOGLE_OAUTH2_CLIENT_SECRET ?? env.EXTERNAL_GOOGLE_CLIENT_SECRET ?? "";

  if (!accessToken) {
    console.error("Missing SUPABASE_ACCESS_TOKEN.");
    process.exit(1);
  }

  if (!projectRef) {
    console.error("Missing SUPABASE_PROJECT_REF.");
    process.exit(1);
  }

  if (!clientId || !clientSecret) {
    console.warn("Skipping Google OAuth sync (GOOGLE_OAUTH2_CLIENT_ID / SECRET not set).");
    console.warn("See docs/12_メール・Supabase Auth運用設定書.md §2.5");
    console.warn(`Redirect URI: ${SUPABASE_CALLBACK}`);
    process.exit(0);
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        external_google_enabled: true,
        external_google_client_id: clientId,
        external_google_secret: clientSecret,
      }),
    },
  );

  if (!response.ok) {
    console.error("Failed to enable Google OAuth:", response.status, await response.text());
    process.exit(1);
  }

  const updated = await response.json();
  console.log("Supabase Google OAuth enabled.");
  console.log("  external_google_enabled:", updated.external_google_enabled);
  console.log(
    "  external_google_client_id:",
    updated.external_google_client_id ?? clientId,
  );
  console.log("");
  console.log("Google Cloud checklist:");
  console.log("  1. OAuth 同意画面 → アプリを公開（Production）");
  console.log("  2. 承認済みリダイレクト URI:");
  console.log(`     ${SUPABASE_CALLBACK}`);
  console.log("  3. Vercel: NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true");
  console.log("  4. Test: https://eldonia-nex.com/auth/login → Google で続行");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
