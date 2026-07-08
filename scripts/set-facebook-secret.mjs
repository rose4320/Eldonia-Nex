import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

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

async function validateFacebookSecret(clientId, clientSecret) {
  const tokenUrl = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
  tokenUrl.searchParams.set("client_id", clientId);
  tokenUrl.searchParams.set("client_secret", clientSecret);
  tokenUrl.searchParams.set("grant_type", "client_credentials");

  const res = await fetch(tokenUrl);
  if (res.ok) return true;

  const body = await res.text();
  console.error("Meta rejected this secret:", body.slice(0, 200));
  return false;
}

async function patchSupabase(projectRef, accessToken, clientId, clientSecret) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/config/auth`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      external_facebook_enabled: true,
      external_facebook_client_id: clientId,
      external_facebook_secret: clientSecret,
    }),
  });

  if (res.ok) return true;

  const body = await res.text();
  console.error(`Supabase PATCH failed (${res.status}):`, body.slice(0, 300));
  return false;
}

function upsertEnvLocal(clientId, clientSecret) {
  const path = ".env.local";
  const lines = existsSync(path) ? readFileSync(path, "utf8").split(/\r?\n/) : [];
  const map = new Map();

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith("#")) {
      map.set(`__raw__${map.size}`, line);
      continue;
    }
    const idx = line.indexOf("=");
    if (idx === -1) {
      map.set(`__raw__${map.size}`, line);
      continue;
    }
    map.set(line.slice(0, idx).trim(), line.slice(idx + 1));
  }

  map.set("FACEBOOK_OAUTH_CLIENT_ID", clientId);
  map.set("FACEBOOK_OAUTH_CLIENT_SECRET", clientSecret);
  if (![...map.keys()].includes("NEXT_PUBLIC_AUTH_FACEBOOK_ENABLED")) {
    map.set("NEXT_PUBLIC_AUTH_FACEBOOK_ENABLED", "true");
  }

  const out = [];
  const written = new Set();
  for (const [key, value] of map.entries()) {
    if (key.startsWith("__raw__")) {
      out.push(value);
      continue;
    }
    if (written.has(key)) continue;
    written.add(key);
    out.push(`${key}=${value}`);
  }

  writeFileSync(path, `${out.join("\n")}\n`, "utf8");
}

const env = loadEnv();
const clientId = env.FACEBOOK_OAUTH_CLIENT_ID || "1583175109840747";
let clientSecret = (process.env.FACEBOOK_OAUTH_CLIENT_SECRET ?? env.FACEBOOK_OAUTH_CLIENT_SECRET ?? "").trim();
const projectRef = loadProjectRef(env);
const accessToken = loadAccessToken(env);

if (!clientSecret) {
  const rl = readline.createInterface({ input, output });
  clientSecret = (await rl.question("Meta App Secret を貼り付けて Enter: ")).trim();
  rl.close();
}

if (!clientSecret) {
  console.error("Secret が空です。");
  process.exit(1);
}

if (clientSecret.length < 20) {
  console.error(
    `Secret が短すぎます（${clientSecret.length} 文字）。Meta → 設定 → ベーシック のアプリシークレット全体をコピーしてください。`,
  );
  process.exit(1);
}

console.log("Meta で Secret を検証中...");
if (!(await validateFacebookSecret(clientId, clientSecret))) {
  console.error("失敗: Meta が Secret を拒否しました。再生成してやり直してください。");
  process.exit(1);
}
console.log("OK Meta Secret 有効");

upsertEnvLocal(clientId, clientSecret);
console.log("OK .env.local を更新");

if (!accessToken || !projectRef) {
  console.log("");
  console.log("Supabase API トークンがないため、手動で保存してください:");
  console.log("https://supabase.com/dashboard/project/sszlycovwefpyxjllbns/auth/providers");
  console.log("→ Supabase Auth → Facebook → Secret を貼り付け → Save");
  process.exit(0);
}

console.log("Supabase に反映中...");
if (await patchSupabase(projectRef, accessToken, clientId, clientSecret)) {
  console.log("OK Supabase Facebook Secret を更新しました");
  console.log("https://eldonia-nex.com/auth/login で Facebook ログインを試してください");
  process.exit(0);
}

console.log("");
console.log("Supabase への自動反映に失敗しました。ブラウザで手動保存してください:");
console.log("https://supabase.com/dashboard/project/sszlycovwefpyxjllbns/auth/providers");
console.log("→ Supabase Auth → Facebook → Secret を貼り付け → Save");
process.exit(1);
