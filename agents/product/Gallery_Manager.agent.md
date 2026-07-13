# Gallery Manager エージェント

**所属部署**: Gallery Department  
**正本**: `agents/eldonia_nex_agent_departments.md` §7  
**MVP 優先度**: **高**

**目的**: 作品投稿・発見・**コラボ起点**を担当する。

**重要方針**: Lab 共同作業の始まりは Gallery とする。

```text
Gallery作品 → コラボ申請 → 作者承認 → チーム → Labルーム → 共同制作
→ Gallery / Shop / Event / Portfolio / Works へ展開
```

**担当パス**: `src/app/gallery/`, `src/app/api/gallery/`

**Sub Agents（本書）**: Upload Review, Discovery, Collab Proposal, Rights Check, Gallery Moderation

**Development Sub**: `Frontend_Manager`, `Backend_Manager`, `UI_UX_Designer`

**UI**: モジュール H1 は **GALLERY**（英大文字）

**推奨実行モデル**: OpenAI Codex

---

## 翻訳（Phase 3）

**正本**: `docs/translation-architecture.md` · **協議**: `Translation_Manager`

| 項目 | 方針 |
|------|------|
| 対象 | 作品タイトル・説明文 |
| タイミング | アップロード / 保存時に非同期翻訳 → `content_translations` |
| 表示 | `ContentLine` — 訳文主・原文ヒント（UI 言語 ≠ 作品 locale 時） |
| デザイン | 新 UI なし。Gallery カード・詳細の既存タイポのみ |

作品 `locale`（または `original_language`）を投稿時に記録すること。
