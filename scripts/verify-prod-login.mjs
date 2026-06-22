const url = "https://eldonia-nex.com";

const login = await fetch(`${url}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "create@eldonia-nex.com",
    password: process.env.PROD_USER_PASSWORD ?? "Ghq007ddkr",
  }),
});

console.log("login status", login.status);
const body = await login.json();
console.log("login body", body.error ? { error: body.error } : { ok: body.ok });
console.log("set-cookie", login.headers.get("set-cookie")?.slice(0, 80) ?? "none");
