# X（Twitter）ログイン設定（Eldonia-Nex）

Supabase OAuth 2.0 経由。アプリ側は `signInWithProvider("twitter")` → Supabase provider `x` にマップされます。

## 前提

| 項目 | 値 |
|------|-----|
| Supabase プロジェクト | `sszlycovwefpyxjllbns` |
| X コールバック URI | `https://sszlycovwefpyxjllbns.supabase.co/auth/v1/callback` |
| アプリコールバック | `https://eldonia-nex.com/auth/callback` |

---

## 1. X Developer Portal

1. https://developer.x.com/en/portal/dashboard → プロジェクト / アプリを作成
2. **User authentication settings** → **Set up**
3. **OAuth 2.0** を有効化（OAuth 1.0a は不要）
4. **Type of App**: Web App, Automated App or Bot
5. **App permissions**: Read（メール取得は X 側で提供されないため email スコープなし）
6. **Callback URI / Redirect URL**（1行）:
   ```
   https://sszlycovwefpyxjllbns.supabase.co/auth/v1/callback
   ```
7. **Website URL**: `https://eldonia-nex.com`
8. **Client ID** と **Client Secret** を控える

---

## 2. Supabase Dashboard

https://supabase.com/dashboard/project/sszlycovwefpyxjllbns/auth/providers

| 項目 | 設定 |
|------|------|
| X / Twitter (OAuth 2.0) | **ON** |
| Client ID | X Developer Portal の Client ID |
| Secret | X Developer Portal の Client Secret |

**URL Configuration** に `https://eldonia-nex.com/**` と `http://localhost:3000/**` があること。

---

## 3. 環境変数

### ローカル（`.env.local`）

```env
NEXT_PUBLIC_AUTH_TWITTER_ENABLED=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
X_OAUTH_CLIENT_ID=（X Client ID）
X_OAUTH_CLIENT_SECRET=（X Client Secret）
```

`TWITTER_OAUTH_CLIENT_ID` / `TWITTER_OAUTH_CLIENT_SECRET` でも可（sync スクリプトが読み取ります）。

### 本番反映用（`.env.production.supabase` — gitignore）

上記 Client ID / Secret を記入し:

```bash
npm run supabase:sync-social
```

### Vercel（本番ボタン表示）

```env
NEXT_PUBLIC_AUTH_TWITTER_ENABLED=true
```

Client ID / Secret は Supabase に同期済みのため Vercel には不要です。

---

## 4. 検証

```bash
npm run verify:x-oauth
```

成功時: `signInWithOAuth` で authorize URL が生成され、Supabase 側 `external_x_enabled` が true。

---

## 5. 手動テスト

1. `npm run dev` → http://localhost:3000/auth/login
2. **X** ボタン → X 同意画面 → `/auth/callback` → ホームまたはサインアップ続行
3. 初回ログインでメール未設定の場合、オンボーディングでメール追加を案内

---

## トラブルシュート

| 症状 | 対処 |
|------|------|
| ボタンが出ない | `NEXT_PUBLIC_AUTH_TWITTER_ENABLED=true` と Supabase URL/key を確認 |
| redirect_uri mismatch | X Portal の Callback URI が Supabase callback と完全一致か確認 |
| Provider not enabled | Dashboard または `npm run supabase:sync-social` で X を ON |
| invalid_client | Client Secret を再生成し sync し直す |
