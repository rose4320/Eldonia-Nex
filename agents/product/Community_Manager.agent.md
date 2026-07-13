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
| 翻訳 | **翻訳 Nexus** — Google 翻訳 + ブランドバッジ |
| 白背景・青リンク | **禁止** — 黒背景・金CTA |

**タグライン**: `Hall of the Nexus`

**コメント削除**: 返信は物理削除せず `deleted_at` でソフト削除。**作者本人のみ**（スレッド主・モデレーター削除は当面なし）。UI + RLS（`040`/`041`）。

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

- 本文 + 返信リスト + 返信フォーム
- **翻訳 Nexus** — `TranslationPanel`（スレッド本文・各返信 `compact`）

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
| `src/components/community/translation-panel.tsx` | 翻訳 Nexus UI |
| `src/components/i18n/content-line.tsx` | 一覧の原文 + ヒント表示 |
| `src/app/api/nexus/translate/route.ts` | 翻訳 API（Google → デモ fallback） |

---

## 翻訳 Nexus（2026-07-13）

**正本**: `docs/translation-architecture.md` · **協議**: `Translation_Manager`

### 本番

- Google Cloud Translation API 接続済（`mode: "google"`）
- 対象: スレッド本文・返信（`sourceLocale` = 投稿時 `locale`）
- 現状: **原文主・ボタンで訳文表示**（オプトイン）

### 目標 UX（デザイン維持）

| 条件 | 表示 |
|------|------|
| 投稿 locale ≠ UI locale | **訳文を主**、`eldonia-localized-hint` で原文 |
| 投稿 locale = UI locale | 原文のみ（パネル非表示） |

コンポーネントは既存のみ: `eldonia-badge-nexus-prime`, `TranslationPanel`, `ContentLine`。

### 投稿時翻訳（計画 Phase 2）

```text
スレッド/返信 POST
  → 原文保存
  → 非同期で en / ko / zh-CN 翻訳
  → content_translations キャッシュ
閲覧
  → キャッシュ読み取り（Google 再呼び出しなし）
```

投稿完了を遅らせない（翻訳は非同期）。失敗時も投稿は成功。

**校正**: MVP は L0（機械翻訳のみ）。全件人力校正はしない。通報・不自然訳は `Translation Quality Agent` へ — `docs/translation-architecture.md` § Quality Assurance。

### 一覧 `/community`

`ThreadCard` の `ContentLine` — 将来キャッシュ訳を主表示、原文を括弧ヒントに。

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
- [x] 翻訳 Nexus 連携（Google API + 翻訳ベース UI）
- [x] UI locale ブラウザ推定
- [x] 言語不一致時の自動翻訳 + 投稿時キャッシュ warm
- [x] 一覧 `ThreadCard` のキャッシュ訳表示（+ 未キャッシュ最大5件 warm）
