# Facebook ログイン設定（Eldonia-Nex）

Supabase OAuth 経由。Facebook JavaScript SDK は **不要** です。

## 前提

| 項目 | 値 |
|------|-----|
| Supabase プロジェクト | `sszlycovwefpyxjllbns` |
| Meta コールバック URI | `https://sszlycovwefpyxjllbns.supabase.co/auth/v1/callback` |
| アプリコールバック | `https://eldonia-nex.com/auth/callback` |

---

## 1. Meta for Developers

1. https://developers.facebook.com/apps/ → アプリ作成
2. ユースケース: **Facebookログインでの認証およびユーザーデータのリクエスト**
3. **設定 → ベーシック**
   - アプリドメイン（1行1つ）:
     ```
     eldonia-nex.com
     sszlycovwefpyxjllbns.supabase.co
     ```
   - プライバシーポリシー: `https://eldonia-nex.com/privacy`
   - 利用規約: `https://eldonia-nex.com/terms`
   - データ削除: `https://eldonia-nex.com/privacy`
4. **Facebookログイン → 設定**
   - 有効な OAuth リダイレクト URI:
     ```
     https://sszlycovwefpyxjllbns.supabase.co/auth/v1/callback
     ```
5. **ユースケース → 認証とアカウント作成**: `public_profile` と `email` を有効化
6. **アプリの役割**: 開発モード中は自分を **テスター** に追加

クイックスタート（SDK 埋め込み）は **スキップ** で OK。

---

## 2. Supabase Dashboard

https://supabase.com/dashboard/project/sszlycovwefpyxjllbns/auth/providers

| 項目 | 設定 |
|------|------|
| Facebook | **ON** |
| Client ID | Meta のアプリ ID（数字） |
| Secret | Meta のアプリシークレット（最新をコピー） |

**URL Configuration** に `https://eldonia-nex.com/**` と `http://localhost:3000/**` があること。

---

## 3. 環境変数

### ローカル（`.env.local`）

```env
NEXT_PUBLIC_AUTH_FACEBOOK_ENABLED=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
FACEBOOK_OAUTH_CLIENT_ID=（Meta アプリ ID）
FACEBOOK_OAUTH_CLIENT_SECRET=（Meta アプリシークレット）
```

### Vercel（本番ボタン表示）

```env
NEXT_PUBLIC_AUTH_FACEBOOK_ENABLED=true
```

---

## 4. CLI で反映（任意）

```bash
npm run supabase:sync-social
```

`.env.local` の `NEXT_PUBLIC_SUPABASE_URL` が `sszlycovwefpyxjllbns` を指していること。  
`SUPABASE_ACCESS_TOKEN` にプロジェクト権限が必要です。

---

## 5. 動作確認

```bash
npm run verify:facebook-oauth
```

ブラウザ: `/auth/login` → **Facebook**

---

## よくあるエラー

| 症状 | 対処 |
|------|------|
| `provider is not enabled` | Supabase → Facebook を ON + Secret 保存 |
| URLを読み込めません（ドメイン） | Meta → アプリドメインに `sszlycovwefpyxjllbns.supabase.co` を追加 |
| App not setup | Meta → テスターに自分を追加 |
| ログイン後に失敗 | Meta の Secret と Supabase の Secret が一致しているか確認 |
| ボタンが出ない | `NEXT_PUBLIC_AUTH_FACEBOOK_ENABLED=true` + dev 再起動 |

---

## 本番公開時

- Meta **アプリレビュー** + **ビジネス認証**
- アプリを **ライブ** に切替

詳細: `docs/12_メール・Supabase Auth運用設定書.md` §2.6
