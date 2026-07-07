import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

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

function loadAccessToken(env) {
  if (env.SUPABASE_ACCESS_TOKEN) return env.SUPABASE_ACCESS_TOKEN;

  const tokenPath = join(homedir(), ".supabase", "access-token");
  if (existsSync(tokenPath)) {
    return readFileSync(tokenPath, "utf8").trim();
  }

  return "";
}

function loadProjectRef(env) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (match?.[1]) return match[1];
  if (env.SUPABASE_PROJECT_REF) return env.SUPABASE_PROJECT_REF;
  return "";
}

const PROVIDERS = [
  {
    name: "Facebook",
    clientIdKeys: ["FACEBOOK_OAUTH_CLIENT_ID", "EXTERNAL_FACEBOOK_CLIENT_ID"],
    secretKeys: ["FACEBOOK_OAUTH_CLIENT_SECRET", "EXTERNAL_FACEBOOK_CLIENT_SECRET"],
    enabledKey: "external_facebook_enabled",
    clientIdKey: "external_facebook_client_id",
    secretKey: "external_facebook_secret",
    vercelFlag: "NEXT_PUBLIC_AUTH_FACEBOOK_ENABLED=true",
    consoleHint: "Meta for Developers → アプリ → Facebook Login → Valid OAuth Redirect URIs",
  },
  {
    name: "X (Twitter)",
    clientIdKeys: ["X_OAUTH_CLIENT_ID", "TWITTER_OAUTH_CLIENT_ID", "EXTERNAL_X_CLIENT_ID"],
    secretKeys: ["X_OAUTH_CLIENT_SECRET", "TWITTER_OAUTH_CLIENT_SECRET", "EXTERNAL_X_CLIENT_SECRET"],
    enabledKey: "external_x_enabled",
    clientIdKey: "external_x_client_id",
    secretKey: "external_x_secret",
    vercelFlag: "NEXT_PUBLIC_AUTH_TWITTER_ENABLED=true",
    consoleHint: "X Developer Portal → OAuth 2.0 → Redirect URI",
  },
  {
    name: "Discord",
    clientIdKeys: ["DISCORD_OAUTH_CLIENT_ID", "EXTERNAL_DISCORD_CLIENT_ID"],
    secretKeys: ["DISCORD_OAUTH_CLIENT_SECRET", "EXTERNAL_DISCORD_CLIENT_SECRET"],
    enabledKey: "external_discord_enabled",
    clientIdKey: "external_discord_client_id",
    secretKey: "external_discord_secret",
    vercelFlag: "NEXT_PUBLIC_AUTH_DISCORD_ENABLED=true",
    consoleHint: "Discord Developer Portal → OAuth2 → Redirects",
  },
];

function pickEnv(env, keys) {
  for (const key of keys) {
    if (env[key]) return env[key];
  }
  return "";
}

async function main() {
  const env = loadEnv();
  const accessToken = loadAccessToken(env);
  const projectRef = loadProjectRef(env);

  if (!accessToken) {
    console.error("Missing SUPABASE_ACCESS_TOKEN.");
    process.exit(1);
  }

  if (!projectRef) {
    console.error("Missing SUPABASE_PROJECT_REF.");
    process.exit(1);
  }

  const callbackUrl = `https://${projectRef}.supabase.co/auth/v1/callback`;
  console.log(`Supabase OAuth callback: ${callbackUrl}\n`);

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  let synced = 0;

  for (const provider of PROVIDERS) {
    const clientId = pickEnv(env, provider.clientIdKeys);
    const clientSecret = pickEnv(env, provider.secretKeys);

    if (!clientId || !clientSecret) {
      console.warn(`Skip ${provider.name} (client ID / secret not set).`);
      continue;
    }

    const body = {
      [provider.enabledKey]: true,
      [provider.clientIdKey]: clientId,
      [provider.secretKey]: clientSecret,
    };

    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
      { method: "PATCH", headers, body: JSON.stringify(body) },
    );

    if (!response.ok) {
      console.error(
        `Failed ${provider.name}:`,
        response.status,
        await response.text(),
      );
      process.exit(1);
    }

    synced += 1;
    console.log(`${provider.name}: enabled in Supabase.`);
    console.log(`  Vercel flag: ${provider.vercelFlag}`);
    console.log(`  ${provider.consoleHint}`);
    console.log(`  Redirect URI: ${callbackUrl}\n`);
  }

  if (synced === 0) {
    console.warn("No social providers synced.");
    console.warn("Set FACEBOOK / X / DISCORD OAuth env vars in .env.production.supabase");
    console.warn("See docs/12_メール・Supabase Auth運用設定書.md §2.6");
    process.exit(0);
  }

  console.log(`Done. ${synced} provider(s) synced.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
