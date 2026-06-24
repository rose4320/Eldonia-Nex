import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const ENV_FILE = ".env.production.supabase";

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

  for (const file of [".env", ".env.local"]) {
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

async function fetchPublishableKey(projectRef, accessToken) {
  if (!accessToken || !projectRef) return "";

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/api-keys?reveal=true`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) {
    console.warn(
      "Could not fetch API keys from Supabase Management API:",
      response.status,
    );
    return "";
  }

  const keys = await response.json();
  const publishable = keys.find((key) => key.type === "publishable");
  if (publishable?.api_key) return publishable.api_key;

  const legacyAnon = keys.find((key) => key.name === "anon");
  return legacyAnon?.api_key ?? "";
}

function run(command) {
  execSync(command, { stdio: "inherit", shell: true });
}

function upsertVercelEnv(name, value, environment = "production") {
  const escaped = value.replace(/"/g, '\\"');
  try {
    run(
      `npx vercel env update ${name} ${environment} --value "${escaped}" --yes`,
    );
    return;
  } catch {
    // variable may not exist yet
  }
  run(`npx vercel env add ${name} ${environment} --value "${escaped}" --yes`);
}

if (!existsSync(ENV_FILE)) {
  console.error(`Missing ${ENV_FILE}. Copy .env.production.supabase.example first.`);
  process.exit(1);
}

const env = loadFile(ENV_FILE);
const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
let publishable =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";
const secret = env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const projectRef =
  env.SUPABASE_PROJECT_REF ??
  url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ??
  "";

if (!url || !secret) {
  console.error("Missing URL or secret key in", ENV_FILE);
  process.exit(1);
}

if (url.includes("127.0.0.1") || url.includes("localhost")) {
  console.error("Refusing to sync local Supabase URL to Vercel production:", url);
  process.exit(1);
}

if (!publishable) {
  const accessToken = loadAccessToken();
  if (accessToken) {
    console.log("Fetching publishable key from Supabase Management API...");
    publishable = await fetchPublishableKey(projectRef, accessToken);
  }
}

console.log("Updating Vercel production env...");
upsertVercelEnv("NEXT_PUBLIC_SUPABASE_URL", url);
upsertVercelEnv("NEXT_PUBLIC_SITE_URL", "https://eldonia-nex.com");
upsertVercelEnv("SUPABASE_SECRET_KEY", secret);
upsertVercelEnv("SUPABASE_SERVICE_ROLE_KEY", secret);

if (publishable) {
  upsertVercelEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", publishable);
  upsertVercelEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", publishable);
  console.log("Publishable key synced.");
} else {
  console.warn(
    "Publishable key missing — login uses /api/auth/login; client-side Supabase actions need the publishable key later.",
  );
}

const supabase = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const adminEmail = env.PROD_ADMIN_EMAIL ?? "admin@eldonia-nex.com";
const createEmail = env.PROD_CREATE_EMAIL ?? "create@eldonia-nex.com";
const password = env.PROD_USER_PASSWORD ?? "";

async function ensureUser(email, metadata = {}) {
  const list = await fetch(
    `${url}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
    {
      headers: {
        Authorization: `Bearer ${secret}`,
        apikey: secret,
      },
    },
  ).then((res) => res.json());

  const existing = (list.users ?? []).find(
    (user) => user.email?.toLowerCase() === email.toLowerCase(),
  );

  if (existing) {
    if (!password) return { email, action: "exists" };
    await fetch(`${url}/auth/v1/admin/users/${existing.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${secret}`,
        apikey: secret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, email_confirm: true }),
    });
    return { email, action: "password-updated" };
  }

  if (!password) return { email, action: "missing" };

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
  });

  if (error) throw error;
  return { email, action: "created", id: data.user?.id };
}

console.log("Checking cloud Supabase connectivity...");
const health = await fetch(`${url}/auth/v1/health`, {
  headers: { apikey: secret },
}).catch(() => null);
if (!health?.ok) {
  console.error("Cloud Supabase health check failed for", url);
  process.exit(1);
}
console.log("Cloud Supabase reachable.");

if (password) {
  const seeded = [];
  seeded.push(await ensureUser(adminEmail, { display_name: "Admin" }));
  seeded.push(
    await ensureUser(createEmail, {
      display_name: "Creator",
      username: "create",
    }),
  );
  for (const item of seeded) {
    console.log(`seed ${item.email}: ${item.action}`);
  }
} else {
  console.log("Skipped user seeding (PROD_USER_PASSWORD not set).");
}

console.log("Deploying production...");
run("npx vercel deploy --prod --yes");

console.log("Done. Verify login at https://eldonia-nex.com/auth/login");
