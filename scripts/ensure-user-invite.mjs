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
  console.error("Usage: node scripts/ensure-user-invite.mjs <email>");
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
  "Content-Type": "application/json",
};

async function findUser() {
  const listRes = await fetch(
    `${url}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
    { headers: adminHeaders },
  );
  const listBody = await listRes.json();
  return (listBody.users ?? []).find(
    (item) => item.email?.toLowerCase() === email.toLowerCase(),
  );
}

let user = await findUser();

if (!user) {
  const createRes = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: adminHeaders,
    body: JSON.stringify({
      email,
      email_confirm: true,
      user_metadata: { display_name: email.split("@")[0] },
    }),
  });
  const createBody = await createRes.json().catch(() => ({}));
  if (!createRes.ok) {
    console.error("CREATE_FAILED", createBody.msg ?? createBody.error ?? createRes.statusText);
    process.exit(1);
  }
  user = createBody;
  console.log("USER_STATUS:created");
} else {
  console.log("USER_STATUS:already_registered");
}

const resetRes = await fetch(`${url}/auth/v1/recover`, {
  method: "POST",
  headers: {
    apikey: anonKey,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email }),
});

if (!resetRes.ok) {
  const body = await resetRes.json().catch(() => ({}));
  console.error("RESET_FAILED", body.msg ?? body.error ?? resetRes.statusText);
  process.exit(1);
}

console.log("RESET_EMAIL:sent");
console.log(`EMAIL_CONFIRMED:${Boolean(user.email_confirmed_at ?? true)}`);
