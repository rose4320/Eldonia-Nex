import { existsSync, readFileSync } from "node:fs";
import nodemailer from "nodemailer";

function loadEnv() {
  const path = ".env.production.supabase";
  if (!existsSync(path)) {
    console.error("Missing .env.production.supabase");
    process.exit(1);
  }
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

async function main() {
  const env = loadEnv();
  const host = env.SUPABASE_SMTP_HOST ?? "elbonianex.sakura.ne.jp";
  const port = Number(env.SUPABASE_SMTP_PORT ?? "587");
  const user = env.SUPABASE_SMTP_USER ?? "support@elbonianex.sakura.ne.jp";
  const pass = env.SUPABASE_SMTP_PASS ?? env.SMTP_PASS ?? "";
  const to = process.argv[2] ?? user;

  if (!pass) {
    console.error("SUPABASE_SMTP_PASS is missing.");
    process.exit(1);
  }

  console.log("Testing Sakura SMTP...");
  console.log("  host:", host);
  console.log("  port:", port);
  console.log("  user:", user);
  console.log("  to:", to);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    requireTLS: port === 587,
    tls: { minVersion: "TLSv1.2" },
  });

  try {
    await transporter.verify();
    console.log("SMTP verify: OK (login succeeded)");
  } catch (error) {
    console.error("SMTP verify: FAILED");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }

  const fromCandidates = [
    env.SUPABASE_SMTP_ADMIN_EMAIL ?? "support@eldonia-nex.com",
    user,
  ];

  for (const from of [...new Set(fromCandidates)]) {
    try {
      const info = await transporter.sendMail({
        from: `"Eldonia Nex Test" <${from}>`,
        to,
        subject: `[Eldonia] SMTP test from ${from}`,
        text: `Test sent at ${new Date().toISOString()}\nFrom: ${from}`,
      });
      console.log(`Send OK (from=${from}) messageId=${info.messageId ?? "n/a"}`);
    } catch (error) {
      console.error(`Send FAILED (from=${from})`);
      console.error(error instanceof Error ? error.message : error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
