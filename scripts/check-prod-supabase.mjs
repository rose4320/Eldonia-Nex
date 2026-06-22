const html = await fetch("https://eldonia-nex.com/auth/login").then((r) => r.text());
const chunks = [
  ...html.matchAll(/\/_next\/static\/chunks\/[^"']+\.js/g),
].map((m) => m[0]);

const urls = new Set();
for (const chunk of chunks) {
  const js = await fetch(`https://eldonia-nex.com${chunk}`)
    .then((r) => r.text())
    .catch(() => "");
  for (const hit of js.match(/https:\/\/[a-z0-9-]+\.supabase\.co/g) ?? []) {
    urls.add(hit);
  }
  for (const hit of js.match(/http:\/\/127\.0\.0\.1:54321/g) ?? []) {
    urls.add(hit);
  }
  for (const hit of js.match(/sb_publishable_[A-Za-z0-9_-]+/g) ?? []) {
    urls.add(`publishable:${hit.slice(0, 32)}...`);
  }
}

console.log("login page", (await fetch("https://eldonia-nex.com/auth/login")).status);
console.log("supabase refs", [...urls].join(", ") || "none found");
