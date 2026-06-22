import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const env = {};
  for (const file of [".env.local", ".env"]) {
    try {
      for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (m && !(m[1] in env)) env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
      }
    } catch {
      // ignore missing file
    }
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";
const adminPassword = env.DJANGO_ADMIN_PASSWORD ?? "";

if (!url || !key) {
  console.error("FAIL missing Supabase URL or publishable key");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const results = [];

async function testLogin(label, email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  results.push({
    label,
    ok: !error && Boolean(data.session),
    email,
    error: error?.message ?? null,
  });
  if (data.session) await supabase.auth.signOut();
}

async function ensureCreatePassword(serviceKey, password) {
  const headers = {
    Authorization: `Bearer ${serviceKey}`,
    apikey: serviceKey,
    "Content-Type": "application/json",
  };
  const listRes = await fetch(
    `${url}/auth/v1/admin/users?email=${encodeURIComponent("create@eldonia-nex.com")}`,
    { headers },
  );
  const listBody = await listRes.json();
  const user = (listBody.users ?? []).find(
    (item) => item.email?.toLowerCase() === "create@eldonia-nex.com",
  );
  if (!user) {
    return { ensured: false, reason: "create@ user not found" };
  }
  const res = await fetch(`${url}/auth/v1/admin/users/${user.id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ password, email_confirm: true }),
  });
  if (!res.ok) {
    const body = await res.json();
    return { ensured: false, reason: body.msg ?? body.error ?? res.statusText };
  }
  return { ensured: true };
}

async function testSignupFlow() {
  const testEmail = `signup-test-${Date.now()}@eldonia-nex.com`;
  const testPassword = "TestSignup2026!";
  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: testPassword,
    options: {
      data: { display_name: "Signup Test", username: `test_${Date.now()}` },
    },
  });

  const ok = !error && Boolean(data.user);
  results.push({
    label: "signup new user",
    ok,
    email: testEmail,
    error: error?.message ?? null,
    session: Boolean(data.session),
  });

  const serviceKey = env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (serviceKey && data.user?.id) {
    await fetch(`${url}/auth/v1/admin/users/${data.user.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
    });
  }
}

const serviceKey = env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY ?? "";
if (adminPassword && serviceKey) {
  const ensured = await ensureCreatePassword(serviceKey, adminPassword);
  results.push({
    label: "ensure create@ password",
    ok: ensured.ensured,
    email: "create@eldonia-nex.com",
    error: ensured.reason ?? null,
  });
}

if (adminPassword) {
  await testLogin("login admin@", "admin@eldonia-nex.com", adminPassword);
  await testLogin("login create@", "create@eldonia-nex.com", adminPassword);
}

await testSignupFlow();

let failed = 0;
for (const item of results) {
  const status = item.ok ? "OK" : "FAIL";
  if (!item.ok) failed += 1;
  console.log(
    `${status} ${item.label}${item.email ? ` (${item.email})` : ""}${
      item.error ? ` -> ${item.error}` : ""
    }${item.session === false ? " [email confirm may be required]" : ""}`,
  );
}

console.log(`\nSupabase URL: ${url}`);
console.log(`Key type: ${key.startsWith("sb_publishable_") ? "publishable" : "legacy-anon"}`);
process.exit(failed > 0 ? 1 : 0);
