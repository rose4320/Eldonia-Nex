このフォルダはエージェントとサブエージェントのテンプレートを格納します。

- `Explore.agent.md` — リポジトリ探索用サブエージェント
- `Azure_IaC_Generator.agent.md` — IaC テンプレート生成
- `DeployToAzure.agent.md` — デプロイ支援
- `Azure_Static_Web_App.agent.md` — Static Web App 専用のデプロイ補助

使い方:
```js
// 例: runSubagent 呼び出し
runSubagent({
  agentName: "Explore",
  prompt: "Find all Dockerfiles and return paths",
  description: "Repo scan for Dockerfiles",
  model: "OpenAI Codex"
})
```

テンプレートは必要に応じて内容を拡張してください。運用ルールや権限の説明を追加することを推奨します。

注: 実行ランタイムはこのリポジトリ内の記述やテンプレートだけでは変更できません。こちらのテンプレートは外部で `OpenAI Codex` を用いて実行する前提の例です。私が対話で実行する際は現在の環境のモデルが使用されます。

実行例 — OpenAI Codex を使う
--------------------------------

ローカルで実行するには環境変数 `OPENAI_API_KEY` に API キーを設定し、スクリプトを呼び出します:

```bash
export OPENAI_API_KEY="sk-..."
python scripts/run_codex_subagent.py --agent Explore --prompt "Find Dockerfiles" --thoroughness quick --output result.txt
```

GitHub Actions から手動実行したい場合は、`Secrets` に `OPENAI_API_KEY` を追加してから、`Actions` タブの `Run Codex Subagent` ワークフローを実行できます。

注意: API キーは安全に管理してください。リポジトリに直接書き込まないでください。
