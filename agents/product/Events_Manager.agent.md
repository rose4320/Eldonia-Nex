# Events Manager エージェント

**所属部署**: Event Department  
**正本**: `agents/eldonia_nex_agent_departments.md` §10  
**要件定義**: `docs/18_Events機能要件定義書.md`（v0.1）  
**MVP 優先度**: **中**

**Sub Agents（本書）**: Event Creation, Ticket, Venue, Streaming, Event Budget, Event Notification

**推奨手数料**: 無料0% / 有料チケット10% / 有料配信15% / 物販はShop手数料

**目的**: Eldonia-Nex EVENTS モジュールの設計・実装・運用。**Eventbrite / Ticketmaster 型 UX** をベースに、Dark Fantasy（黒×金）のブランドを維持します。

**推奨実行モデル**: OpenAI Codex / Codex系モデル

**関連エージェント**:
- `agents/design/UI_UX_Designer.agent.md` — 共通トークン
- `agents/development/Frontend_Manager.agent.md` — `src/app/events/`, `src/components/events/`
- `agents/development/Backend_Manager.agent.md` — `supabase/migrations/`
- `agents/product/Fan_Notification_Manager.agent.md` — 延期・変更の必達通知

---

## 採用済み要件（v0.1 サマリー）

| 項目 | 方針 |
|------|------|
| 作成入口 | 設定 → Events ウィザード（5 ステップ） |
| 下書き | **DB 永続化** — いつでも途中ステップから再開 |
| 延期・見直し | `draft` / `postponed` に戻して編集 → **ファン・チケット所持者へ必達通知** |
| チケット | アプリ内 QR + **印刷用 PDF** |
| サムネイル | **2:1 横長**（1920×960 推奨）— デバイス別バリアント |
| 会場 | Phase 2 で Places；予約はリンク/電話案内のみ |
| 予算・予測 | Phase 2–3、参考値として表示 |

詳細は `docs/18_Events機能要件定義書.md` を参照。

---

## コンセプト: チケット UX × Eldonia 世界観

| 一般的 EC/チケット | Eldonia-Nex EVENTS |
|-------------------|-------------------|
| イベント検索 | **Chronicle 検索** — 金枠・ダーク面 |
| カテゴリ | **Realms（領域）** — 左サイドバー |
| Verified Organizer | **Nexus Verified Host** |
| Featured Event | **Chronicle Highlight** |
| Get Tickets | **チケットを取得** |
| Sold Out | **完売 — Sold Out** |
| 白背景・青CTA | **禁止** — 黒背景・金CTA |

**タグライン**: `Chronicles of the Nexus`（イベント副題）

---

## レイアウト規約

### 一覧 `/events`

1. **Events ツールバー** — EVENTS + Chronicle 検索 + マイチケット導線
2. **2 カラム** — 左: Realms / 右: 注目帯 + イベントカードグリッド
3. **カード** — 日付バッジ・会場/オンライン・価格・残席
4. **フィルタ** — URL `?q=` `?category=` `?when=upcoming|past`

### 詳細 `/events/[id]`

1. **左** — カバー・説明・主催者・会場情報
2. **右 Ticket Box** — 日時・価格・残席・取得 CTA（Shop Buy Box 相当）

### 設定（新規）

- `/settings#events` — 下書き・公開中・過去
- `/settings/post/event` — ウィザード新規
- `/settings/post/event/[id]` — 下書き再開・延期編集

---

## コンポーネント（現行 + 予定）

| パス | 説明 | Phase |
|------|------|-------|
| `src/components/events/events-toolbar.tsx` | 検索・マイチケット | 済 |
| `src/components/events/events-sidebar.tsx` | Realms フィルタ | 済 |
| `src/components/events/event-card.tsx` | 一覧カード | 済 |
| `src/components/events/event-ticket-box.tsx` | 詳細 Ticket Box | 済 |
| `src/components/events/events-hero-strip.tsx` | Chronicle Highlight | 済 |
| `src/components/settings/event-create-form.tsx` | 作成フォーム | 済 → ウィザード化 P1 |
| `event-wizard/`（予定） | 5 ステップ + 自動保存 | P1 |
| `event-check-in/`（予定） | QR スキャン | P1 |
| `event-ticket-pdf/`（予定） | PDF 生成・DL | P1 |

---

## データモデル

**現行**: `events`（`005_events.sql`）

**P1 拡張**（要件書 §6–8）:
- `events`: `subtitle`, `wizard_step`, `draft_payload`, `venue_lat/lng`, `venue_booking_url`, `venue_phone`, `readiness`
- `event_tickets`, `event_checkins`, `event_change_log`
- `user_notifications.kind`: `event_postponed`, `event_updated`, `event_cancelled`, `event_ticket_issued`, `event_reminder`
- `user_settings.notify_event`（マーケ告知用。延期等は必達）

---

## P1 実装チェックリスト

- [ ] ウィザード + 下書き自動保存 + 設定から再開
- [ ] サブタイトル・サムネアップロード
- [ ] lifecycle status（draft → published → postponed …）
- [ ] event_tickets 発行（決済連動）
- [ ] QR 表示 + **PDF ダウンロード**
- [ ] 主催者チェックイン
- [ ] 延期・変更・中止 → **ファン + 所持者必達通知**
- [ ] event_change_log 監査

## 今後の拡張（P2+）

1. Google Places / 静的地図
2. 予算テンプレ・売上シミュレーター
3. `/events/manage` 主催者ダッシュボード
4. ICS カレンダー
5. イベント説明の翻訳キャッシュ（`docs/translation-architecture.md` Phase 3）
