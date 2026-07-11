import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

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
  if (existsSync(tokenPath)) return readFileSync(tokenPath, "utf8").trim();
  return "";
}

function loadProjectRef(env) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (match?.[1]) return match[1];
  return env.SUPABASE_PROJECT_REF ?? "";
}

function pickEnv(env, keys) {
  for (const key of keys) {
    if (env[key]) return env[key];
  }
  return "";
}

function exitLater(code) {
  setTimeout(() => process.exit(code), 50);
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const publishableKey =
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const projectRef = loadProjectRef(env);
  const accessToken = loadAccessToken(env);
  const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "https://eldonia-nex.com";
  const xClientId = pickEnv(env, [
    "X_OAUTH_CLIENT_ID",
    "TWITTER_OAUTH_CLIENT_ID",
    "EXTERNAL_X_CLIENT_ID",
  ]);

  let failed = 0;

  function ok(label, detail = "") {
    console.log(`OK  ${label}${detail ? ` — ${detail}` : ""}`);
  }

  function fail(label, detail = "") {
    failed += 1;
    console.log(`FAIL ${label}${detail ? ` — ${detail}` : ""}`);
  }

  function warn(label, detail = "") {
    console.log(`WARN ${label}${detail ? ` — ${detail}` : ""}`);
  }

  if (!url || !publishableKey) {
    fail("Supabase URL / publishable key in .env.local");
    return 1;
  }

  ok("Supabase project", projectRef || url);

  const supabase = createClient(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: oauthData, error: oauthError } = await supabase.auth.signInWithOAuth({
    provider: "x",
    options: {
      redirectTo: `${siteUrl.replace(/\/$/, "")}/auth/callback?redirect_to=%2F`,
    },
  });

  if (oauthError || !oauthData?.url) {
    fail("signInWithOAuth(x)", oauthError?.message ?? "no redirect URL");
  } else {
    ok("OAuth authorize URL", new URL(oauthData.url).origin);
  }

  if (accessToken && projectRef) {
    const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/config/auth`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      warn("Management API auth config", `${res.status} (token may lack access)`);
    } else {
      const auth = await res.json();
      if (auth.external_x_enabled) {
        ok("Supabase external_x_enabled");
      } else {
        fail("Supabase external_x_enabled", "Dashboard → Providers → X → ON");
      }

      if (auth.external_x_client_id) {
        ok("Supabase X client ID set", auth.external_x_client_id);
        if (xClientId && auth.external_x_client_id !== xClientId) {
          warn("X_OAUTH_CLIENT_ID mismatch with Supabase");
        }
      } else {
        fail("Supabase X client ID", "not set");
      }

      if (auth.external_x_secret) {
        ok("Supabase X secret set");
      } else {
        fail("Supabase X secret", "not set");
      }

      const callback = `https://${projectRef}.supabase.co/auth/v1/callback`;
      console.log(`INFO X redirect URI must include: ${callback}`);
    }
  } else {
    warn("SUPABASE_ACCESS_TOKEN", "skip Management API checks");
  }

  if (env.NEXT_PUBLIC_AUTH_TWITTER_ENABLED === "true") {
    ok("NEXT_PUBLIC_AUTH_TWITTER_ENABLED", "true");
  } else {
    warn(
      "NEXT_PUBLIC_AUTH_TWITTER_ENABLED",
      "not true — X button hidden locally unless set in .env.local",
    );
  }

  if (!xClientId) {
    warn("X_OAUTH_CLIENT_ID", "not set locally — add to .env.local or .env.production.supabase");
  }

  console.log("");
  console.log("X checklist:");
  console.log("  1. X Developer Portal → OAuth 2.0 → Callback URI");
  console.log(`     https://${projectRef}.supabase.co/auth/v1/callback`);
  console.log("  2. npm run supabase:sync-social after setting X_OAUTH_*");
  console.log("  3. See docs/x-oauth-setup.md");

  return failed > 0 ? 1 : 0;
}

main()
  .then((code) => exitLater(code))
  .catch((error) => {
    console.error(error);
    exitLater(1);
  });
