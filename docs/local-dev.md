# ローカル開発

## いちばん簡単な方法（Docker 不要）

**本番と同じ Supabase プロジェクト**（`sszlycovwefpyxjllbns`）を `.env.local` に設定してください。  
投稿した音楽・画像はこちらに保存されています。

```env
NEXT_PUBLIC_SUPABASE_URL=https://sszlycovwefpyxjllbns.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=...  # service_role JWT
```

> 旧プロジェクト `evrklfqdyptuelulgcdy` を向けると、公式シード作品だけ表示され、**自分の投稿は出ません**。

起動:

```bash
npm run dev
```

ブラウザ: **http://localhost:3000**

| ページ | URL |
|--------|-----|
| ギャラリー一覧 | http://localhost:3000/gallery |
| 作品詳細 | http://localhost:3000/gallery/{作品ID} |

---

## ローカル Supabase を使う場合

1. **Docker Desktop** を起動
2. `npm run supabase:start`
3. `.env.local` でローカル URL を有効化（クラウド行はコメントアウト）
4. `npm run dev`

`supabase status` で `http://127.0.0.1:54321` が応答することを確認してください。

---

## よくある症状

| 症状 | 原因 | 対処 |
|------|------|------|
| `fetch failed`（ターミナル） | ローカル Supabase が止まっている | クラウド Supabase に切り替え、または Docker を起動 |
| `npm run dev` がすぐ終了 | `predev` の同期失敗（Windows） | `npm run dev:next` で起動 |
| ギャラリーが空 / ログインできない | `.env.local` がローカル向きのまま | 上記「クラウド Supabase」に切り替え |
| 本番と表示が違う | 未コミット・未デプロイ | `main` に push して CI デプロイを待つ |

---

## Facebook ログイン（ローカル）

1. Supabase Dashboard で Facebook を有効化（`docs/facebook-oauth-setup.md`）
2. `.env.local` に以下を追加:

```env
NEXT_PUBLIC_AUTH_FACEBOOK_ENABLED=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
FACEBOOK_OAUTH_CLIENT_ID=（Meta アプリ ID）
FACEBOOK_OAUTH_CLIENT_SECRET=（Meta アプリシークレット）
```

3. `npm run dev` を再起動
4. 確認: `npm run verify:facebook-oauth`

---

## 本番デプロイ

`main` への push で https://eldonia-nex.com に自動反映されます。  
手順: `docs/vercel-ci-setup.md`
