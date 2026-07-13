/**
 * Verify a single gallery artwork detail page (DB + HTTP).
 * Usage: node scripts/verify-gallery-artwork-page.mjs <artwork-id> [--base-url=http://localhost:3000]
 */
import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const args = process.argv.slice(2);
const ID = args.find((a) => !a.startsWith("--")) ?? "";
const BASE_URL =
  args.find((a) => a.startsWith("--base-url="))?.split("=")[1] ??
  "http://localhost:3000";

if (!ID) {
  console.error("Usage: node scripts/verify-gallery-artwork-page.mjs <artwork-id>");
  process.exit(1);
}

let failed = 0;

function pass(label, detail = "") {
  console.log(`  OK  ${label}${detail ? ` — ${detail}` : ""}`);
}

function fail(label, detail = "") {
  failed += 1;
  console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
}

function assert(ok, label, detail = "") {
  if (ok) pass(label, detail);
  else fail(label, detail);
}

function loadEnv() {
  const env = {};
  for (const file of [".env.local", ".env"]) {
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

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log(`\nGallery artwork verify: ${ID}`);
console.log(`Base URL: ${BASE_URL}\n`);

assert(!!supabaseUrl && !!supabaseKey, "Supabase env configured");

const sb = createClient(supabaseUrl, supabaseKey);
const { data: art, error } = await sb
  .from("artworks")
  .select(
    "id,title,media_type,media_url,is_public,creator_id,description,category,format,page_count,tags,created_at",
  )
  .eq("id", ID)
  .maybeSingle();

const { data: pages } = art
  ? await sb
      .from("artwork_pages")
      .select("id,page_number,media_url")
      .eq("artwork_id", ID)
      .order("page_number")
  : { data: null };

if (error) {
  fail("DB query", error.message);
} else if (!art) {
  fail("Artwork exists in DB");
} else {
  pass("Artwork in DB", art.title);
  assert(art.is_public === true, "is_public", String(art.is_public));
  assert(Boolean(art.media_url), "media_url set", art.media_type ?? "unknown");
  console.log(
    `  INFO category=${art.category} format=${art.format ?? "single"} media_type=${art.media_type} pages=${pages?.length ?? 0}`,
  );
  if ((art.format === "multi_page" || (art.page_count ?? 0) > 1) && pages) {
    assert(pages.length > 0, "artwork_pages rows for multi_page", String(pages.length));
  }
}

let html = "";
try {
  const res = await fetch(`${BASE_URL}/gallery/${ID}`, {
    redirect: "follow",
  });
  assert(res.ok, "HTTP GET /gallery/[id]", String(res.status));
  html = await res.text();
} catch (e) {
  fail("HTTP fetch", e instanceof Error ? e.message : String(e));
}

if (html) {
  assert(!html.includes("This page could not be found"), "Not Next.js 404");
  assert(html.includes("eldonia-page"), "Eldonia page shell");

  if (art?.title) {
    const snippet = art.title.slice(0, 30);
    assert(
      html.includes(snippet) || html.includes(encodeURIComponent(snippet)),
      "Title visible in HTML",
      snippet,
    );
  }

  switch (art?.media_type) {
    case "model":
      assert(
        html.includes("model-viewer") ||
          html.includes("ArtworkModelViewer") ||
          html.includes("Loading 3D model") ||
          html.includes("eldonia-model-viewer"),
        "3D viewer shell in page",
      );
      if (art.media_url) {
        const file = art.media_url.split("/").pop()?.split("?")[0] ?? "";
        assert(
          !file || html.includes(file) || html.includes(encodeURIComponent(file)),
          "Model asset referenced",
          file,
        );
      }
      break;
    case "image":
      assert(html.includes("<img") || html.includes("_next/image"), "Image media");
      break;
    case "video":
      assert(html.includes("<video"), "Video element");
      break;
    case "audio":
      assert(
        html.includes("<audio") || html.includes("eldonia-audio-hero"),
        "Audio player",
      );
      break;
    case "document":
      assert(
        html.includes("<iframe") || html.includes("StoryNarrative") || html.includes("pdf"),
        "Document/PDF viewer",
      );
      break;
    default:
      if (art) pass("Media type check skipped", art.media_type ?? "null");
  }

  if (art?.format === "multi_page" || (pages?.length ?? 0) > 0) {
    assert(
      html.includes("ArtworkPageViewer") ||
        html.includes("eldonia-page-viewer") ||
        html.includes("page-viewer"),
      "Multi-page viewer present",
    );
  }

  // Shop → Gallery (§3.11) — not implemented yet; informational only
  const hasShopSell =
    html.includes("/shop/sell") || html.includes("from_artwork=");
  if (hasShopSell) {
    pass("Shop sell CTA link (§3.11)");
  } else {
    pass("Shop sell CTA absent (§3.11 pending — expected)");
  }

  if (art?.format === "multi_page" && (pages?.length ?? 0) === 0) {
    pass("Note: multi_page with 0 artwork_pages (viewer falls back to cover)", "");
  }

  assert(
    html.toLowerCase().includes("gallery") || html.includes("GALLERY"),
    "Gallery chrome",
  );
}

console.log(`\n--- ${failed === 0 ? "PASS" : `${failed} FAILED`} ---\n`);
process.exit(failed > 0 ? 1 : 0);
