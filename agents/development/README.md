# Development — 実装・インフラ

Next.js / Supabase / Django / CI の Sub Agent。

| ファイル | 役割 | 主パス |
|---------|------|--------|
| [Frontend_Manager.agent.md](./Frontend_Manager.agent.md) | UI 実装 | `src/app/`, `src/components/` |
| [Backend_Manager.agent.md](./Backend_Manager.agent.md) | API・業務ロジック | `src/app/api/`, `src/lib/` |
| [Database_Agent.agent.md](./Database_Agent.agent.md) | RLS・マイグレーション | `supabase/migrations/` |
| [Auth_Agent.agent.md](./Auth_Agent.agent.md) | 認証・OAuth | `src/app/auth/` |
| [DevOps_Agent.agent.md](./DevOps_Agent.agent.md) | デプロイ・CI | Vercel, build |
| [QA_Test_Agent.agent.md](./QA_Test_Agent.agent.md) | テスト・検証 | lint/build |
| [Django_Manager.agent.md](./Django_Manager.agent.md) | Django Admin | `backend/` |
| [Accounting.agent.md](./Accounting.agent.md) | 財務・帳票 | Revenue 協議 |

正本: [../eldonia_nex_agent_departments.md](../eldonia_nex_agent_departments.md) §5
