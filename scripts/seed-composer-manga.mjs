/**
 * Seed 10-page demo manga by Composer (AI) to production GALLERY.
 * Usage: node scripts/seed-composer-manga.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const ASSET_DIR = join(process.cwd(), "public/aset/seed/composer-eldonia-manga");
const PAGE_FILES = Array.from({ length: 10 }, (_, i) =>
  join(ASSET_DIR, `page-${String(i + 1).padStart(2, "0")}.png`),
);

const AUTHOR = {
  email: "composer-ai@eldonia-nex.com",
  username: "composer_ai",
  display_name: "Composer (AI)",
  bio: "Cursor の AI モデル Composer によるデモ漫画。Eldonia-Nex の世界観紹介用読み切り。",
  disciplines: ["manga_artist"],
};

const ARTWORK = {
  title: "Nexusへようこそ — Eldonia-Nex 10ページガイド",
  description:
    "AI（Composer）が描いた読み切りマンガ。GALLERY・Lab・SHOP・WORKS へつながる創作ネクサス Eldonia-Nex を10ページで紹介します。",
  tags: ["公式風デモ", "漫画", "Eldonia-Nex", "Composer", "AI"],
};

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

async function ensureAuthor(supabase, url, secret) {
  const adminHeaders = {
    Authorization: `Bearer ${secret}`,
    apikey: secret,
    "Content-Type": "application/json",
  };

  const findRes = await fetch(
    `${url}/auth/v1/admin/users?email=${encodeURIComponent(AUTHOR.email)}`,
    { headers: adminHeaders },
  );
  const findBody = await findRes.json().catch(() => ({}));
  let user = (findBody.users ?? []).find(
    (item) => item.email?.toLowerCase() === AUTHOR.email.toLowerCase(),
  );

  if (!user) {
    const createRes = await fetch(`${url}/auth/v1/admin/users`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        email: AUTHOR.email,
        email_confirm: true,
        user_metadata: {
          display_name: AUTHOR.display_name,
          username: AUTHOR.username,
        },
      }),
    });
    const createBody = await createRes.json().catch(() => ({}));
    if (!createRes.ok) {
      throw new Error(createBody.msg ?? createBody.message ?? `createUser ${createRes.status}`);
    }
    user = createBody;
    console.log("Created auth user:", AUTHOR.email);
  } else {
    console.log("Using existing auth user:", AUTHOR.email);
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      username: AUTHOR.username,
      display_name: AUTHOR.display_name,
      bio: AUTHOR.bio,
      is_creator: true,
      disciplines: AUTHOR.disciplines,
    },
    { onConflict: "id" },
  );
  if (profileError) throw profileError;

  return user.id;
}

async function uploadPage(supabase, userId, filePath, suffix) {
  const bytes = readFileSync(filePath);
  const objectPath = `${userId}/${crypto.randomUUID()}${suffix}.png`;

  const { error } = await supabase.storage.from("artworks").upload(objectPath, bytes, {
    cacheControl: "3600",
    upsert: false,
    contentType: "image/png",
  });
  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("artworks").getPublicUrl(objectPath);

  return publicUrl;
}

async function main() {
  for (const file of PAGE_FILES) {
    if (!existsSync(file)) {
      console.error("Missing page file:", file);
      process.exit(1);
    }
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

  const userId = await ensureAuthor(supabase, url, secret);

  const { data: existing } = await supabase
    .from("artworks")
    .select("id")
    .eq("creator_id", userId)
    .eq("title", ARTWORK.title)
    .maybeSingle();

  if (existing?.id) {
    console.log("Artwork already exists:", existing.id);
    console.log(`https://eldonia-nex.com/gallery/${existing.id}`);
    console.log(`https://eldonia-nex.com/gallery/creator/${AUTHOR.username}`);
    return;
  }

  console.log("Uploading 10 pages...");
  const pageUrls = [];
  for (let i = 0; i < PAGE_FILES.length; i++) {
    const urlUploaded = await uploadPage(supabase, userId, PAGE_FILES[i], `-p${i + 1}`);
    pageUrls.push(urlUploaded);
    console.log(`  page ${i + 1}/10 OK`);
  }

  const { data: artwork, error: insertError } = await supabase
    .from("artworks")
    .insert({
      creator_id: userId,
      title: ARTWORK.title,
      description: ARTWORK.description,
      media_type: "image",
      media_url: pageUrls[0],
      thumbnail_url: pageUrls[0],
      category: "manga",
      format: "multi_page",
      page_count: 10,
      story_excerpt: "創作の星々が繋がるファンタジー・ネクサスを、10ページの読み切りで紹介。",
      tags: ARTWORK.tags,
      is_public: true,
    })
    .select("id")
    .single();

  if (insertError || !artwork) {
    throw insertError ?? new Error("Artwork insert failed");
  }

  const extraPages = pageUrls.slice(1).map((mediaUrl, index) => ({
    artwork_id: artwork.id,
    page_index: index + 2,
    media_url: mediaUrl,
  }));

  const { error: pagesError } = await supabase.from("artwork_pages").insert(extraPages);
  if (pagesError) throw pagesError;

  console.log("\nDone!");
  console.log("Artwork:", artwork.id);
  console.log(`Gallery: https://eldonia-nex.com/gallery/${artwork.id}`);
  console.log(`Author:  https://eldonia-nex.com/gallery/creator/${AUTHOR.username}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
