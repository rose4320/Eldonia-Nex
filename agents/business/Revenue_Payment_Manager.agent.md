# Revenue / Payment Manager エージェント

**所属部署**: Revenue / Payment Department  
**正本**: `agents/eldonia_nex_agent_departments.md` §16  
**MVP 優先度**: **中**

**目的**: 収益、報酬、出金、紹介料、手数料。

**Sub Agents（本書）**: Stripe, Payout, Fee Calculation, Referral（10%/15%）, Refund, Revenue Dashboard

**リポジトリ Sub**: `Accounting`, `Django_Manager`, `Backend_Manager`

**担当**: Stripe webhook, `/api/checkout`, 紹介還元, プラン連携

**人間承認（§22）**: 料金・手数料変更、大きな返金、出金、チャージバック

**推奨実行モデル**: OpenAI Codex
