/* jshint esversion: 11, node: true */
/**
 * Attach or replace BGM on the Composer fantasy photo album (production).
 * Usage:
 *   node scripts/attach-photo-album-bgm.mjs
 *   node scripts/attach-photo-album-bgm.mjs --force
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const BGM_FILE = join(
  process.cwd(),
  "public/aset/seed/composer-fantasy-photos/fantasy-slideshow-bgm.mp3",
);
const ALBUM_TITLE = "幻想紀行 — ファンタジー世界写真集";
const AUTHOR_USERNAME = "composer_ai";
const forceReplace = process.argv.includes("--force");

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
  if (!existsSync(BGM_FILE)) {
    console.error("Missing BGM file:", BGM_FILE);
    process.exit(1);
  }

  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const secret = env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !secret) {
    console.error("Missing Supabase URL or service role key");
    process.exit(1);
  }

  const supabase = createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", AUTHOR_USERNAME)
    .maybeSingle();

  if (!profile?.id) {
    console.error("Composer profile not found");
    process.exit(1);
  }

  const { data: artwork, error: artworkError } = await supabase
    .from("artworks")
    .select("id, title, bgm_url")
    .eq("creator_id", profile.id)
    .eq("title", ALBUM_TITLE)
    .maybeSingle();

  if (artworkError || !artwork) {
    throw artworkError ?? new Error("Photo album artwork not found");
  }

  if (artwork.bgm_url && !forceReplace) {
    console.log("BGM already set (use --force to replace):", artwork.id);
    console.log(artwork.bgm_url);
    console.log(`https://eldonia-nex.com/gallery/${artwork.id}`);
    return;
  }

  const bytes = readFileSync(BGM_FILE);
  const objectPath = `${profile.id}/${crypto.randomUUID()}-bgm.mp3`;

  const { error: uploadError } = await supabase.storage.from("artworks").upload(objectPath, bytes, {
    cacheControl: "3600",
    upsert: false,
    contentType: "audio/mpeg",
  });
  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("artworks").getPublicUrl(objectPath);

  const { error: updateError } = await supabase
    .from("artworks")
    .update({ bgm_url: publicUrl })
    .eq("id", artwork.id);

  if (updateError) throw updateError;

  console.log(forceReplace ? "BGM replaced!" : "BGM attached!");
  console.log("Artwork:", artwork.id);
  console.log("BGM URL:", publicUrl);
  console.log(`Gallery: https://eldonia-nex.com/gallery/${artwork.id}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
