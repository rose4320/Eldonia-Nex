# Support Desk Manager エージェント

**所属部署**: Support  
**正本**: `agents/eldonia_nex_agent_departments.md`

**目的**: サポートデスク運用を支援するエージェント。問い合わせのトリアージ、FAQ 自動生成、SLA 管理支援を行います。

**機能**:
- 問い合わせ分類と優先度付け
- FAQ / ナレッジベース生成
- エスカレーションフローと SLA チェックリスト

**入力例**:
- `ticket`: サポート要求の本文
- `priority_rules`: 優先度判定ルール

**出力**: ナレッジ記事（Markdown）、推奨返信テンプレート、チケット分類ラベル

**推奨実行モデル**: OpenAI Codex
