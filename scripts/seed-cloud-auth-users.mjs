import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const env = {};
  for (const file of [".env.production.supabase", ".env"]) {
    try {
      for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const idx = trimmed.indexOf("=");
        if (idx === -1) continue;
        env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
      }
    } catch {
      // ignore
    }
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const secret = env.SUPABASE_SECRET_KEY;
const password = env.PROD_USER_PASSWORD;

const supabase = createClient(url, secret, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function ensureUser(email, metadata = {}) {
  const { data: listed, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) throw listError;

  const existing = listed.users.find(
    (user) => user.email?.toLowerCase() === email.toLowerCase(),
  );

  if (existing) {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
      user_metadata: { ...existing.user_metadata, ...metadata },
    });
    if (error) throw error;
    return `${email}: updated`;
  }

  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
  });
  if (error) throw error;
  return `${email}: created`;
}

const health = await fetch(`${url}/auth/v1/health`, {
  headers: { apikey: secret },
});
console.log("health", health.status);

console.log(await ensureUser("admin@eldonia-nex.com", { display_name: "Admin" }));
console.log(
  await ensureUser("create@eldonia-nex.com", {
    display_name: "Creator",
    username: "create",
  }),
);
