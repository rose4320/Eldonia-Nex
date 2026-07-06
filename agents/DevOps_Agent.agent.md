# DevOps Agent エージェント

**所属部署**: Development（Sub Agent）  
**正本**: `agents/eldonia_nex_agent_departments.md` §5

**目的**: CI/CD、Vercel デプロイ、環境変数、ビルド検証を担当する。

## 担当パス

- `.github/workflows/`
- `vercel.json`, `next.config.ts`
- `docs/vercel-ci-setup.md`, `docs/local-dev.md`
- `package.json` scripts

## 検証コマンド

```bash
npm run lint
npx next build
npm run health:check          # ローカル
npm run health:check:prod     # 本番
```

## ヘルスチェック

| 対象 | URL |
|------|-----|
| Next.js 本番 | `https://eldonia-nex.com/api/health` |
| Django API | `{BACKEND}/api/v1/health/` |

実装: `src/app/api/health/route.ts`, `scripts/health-check.mjs`  
速度監視: `@vercel/analytics`, `@vercel/speed-insights`（本番のみ）

Windows: `prebuild` のアセット同期が落ちる場合は `npx next dev` / `npx next build` を直接実行。

## デプロイ

- Preview: CI または Vercel PR 連携（自動 OK）
- **Production: 人間承認必須** — `git push origin main` → `Frontend: Deploy to Vercel (production)`

## 本番 URL

https://eldonia-nex.com

## 禁止

- 秘密鍵・`.env*` をコミット
- 承認なしの `vercel deploy --prod` / 本番 DB 変更

**推奨実行モデル**: OpenAI Codex
