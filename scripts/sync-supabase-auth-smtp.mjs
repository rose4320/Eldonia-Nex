import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const DEFAULTS = {
  host: "elbonianex.sakura.ne.jp",
  port: "587",
  user: "support@elbonianex.sakura.ne.jp",
  adminEmail: "support@eldonia-nex.com",
  senderName: "Eldonia Nex",
};

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

  for (const file of [".env.production.supabase", ".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    Object.assign(merged, loadFile(file));
  }

  return merged;
}

function loadAccessToken(env) {
  if (env.SUPABASE_ACCESS_TOKEN) return env.SUPABASE_ACCESS_TOKEN;

  const tokenPath = join(homedir(), ".supabase", "access-token");
  if (existsSync(tokenPath)) {
    return readFileSync(tokenPath, "utf8").trim();
  }

  return "";
}

function loadProjectRef(env) {
  if (env.SUPABASE_PROJECT_REF) return env.SUPABASE_PROJECT_REF;

  const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match?.[1] ?? "";
}

function requireSmtpPassword(env) {
  const password = env.SUPABASE_SMTP_PASS ?? env.SMTP_PASS ?? "";
  if (!password) {
    console.error(
      "Missing SUPABASE_SMTP_PASS (or SMTP_PASS) in .env.production.supabase",
    );
    process.exit(1);
  }
  return password;
}

async function main() {
  const env = loadEnv();
  const accessToken = loadAccessToken(env);
  const projectRef = loadProjectRef(env);

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

  const smtpPass = requireSmtpPassword(env);
  const smtpHost = env.SUPABASE_SMTP_HOST ?? env.SMTP_HOST ?? DEFAULTS.host;
  const smtpPort = String(env.SUPABASE_SMTP_PORT ?? env.SMTP_PORT ?? DEFAULTS.port);
  const smtpUser = env.SUPABASE_SMTP_USER ?? env.SMTP_USER ?? DEFAULTS.user;
  const smtpAdminEmail =
    env.SUPABASE_SMTP_ADMIN_EMAIL ?? env.SMTP_FROM ?? DEFAULTS.adminEmail;
  const smtpSenderName =
    env.SUPABASE_SMTP_SENDER_NAME ?? env.SMTP_FROM_NAME ?? DEFAULTS.senderName;
  const rateLimitEmailSent = Number(env.SUPABASE_RATE_LIMIT_EMAIL_SENT ?? "60");

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };

  const body = {
    external_email_enabled: true,
    mailer_autoconfirm: false,
    mailer_secure_email_change_enabled: true,
    smtp_host: smtpHost,
    smtp_port: smtpPort,
    smtp_user: smtpUser,
    smtp_pass: smtpPass,
    smtp_admin_email: smtpAdminEmail,
    smtp_sender_name: smtpSenderName,
    rate_limit_email_sent: Number.isFinite(rateLimitEmailSent) ? rateLimitEmailSent : 60,
  };

  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/config/auth`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    console.error("Failed to update Supabase SMTP config:", response.status, await response.text());
    process.exit(1);
  }

  const updated = await response.json();
  console.log("Supabase custom SMTP configured.");
  console.log("  smtp_host:", updated.smtp_host ?? smtpHost);
  console.log("  smtp_port:", updated.smtp_port ?? smtpPort);
  console.log("  smtp_user:", updated.smtp_user ?? smtpUser);
  console.log("  smtp_admin_email:", updated.smtp_admin_email ?? smtpAdminEmail);
  console.log("  smtp_sender_name:", updated.smtp_sender_name ?? smtpSenderName);
  console.log("  external_email_enabled:", updated.external_email_enabled);
  console.log("  mailer_autoconfirm:", updated.mailer_autoconfirm);
  console.log("  rate_limit_email_sent:", updated.rate_limit_email_sent ?? rateLimitEmailSent);
  console.log("");
  console.log("Next: run signup on https://eldonia-nex.com/auth/signup and check inbox/spam.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
