/**
 * Seed CC0 Khronos glTF sample models as 3D gallery test artworks.
 * Usage: node scripts/seed-gallery-3d-showcase.mjs
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const KHRONOS =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models";

const OFFICIAL_ID = "00000000-0000-4000-8000-000000000001";

/** Fixed artwork IDs — idempotent upsert */
const MODELS = [
  {
    id: "00000000-0000-4000-8000-000000000603",
    slug: "duck",
    title: "Rubber Duck (glTF Sample)",
    description:
      "Khronos glTF Sample Assets のラバーダック。3D ビューア動作確認用テスト作品（CC0・再投稿可）。",
    tags: ["3D", "GLB", "テスト", "Khronos", "CC0"],
    glbUrl: `${KHRONOS}/Duck/glTF-Binary/Duck.glb`,
    thumbUrl: `${KHRONOS}/Duck/screenshot/screenshot.png`,
    thumbExt: ".png",
    viewCount: 420,
  },
  {
    id: "00000000-0000-4000-8000-000000000604",
    slug: "avocado",
    title: "Avocado (glTF Sample)",
    description:
      "Khronos glTF Sample Assets のアボカド PBR モデル。Blender 系 3D 作品の表示テスト用（CC0・再投稿可）。",
    tags: ["3D", "GLB", "PBR", "テスト", "Khronos", "CC0"],
    glbUrl: `${KHRONOS}/Avocado/glTF-Binary/Avocado.glb`,
    thumbUrl: `${KHRONOS}/Avocado/screenshot/screenshot.jpg`,
    thumbExt: ".jpg",
    viewCount: 380,
  },
  {
    id: "00000000-0000-4000-8000-000000000605",
    slug: "lantern",
    title: "Lantern (glTF Sample)",
    description:
      "Khronos glTF Sample Assets のランタン PBR モデル。Blender 系 3D 作品のギャラリー表示テスト（CC0・再投稿可）。",
    tags: ["3D", "GLB", "PBR", "テスト", "Khronos", "CC0"],
    glbUrl: `${KHRONOS}/Lantern/glTF-Binary/Lantern.glb`,
    thumbUrl: `${KHRONOS}/Lantern/screenshot/screenshot.jpg`,
    thumbExt: ".jpg",
    viewCount: 510,
  },
];

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

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download failed ${res.status}: ${url}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

async function uploadAsset(supabase, userId, bytes, suffix, contentType) {
  const objectPath = `${userId}/${crypto.randomUUID()}${suffix}`;

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

async function seedModel(supabase, userId, model, cacheDir) {
  const { data: existing } = await supabase
    .from("artworks")
    .select("id, media_url")
    .eq("id", model.id)
    .maybeSingle();

  if (existing?.media_url?.includes(".glb")) {
    console.log(`  skip (already seeded): ${model.title}`);
    return existing.id;
  }

  mkdirSync(cacheDir, { recursive: true });
  const glbPath = join(cacheDir, `${model.slug}.glb`);
  const thumbPath = join(cacheDir, `${model.slug}-thumb${model.thumbExt}`);

  console.log(`  downloading ${model.slug}...`);
  const [glbBytes, thumbBytes] = await Promise.all([
    existsSync(glbPath) ? readFileSync(glbPath) : download(model.glbUrl).then((b) => {
      writeFileSync(glbPath, b);
      return b;
    }),
    existsSync(thumbPath)
      ? readFileSync(thumbPath)
      : download(model.thumbUrl).then((b) => {
          writeFileSync(thumbPath, b);
          return b;
        }),
  ]);

  console.log(`  uploading ${model.slug}...`);
  const [mediaUrl, thumbnailUrl] = await Promise.all([
    uploadAsset(supabase, userId, glbBytes, ".glb", "model/gltf-binary"),
    uploadAsset(
      supabase,
      userId,
      thumbBytes,
      model.thumbExt,
      model.thumbExt === ".png" ? "image/png" : "image/jpeg",
    ),
  ]);

  const { error } = await supabase.from("artworks").upsert(
    {
      id: model.id,
      creator_id: userId,
      title: model.title,
      description: model.description,
      media_type: "model",
      media_url: mediaUrl,
      thumbnail_url: thumbnailUrl,
      category: "3d",
      tags: model.tags,
      is_public: true,
      view_count: model.viewCount,
    },
    { onConflict: "id" },
  );
  if (error) throw error;

  console.log(`  OK: ${model.title}`);
  return model.id;
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const secret = env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !secret) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", OFFICIAL_ID)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile) {
    console.error(
      "Official showcase profile not found. Run migration 024_gallery_showcase_seed.sql first.",
    );
    process.exit(1);
  }

  console.log(`Seeding 3D models for ${profile.username} (${OFFICIAL_ID})`);

  const cacheDir = join(process.cwd(), ".cache/seed-gallery-3d");
  const ids = [];

  for (const model of MODELS) {
    const id = await seedModel(supabase, OFFICIAL_ID, model, cacheDir);
    ids.push(id);
  }

  const site = env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://eldonia-nex.com";
  console.log("\nDone! 3D test artworks:");
  for (const id of ids) {
    console.log(`  ${site}/gallery/${id}`);
  }
  console.log(`  ${site}/gallery/creator/${profile.username}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
