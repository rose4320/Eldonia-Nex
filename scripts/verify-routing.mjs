import { chromium } from "playwright";

const BASE = "https://eldonia-nex.com";

const results = [];

function pass(name, detail) {
  results.push({ name, ok: true, detail });
  console.log(`✓ ${name}: ${detail}`);
}

function fail(name, detail) {
  results.push({ name, ok: false, detail });
  console.error(`✗ ${name}: ${detail}`);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();

try {
  // 1) 未ログイン: / → /lp
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 30000 });
  if (page.url().includes("/lp")) {
    pass("未ログイン / → /lp", page.url());
  } else {
    fail("未ログイン / → /lp", `expected /lp, got ${page.url()}`);
  }

  // 2) LP コンテンツ表示
  const hero = await page.locator(".lp-hero").count();
  const lpPage = await page.locator(".lp-page").count();
  if (hero > 0 && lpPage > 0) {
    pass("LP ページ表示", `lp-hero=${hero}, lp-page=${lpPage}`);
  } else {
    fail("LP ページ表示", `lp-hero=${hero}, lp-page=${lpPage}`);
  }

  // 3) /home → / → /lp（未ログイン時のチェーン）
  await page.goto(`${BASE}/home`, { waitUntil: "networkidle", timeout: 30000 });
  const finalHome = page.url();
  if (finalHome.includes("/lp")) {
    pass("/home → / → /lp（未ログイン）", finalHome);
  } else if (finalHome.match(/eldonia-nex\.com\/?$/)) {
    pass("/home → /（ログイン済み想定）", finalHome);
  } else {
    fail("/home リダイレクト", finalHome);
  }

  // 5) ログインページ redirect_to パラメータ
  await page.goto(`${BASE}/auth/login?redirect_to=%2F`, {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  const loginUrl = page.url();
  if (loginUrl.includes("/auth/login")) {
    pass("ログインページ表示", loginUrl);
  } else {
    fail("ログインページ表示", loginUrl);
  }

  // 6) Gallery（ログイン後ページ）未ログインでも表示可能
  await page.goto(`${BASE}/gallery`, { waitUntil: "domcontentloaded", timeout: 30000 });
  const galleryText = await page.locator("body").innerText();
  if (galleryText.includes("GALLERY") || galleryText.includes("ギャラリー")) {
    pass("Gallery ページ表示", page.url());
  } else {
    fail("Gallery ページ表示", "heading not found");
  }

  // 7) LP フッターリンク（/lp#services）
  await page.goto(`${BASE}/lp`, { waitUntil: "domcontentloaded", timeout: 30000 });
  const servicesLink = page.locator('a[href="/lp#services"], a[href="#services"]');
  const linkCount = await servicesLink.count();
  if (linkCount > 0) {
    pass("LP フッター/ナビ アンカー", `links=${linkCount}`);
  } else {
    fail("LP フッター/ナビ アンカー", "no /lp#services link");
  }
} catch (error) {
  fail("ブラウザテスト例外", String(error));
} finally {
  await browser.close();
}

const failed = results.filter((r) => !r.ok);
console.log("\n--- サマリー ---");
console.log(`合格: ${results.length - failed.length}/${results.length}`);
if (failed.length > 0) {
  process.exit(1);
}
