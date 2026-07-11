# Shop Manager エージェント

**所属部署**: Shop Department  
**正本**: `agents/eldonia_nex_agent_departments.md` §9  
**機能提案書（詳細仕様）**: [Shop_Feature_Proposal.md](./Shop_Feature_Proposal.md) — §2.1 MVP ログ・§3 機能・§6 受け入れ条件・§7 フェーズ  
**MVP 優先度**: **高**  
**最終更新**: 2026-07-11

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
- [Shop_Feature_Proposal.md](./Shop_Feature_Proposal.md) — 機能提案書（配送・翻訳・受け入れ条件）
- `agents/design/UI_UX_Designer.agent.md` — 共通トークン・タイポグラフィ
- `agents/development/Frontend_Manager.agent.md` — `src/app/shop/`, `src/components/shop/`
- `agents/development/Backend_Manager.agent.md` — `supabase/migrations/004_shop.sql` 以降
- `agents/product/Gallery_Manager.agent.md` — 作品公開（無料配布）・Shop 連携は設定経由（§3.11）
- `agents/business/Revenue_Payment_Manager.agent.md` — Stripe Connect・返金（§3.13）
- `agents/business/Translation_Manager.agent.md` — 商品翻訳（§3.15）
- `agents/product/Fan_Notification_Manager.agent.md` — 購入後メール（§3.3）

---

## 本書と機能提案書の分担

| ドキュメント | 役割 |
|-------------|------|
| **Shop_Manager.agent.md**（本書） | エージェント運用・UX 規約・実装済み一覧・協議先 |
| **[Shop_Feature_Proposal.md](./Shop_Feature_Proposal.md)** | 機能提案の詳細（出品〜配送〜翻訳〜海外・DB 案・テスト・フェーズ） |

実装・Verify 時は [機能提案書 §6](./Shop_Feature_Proposal.md) 受け入れ条件をチェックリストとして使う。

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
| 白背景・青 CTA | **禁止** — 常に黒背景・金CTA |

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
3. **下** — 説明・仕様テーブル（発送目安・ライセンス）・レビュー枠（将来）

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
| `src/components/shop/shop-toolbar.tsx` | 検索・カート件数 |
| `src/components/shop/shop-sidebar.tsx` | Realms カテゴリ |
| `src/components/shop/product-card.tsx` | 一覧カード（**無料**価格表示） |
| `src/components/shop/star-rating.tsx` | 星評価 |
| `src/components/shop/product-buy-box.tsx` | Buy Box・無料即入手・DL |
| `src/components/shop/product-download-link.tsx` | デジタル DL ボタン |
| `src/components/shop/shop-hero-strip.tsx` | おすすめ帯 |
| `src/components/cart/add-to-cart-button.tsx` | カート追加 / buyNow / 無料即入手 |
| `src/components/cart/cart-checkout-panel.tsx` | カート決済（無料 / 送料 Stripe） |
| `src/components/cart/free-claim-button.tsx` | 無料入手 API |
| `src/components/cart/cart-nav-link.tsx` | ヘッダー カート件数バッジ |
| `src/components/settings/product-create-form.tsx` | 設定から商品登録 |
| `src/components/settings/settings-shop-management.tsx` | 商品管理・DL・削除 |
| `src/components/settings/settings-artwork-management.tsx` | 作品管理「SHOP で販売」 |
| `src/lib/shop/constants.ts` | カテゴリ・`formatProductPrice`（¥0→無料） |
| `src/lib/shop/get-products.ts` | 公開商品取得 |
| `src/lib/shop/get-user-products.ts` | 出品者商品一覧 |
| `src/lib/shop/artwork-product-prefill.ts` | 作品→商品 prefill |
| `src/lib/shop/product-download.ts` | DL URL（Client 安全） |
| `src/lib/shop/product-download-access.ts` | DL 権限（Server） |
| `src/lib/cart/resolve-cart.ts` | カート集計・送料・無料判定 |
| `src/lib/cart/shipping.ts` | 配送先・国内送料 ¥770 MVP |
| `src/lib/cart/order-items.ts` | 注文 items + shipping メタ |
| `src/lib/shop/sample-products.ts` | デモ商品（DB 未適用時） |

---

## API（実装済み）

| パス | 説明 |
|------|------|
| `src/app/api/cart/route.ts` | Cookie カート |
| `src/app/api/checkout/route.ts` | Stripe（送料 body 対応） |
| `src/app/api/checkout/free/route.ts` | 無料注文（`direct` 即入手） |
| `src/app/api/shop/products/[id]/route.ts` | 商品非公開 DELETE / 再公開 PATCH |
| `src/app/api/shop/products/[id]/download/route.ts` | デジタル DL |
| `src/app/shop/sell/page.tsx` | → `/settings/post/product` リダイレクト |

---

## 計画コンポーネント・ライブラリ（機能提案書準拠）

| パス | 説明 | 参照 |
|------|------|-----------|
| `src/app/settings/post/product/` | 商品登録フォーム（MVP） | §3.1 |
| `src/components/settings/product-create-form.tsx` | 登録 UI | §3.1 |
| `src/components/settings/settings-shop-management.tsx` | 設定内商品管理 | §3.1 |
| `src/app/shop/checkout/` | 届け先・確定送料・Stripe | §3.9 |
| `src/lib/shop/fees.ts` | 手数料・純利益試算 | §3.2, §3.6 |
| `src/lib/shop/shipping-carriers.ts` | 各社追跡 URL | §3.7 |
| `src/lib/shop/shipping-packaging.ts` | 業者別梱包プリセット | §3.8 |
| `src/lib/shop/shipping-zones.ts` | 国内・国際 zone | §3.9, §3.14 |
| `src/lib/shop/shipping-rates.ts` | 料金 lookup | §3.9, §3.10 |
| `data/shipping-rates.json` | 料金マスタ正本 | §3.10 |
| `scripts/sync-shipping-rates.mjs` | JSON → DB 同期 | §3.10 |
| `src/app/api/shop/shipping/` | rates / quote API | §3.9, §3.10 |

---

## 画面一覧（機能提案書 §5）

| パス | 状態 | 備考 |
|------|------|------|
| `/shop` | 実装済 | 一覧 |
| `/shop/[id]` | 実装済 | 詳細・Buy Box |
| `/shop/cart` | 実装済 | カート・無料入手・配送先 |
| `/checkout/success` | 実装済 | 決済/無料完了 |
| `/shop/checkout` | 計画 | §3.9 確定送料ページ |
| `/settings/post/product` | **実装済** | 商品登録（設定・MVP） |
| `/settings#shop` | **実装済** | 出品商品管理 |
| `/settings#artworks` | **実装済** | 作品管理から **SHOP で販売**（有料・無料 ¥0） |
| `/settings/post/product?from_artwork=` | **実装済** | 作品情報引き継ぎ |
| `/shop/sell` | **リダイレクト** | → `/settings/post/product` |
| `/shop/sell/[id]/edit` | 計画 | 編集・在庫 |
| `/gallery/[id]` Shop CTA | **非採用** | 作者操作は設定に集約 |
| `/shop/orders` | 計画 | 購入者注文・DL |
| `/shop/seller/orders` | 計画 | 受注・発送 |
| `/shop/seller/inventory` | 計画 | 在庫一覧 |
| `/shop/seller/revenue` | 計画 | 収益ダッシュボード |
| `/settings/shop` | 計画 | 出品者設定 |
| `/settings/shop/payouts` | 計画 | §3.13 Connect |

---

## データモデル

**現行テーブル**: `shop_products`（`004_shop.sql`）

主要カラム: `title`, `category`, `product_type`, `price`, `compare_at_price`, `rating`, `review_count`, `stock_quantity`, `is_nexus_prime`, `is_nexus_choice`, `is_bestseller`, `seller_id`

**RLS**: 公開商品は全員 SELECT、出品は seller のみ INSERT/UPDATE

**拡張（計画）**: [機能提案書 §4](./Shop_Feature_Proposal.md) — 梱包・注文・台帳・返品・デジタル DL・翻訳・海外配送

---

## 計画機能サマリ（機能提案書 §3）

| § | 機能 | 状態 |
|---|------|------|
| 3.1 | **設定から商品出品**（`/settings/post/product`） | **MVP 実装済** |
| 3.2 | 利益計算カリキュレーター | 計画 |
| 3.3 | 購入後メール・レビュー依頼 | 計画 |
| 3.4 | Amazon 型掲載 UX | 一部実装済 |
| 3.5 | 在庫管理（減算・欠品） | UI 一部済 |
| 3.6 | 収益計算・精算・ダッシュボード | 計画 |
| 3.7 | 配送各社追跡リンク | 計画 |
| 3.8 | 商品登録・業者別梱包 | 計画 |
| 3.9 | 国内送料・Checkout 確定 | **送料定額 MVP のみ** |
| 3.10 | 各社料金表更新 | 計画 |
| 3.11 | **設定・作品管理 → Shop** | **MVP 実装済** |
| 3.12 | **デジタル DL** | **MVP 実装済**（`image_url`）/ Storage 本番は計画 |
| 3.13 | **Stripe Connect + 返品 RMA** | 計画 P1 |
| 3.14 | **海外配送 DDU** | 計画 P2 |
| 3.15 | **商品翻訳 4 ロケール** | 計画 P1 |

---

## MVP 実装ログ（2026-07-11）

[機能提案書 §2.1](./Shop_Feature_Proposal.md) と同期。要点:

1. **出品入口**: 設定 `#shop` / `#posts` / `#artworks`（Gallery 詳細 CTA なし）
2. **無料 Shop**: ¥0 登録・「無料で入手」API・カート「無料」表示
3. **無料物理**: 配送先 + 送料 ¥770 のみ Stripe
4. **カート**: 件数バッジ（ヘッダー・ツールバー）、`canFreeCheckout` 分岐
5. **デジタル DL**: `/api/shop/products/[id]/download`（出品者 / paid 注文）
6. **商品管理**: 削除 = `is_active=false`、再公開 PATCH、DL ボタン
7. **作品引き継ぎ**: `?from_artwork=` prefill（`source_artwork_id` DB は未）

**Verify**: §6.1 / §6.12 / §6.13 / §6.17 の [x] 項目を回帰確認。

---

## 実装フェーズ（機能提案書 §7）

| フェーズ | 内容 |
|----------|------|
| **P0** | ~~設定出品 MVP~~（**済** §2.1） |
| **P0** | 多段ウィザード・梱包・利益計算・在庫・精算 |
| **P1** | 国内配送本番・Checkout・DL Storage・Connect・返品・翻訳 |
| **P2** | **海外配送**・料金改定バナー・離島・在庫一覧・レビュー |
| **P3** | 多通貨・DDP・Nexus Prime 海外 |

---

## 新規画面チェックリスト

- [ ] 紫/白ベース UI を使っていない
- [ ] 検索・カテゴリが Amazon 型配置
- [ ] Nexus Prime / Choice 用語を使用（Prime 単独表記は使わない）
- [ ] `.eldonia-btn-primary` で CTA
- [ ] `npm run lint` + `npm run build` 成功
- [ ] マイグレーション未適用時もサンプル商品で表示
- [ ] 該当機能の [機能提案書 §6](./Shop_Feature_Proposal.md) 受け入れ条件を満たす

---

## 未採用バックログ（機能提案書 §10）

- Lab 共同商品・Events 物販・出品者ストアfront
- 禁止商品チェック・権利侵害申立
- ウィッシュリスト・Q&A・SKU バリエーション・クーポン
- インボイス・発送前キャンセル・受注生産
- Nexus Prime 詳細・出品者アナリティクス・下書き公開

詳細は [機能提案書 §10](./Shop_Feature_Proposal.md)。

---

## Verify

- Lint / build: `npm run lint`, `npm run build`
- 受け入れ条件: [機能提案書 §6](./Shop_Feature_Proposal.md)
- 部署 Verify: `.cursor/skills/eldonia-verify/SKILL.md`（Shop タッチ時）
