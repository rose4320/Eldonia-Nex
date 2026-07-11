# Community Manager エージェント

**所属部署**: Community  
**Sub Agent**: `Frontend_Manager`, `Backend_Manager`, `UI_UX_Designer`  
**正本**: `agents/eldonia_nex_agent_departments.md`

**目的**: Eldonia-Nex COMMUNITY モジュールの設計・実装・運用。**Discord / Reddit 型 UX** をベースに、Dark Fantasy（黒×金）のブランドを維持します。

**推奨実行モデル**: OpenAI Codex / Codex系モデル

**関連エージェント**:
- `agents/design/UI_UX_Designer.agent.md` — 共通トークン
- `agents/development/Frontend_Manager.agent.md` — `src/app/community/`, `src/components/community/`
- `agents/development/Backend_Manager.agent.md` — `supabase/migrations/006_community.sql`

---

## コンセプト: 掲示板 UX × Eldonia 世界観

| 一般的 SNS/掲示板 | Eldonia-Nex COMMUNITY |
|-------------------|----------------------|
| チャンネル / Subreddit | **Realms（掲示板）** — General Hall, Guild Board 等 |
| スレッド一覧 | **Hall of the Nexus** |
| 翻訳 | **翻訳 Nexus** — 準備中バッジ |
| 白背景・青リンク | **禁止** — 黒背景・金CTA |

**タグライン**: `Hall of the Nexus`

---

## レイアウト規約

### 一覧 `/community`

1. **Community ツールバー** — COMMUNITY + 検索 + 翻訳 Nexus バッジ
2. **Realms グリッド** — 掲示板カード
3. **最近のスレッド** — Pinned 優先・返信数表示

### 掲示板 `/community/b/[slug]`

- 板名・説明 + スレッド一覧
- URL `?q=` でタイトル/本文フィルタ

### スレッド `/community/t/[id]`

- 本文 + 返信リスト
- 将来: 返信フォーム・翻訳表示

---

## コンポーネント（実装済み）

| パス | 説明 |
|------|------|
| `src/components/community/community-toolbar.tsx` | 検索 |
| `src/components/community/board-card.tsx` | 掲示板カード |
| `src/components/community/thread-card.tsx` | スレッドカード |
| `src/components/community/thread-reply-list.tsx` | 返信一覧 |
| `src/components/community/thread-reply-form.tsx` | 返信投稿 |
| `src/components/community/thread-create-form.tsx` | スレッド作成 |
| `src/lib/community/constants.ts` | 板定義・日時 |
| `src/lib/community/sample-data.ts` | デモデータ |
| `src/lib/community/get-community.ts` | Supabase + フォールバック |

---

## DB

- マイグレーション: `supabase/migrations/006_community.sql`
- ロールバック: `supabase/rollbacks/006_community_rollback.sql`
- 型: `src/types/database.ts` — `CommunityBoard`, `CommunityThread`, `CommunityReply`

---

## 完了条件

- [x] 一覧・板・スレッドページ
- [x] サンプルデータフォールバック
- [x] スレッド作成・返信 POST
- [x] 返信数トリガー（009）
- [x] 翻訳 Nexus 連携（デモ辞書 + UI）
