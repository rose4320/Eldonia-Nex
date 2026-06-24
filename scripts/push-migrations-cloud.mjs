import fs from "node:fs";
import { execSync } from "node:child_process";

const env = Object.fromEntries(
  fs
    .readFileSync(".env", "utf8")
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const i = line.indexOf("=");
      return [line.slice(0, i), line.slice(i + 1).replace(/^["']|["']$/g, "")];
    }),
);

const url = env.SUPABASE_DB_URL ?? env.DATABASE_URL;
if (!url) {
  console.error("Missing SUPABASE_DB_URL or DATABASE_URL in .env");
  process.exit(1);
}

execSync(`npx supabase db push --db-url "${url}"`, {
  stdio: "inherit",
  shell: true,
});
