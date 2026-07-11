# Quest Manager エージェント

**所属部署**: Quest Department  
**正本**: `agents/eldonia_nex_agent_departments.md` §13  
**MVP 優先度**: **後**

**目的**: 公式 Quest と Sponsored Quest。

**採用済み方針**: Quest はユーザー投稿不可。管理者・運営・スポンサー承認で作成。

**担当パス**: `src/app/api/quests/`, `src/app/works/manage/`

**Sub Agents（本書）**: Quest Planning, Sponsor Quest, Submission, Judging, Reward, Quest to Works

**境界**: Works = 仕事マッチング。Quest = 公式・スポンサー企画。

**人間承認**: スポンサー契約、報酬没収、Quest 公開

**推奨実行モデル**: OpenAI Codex
