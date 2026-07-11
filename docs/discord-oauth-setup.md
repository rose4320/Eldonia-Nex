# Discord ログイン設定（Eldonia-Nex）

Supabase OAuth 経由。

## 前提

| 項目 | 値 |
|------|-----|
| Supabase プロジェクト | `sszlycovwefpyxjllbns` |
| Discord リダイレクト | `https://sszlycovwefpyxjllbns.supabase.co/auth/v1/callback` |
| アプリコールバック | `https://eldonia-nex.com/auth/callback` |

---

## 1. Discord Developer Portal

1. https://discord.com/developers/applications → **New Application**
2. **OAuth2** → **Redirects** に追加:
   ```
   https://sszlycovwefpyxjllbns.supabase.co/auth/v1/callback
   ```
3. **Client ID** と **Client Secret**（Reset して最新をコピー）を控える
4. **OAuth2 URL Generator**（参考）: scopes `identify` + `email`（Supabase が要求）

---

## 2. Supabase Dashboard

https://supabase.com/dashboard/project/sszlycovwefpyxjllbns/auth/providers

| 項目 | 設定 |
|------|------|
| Discord | **ON** |
| Client ID | Discord Application の Client ID |
| Secret | Discord Client Secret |

**URL Configuration** に `https://eldonia-nex.com/**` と `http://localhost:3000/**` があること。

---

## 3. 環境変数

### ローカル（`.env.local`）

```env
NEXT_PUBLIC_AUTH_DISCORD_ENABLED=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DISCORD_OAUTH_CLIENT_ID=（Discord Client ID）
DISCORD_OAUTH_CLIENT_SECRET=（Discord Client Secret）
```

### 本番反映用（`.env.production.supabase`）

Client ID / Secret を記入後:

```bash
npm run supabase:sync-social
```

### Vercel（本番ボタン表示）

```env
NEXT_PUBLIC_AUTH_DISCORD_ENABLED=true
```

---

## 4. 検証

```bash
npm run verify:discord-oauth
```

---

## 5. 手動テスト

1. `npm run dev` → http://localhost:3000/auth/login
2. **Discord** ボタン → Discord 同意 → `/auth/callback` → 完了

---

## トラブルシュート

| 症状 | 対処 |
|------|------|
| ボタンが出ない | `NEXT_PUBLIC_AUTH_DISCORD_ENABLED=true` を確認 |
| redirect_uri エラー | Discord OAuth2 Redirects に Supabase callback を追加 |
| invalid_client | Client Secret を Reset し Supabase + `.env.local` を更新して sync |
