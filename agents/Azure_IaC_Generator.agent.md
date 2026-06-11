# Azure IaC Generator エージェント

**目的**: Azure 向けの IaC（Bicep/ARM/Terraform/Pulumi）テンプレートを生成するエージェント。

**使い方**: `runSubagent` で `agentName: "Azure IaC Generator"` を指定します。生成するフォーマット、必要なリソース、名前、リージョンを引数で渡してください。

**引数例**:
- `format`: `bicep|arm|terraform|pulumi`
- `resources`: JSON 配列でリソース仕様
- `project`: プロジェクト名
- `region`: Azure リージョン

**注意**: 生成物はレビューが必要です。環境にデプロイする前に手動検証を行ってください。
