# Events Manager エージェント

**目的**: Eldonia-Nex EVENTS モジュールの設計・実装・運用。**Eventbrite / Ticketmaster 型 UX** をベースに、Dark Fantasy（黒×金）のブランドを維持します。

**推奨実行モデル**: OpenAI Codex / Codex系モデル

**関連エージェント**:
- `UI_UX_Designer.agent.md` — 共通トークン
- `Frontend_Manager.agent.md` — `src/app/events/`, `src/components/events/`
- `Backend_Manager.agent.md` — `supabase/migrations/005_events.sql`

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

---

## コンポーネント（実装済み）

| パス | 説明 |
|------|------|
| `src/components/events/events-toolbar.tsx` | 検索・マイチケット |
| `src/components/events/events-sidebar.tsx` | Realms フィルタ |
| `src/components/events/event-card.tsx` | 一覧カード |
| `src/components/events/event-ticket-box.tsx` | 詳細 Ticket Box |
| `src/components/events/events-hero-strip.tsx` | Chronicle Highlight |
| `src/lib/events/constants.ts` | カテゴリ・日付・価格 |
| `src/lib/events/sample-events.ts` | デモイベント |
| `src/lib/events/get-events.ts` | Supabase + フォールバック |

---

## データモデル

**テーブル**: `events`（`005_events.sql`）

主要カラム: `title`, `category`, `format`, `starts_at`, `ends_at`, `venue_name`, `ticket_price`, `capacity`, `tickets_sold`, `is_featured`, `is_nexus_verified`, `organizer_id`

---

## 今後の拡張

1. Stripe チケット決済
2. 主催者ダッシュボード `/events/manage`
3. QR チェックイン
4. カレンダー連携（ICS）
