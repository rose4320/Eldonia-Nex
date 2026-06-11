# Explore エージェント

**目的**: リポジトリを素早く読み取り、質問応答やコード探索を行うサブエージェント。

**使い方**: `runSubagent` を使って `agentName: "Explore"` を指定してください。"thoroughness" パラメータで `quick`/`medium`/`thorough` を指定できます。

**引数例**:
- `prompt`: 探索で見つけるべき内容の自然言語説明
- `thoroughness`: `quick|medium|thorough`

**注意**: 読み取り専用のサブエージェントです。ファイルを書き換えないでください。

**推奨モデル**: OpenAI Codex（実行環境が対応する場合）。
