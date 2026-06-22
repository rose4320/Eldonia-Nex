/**
 * 本番: ログイン → プラン変更 API → セッション維持を検証
 */
const url = process.env.PROD_URL ?? "https://eldonia-nex.com";
const email = process.env.PROD_USER_EMAIL ?? "create@eldonia-nex.com";
const password = process.env.PROD_USER_PASSWORD ?? "Ghq007ddkr";

function parseSetCookie(header) {
  if (!header) return [];
  return header.split(/,(?=\s*sb-)/).map((c) => c.trim());
}

async function main() {
  console.log("=== Plan change session verify ===");
  console.log("target:", url);

  const login = await fetch(`${url}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  console.log("login status:", login.status);
  const loginBody = await login.json();
  if (!login.ok) {
    console.error("login failed:", loginBody);
    process.exit(1);
  }

  const rawSetCookie = login.headers.getSetCookie?.() ?? [];
  const cookieHeader = rawSetCookie.map((c) => c.split(";")[0]).join("; ");
  console.log("cookies after login:", rawSetCookie.length, "items");

  const planGet = await fetch(`${url}/api/settings/plan`, {
    headers: { Cookie: cookieHeader },
  });
  console.log("plan GET status:", planGet.status);
  const currentPlan = await planGet.json();
  console.log("current plan:", currentPlan);

  const nextPlan = currentPlan.plan === "free" ? "standard" : "free";
  const planPost = await fetch(`${url}/api/settings/plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookieHeader },
    body: JSON.stringify({ planId: nextPlan }),
  });
  console.log("plan POST status:", planPost.status);
  const planResult = await planPost.json();
  console.log("plan POST body:", planResult);

  const postSetCookie = planPost.headers.getSetCookie?.() ?? [];
  const mergedCookies = postSetCookie.length
    ? postSetCookie.map((c) => c.split(";")[0]).join("; ")
    : cookieHeader;
  if (postSetCookie.length) {
    console.log("plan POST set-cookie:", postSetCookie.length, "items");
    postSetCookie.forEach((c) => console.log(" ", c.slice(0, 120)));
  }

  const home = await fetch(`${url}/`, {
    headers: { Cookie: mergedCookies },
    redirect: "manual",
  });
  console.log("home status:", home.status);

  const planGetAfter = await fetch(`${url}/api/settings/plan`, {
    headers: { Cookie: mergedCookies },
  });
  console.log("plan GET after change:", planGetAfter.status);
  const afterPlan = await planGetAfter.json();
  console.log("plan after:", afterPlan);

  if (planGetAfter.status === 401) {
    console.error("FAIL: session lost after plan change");
    process.exit(1);
  }
  console.log("OK: session preserved after plan change");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
