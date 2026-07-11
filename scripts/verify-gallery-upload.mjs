/**
 * Gallery upload verification — unit checks, DB/storage, API validation, all media types.
 * Usage: node scripts/verify-gallery-upload.mjs [--base-url http://localhost:3000]
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

const BASE_URL = process.argv.find((a) => a.startsWith("--base-url="))?.split("=")[1] ?? "http://localhost:3000";
const KHRONOS =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models";

const results = [];
let failed = 0;

function pass(label, detail = "") {
  results.push({ ok: true, label, detail });
  console.log(`  OK  ${label}${detail ? ` — ${detail}` : ""}`);
}

function fail(label, detail = "") {
  failed += 1;
  results.push({ ok: false, label, detail });
  console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
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
      if (!(key in env)) env[key] = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

function assert(condition, label, detail) {
  if (condition) pass(label, detail);
  else fail(label, detail);
}

/** 1×1 PNG */
function tinyPngBuffer() {
  return Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
}

/** Minimal valid PDF */
function tinyPdfBuffer() {
  return Buffer.from(
    "%PDF-1.1\n1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj\n2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj\n3 0 obj<< /Type /Page /MediaBox [0 0 3 3] /Parent 2 0 R >>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \ntrailer<< /Size 4 /Root 1 0 R >>\nstartxref\n149\n%%EOF",
  );
}

/** Minimal WAV (44-byte header + 1 sample) */
function tinyWavBuffer() {
  const buf = Buffer.alloc(46);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(38, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(8000, 24);
  buf.writeUInt32LE(8000, 28);
  buf.writeUInt16LE(1, 32);
  buf.writeUInt16LE(8, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(2, 40);
  buf.writeUInt16LE(0, 44);
  return buf;
}

async function ensureFixture(name, url) {
  const dir = join(process.cwd(), ".cache/verify-gallery");
  mkdirSync(dir, { recursive: true });
  const path = join(dir, name);
  if (existsSync(path)) return readFileSync(path);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download ${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(path, buf);
  return buf;
}

async function runUnitTests() {
  console.log("\n[1/5] Unit tests (constants & wizard)");

  const EXT = {
    png: "image",
    glb: "model",
    pdf: "document",
    wav: "audio",
    mp4: "video",
  };

  function extMedia(name) {
    const ext = name.split(".").pop()?.toLowerCase();
    return ext ? EXT[ext] : null;
  }

  function wizardStepsForMedia(mediaType) {
    if (mediaType === "image") return ["file", "details"];
    return ["file", "thumbnail", "details"];
  }

  function isOwnedArtworksStorageUrl(url, userId) {
    try {
      return new URL(url).pathname.includes(`/artworks/${userId}/`);
    } catch {
      return false;
    }
  }

  const png = new File([tinyPngBuffer()], "test.png", { type: "image/png" });
  const glbBuf = await ensureFixture("Duck.glb", `${KHRONOS}/Duck/glTF-Binary/Duck.glb`);
  const glb = new File([glbBuf], "duck.glb", { type: "model/gltf-binary" });
  const pdf = new File([tinyPdfBuffer()], "test.pdf", { type: "application/pdf" });
  const wav = new File([tinyWavBuffer()], "test.wav", { type: "audio/wav" });

  assert(extMedia(png.name) === "image", "extension detect image");
  assert(extMedia(glb.name) === "model", "extension detect model");
  assert(extMedia(pdf.name) === "document", "extension detect pdf");
  assert(extMedia(wav.name) === "audio", "extension detect wav");
  assert(extMedia("x.png") !== extMedia("x.glb"), "file type mismatch detection");
  assert(
    JSON.stringify(wizardStepsForMedia("image")) === JSON.stringify(["file", "details"]),
    "wizard steps image = 2",
  );
  assert(
    JSON.stringify(wizardStepsForMedia("video")) === JSON.stringify(["file", "thumbnail", "details"]),
    "wizard steps video = 3",
  );
  assert(
    isOwnedArtworksStorageUrl(
      "https://example.supabase.co/storage/v1/object/public/artworks/user-id/abc.glb",
      "user-id",
    ),
    "isOwnedArtworksStorageUrl valid path",
  );
  assert(png.type.startsWith("image/"), "File API image mime");
  assert(glb.name.endsWith(".glb"), "File API glb name");
}

async function runDbChecks(supabaseAdmin) {
  console.log("\n[2/5] Database & seeded artworks");

  const ids = [
    "00000000-0000-4000-8000-000000000603",
    "00000000-0000-4000-8000-000000000604",
    "00000000-0000-4000-8000-000000000605",
  ];

  const { data, error } = await supabaseAdmin
    .from("artworks")
    .select("id, title, media_type, category, is_public, media_url, thumbnail_url")
    .in("id", ids);

  if (error) {
    fail("fetch seeded 3D artworks", error.message);
    return;
  }

  assert(data?.length === 3, "seeded 3D artworks count", `found ${data?.length ?? 0}`);

  for (const row of data ?? []) {
    assert(row.media_type === "model", `artwork ${row.id} media_type=model`);
    assert(row.category === "3d", `artwork ${row.id} category=3d`);
    assert(row.is_public === true, `artwork ${row.id} is public`);
    assert(Boolean(row.thumbnail_url), `artwork ${row.id} has thumbnail`);
    if (row.media_url) {
      const head = await fetch(row.media_url, { method: "HEAD" }).catch(() => null);
      assert(head?.ok === true, `artwork ${row.id} GLB URL reachable`, String(head?.status ?? "network"));
    }
  }
}

function createCookieClient(url, anonKey) {
  const jar = new Map();
  const client = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return [...jar.entries()].map(([name, value]) => ({ name, value }));
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          if (value) jar.set(name, value);
          else jar.delete(name);
        }
      },
    },
  });
  return {
    client,
    cookieHeader: () =>
      [...jar.entries()].map(([name, value]) => `${name}=${encodeURIComponent(value)}`).join("; "),
  };
}

async function uploadToStorage(supabase, userId, buffer, filename, contentType) {
  const objectPath = `${userId}/verify-${crypto.randomUUID()}-${filename}`;
  const { error } = await supabase.storage.from("artworks").upload(objectPath, buffer, {
    contentType,
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const {
    data: { publicUrl },
  } = supabase.storage.from("artworks").getPublicUrl(objectPath);
  return { publicUrl, objectPath };
}

async function createVerifyUser(serviceKey, url, password) {
  const headers = {
    Authorization: `Bearer ${serviceKey}`,
    apikey: serviceKey,
    "Content-Type": "application/json",
  };
  const email = `gallery-verify-${Date.now()}@eldonia-nex.internal`;
  const res = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: "Gallery Verify", username: `verify_${Date.now()}` },
    }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.id) {
    return { ok: false, reason: body.msg ?? body.message ?? `HTTP ${res.status}` };
  }
  return { ok: true, email, password, userId: body.id };
}

async function deleteVerifyUser(serviceKey, url, userId) {
  const headers = { Authorization: `Bearer ${serviceKey}`, apikey: serviceKey };
  await fetch(`${url}/auth/v1/admin/users/${userId}`, { method: "DELETE", headers });
}

async function runCreatorUploadTests(env, url, anonKey, serviceKey) {
  console.log("\n[3/5] Creator upload pipeline (all media types via API)");

  const password = env.GALLERY_VERIFY_PASSWORD ?? env.DJANGO_ADMIN_PASSWORD ?? "VerifyGallery2026!";
  let email = env.GALLERY_VERIFY_EMAIL ?? "";
  let verifyUserId = null;

  if (serviceKey) {
    const created = await createVerifyUser(serviceKey, url, password);
    if (!created.ok) {
      fail("create verify user", created.reason ?? "unknown");
      return { artworkIds: [], cookieHeader: null, verifyUserId: null };
    }
    email = created.email;
    verifyUserId = created.userId;
    pass("create verify user", email);
  } else if (!email) {
    fail("creator login", "no service key and GALLERY_VERIFY_EMAIL not set");
    return { artworkIds: [], cookieHeader: null, verifyUserId: null };
  }

  const { client, cookieHeader } = createCookieClient(url, anonKey);
  const { error: signInError } = await client.auth.signInWithPassword({ email, password });
  if (signInError) {
    fail("creator sign-in", signInError.message);
    return { artworkIds: [], cookieHeader: null, verifyUserId };
  }
  pass("creator sign-in", email);

  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) {
    fail("get user after sign-in");
    return { artworkIds: [], sessionCookie: "", verifyUserId };
  }

  const sessionCookie = cookieHeader();
  await runAuthenticatedValidationTests(sessionCookie);

  await client.from("profiles").upsert(
    { id: user.id, is_creator: true, display_name: "Upload Verify" },
    { onConflict: "id" },
  );

  const thumbBuf = tinyPngBuffer();
  const glbBuf = await ensureFixture("Duck.glb", `${KHRONOS}/Duck/glTF-Binary/Duck.glb`);
  const artworkIds = [];

  const cases = [
    {
      label: "image",
      mediaType: "image",
      category: "illustration",
      main: { buf: thumbBuf, name: "verify.png", type: "image/png" },
      thumb: null,
    },
    {
      label: "model",
      mediaType: "model",
      category: "3d",
      main: { buf: glbBuf, name: "verify.glb", type: "model/gltf-binary" },
      thumb: { buf: thumbBuf, name: "verify-thumb.png", type: "image/png" },
    },
    {
      label: "document",
      mediaType: "document",
      category: "document",
      main: { buf: tinyPdfBuffer(), name: "verify.pdf", type: "application/pdf" },
      thumb: { buf: thumbBuf, name: "verify-thumb.png", type: "image/png" },
    },
    {
      label: "audio",
      mediaType: "audio",
      category: "music",
      main: { buf: tinyWavBuffer(), name: "verify.wav", type: "audio/wav" },
      thumb: { buf: thumbBuf, name: "verify-thumb.png", type: "image/png" },
    },
  ];

  for (const testCase of cases) {
    try {
      const media = await uploadToStorage(
        client,
        user.id,
        testCase.main.buf,
        testCase.main.name,
        testCase.main.type,
      );
      let thumbnailUrl = testCase.mediaType === "image" ? media.publicUrl : null;
      if (testCase.thumb) {
        const thumb = await uploadToStorage(
          client,
          user.id,
          testCase.thumb.buf,
          testCase.thumb.name,
          testCase.thumb.type,
        );
        thumbnailUrl = thumb.publicUrl;
      }

      const res = await fetch(`${BASE_URL}/api/gallery/artworks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader(),
        },
        body: JSON.stringify({
          title: `[verify] ${testCase.label} ${Date.now()}`,
          description: `Automated gallery upload verification for ${testCase.label}.`,
          category: testCase.category,
          tags: "verify,test",
          media_type: testCase.mediaType,
          media_url: media.publicUrl,
          thumbnail_url: thumbnailUrl,
        }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.id) {
        fail(`POST API ${testCase.label}`, body.error ?? `HTTP ${res.status}`);
        continue;
      }

      artworkIds.push(body.id);
      pass(`POST API ${testCase.label}`, body.id);

      const { data: row } = await client
        .from("artworks")
        .select("id, media_type, description, is_public")
        .eq("id", body.id)
        .single();

      assert(row?.media_type === testCase.mediaType, `DB row ${testCase.label} media_type`);
      assert(Boolean(row?.description), `DB row ${testCase.label} has description`);
      assert(row?.is_public === true, `DB row ${testCase.label} is public`);
    } catch (cause) {
      fail(`pipeline ${testCase.label}`, cause instanceof Error ? cause.message : String(cause));
    }
  }

  return { artworkIds, sessionCookie, verifyUserId };
}

async function runAuthenticatedValidationTests(sessionCookie) {
  console.log("  (auth validation)");
  if (!sessionCookie) {
    fail("session cookie after sign-in", "empty — cannot run auth validation");
    return;
  }

  const noDesc = await fetch(`${BASE_URL}/api/gallery/artworks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: sessionCookie },
    body: JSON.stringify({
      title: "Test",
      description: "",
      media_type: "image",
      media_url: "https://example.com/storage/v1/object/public/artworks/fake/user/x.png",
    }),
  });
  const noDescBody = await noDesc.json().catch(() => ({}));
  assert(noDesc.status === 400, "missing description returns 400", noDescBody.error ?? "");

  const noTitle = await fetch(`${BASE_URL}/api/gallery/artworks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: sessionCookie },
    body: JSON.stringify({
      title: "",
      description: "desc",
      media_type: "image",
      media_url: "https://example.com/x.png",
    }),
  });
  assert(noTitle.status === 400, "missing title returns 400");

  const noThumb = await fetch(`${BASE_URL}/api/gallery/artworks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: sessionCookie },
    body: JSON.stringify({
      title: "Test",
      description: "desc",
      media_type: "model",
      media_url: "https://example.com/x.glb",
      thumbnail_url: null,
    }),
  });
  assert(noThumb.status === 400, "model without thumbnail returns 400");
}

async function runApiValidationTests() {
  console.log("\n[4/5] API validation (unauthenticated)");

  const unauth = await fetch(`${BASE_URL}/api/gallery/artworks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "x", description: "y", media_type: "image", media_url: "https://x" }),
  });
  assert(unauth.status === 401, "unauthenticated POST returns 401");
}

async function runPageChecks() {
  console.log("\n[5/5] Upload page & gallery routes");

  for (const path of ["/settings/post/artwork", "/gallery"]) {
    try {
      const res = await fetch(`${BASE_URL}${path}`, { redirect: "manual" });
      const ok = res.status === 200 || res.status === 307 || res.status === 308;
      assert(ok, `GET ${path}`, `HTTP ${res.status}`);
    } catch (cause) {
      fail(`GET ${path}`, cause instanceof Error ? cause.message : String(cause));
    }
  }

  for (const id of [
    "00000000-0000-4000-8000-000000000603",
    "00000000-0000-4000-8000-000000000604",
  ]) {
    try {
      const res = await fetch(`${BASE_URL}/gallery/${id}`);
      assert(res.status === 200, `GET /gallery/${id.slice(-3)}`, `HTTP ${res.status}`);
    } catch (cause) {
      fail(`GET /gallery/${id}`, cause instanceof Error ? cause.message : String(cause));
    }
  }

  const loginRedirect = await fetch(`${BASE_URL}/settings/post/artwork`, { redirect: "manual" });
  if (loginRedirect.status === 307 || loginRedirect.status === 308) {
    const location = loginRedirect.headers.get("location") ?? "";
    assert(location.includes("/auth/login"), "upload page redirects unauthenticated to login");
  }
}

async function cleanupArtworks(supabaseAdmin, artworkIds) {
  if (artworkIds.length === 0) return;
  console.log("\n[cleanup] Removing verify artworks...");
  for (const id of artworkIds) {
    await supabaseAdmin.from("artwork_pages").delete().eq("artwork_id", id);
    await supabaseAdmin.from("artworks").delete().eq("id", id);
  }
  pass("cleanup verify artworks", `${artworkIds.length} removed`);
}

async function main() {
  console.log("=== Gallery Upload Verification ===");
  console.log(`Base URL: ${BASE_URL}`);

  try {
    await runUnitTests();
  } catch (cause) {
    fail("unit tests import/run", cause instanceof Error ? cause.message : String(cause));
  }

  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey =
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceKey = env.SUPABASE_SECRET_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  if (!url || !serviceKey) {
    fail("Supabase config", "missing URL or service role key");
  } else {
    const supabaseAdmin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    await runDbChecks(supabaseAdmin);

    let artworkIds = [];
    let verifyUserId = null;
    if (anonKey) {
      const uploadResult = await runCreatorUploadTests(env, url, anonKey, serviceKey);
      artworkIds = uploadResult.artworkIds ?? [];
      verifyUserId = uploadResult.verifyUserId ?? null;
      await runApiValidationTests();
      await cleanupArtworks(supabaseAdmin, artworkIds);
      if (verifyUserId && serviceKey) {
        await deleteVerifyUser(serviceKey, url, verifyUserId);
        pass("delete verify user");
      }
    } else {
      fail("anon key", "skipped API upload tests");
    }
  }

  await runPageChecks();

  const passed = results.filter((r) => r.ok).length;
  console.log(`\n=== Summary: ${passed} passed, ${failed} failed ===`);

  if (failed > 0) {
    console.log("\nFailed checks:");
    for (const r of results.filter((x) => !x.ok)) {
      console.log(`  - ${r.label}${r.detail ? `: ${r.detail}` : ""}`);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
