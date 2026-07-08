/* jshint esversion: 11, node: true */
/**
 * Seed Eldonia-Nex usage textbook (story + narrative reader demo).
 * Usage: node scripts/seed-composer-textbook.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const SEED_DIR = join(process.cwd(), "public/aset/seed/composer-eldonia-textbook");
const BODY_FILE = join(SEED_DIR, "textbook-body.md");
const COVER_FILE = join(process.cwd(), "public/design/gallery/eldonia-nex-key-visual.png");

const AUTHOR = {
  email: "composer-ai@eldonia-nex.com",
  username: "composer_ai",
  display_name: "Composer (AI)",
  disciplines: ["writer", "illustrator"],
};

const ARTWORK = {
  title: "Eldonia-Nex 使い方テキストブック",
  story_excerpt:
    "GALLERY・Lab・SHOP への導線を章立てで学ぶ、読み上げナレーション付きの公式風デモ教本です。",
  tags: ["公式風デモ", "テキストブック", "使い方", "Eldonia-Nex", "Composer", "AI"],
};

function minimalPdfBuffer(title) {
  const text = `(${title}) Tj`;
  const stream = `BT /F1 18 Tf 72 720 Td ${text} ET`;
  const objects = [
    "1 0 obj<< /Type /Catalog /Pages 2 0 R>>endobj",
    "2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1>>endobj",
    "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources<< /Font<< /F1<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica>>>>>>endobj",
    `4 0 obj<< /Length ${stream.length}>>stream\n${stream}\nendstream\nendobj`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${object}\n`;
  }

  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer<< /Size ${objects.length + 1} /Root 1 0 R>>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, "utf8");
}

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
    .select("id, disciplines")
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

  const mergedDisciplines = Array.from(
    new Set([...(existingProfile?.disciplines ?? []), ...AUTHOR.disciplines]),
  );

  const { error: profileError } = await supabase.from("profiles").upsert(
    {
      id: userId,
      username: AUTHOR.username,
      display_name: AUTHOR.display_name,
      is_creator: true,
      disciplines: mergedDisciplines,
    },
    { onConflict: "id" },
  );
  if (profileError) throw profileError;

  return userId;
}

async function uploadBytes(supabase, userId, bytes, suffix, extension, contentType) {
  const objectPath = `${userId}/${crypto.randomUUID()}${suffix}.${extension}`;
  const { error } = await supabase.storage.from("artworks").upload(objectPath, bytes, {
    cacheControl: "3600",
    upsert: false,
    contentType,
  });
  if (error) throw error;
  const {
    data: { publicUrl },
  } = supabase.storage.from("artworks").getPublicUrl(objectPath);
  return publicUrl;
}

async function main() {
  if (!existsSync(BODY_FILE)) {
    console.error("Missing body file:", BODY_FILE);
    process.exit(1);
  }
  if (!existsSync(COVER_FILE)) {
    console.error("Missing cover file:", COVER_FILE);
    process.exit(1);
  }

  const description = readFileSync(BODY_FILE, "utf8").trim();
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
    console.log("Textbook already exists:", existing.id);
    console.log(`https://eldonia-nex.com/gallery/${existing.id}`);
    return;
  }

  console.log("Uploading textbook assets...");
  const pdfUrl = await uploadBytes(
    supabase,
    userId,
    minimalPdfBuffer(ARTWORK.title),
    "-textbook",
    "pdf",
    "application/pdf",
  );
  const coverUrl = await uploadBytes(
    supabase,
    userId,
    readFileSync(COVER_FILE),
    "-textbook-cover",
    "png",
    "image/png",
  );

  const { data: artwork, error: insertError } = await supabase
    .from("artworks")
    .insert({
      creator_id: userId,
      title: ARTWORK.title,
      description,
      media_type: "document",
      media_url: pdfUrl,
      thumbnail_url: coverUrl,
      category: "story",
      format: "story",
      page_count: 1,
      story_excerpt: ARTWORK.story_excerpt,
      tags: ARTWORK.tags,
      is_public: true,
    })
    .select("id")
    .single();

  if (insertError || !artwork) {
    throw insertError ?? new Error("Artwork insert failed");
  }

  console.log("\nDone!");
  console.log("Artwork:", artwork.id);
  console.log(`Gallery: https://eldonia-nex.com/gallery/${artwork.id}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
