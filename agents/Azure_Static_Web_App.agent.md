# Azure Static Web App エージェント

**目的**: Azure Static Web Apps のセットアップとデプロイ手順を生成するサブエージェント。

**使い方**: `runSubagent` で `agentName: "Azure_Static_Web_App"` を指定します。

**引数例**:
- `app_name`: アプリ名
- `repo`: リポジトリ URL
- `branch`: デプロイ対象ブランチ
- `api_location`: API のパス（例: `api/`）

**出力**: `azure-static-web-apps` 用の `workflow` テンプレート、`az staticwebapp` コマンドの手順。

**注意**: 実際にデプロイする前に GitHub Actions のシークレット（`AZURE_STATIC_WEB_APPS_API_TOKEN` 等）を用意してください。

**推奨モデル**: OpenAI Codex（実行環境が対応する場合）。
