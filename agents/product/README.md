# Product — コアプロダクト

Gallery → Lab コアフローを含むプロダクト部署。

| ファイル | 役割 | 主パス |
|---------|------|--------|
| [Gallery_Manager.agent.md](./Gallery_Manager.agent.md) | 作品・投稿 | `src/app/gallery/` |
| [Lab_Manager.agent.md](./Lab_Manager.agent.md) | 共同制作 | `src/app/lab/` |
| [Works_Manager.agent.md](./Works_Manager.agent.md) | Works・求人 | `src/app/works/` |
| [Shop_Manager.agent.md](./Shop_Manager.agent.md) | ショップ | `src/app/shop/` |
| [Shop_Feature_Proposal.md](./Shop_Feature_Proposal.md) | Shop 機能提案書 | §3 機能・§6 テスト |
| [Events_Manager.agent.md](./Events_Manager.agent.md) | イベント | `src/app/events/` |
| [Community_Manager.agent.md](./Community_Manager.agent.md) | コミュニティ・**翻訳 Nexus** | `src/app/community/` |
| [Quest_Manager.agent.md](./Quest_Manager.agent.md) | Quest | `/api/quests` |
| [Fan_Notification_Manager.agent.md](./Fan_Notification_Manager.agent.md) | 通知 | 通知基盤 |
| [Portfolio_Passport_Manager.agent.md](./Portfolio_Passport_Manager.agent.md) | ポートフォリオ | `works/portfolio/` |

**MVP 高**: Gallery, Lab, Works, Shop, Fan Notification

**翻訳戦略正本**: [`docs/translation-architecture.md`](../../docs/translation-architecture.md) — Community 本番接続済、全モジュールは投稿時キャッシュ + 翻訳ベース表示を Phase 2–3 で展開。

正本: [../eldonia_nex_agent_departments.md](../eldonia_nex_agent_departments.md) §7–§15
