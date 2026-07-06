# ローカル開発

## いちばん簡単な方法（Docker 不要）

本番と同じデータで UI を確認する場合、`.env.local` で **クラウド Supabase** を有効にします。

```env
# クラウド Supabase（推奨: Docker なしで動く）
NEXT_PUBLIC_SUPABASE_URL=https://evrklfqdyptuelulgcdy.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...

# ローカル Supabase（Docker + supabase start が必要なときだけ有効化）
# NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
# ...
```

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

## 本番デプロイ

`main` への push で https://eldonia-nex.com に自動反映されます。  
手順: `docs/vercel-ci-setup.md`
