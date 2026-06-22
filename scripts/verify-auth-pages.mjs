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

const env = loadEnv();
const base = process.env.APP_BASE_URL ?? "http://127.0.0.1:3000";
const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key =
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";
const password = env.DJANGO_ADMIN_PASSWORD ?? "";

async function waitForServer() {
  for (let i = 0; i < 30; i += 1) {
    try {
      const res = await fetch(`${base}/auth/login`, { redirect: "manual" });
      if (res.status === 200) return true;
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
}

const ready = await waitForServer();
if (!ready) {
  console.error("FAIL dev server not reachable at", base);
  process.exit(1);
}

const loginPage = await fetch(`${base}/auth/login`);
const signupPage = await fetch(`${base}/auth/signup`);
console.log("OK login page", loginPage.status);
console.log("OK signup page", signupPage.status);

const tokenRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { apikey: key, "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "create@eldonia-nex.com",
    password,
  }),
});
const tokenBody = await tokenRes.json();
if (!tokenRes.ok) {
  console.error("FAIL create@ token", tokenBody.error_description ?? tokenBody);
  process.exit(1);
}
console.log("OK create@ access token");

const consentRes = await fetch(`${base}/api/onboarding/consents`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Cookie: `sb-localhost-auth-token=${encodeURIComponent(JSON.stringify(tokenBody))}`,
  },
  body: JSON.stringify({
    planId: "free",
    paymentStatus: "not_required",
    consents: [
      { type: "terms_of_service", title: "Terms", version: "2026-06-19" },
      { type: "privacy_policy", title: "Privacy", version: "2026-06-19" },
      { type: "subscription_terms", title: "Sub", version: "2026-06-19" },
      { type: "creator_guidelines", title: "Guide", version: "2026-06-19" },
      { type: "commerce_terms", title: "Commerce", version: "2026-06-19" },
    ],
  }),
});
console.log(
  consentRes.ok ? "OK consent API" : `WARN consent API ${consentRes.status}`,
  await consentRes.text(),
);
