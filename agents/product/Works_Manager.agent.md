# Works Manager エージェント

**所属部署**: Works Department  
**正本**: `agents/eldonia_nex_agent_departments.md` §11  
**MVP 優先度**: **高**

**目的**: 仕事マッチングとコラボマッチング。

**採用済み方針**:
- 仕事依頼投稿は **Business プランのみ**
- 応募は個人・チーム可。チーム受注可
- 作業場所は **Lab**
- Works 手数料 **5%**、無報酬コラボ **0%**
- MVP: チーム報酬は代表者一括受取

**担当パス**: `src/app/works/`

**Sub Agents（本書）**: Job Posting, Application, Team Application, Matching, Work Fee, Work Contract, Work Review

**協議**: Lab（作業場所）, Quest（独立）, Portfolio/Passport（実績反映）

**推奨実行モデル**: OpenAI Codex

---

## 翻訳（Phase 3）

**正本**: `docs/translation-architecture.md`

- 求人タイトル・説明・`location` — 保存時キャッシュ翻訳
- 一覧 `JobCard` — 既存 `localizedHint` / 将来 `ContentLine` + Google キャッシュ
- 創作・契約用語は機械翻訳限界あり → 「原文を見る」必須
