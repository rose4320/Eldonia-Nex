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

### 1.2.1 さくら SMTP（送信）— 確定値

| 項目 | 値 |
|------|-----|
| SMTP ホスト | `elbonianex.sakura.ne.jp` |
| ポート | **587**（STARTTLS・推奨）または 465（SMTPS） |
| SMTP 認証ユーザー | `support@elbonianex.sakura.ne.jp` |
| パスワード | メール作成時に設定したメールパスワード |
| 表示用 From（推奨） | `support@eldonia-nex.com` |
| 送信者名 | `Eldonia Nex` |

**注意:** 独自ドメイン `eldonia-nex.com` で受信していても、**SMTP サーバーは初期ドメイン `elbonianex.sakura.ne.jp`** を使います。SMTP 認証は必須です。

From アドレス `support@eldonia-nex.com` で届かない場合は、Supabase の `smtp_admin_email` を `support@elbonianex.sakura.ne.jp` に変更して再試行してください。

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
SMTP_HOST=elbonianex.sakura.ne.jp
SMTP_PORT=587
SMTP_USER=support@elbonianex.sakura.ne.jp
SMTP_PASS=<メールボックスのパスワード>
SMTP_FROM=support@eldonia-nex.com
SMTP_FROM_NAME=Eldonia Nex Support
```

---

## 1.6 Supabase Auth 用 SMTP（確認メール・パスワードリセット）

**用途:** 新規登録の確認メール、パスワードリセット等（Supabase Auth が送信）

**Dashboard:** https://supabase.com/dashboard/project/evrklfqdyptuelulgcdy/auth/smtp

| 項目 | 値 |
|------|-----|
| Enable custom SMTP | ON |
| Host | `elbonianex.sakura.ne.jp` |
| Port | `587` |
| Username | `noreply@elbonianex.sakura.ne.jp` |
| Password | （noreply メールボックスのパスワード） |
| Sender email | `noreply@eldonia-nex.com` |
| Sender name | `Eldonia Nex` |

問い合わせ先はメール本文の `support@eldonia-nex.com`（人間対応用）。

### CLI で一括反映（推奨）

1. `.env.production.supabase.example` をコピー → `.env.production.supabase`
2. `SUPABASE_ACCESS_TOKEN` と `SUPABASE_SMTP_PASS` を記入
3. 実行:

```bash
npm run supabase:sync-smtp
```

または URL・テンプレート・SMTP をまとめて:

```bash
npm run supabase:sync-auth
```

**確認:** 本番 https://eldonia-nex.com/auth/signup でテスト登録 → 受信トレイ（迷惑メール含む）を確認。

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

### 2.5 Google OAuth（本番で「Google で続行」を使う）

**現状:** Supabase 側は `external_google_enabled: false`（未設定）。  
**必要:** Google Cloud で OAuth アプリを **公開** し、Client ID / Secret を Supabase に登録。

#### A. Google Cloud Console（あなたが行う作業）

1. [Google Cloud Console](https://console.cloud.google.com/) → プロジェクト選択（または新規作成）
2. **API とサービス → OAuth 同意画面**
   - User Type: **外部**
   - アプリ名: `Eldonia Nex`
   - ユーザーサポートメール: `support@eldonia-nex.com`
   - 承認済みドメイン: `eldonia-nex.com`
   - スコープ: `email`, `profile`, `openid`（デフォルトで可）
   - **公開ステータス → 「アプリを公開」**（Testing のままだとテストユーザー以外ログイン不可）
3. **API とサービス → 認証情報 → 認証情報を作成 → OAuth クライアント ID**
   - アプリケーションの種類: **ウェブアプリケーション**
   - 名前: `Eldonia Nex (Supabase Auth)`
   - **承認済み JavaScript 生成元**（任意）:
     ```
     https://eldonia-nex.com
     ```
   - **承認済みリダイレクト URI**（必須）:
     ```
     https://evrklfqdyptuelulgcdy.supabase.co/auth/v1/callback
     ```
4. 表示された **クライアント ID** と **クライアント シークレット** を控える

#### B. Supabase に反映（CLI）

`.env.production.supabase` に追加:

```env
GOOGLE_OAUTH2_CLIENT_ID=....apps.googleusercontent.com
GOOGLE_OAUTH2_CLIENT_SECRET=....
```

実行:

```bash
npm run supabase:sync-google
```

または Dashboard: [Providers → Google](https://supabase.com/dashboard/project/evrklfqdyptuelulgcdy/auth/providers)

#### C. Vercel（ボタン表示）

```env
NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true
```

（未設定でも Supabase 設定があればボタンは表示されます。明示的に `false` にしていない限り ON）

#### D. 動作確認

1. https://eldonia-nex.com/auth/login → **Google で続行**
2. 初回 Google ログイン → `/auth/signup?resume=1` 経由で **プラン・規約** まで進む（メール確認は不要）
3. 以降は通常ログイン

#### リダイレクト URI 一覧（再掲）

| 用途 | URL |
|------|-----|
| Supabase（Google 必須） | `https://<project-ref>.supabase.co/auth/v1/callback` |
| アプリ（Supabase 設定済み） | `https://eldonia-nex.com/**` |

コールバック処理: `src/app/auth/callback/route.ts`

### 2.6 Facebook / X / Discord OAuth

| プロバイダ | 手順書 | 検証 | Vercel フラグ |
|-----------|--------|------|---------------|
| Facebook | `docs/facebook-oauth-setup.md` | `npm run verify:facebook-oauth` | `NEXT_PUBLIC_AUTH_FACEBOOK_ENABLED=true` |
| X (Twitter) | `docs/x-oauth-setup.md` | `npm run verify:x-oauth` | `NEXT_PUBLIC_AUTH_TWITTER_ENABLED=true` |
| Discord | `docs/discord-oauth-setup.md` | `npm run verify:discord-oauth` | `NEXT_PUBLIC_AUTH_DISCORD_ENABLED=true` |

**共通:** リダイレクト URI は `https://sszlycovwefpyxjllbns.supabase.co/auth/v1/callback`。  
アプリ側は `src/lib/auth/oauth.ts`（X は Supabase provider `x` にマップ）。

**デフォルト:** Google のみボタン表示。各 `NEXT_PUBLIC_AUTH_*_ENABLED=true` で UI に出る。

有効化手順（共通）:

1. 各 Developer Console で OAuth アプリ作成（上記手順書）
2. `.env.production.supabase` または `.env.local` に Client ID / Secret を記入
3. `npm run supabase:sync-social`（または Supabase Dashboard 手動）
4. 対応する `npm run verify:*-oauth`
5. Vercel に `NEXT_PUBLIC_AUTH_*_ENABLED=true`（本番ボタン表示）

Facebook 例:

```env
FACEBOOK_OAUTH_CLIENT_ID=...
FACEBOOK_OAUTH_CLIENT_SECRET=...
NEXT_PUBLIC_AUTH_FACEBOOK_ENABLED=true
```

X 例:

```env
X_OAUTH_CLIENT_ID=...
X_OAUTH_CLIENT_SECRET=...
NEXT_PUBLIC_AUTH_TWITTER_ENABLED=true
```

Discord 例:

```env
DISCORD_OAUTH_CLIENT_ID=...
DISCORD_OAUTH_CLIENT_SECRET=...
NEXT_PUBLIC_AUTH_DISCORD_ENABLED=true
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
| `scripts/sync-supabase-auth-smtp.mjs` | さくら SMTP（確認メール送信） |

---

## 6. 設定チェックリスト

- [ ] Supabase **カスタム SMTP**（さくら `elbonianex.sakura.ne.jp:587`）を設定
- [ ] `npm run supabase:sync-smtp` 実行後、本番 signup で確認メール受信テスト
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
