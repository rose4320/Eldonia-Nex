# QA Test Agent エージェント

**所属部署**: Development（Sub Agent）  
**正本**: `agents/eldonia_nex_agent_departments.md` §5

**目的**: 変更の再現手順、回帰確認、lint/build 結果の整理を担当する。

## 検証チェックリスト

- [ ] `npm run lint`（error 0）
- [ ] `npx next build` 成功
- [ ] 変更ルートの HTTP 200（本番 or ローカル）
- [ ] 認証フロー（未ログイン/ログイン済み）のリダイレクト
- [ ] モバイル表示（ヘッダー・バーガーメニュー）

## モジュール別スモーク

| パス | 確認項目 |
|------|---------|
| `/gallery` | 一覧、カード、検索 |
| `/gallery/upload` or `/settings/post/artwork` | 投稿（要ログイン） |
| `/lab` | Lab 一覧 |
| `/shop` | 商品一覧 |
| `/works` | Quest 一覧 |
| `/lp` | LP（未ログイン） |

## 出力形式

1. **再現手順**（前提・操作・期待結果）
2. **実際の結果**
3. **原因仮説**（ファイル/行の特定）
4. **修正提案**（最小 diff）

**推奨実行モデル**: OpenAI Codex
