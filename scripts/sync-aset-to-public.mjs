import { cpSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SOURCE = join(process.cwd(), "aset");
const TARGET = join(process.cwd(), "public", "aset");

function copyRecursive(src, dest) {
  if (!existsSync(src)) {
    console.warn(`sync-aset: source missing (${src})`);
    return;
  }

  mkdirSync(dest, { recursive: true });

  for (const entry of readdirSync(src)) {
    if (entry === "README.md" || entry === ".gitignore") continue;
    const from = join(src, entry);
    const to = join(dest, entry);
    if (statSync(from).isDirectory()) {
      copyRecursive(from, to);
    } else {
      cpSync(from, to);
    }
  }
}

if (!existsSync(SOURCE)) {
  console.warn("sync-aset: aset/ not found — skip");
  process.exit(0);
}

copyRecursive(SOURCE, TARGET);
console.log("Synced aset/ → public/aset/");
