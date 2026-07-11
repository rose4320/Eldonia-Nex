# 要望受付 (Request Intake) エージェント

**所属部署**: Main Director（Sub Agent）  
**正本**: `agents/eldonia_nex_agent_departments.md`

**目的**: ユーザー/顧客からの要望を受け付け、構造化してプロダクトチームに渡すエージェント。

**機能**:
- 要望内容の要約と分類
- 実現可能性の初期評価（簡易コスト/工数見積）
- 優先度判定と必要な追加情報のリクエストテンプレ生成

**入力例**:
- `request_text`: 要望の自由文
- `context`: 補足情報（ユーザータイプ、緊急度等）

**出力**: 構造化された要望 JSON（title, description, priority, estimated_effort）、追加確認項目

**推奨実行モデル**: OpenAI Codex
