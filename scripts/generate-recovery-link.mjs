import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
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
      // ignore
    }
  }
  return env;
}

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Usage: node scripts/generate-recovery-link.mjs <email>");
  process.exit(1);
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey = env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const siteUrl = env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

if (!url || !serviceKey) {
  console.error("FAIL missing Supabase env");
  process.exit(1);
}

const projectRef = url.match(/https:\/\/([^.]+)/)?.[1] ?? "unknown";
console.log(`PROJECT:${projectRef}`);

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
  type: "recovery",
  email,
  options: { redirectTo: `${siteUrl}/auth/reset-password` },
});

if (linkError || !linkData?.properties?.action_link) {
  console.error("LINK_FAILED", linkError?.message ?? "missing action_link");
  process.exit(1);
}

const outPath = join(process.cwd(), ".recovery-link.local.txt");
writeFileSync(
  outPath,
  [
    `Generated: ${new Date().toISOString()}`,
    `Email: ${email}`,
    `Open this link once to set a new password:`,
    linkData.properties.action_link,
    "",
  ].join("\n"),
  "utf8",
);

console.log("RECOVERY_LINK_FILE:.recovery-link.local.txt");
console.log("LINK_READY:yes");
