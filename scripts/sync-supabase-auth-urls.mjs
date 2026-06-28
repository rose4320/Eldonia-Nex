import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const PRODUCTION_SITE_URL = "https://eldonia-nex.com";
const LOCAL_REDIRECT_URLS = [
  "http://localhost:3000",
  "http://localhost:3000/auth/callback",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3000/auth/callback",
];
const PRODUCTION_REDIRECT_URLS = [`${PRODUCTION_SITE_URL}/**`];

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

function loadAccessToken() {
  if (process.env.SUPABASE_ACCESS_TOKEN) {
    return process.env.SUPABASE_ACCESS_TOKEN;
  }

  for (const file of [".env", ".env.local", ".env.production.supabase"]) {
    if (!existsSync(file)) continue;
    const env = loadFile(file);
    if (env.SUPABASE_ACCESS_TOKEN) return env.SUPABASE_ACCESS_TOKEN;
  }

  const tokenPath = join(homedir(), ".supabase", "access-token");
  if (existsSync(tokenPath)) {
    return readFileSync(tokenPath, "utf8").trim();
  }

  return "";
}

function loadProjectRef() {
  if (process.env.SUPABASE_PROJECT_REF) {
    return process.env.SUPABASE_PROJECT_REF;
  }

  for (const file of [".env.production.supabase", ".env"]) {
    if (!existsSync(file)) continue;
    const env = loadFile(file);
    if (env.SUPABASE_PROJECT_REF) return env.SUPABASE_PROJECT_REF;
    const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
    if (match?.[1]) return match[1];
  }

  return "";
}

function mergeRedirectUrls(existing) {
  const current = (existing ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  const merged = new Set([
    ...current,
    ...LOCAL_REDIRECT_URLS,
    ...PRODUCTION_REDIRECT_URLS,
  ]);
  return [...merged].join(",");
}

async function main() {
  const accessToken = loadAccessToken();
  const projectRef = loadProjectRef();

  if (!accessToken) {
    console.error(
      "Missing SUPABASE_ACCESS_TOKEN. Create one at https://supabase.com/dashboard/account/tokens",
    );
    process.exit(1);
  }

  if (!projectRef) {
    console.error("Missing SUPABASE_PROJECT_REF or NEXT_PUBLIC_SUPABASE_URL.");
    process.exit(1);
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const currentResponse = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    { headers },
  );

  if (!currentResponse.ok) {
    console.error("Failed to read auth config:", currentResponse.status, await currentResponse.text());
    process.exit(1);
  }

  const current = await currentResponse.json();
  const uriAllowList = mergeRedirectUrls(current.uri_allow_list);

  const patchResponse = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        site_url: PRODUCTION_SITE_URL,
        uri_allow_list: uriAllowList,
      }),
    },
  );

  if (!patchResponse.ok) {
    console.error("Failed to update auth config:", patchResponse.status, await patchResponse.text());
    process.exit(1);
  }

  const updated = await patchResponse.json();
  console.log("Supabase auth config updated.");
  console.log("  site_url:", updated.site_url);
  console.log("  uri_allow_list:", updated.uri_allow_list);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
