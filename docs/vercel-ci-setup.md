# Vercel CI — main ブランチ自動本番デプロイ

**本番 URL:** https://eldonia-nex.com  
**Vercel プロジェクト:** `eldonianex-5088s-projects/eldonia-nex`

`main` への push で GitHub Actions が本番へデプロイします。  
ワークフロー: `.github/workflows/frontend-deploy-production.yml`

## 初回セットアップ（1 回だけ）

### 1. Vercel トークンを作成

1. [Vercel Account Tokens](https://vercel.com/account/tokens) を開く
2. **Create** → 名前例: `GitHub Actions CI - eldonia-nex`
3. スコープ: フルアクセス（または `eldonia-nex` プロジェクトへのデプロイ権限）
4. 表示された **classic token** をコピー（再表示不可）

> OAuth で CLI ログインしている場合でも、ここで作る **classic token** を GitHub Secret に登録してください。

### 2. GitHub リポジトリ Secret に登録

[Repository secrets](https://github.com/rose4320/Eldonia-Nex/settings/secrets/actions) で追加:

| Secret 名 | 値 |
|-----------|-----|
| `VERCEL_TOKEN` | 手順 1 でコピーしたトークン |

`VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` はワークフローと `.vercel/project.json` に固定済みです。

### 3. 動作確認

```bash
git push origin main
```

または GitHub → **Actions** → **Frontend: Deploy to Vercel (production)** → **Run workflow**

成功すると https://eldonia-nex.com に反映されます。

デプロイ後、CI は `https://eldonia-nex.com/api/health` でヘルスチェックを実行します。

### ヘルスチェック（手動）

```bash
# ローカル
npm run health:check

# 本番
npm run health:check:prod
# または
curl -s https://eldonia-nex.com/api/health | jq
```

`status`: `healthy`（正常） / `degraded`（Supabase 等の依存先に問題）  
速度監視: Vercel Analytics + Speed Insights（本番のみ、`layout.tsx`）

ビルドは **Vercel 側** で実行されます（環境変数を Edge Middleware まで確実に渡すため）。

## ローカルから手動デプロイ

Secret 未設定時や緊急時:

```bash
npx vercel deploy --prod --yes
```

（要: `vercel login` 済み、`.vercel/project.json` リンク済み）

## トラブルシュート

| 症状 | 対処 |
|------|------|
| `Missing VERCEL_TOKEN` | 上記 Secret を登録 |
| push しても本番が変わらない | Actions の Deploy ジョブが成功しているか確認。失敗時は手動 `vercel deploy --prod` |
| ビルドで Supabase エラー | Vercel ダッシュボードの Production Environment Variables を確認 |
