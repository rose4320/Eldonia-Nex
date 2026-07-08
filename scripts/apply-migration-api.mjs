/* jshint esversion: 11, node: true, -W117 */
/**
 * Apply a single SQL migration to production via Supabase Management API.
 * Usage: node scripts/apply-migration-api.mjs 028_artwork_bgm.sql
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

function loadEnv() {
  const env = {};
  for (const file of [".env.local", ".env.production.supabase", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      if (!(key in env)) {
        env[key] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      }
    }
  }
  return env;
}

async function main() {
  const migrationFile = process.argv[2] ?? "028_artwork_bgm.sql";
  const sqlPath = join(process.cwd(), "supabase/migrations", migrationFile);

  if (!existsSync(sqlPath)) {
    console.error("Migration file not found:", sqlPath);
    process.exit(1);
  }

  const sql = readFileSync(sqlPath, "utf8").trim();
  if (!sql) {
    console.error("Migration file is empty:", sqlPath);
    process.exit(1);
  }

  const env = loadEnv();
  const token = env.SUPABASE_ACCESS_TOKEN ?? process.env.SUPABASE_ACCESS_TOKEN ?? "";
  const ref =
    env.SUPABASE_PROJECT_REF ??
    (env.NEXT_PUBLIC_SUPABASE_URL ?? "").match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ??
    "";

  if (!token) {
    console.error("Missing SUPABASE_ACCESS_TOKEN in .env.local / .env");
    process.exit(1);
  }
  if (!ref) {
    console.error("Missing project ref. Set SUPABASE_PROJECT_REF or NEXT_PUBLIC_SUPABASE_URL");
    process.exit(1);
  }

  const response = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });

  const body = await response.text();
  console.log("Migration:", migrationFile);
  console.log("Project:", ref);
  console.log("Status:", response.status);

  if (!response.ok) {
    console.error(body);
    process.exit(1);
  }

  console.log(body || "OK");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
