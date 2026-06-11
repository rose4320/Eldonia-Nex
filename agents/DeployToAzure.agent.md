# DeployToAzure エージェント

**目的**: Azure へのデプロイ作業を支援するエージェント（リソース作成手順・デプロイ手順の生成）。

**使い方**: `runSubagent` で `agentName: "DeployToAzure"` を指定してください。デプロイ対象、認証方法、リソースグループ名を渡します。

**引数例**:
- `target`: デプロイ対象（例: `webapp`, `function`, `bicep`）
- `subscription`: サブスクリプション ID
- `resource_group`: リソースグループ名
- `artifacts`: デプロイする成果物パス

**注意**: 認証情報は送らないでください。実行前にユーザー側で `az login` 等を行ってください。
