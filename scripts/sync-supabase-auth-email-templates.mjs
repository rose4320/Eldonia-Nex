import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const TEMPLATE_DIR = join("supabase", "templates");

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

  const confirmationContent = readFileSync(
    join(TEMPLATE_DIR, "auth-confirmation.html"),
    "utf8",
  );
  const confirmationSubject = readFileSync(
    join(TEMPLATE_DIR, "auth-confirmation-subject.txt"),
    "utf8",
  ).trim();

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        mailer_subjects_confirmation: confirmationSubject,
        mailer_templates_confirmation_content: confirmationContent,
      }),
    },
  );

  if (!response.ok) {
    console.error("Failed to update auth email templates:", response.status, await response.text());
    process.exit(1);
  }

  console.log("Supabase confirmation email templates updated (ja / en / ko / zh-CN).");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
