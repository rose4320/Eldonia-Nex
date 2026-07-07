import { readFileSync } from "node:fs";

function loadEnv() {
  const env = {};
  for (const file of [".env.local", ".env"]) {
    try {
      for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
        if (m && !(m[1] in env)) env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
      }
    } catch {
      // ignore
    }
  }
  return env;
}

const email = process.argv[2]?.trim();
if (!email) {
  console.error("Usage: node scripts/check-user-reset.mjs <email>");
  process.exit(1);
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const anonKey =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!url || !serviceKey || !anonKey) {
  console.error("FAIL missing Supabase env");
  process.exit(1);
}

const adminHeaders = {
  Authorization: `Bearer ${serviceKey}`,
  apikey: serviceKey,
};

const listRes = await fetch(
  `${url}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
  { headers: adminHeaders },
);
const listBody = await listRes.json();
const user = (listBody.users ?? []).find(
  (item) => item.email?.toLowerCase() === email.toLowerCase(),
);

if (!user) {
  console.log("USER_STATUS:not_registered");
  process.exit(0);
}

console.log("USER_STATUS:registered");
console.log(`EMAIL_CONFIRMED:${Boolean(user.email_confirmed_at)}`);
console.log(`LAST_SIGN_IN:${user.last_sign_in_at ?? "never"}`);

const resetRes = await fetch(`${url}/auth/v1/recover`, {
  method: "POST",
  headers: {
    apikey: anonKey,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email }),
});

if (resetRes.ok) {
  console.log("RESET_EMAIL:sent");
} else {
  const body = await resetRes.json().catch(() => ({}));
  console.log("RESET_EMAIL:failed");
  console.log(`RESET_REASON:${body.msg ?? body.error ?? resetRes.statusText}`);
  process.exit(1);
}
