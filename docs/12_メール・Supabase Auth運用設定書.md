# メール・Supabase Auth 運用設定書

**ドメイン**: `eldonia-nex.com`  
**本番サイト**: https://eldonia-nex.com  
**Supabase プロジェクト**: `evrklfqdyptuelulgcdy`  
**最終更新**: 2026-06-23

---

## 1. さくらインターネット メール（eldonia-nex.com）

### 1.1 作成済みアドレス

| アドレス | 役割 | 備考 |
|----------|------|------|
| `support@eldonia-nex.com` | サポート窓口（メイン） | サイト表示・チケット自動返信の From |
| `help@eldonia-nex.com` | 利用者向け別名 | **support へ転送** 推奨 |
| `billing@eldonia-nex.com` | 請求・支払い | チケット category: `billing` |
| `info@eldonia-nex.com` | 一般・広報 | FAQ 誘導・低優先 |

### 1.2 さくら側の推奨設定

1. **help@ → support@** にメール転送（受信を 1 本化）
2. **SMTP / IMAP** を有効化し、接続情報を控える（後述の Vercel 環境変数用）
3. **SPF** を `eldonia-nex.com` の DNS（TXT）に設定
4. （任意）billing@ / info@ も support@ に転送するか、IMAP で個別監視

### 1.3 アプリとの対応（コード）

| 項目 | 現状 |
|------|------|
| ヘルプページ表示 | `src/lib/support/constants.ts` → `support@eldonia-nex.com` |
| フォーム送信 | `/help/contact` → Supabase `support_tickets`（メール送信は未実装） |
| 半自動化（予定） | さくら SMTP 送信 + IMAP 受信 → チケット化 → `/admin/support` |

### 1.4 予算ゼロ構成（追加 SaaS なし）

```
[ユーザー] → support@ / billing@ / info@（さくら）
                ↓ IMAP ポーリング（Vercel Cron・予定）
[Next.js] → さくら SMTP で返信
                ↓
[Supabase] support_tickets
```

| 機能 | 方式 | 追加コスト |
|------|------|------------|
| 送信 | さくら SMTP | $0（契約内） |
| 受信 | さくら IMAP + Cron | $0 |
| 保管 | Supabase 既存テーブル | $0 |

### 1.5 Vercel 環境変数（メール実装時）

```env
SMTP_HOST=<さくら SMTP ホスト>
SMTP_PORT=587
SMTP_USER=support@eldonia-nex.com
SMTP_PASS=<メールボックスのパスワード>
SMTP_FROM=support@eldonia-nex.com
SMTP_FROM_NAME=Eldonia Nex Support

# IMAP 受信（予定）
IMAP_HOST=<さくら IMAP ホスト>
IMAP_PORT=993
IMAP_USER=support@eldonia-nex.com
IMAP_PASS=<同上>
INBOUND_EMAIL_SECRET=<Webhook / Cron 用ランダム文字列>
```

---

## 2. Supabase 管理画面 — Auth URL 設定

### 2.1 ダッシュボードへの直接リンク

| 設定項目 | URL |
|----------|-----|
| **URL Configuration** | https://supabase.com/dashboard/project/evrklfqdyptuelulgcdy/auth/url-configuration |
| Email Templates | https://supabase.com/dashboard/project/evrklfqdyptuelulgcdy/auth/templates |
| Providers（Google 等） | https://supabase.com/dashboard/project/evrklfqdyptuelulgcdy/auth/providers |
| General（Site URL 含む） | https://supabase.com/dashboard/project/evrklfqdyptuelulgcdy/settings/general |

### 2.2 Site URL（必須）

**Authentication → URL Configuration → Site URL** に以下を設定:

```
https://eldonia-nex.com
```

メール内リンク（確認・パスワードリセット等）のベース URL になります。

### 2.3 Redirect URLs（必須）

**Authentication → URL Configuration → Redirect URLs**

#### 本番（必須）

```
https://eldonia-nex.com/**
```

`/auth/callback` やクエリ付き URL（`?redirect_to=/auth/signup?resume=1` 等）をすべてこの 1 行で許可します。

#### ローカル開発（任意）

```
http://localhost:3000
http://localhost:3000/auth/callback
http://127.0.0.1:3000
http://127.0.0.1:3000/auth/callback
```

### 2.4 各 Auth フローと URL の対応

| フロー | アプリ側エンドポイント | メール / OAuth 後のリダイレクト先 |
|--------|------------------------|-----------------------------------|
| 新規登録（メール確認） | `/auth/signup` | `https://eldonia-nex.com/auth/callback?redirect_to=/auth/signup%3Fresume%3D1&locale=...` |
| ログイン | `/auth/login` | `https://eldonia-nex.com/auth/callback?redirect_to=/` |
| パスワードリセット | `/auth/forgot-password` → `/auth/reset-password` | `https://eldonia-nex.com/auth/callback?redirect_to=/auth/reset-password&locale=...` |
| Google OAuth | `/auth/login`, `/auth/signup` | Supabase 経由 → 上記 `/auth/callback` |

コールバック処理: `src/app/auth/callback/route.ts`

### 2.5 Google OAuth（有効化する場合）

#### Supabase Dashboard

**Authentication → Providers → Google** を有効化し、Google Cloud の Client ID / Secret を入力。

#### Google Cloud Console

**Authorized redirect URIs** に以下を追加:

```
https://evrklfqdyptuelulgcdy.supabase.co/auth/v1/callback
```

ローカル Supabase CLI 利用時のみ追加:

```
http://127.0.0.1:54321/auth/v1/callback
```

#### Vercel 環境変数

```env
GOOGLE_OAUTH2_CLIENT_ID=<Google Client ID>
GOOGLE_OAUTH2_CLIENT_SECRET=<Google Client Secret>
NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true
```

---

## 3. Supabase 管理画面 — メールテンプレート

リポジトリ内テンプレートを Dashboard に反映する。

| 種類 | 件名ファイル | 本文ファイル |
|------|--------------|--------------|
| Confirm signup | `supabase/templates/auth-confirmation-subject.txt` | `supabase/templates/auth-confirmation.html` |
| Reset password | `supabase/templates/auth-recovery-subject.txt` | `supabase/templates/auth-recovery.html` |

**Authentication → Email Templates** で各テンプレートを開き、上記ファイルの内容をコピー＆ペースト。

---

## 4. Vercel 環境変数（Auth 関連）

本番（Vercel プロジェクト `eldonia-nex`）:

```env
NEXT_PUBLIC_SITE_URL=https://eldonia-nex.com
NEXT_PUBLIC_SUPABASE_URL=https://evrklfqdyptuelulgcdy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase anon key>
```

---

## 5. CLI による一括同期（推奨）

Dashboard を手動で触る代わりに、Management API で Site URL・Redirect URLs・メールテンプレートを同期できる。

### 5.1 事前準備

1. https://supabase.com/dashboard/account/tokens で **Access Token** を発行
2. ルートに `.env.production.supabase` を作成（git 管理外）:

```env
SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxx
SUPABASE_PROJECT_REF=evrklfqdyptuelulgcdy
```

### 5.2 実行

```bash
npm run supabase:sync-auth
```

| スクリプト | 内容 |
|------------|------|
| `scripts/sync-supabase-auth-urls.mjs` | Site URL + Redirect URLs |
| `scripts/sync-supabase-auth-email-templates.mjs` | 確認・リセットメールテンプレート |

---

## 6. 設定チェックリスト

- [ ] Supabase **Site URL** = `https://eldonia-nex.com`
- [ ] Supabase **Redirect URLs** に `https://eldonia-nex.com/**` を登録
- [ ] Vercel **NEXT_PUBLIC_SITE_URL** = `https://eldonia-nex.com`
- [ ] メールテンプレート（確認・リセット）を Dashboard に反映
- [ ] （任意）Google OAuth Provider 有効 + Google Cloud redirect URI 登録
- [ ] さくら **help@ → support@** 転送
- [ ] さくら SMTP/IMAP 接続情報を控えた（メール送信実装時）

---

## 7. 関連ファイル

| パス | 説明 |
|------|------|
| `src/lib/support/constants.ts` | サポート SLA・表示メール |
| `src/lib/auth/site-url.ts` | Site URL / コールバック URL 生成 |
| `scripts/sync-supabase-auth-urls.mjs` | Auth URL 同期 |
| `scripts/sync-supabase-auth-email-templates.mjs` | メールテンプレート同期 |
| `supabase/config.toml` | ローカル Supabase Auth 設定 |
