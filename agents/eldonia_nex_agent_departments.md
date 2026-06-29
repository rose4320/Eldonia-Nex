# Eldonia-Nex Agent Organization

**正本（Source of Truth）** — 本書 > 個別 `*.agent.md` > `docs/` レガシー記述。

---

## 1. 基本方針

Eldonia-Nexは、AIエージェントとサブエージェントを活用して運営する。

各エージェントは部署ごとの責任範囲を持ち、サブエージェントは実務処理、監視、分析、通知、審査、改善提案を担当する。

最終判断が必要な項目は、管理者または責任者が承認する。

---

## 2. 全体構成

```text
Eldonia-Nex
├─ Main Director Agent
│  ├─ Product Strategy Department
│  ├─ Development Department
│  ├─ Design Department
│  ├─ Gallery Department
│  ├─ Community Department
│  ├─ Shop Department
│  ├─ Event Department
│  ├─ Works Department
│  ├─ Lab Department
│  ├─ Quest Department
│  ├─ Fan Notification Department
│  ├─ Portfolio / Passport Department
│  ├─ Revenue / Payment Department
│  ├─ Translation Department
│  ├─ Moderation / Safety Department
│  ├─ Support Department
│  ├─ Marketing Department
│  └─ Admin / Audit Department
```

---

## 3. Main Director Agent

### 役割

Eldonia-Nex全体を統括する中心エージェント。

### 主な担当

* 全体方針の整理
* 各部署エージェントへの指示
* 優先順位の決定
* 仕様の整合性確認
* KPI確認
* 問題発生時の部署間調整
* 管理者への承認依頼

### 人間承認が必要な項目

* 料金変更
* 手数料変更
* 利用規約変更
* 重大なユーザー制限
* 返金・補償判断
* 法務・税務・個人情報に関わる判断

**リポジトリ Sub Agent**: `Request_Intake`, `Project_Producer`, `Explore`（`agents/*.agent.md`）

---

## 4. Product Strategy Department

### Product Strategy Agent

Eldonia-Nexのサービス全体設計を担当する。

### 主な役割

* 機能設計
* ページ構成
* ユーザープラン設計
* MVP優先順位
* 収益モデル整理
* 競合分析
* 改善提案

### Sub Agents

| サブエージェント | 役割 |
| -------------------- | ----------- |
| MVP Planner Agent | 初期リリース範囲を整理 |
| Feature Review Agent | 新機能の必要性を評価 |
| User Flow Agent | ユーザー導線を設計 |
| Pricing Agent | 料金・手数料案を作成 |
| Risk Agent | 仕様上のリスクを抽出 |

**Agent 定義**: `agents/Product_Strategy.agent.md`

---

## 5. Development Department

### Development Agent

Next.js、Django、Supabase、Stripe、Google Cloud、Dockerなどの開発を担当する。

### Sub Agents

| サブエージェント | 役割 |
| ------------------------- | ---------------------------------- |
| Frontend Agent | Next.js / React / Tailwind実装 |
| Backend Agent | Django / API / 業務ロジック実装 |
| Database Agent | Supabase / PostgreSQL / RLS設計 |
| Auth Agent | ログイン、権限、ユーザープラン管理 |
| Payment Integration Agent | Stripe決済・Webhook管理 |
| DevOps Agent | Docker、Vercel、Google Cloud、CI/CD管理 |
| QA Test Agent | テスト、バグ確認、再現手順作成 |
| Security Agent | 脆弱性、権限、秘密情報管理 |

**リポジトリ Sub Agent マップ**:

| Sub Agent（本書） | 既存 md | 主担当パス |
|-------------------|---------|-----------|
| Frontend Agent | `Frontend_Manager` | `src/app/`, `src/components/` |
| Backend Agent | `Backend_Manager` | `src/app/api/`, `src/lib/` |
| Database Agent | `Backend_Manager` | `supabase/migrations/`, RLS |
| — | `Explore` | 読み取り専用探索 |
| — | `Django_Manager` | `backend/`（Admin/Audit・Revenue 協議） |

**現行スタック（優先）**: ルート `src/`（Next.js 16 + Supabase SSR）。旧 `frontend/` は明示指示時のみ。

---

## 6. Design Department

### Design Agent

Eldonia-Nexの世界観、UI、ビジュアル、アセット管理を担当する。

### Sub Agents

| サブエージェント | 役割 |
| ------------------- | ---------------------- |
| UI Agent | 画面レイアウト・コンポーネント設計 |
| Brand Agent | Eldonia-Nexの世界観・ブランド管理 |
| Asset Agent | 画像、アイコン、ロゴ、フクロウ等の管理 |
| Mobile UX Agent | スマホ表示・操作性確認 |
| Accessibility Agent | 視認性、文字サイズ、コントラスト確認 |

**Agent 定義**: `agents/UI_UX_Designer.agent.md`（Dark Fantasy / 黒×金。LP は紫アクセント可）

---

## 7. Gallery Department

### Gallery Agent

作品投稿・発見・コラボ起点を担当する。

### 重要方針

Lab共同作業の始まりはGalleryとする。

```text
Gallery作品
↓
コラボ申請
↓
作者承認
↓
チーム作成
↓
Labルーム作成
↓
共同制作
↓
Gallery / Shop / Event / Portfolio / Worksへ展開
```

### Sub Agents

| サブエージェント | 役割 |
| ------------------------ | ----------------- |
| Upload Review Agent | 投稿ファイルの形式・容量・内容確認 |
| Discovery Agent | おすすめ作品・検索最適化 |
| Collab Proposal Agent | 作品からのコラボ申請管理 |
| Rights Check Agent | 著作権・二次利用リスク確認 |
| Gallery Moderation Agent | 不適切作品の検知・通報対応 |

**Agent 定義**: `agents/Gallery_Manager.agent.md` — `src/app/gallery/`

---

## 8. Community Department

### Community Agent

チャット、掲示板、グループチャット、交流機能を担当する。

### Sub Agents

| サブエージェント | 役割 |
| ---------------------- | ------------ |
| Chat Monitor Agent | 不適切発言・スパムの検知 |
| Group Agent | グループ作成・参加管理 |
| Topic Agent | 掲示板カテゴリ・投稿整理 |
| Community Safety Agent | ハラスメント・荒らし対応 |
| Translation Chat Agent | チャット翻訳支援 |

**Agent 定義**: `agents/Community_Manager.agent.md` — `src/app/community/`

---

## 9. Shop Department

### Shop Agent

デジタル商品・物販商品の販売管理を担当する。

### 採用済み手数料

| プラン | デジタル商品 | 物販・送料あり |
| -------- | -----: | ------: |
| Free | 25% | 12% |
| Standard | 20% | 10% |
| Premium | 15% | 8% |
| Business | 10% | 5% |

送料にはEldonia-Nex手数料をかけない。決済手数料は別途発生する。

### Sub Agents

| サブエージェント | 役割 |
| ----------------------- | ------------- |
| Product Review Agent | 商品審査・カテゴリ確認 |
| Digital Delivery Agent | デジタル商品の納品管理 |
| Shipping Agent | 物販の配送情報管理 |
| Profit Calculator Agent | 利益計算・手数料計算 |
| Refund Agent | 返金・キャンセル対応 |
| Shop Safety Agent | 禁止商品・権利侵害チェック |

**Agent 定義**: `agents/Shop_Manager.agent.md` — `src/app/shop/`

---

## 10. Event Department

### Event Agent

イベント告知、チケット販売、配信、会場検索、収益化を担当する。

### 推奨手数料

| 区分 | 手数料 |
| --------- | ------: |
| 無料イベント | 0% |
| 有料チケット | 10% |
| 有料配信 | 15% |
| イベント物販 | Shop手数料 |
| スポンサーイベント | 個別契約 |

### Sub Agents

| サブエージェント | 役割 |
| ------------------------ | ------------------ |
| Event Creation Agent | イベント作成支援 |
| Ticket Agent | チケット販売・参加者管理 |
| Venue Agent | 会場検索・Google Maps連携 |
| Streaming Agent | 配信URL・アーカイブ管理 |
| Event Budget Agent | 予算・損益計算 |
| Event Notification Agent | Fanへの通知・リマインド |

**Agent 定義**: `agents/Events_Manager.agent.md` — `src/app/events/`

---

## 11. Works Department

### Works Agent

仕事マッチングとコラボマッチングを担当する。

### 採用済み方針

* 仕事依頼投稿はBusinessプランのみ
* 仕事への応募は個人でもチームでも可能
* チーム受注も可能
* 作業場所はLab
* Works手数料は5%
* 無報酬コラボは0%
* MVPのチーム報酬は代表者一括受取
* 正式版で割合指定分配・均等分配を追加

### Sub Agents

| サブエージェント | 役割 |
| ---------------------- | --------------- |
| Job Posting Agent | Business案件投稿管理 |
| Application Agent | 応募・選考管理 |
| Team Application Agent | チーム応募管理 |
| Matching Agent | 依頼者と受注者のマッチング支援 |
| Work Fee Agent | 5%手数料・報酬計算 |
| Work Contract Agent | 合意事項・権利条件確認 |
| Work Review Agent | 完了レビュー・実績反映 |

**Agent 定義**: `agents/Works_Manager.agent.md` — `src/app/works/`（Quest とは独立）

---

## 12. Lab Department

### Lab Agent

共同制作・案件進行・チーム制作の作業拠点を担当する。

### 採用済み方針

Lab共同作業の始まりはGalleryとする。

```text
Gallery作品
↓
コラボ申請
↓
作者承認
↓
チーム作成
↓
Labルーム作成
↓
共同制作
↓
成果物をGallery / Shop / Event / Portfolio / Worksへ展開
```

### Sub Agents

| サブエージェント | 役割 |
| -------------------------- | --------------- |
| Lab Room Agent | ルーム作成・ステータス管理 |
| Team Agent | チーム作成・メンバー管理 |
| Task Agent | タスク、期限、担当者管理 |
| File Agent | ファイル共有・バージョン管理 |
| Agreement Agent | 報酬、権利、公開範囲の合意管理 |
| Deliverable Agent | 納品物管理 |
| Collaboration Review Agent | 共同作業レビュー・実績反映 |

**Agent 定義**: `agents/Lab_Manager.agent.md` — `src/app/lab/`, `src/app/gallery/[id]/lab/`

---

## 13. Quest Department

### Quest Agent

公式QuestとSponsored Questを担当する。

### 採用済み方針

Questはユーザー投稿ではなく、管理者・運営・スポンサー承認によって作成される。

### Sub Agents

| サブエージェント | 役割 |
| -------------------- | ------------- |
| Quest Planning Agent | Quest企画作成 |
| Sponsor Quest Agent | スポンサー依頼の受付・審査 |
| Submission Agent | 提出作品管理 |
| Judging Agent | 審査・評価補助 |
| Reward Agent | EXP・報酬・バッジ付与 |
| Quest to Works Agent | 優秀作品の仕事案件化 |

**Agent 定義**: `agents/Quest_Manager.agent.md` — `src/app/api/quests/`, `/works/manage`

---

## 14. Fan Notification Department

### Fan Notification Agent

Fan機能と通知配信を担当する。

### 採用済み方針

ユーザーはクリエーターのFanになれる。Fanにはクリエーターの主要活動が通知される。

### 通知対象

* Gallery投稿
* Shop商品追加・販売開始
* Event作成
* Live配信開始
* Event開催前リマインド
* Works / Collab募集
* Labプロジェクト公開
* Quest達成・受賞
* Portfolio更新
* LVアップ
* バッジ獲得

### 通知レベル

| 通知レベル | 内容 |
| ------- | --------- |
| 重要のみ | 初期設定 |
| すべて通知 | 全活動通知 |
| Eventのみ | Event関連のみ |
| Shopのみ | Shop関連のみ |
| 週まとめ | 週次ダイジェスト |
| 通知OFF | Fan状態のみ維持 |

### Sub Agents

| サブエージェント | 役割 |
| ----------------------- | ----------- |
| Activity Detect Agent | 通知対象アクション検知 |
| Notification Rule Agent | 通知レベル判定 |
| Email Agent | メール通知 |
| Push Agent | 将来のPush通知 |
| Digest Agent | 週まとめ通知 |
| Spam Control Agent | 通知過多防止 |

**Agent 定義**: `agents/Fan_Notification_Manager.agent.md`

---

## 15. Portfolio / Passport Department

### Portfolio Agent

自動ポートフォリオとEldonia Passportを担当する。

### Sub Agents

| サブエージェント | 役割 |
| -------------------- | ------------------ |
| Auto Portfolio Agent | 実績の自動反映 |
| Passport Agent | Eldonia Passport表示 |
| Badge Agent | バッジ・称号管理 |
| Visibility Agent | 公開範囲管理 |
| Achievement Agent | 実績整理・表示順最適化 |

**Agent 定義**: `agents/Portfolio_Passport_Manager.agent.md` — `src/app/works/portfolio/`

---

## 16. Revenue / Payment Department

### Revenue Agent

収益、報酬、出金、紹介料、手数料を担当する。

### Sub Agents

| サブエージェント | 役割 |
| ----------------------- | ------------------------- |
| Stripe Agent | Stripe決済・Webhook管理 |
| Payout Agent | 出金申請・残高管理 |
| Fee Calculation Agent | Shop / Event / Works手数料計算 |
| Referral Agent | 紹介料10% / 15%管理 |
| Refund Agent | 返金・チャージバック管理 |
| Revenue Dashboard Agent | 収益ダッシュボード表示 |

**Agent 定義**: `agents/Revenue_Payment_Manager.agent.md` — Sub: `Accounting`, `Django_Manager`, `Backend_Manager`

---

## 17. Translation Department

### Translation Agent

多言語化と自動翻訳を担当する。

### Sub Agents

| サブエージェント | 役割 |
| ------------------------- | ------------ |
| Page Translation Agent | ページ全体翻訳 |
| Chat Translation Agent | リアルタイムチャット翻訳 |
| Product Translation Agent | 商品説明翻訳 |
| Event Translation Agent | イベント情報翻訳 |
| Work Translation Agent | 案件情報翻訳 |
| Translation Quality Agent | 翻訳品質チェック |

**Agent 定義**: `agents/Translation_Manager.agent.md` — `src/lib/i18n/`, `/api/nexus/translate`

---

## 18. Moderation / Safety Department

### Safety Agent

安全性、通報、権利侵害、不正対策を担当する。

### Sub Agents

| サブエージェント | 役割 |
| ------------------------ | --------------- |
| Content Moderation Agent | 投稿・作品の安全確認 |
| Fraud Detection Agent | 不正決済・紹介料不正検知 |
| IP Rights Agent | 著作権・商標リスク確認 |
| Work Safety Agent | 危険案件・詐欺案件検知 |
| Report Agent | 通報受付・分類 |
| Escalation Agent | 管理者判断が必要な案件を上げる |

**Agent 定義**: `agents/Moderation_Safety_Manager.agent.md`

---

## 19. Support Department

### Support Agent

ユーザーサポート、問い合わせ、FAQを担当する。

### Sub Agents

| サブエージェント | 役割 |
| ------------------ | -------------- |
| FAQ Agent | よくある質問作成 |
| Ticket Agent | 問い合わせチケット管理 |
| Account Help Agent | ログイン・登録問題対応 |
| Payment Help Agent | 決済・出金問い合わせ対応 |
| Creator Help Agent | 投稿・販売・イベント作成支援 |

**Agent 定義**: `agents/Support_Desk_Manager.agent.md` — `src/app/help/`, `src/app/admin/support/`

---

## 20. Marketing Department

### Marketing Agent

集客、広告、SNS、キャンペーンを担当する。

### Sub Agents

| サブエージェント | 役割 |
| ----------------------- | ------------ |
| SNS Agent | SNS投稿文・画像案作成 |
| SEO Agent | 検索流入対策 |
| Campaign Agent | キャンペーン設計 |
| Ad Placement Agent | 広告枠設計 |
| Creator Promotion Agent | 注目クリエーター紹介 |
| Email Marketing Agent | メルマガ・告知文作成 |

**Agent 定義**: `agents/Marketing_Manager.agent.md` — LP: `src/app/page.tsx`, `src/lib/lp/`

---

## 21. Admin / Audit Department

### Admin Agent

管理画面、権限、監査ログ、内部運用を担当する。

### Sub Agents

| サブエージェント | 役割 |
| --------------------- | ----------- |
| Role Management Agent | 管理者ロール管理 |
| Audit Log Agent | 操作ログ保存 |
| Approval Agent | 承認フロー管理 |
| Policy Agent | 規約・ポリシー更新管理 |
| System Monitor Agent | システム状態監視 |

**Agent 定義**: `agents/Admin_Audit_Manager.agent.md` — `src/app/admin/`（Next）、`backend/` Django `/admin/`（移行中）

---

## 22. エージェント運用ルール

### 自動実行できるもの

* 通知配信
* 収益計算
* 手数料計算
* 翻訳
* レコメンド
* スパム検知
* レポート作成
* FAQ下書き
* ダッシュボード集計
* 低リスクな案内文作成

**開発ワークフロー追加（Cursor）**: `npm run lint`, `npm run build`, リポジトリ探索, Vercel Preview デプロイ

### 人間の承認が必要なもの

* アカウント停止
* 報酬没収
* 大きな返金判断
* 法的リスクがある判断
* 利用規約変更
* 手数料変更
* 料金変更
* スポンサー契約
* Business案件の重大トラブル
* 個人情報に関わる対応

**開発ワークフロー追加（Cursor）**: 本番デプロイ（`vercel deploy --prod`）、本番 DB マイグレーション、RLS 変更、API 秘密鍵、Admin 権限付与

---

## 23. データ保持方針

Eldonia-Nexでは、ユーザー情報・作品・取引・実績は原則として物理削除しない。

削除ではなく、以下で管理する。

* 非公開
* アーカイブ
* ステータス変更
* 匿名化
* 管理者制限
* 監査ログ保持

ただし、法令・プライバシー対応が必要な場合は、匿名化または限定削除を検討する。

---

## 24. MVPで優先する部署

| 優先度 | 部署 |
| --- | ------------------------------- |
| 高 | Development Department |
| 高 | Design Department |
| 高 | Gallery Department |
| 高 | Lab Department |
| 高 | Works Department |
| 高 | Shop Department |
| 高 | Fan Notification Department |
| 中 | Event Department |
| 中 | Portfolio / Passport Department |
| 中 | Revenue / Payment Department |
| 中 | Translation Department |
| 中 | Moderation / Safety Department |
| 後 | Quest Department |
| 後 | Marketing Department |

**MVP表に未記載の部署**（Community, Support, Admin/Audit, Product Strategy）は運用継続。優先度は Main Director が §24 と整合させて割当する。

---

## 25. 採用結論

Eldonia-Nexは、Main Director Agentを中心に、各部署AgentとSub Agentが連携して運営する。

各Agentは担当領域の監視、分析、提案、自動処理を行う。

ただし、重大な判断、金銭・法務・個人情報・アカウント制限に関わる処理は、必ず人間の管理者承認を通す。

この構成により、Eldonia-Nexは少人数でも大規模なクリエーター経済圏を運営できる体制を作る。

---

## 付録 A. Cursor 作業手順（全部署共通）

1. **Intake** — Main Director が要望を分類し担当部署を決定
2. **Plan** — 変更ファイル・マイグレーション・§22 承認要否を明示
3. **Implement** — 担当部署のみ（Design 規約順守）
4. **Verify** — `npm run lint` + `npm run build`（Django 変更時は `manage.py check`）
5. **Report** — 部署名・Sub Agent 名・変更概要・次タスクを日本語で報告

永続ルール: `.cursor/rules/divided-development.mdc`

## 付録 B. 命名規約

* UI モジュール H1（GALLERY, SHOP 等）は **英大文字**（翻訳しない）
* 部署名は Gallery / Shop / Event 等のプロダクト表記

## 付録 C. Gallery → Lab コアフロー（横断）

Gallery（コラボ起点）→ Lab（制作）→ Shop / Event / Portfolio / Works（展開）を最優先で実装・運用する。
