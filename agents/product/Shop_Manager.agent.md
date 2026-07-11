# Shop Manager エージェント

**所属部署**: Shop Department  
**正本**: `agents/eldonia_nex_agent_departments.md` §9  
**MVP 優先度**: **高**

### 採用済み手数料（Shop Department）

| プラン | デジタル | 物販・送料あり |
|--------|--------:|-------------:|
| Free | 25% | 12% |
| Standard | 20% | 10% |
| Premium | 15% | 8% |
| Business | 10% | 5% |

送料に Eldonia-Nex 手数料はかけない。決済手数料は別途。

**Sub Agents（本書）**: Product Review, Digital Delivery, Shipping, Profit Calculator, Refund, Shop Safety

**目的**: Eldonia-Nex SHOP モジュールの設計・実装・運用を担当するエージェント。**Amazon 型 EC UX** をベースに、Dark Fantasy（黒×金）のブランドアイデンティティを維持します。

**推奨実行モデル**: OpenAI Codex / Codex系モデル

**関連エージェント**:
- `agents/design/UI_UX_Designer.agent.md` — 共通トークン・タイポグラフィ
- `agents/development/Frontend_Manager.agent.md` — `src/app/shop/`, `src/components/shop/`
- `agents/development/Backend_Manager.agent.md` — `supabase/migrations/004_shop.sql`

---

## コンセプト: Amazon UX × Eldonia 世界観

| Amazon | Eldonia-Nex SHOP |
|--------|------------------|
| Amazon 検索バー | **Nexus 検索** — 全幅・金枠・ダーク面 |
| Departments | **Realms（領域）** — 左サイドカテゴリ |
| Amazon Prime | **Nexus Prime** — 金盾バッジ・高速配送/特典 |
| Amazon's Choice | **Nexus Choice** — おすすめ商品 |
| Best Seller | **Realm Bestseller** |
| Add to Cart / Buy Now | **カートに加える / 今すぐ購入**（Cinzel ボタン） |
| 星評価 | 金の星（★ `#c9a84c`） |
| 白背景・青CTA | **禁止** — 常に黒背景・金CTA |

**タグライン**: `Treasures of the Nexus`（ショップ副題）

---

## レイアウト規約

### 一覧 `/shop`

1. **Shop ツールバー** — ロゴ「SHOP」+ Nexus 検索 + カート導線
2. **2 カラム** — 左: Realms サイドバー / 右: ヒーロー帯 + 商品グリッド
3. **商品グリッド** — 2〜4 列、カードホバーで金枠強調
4. **フィルタ** — URL `?q=` `?category=` でサーバー側フィルタ

### 詳細 `/shop/[id]`

1. **左** — 商品画像（プレースホルダー可）
2. **右 Buy Box** — 価格・Prime 表示・在庫・CTA（Amazon 型）
3. **下** — 説明・仕様テーブル・レビュー枠（将来）

---

## カラーパレット（Shop 固有）

Shop は `UI_UX_Designer` のトークンを継承。追加:

| トークン | 用途 |
|---------|------|
| `.eldonia-shop-toolbar` | 検索行（`globals.css`） |
| `.eldonia-product-card` | 商品カード |
| `.eldonia-buy-box` | 詳細ページ購入パネル |
| `.eldonia-badge-nexus-prime` | Nexus Prime バッジ |
| `.eldonia-badge-nexus-choice` | Nexus Choice バッジ |

---

## コンポーネント（実装済み）

| パス | 説明 |
|------|------|
| `src/components/shop/shop-toolbar.tsx` | 検索・カート |
| `src/components/shop/shop-sidebar.tsx` | Realms カテゴリ |
| `src/components/shop/product-card.tsx` | 一覧カード |
| `src/components/shop/star-rating.tsx` | 星評価 |
| `src/components/shop/product-buy-box.tsx` | 詳細 Buy Box |
| `src/components/shop/shop-hero-strip.tsx` | おすすめ帯 |
| `src/lib/shop/constants.ts` | カテゴリ・価格フォーマット |
| `src/lib/shop/sample-products.ts` | デモ商品（DB 未適用時） |
| `src/lib/shop/get-products.ts` | Supabase + フォールバック |

---

## データモデル

**テーブル**: `shop_products`（`004_shop.sql`）

主要カラム: `title`, `category`, `product_type`, `price`, `compare_at_price`, `rating`, `review_count`, `is_nexus_prime`, `is_nexus_choice`, `is_bestseller`, `seller_id`

**RLS**: 公開商品は全員 SELECT、出品は seller のみ INSERT/UPDATE

---

## 新規画面チェックリスト

- [ ] 紫/白ベース UI を使っていない
- [ ] 検索・カテゴリが Amazon 型配置
- [ ] Nexus Prime / Choice 用語を使用（Prime 表記は使わない）
- [ ] `.eldonia-btn-primary` で CTA
- [ ] `npm run lint` + `npm run build` 成功
- [ ] マイグレーション未適用時もサンプル商品で表示

---

## 今後の拡張（バックログ）

1. カート・チェックアウト（Stripe）
2. クリエイター出品 `/shop/sell`
3. レビュー・Q&A
4. ウィッシュリスト
