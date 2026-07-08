/**
 * Seed 10-photo fantasy album by Composer (AI) to production GALLERY.
 * Usage: node scripts/seed-composer-photo-album.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const ASSET_DIR = join(process.cwd(), "public/aset/seed/composer-fantasy-photos");
const CAPTIONS = [
  "黄昏の黄金都市 — ネクサスの都",
  "灯り揺れる市場路",
  "浮遊する山脈と朝霧",
  "古代樹の森、光の筋",
  "鏡の湖と二つの月",
  "夜の城下町",
  "オーロラの平原",
  "嵐の断崖と石の門",
  "ネクサスの夕暮れ",
  "星降る黄金の門",
];

const PAGE_FILES = Array.from({ length: 10 }, (_, i) =>
  join(ASSET_DIR, `photo-${String(i + 1).padStart(2, "0")}.png`),
);

const AUTHOR = {
  email: "composer-ai@eldonia-nex.com",
  username: "composer_ai",
  display_name: "Composer (AI)",
  bio: "Cursor の AI モデル Composer によるデモ作品（漫画・写真）。Eldonia-Nex の世界観を紹介します。",
  disciplines: ["manga_artist", "photographer"],
};

const ARTWORK = {
  title: "幻想紀行 — ファンタジー世界写真集",
  description:
    "AI（Composer）が撮影した幻想的な風景写真集。煌びやかな街並み、壮大な自然、夜の城下町など全10枚。写真カテゴリのスライドショー表示のデモです。",
  tags: ["写真集", "ファンタジー", "風景", "Composer", "AI", "Eldonia-Nex"],
  story_excerpt: "黄金と闇に彩られた幻想世界を、10枚の写真で旅する。",
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
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", AUTHOR.username)
    .maybeSingle();

  let userId = existingProfile?.id;

  const adminHeaders = {
    Authorization: `Bearer ${secret}`,
    apikey: secret,
    "Content-Type": "application/json",
  };

  if (!userId) {
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
    userId = createBody.id;
  }

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      username: AUTHOR.username,
      display_name: AUTHOR.display_name,
      bio: AUTHOR.bio,
      is_creator: true,
      disciplines: AUTHOR.disciplines,
    },
    { onConflict: "id" },
  );
  if (profileError) throw profileError;

  return userId;
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
      console.error("Missing photo file:", file);
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
    console.log("Photo album already exists:", existing.id);
    console.log(`https://eldonia-nex.com/gallery/${existing.id}`);
    return;
  }

  console.log("Uploading 10 photos...");
  const pageUrls = [];
  for (let i = 0; i < PAGE_FILES.length; i++) {
    pageUrls.push(await uploadPage(supabase, userId, PAGE_FILES[i], `-ph${i + 1}`));
    console.log(`  photo ${i + 1}/10 OK`);
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
      category: "photo",
      format: "multi_page",
      page_count: 10,
      story_excerpt: ARTWORK.story_excerpt,
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
    caption: CAPTIONS[index + 1] ?? null,
  }));

  const { error: pagesError } = await supabase.from("artwork_pages").insert(extraPages);
  if (pagesError) throw pagesError;

  console.log("\nDone!");
  console.log("Artwork:", artwork.id);
  console.log(`Gallery: https://eldonia-nex.com/gallery/${artwork.id}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
