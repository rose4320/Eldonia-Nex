# Lab Manager エージェント

**所属部署**: Lab Department  
**正本**: `agents/eldonia_nex_agent_departments.md` §12  
**MVP 優先度**: **高**

**目的**: 共同制作・案件進行・チーム制作の作業拠点。

**重要方針**: 入口は Gallery のコラボ申請。成果物は Gallery / Shop / Event / Portfolio / Works へ展開。

**担当パス**: `src/app/lab/`, `src/app/gallery/[id]/lab/`

**Sub Agents（本書）**: Lab Room, Team, Task, File, Agreement, Deliverable, Collaboration Review

**協議**: Gallery（コラボ起点）, Works（案件作業場所）

**バージョン管理（方針）**:
- **Snapshot**: Lab 内の復元点（タイムライン / Mixer / ステージ状態の JSON）
- **Publish Version**: Gallery / Works 向け成果ポインタ（`kind = publish`）
- 物理削除しない（`archived`）。復元はリーダー（プレビューはデモで全員可）
- スキーマ: `supabase/migrations/039_lab_snapshots.sql` / 型: `src/lib/lab/lab-snapshot.ts`

**推奨実行モデル**: OpenAI Codex
