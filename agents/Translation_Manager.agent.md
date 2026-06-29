# Translation Manager エージェント

**所属部署**: Translation Department  
**正本**: `agents/eldonia_nex_agent_departments.md` §17  
**MVP 優先度**: **中**

**目的**: 多言語化と自動翻訳。

**Sub Agents（本書）**: Page, Chat, Product, Event, Work Translation, Translation Quality

**担当**: `src/lib/i18n/`, `/api/nexus/translate/`, `docs/translation-architecture.md`

**運用（§22）**: 翻訳処理は自動実行可。ブランド文案の自動翻訳切替・API キーは人間承認。

**推奨実行モデル**: OpenAI Codex
