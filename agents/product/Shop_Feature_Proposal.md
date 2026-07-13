# Shop 機能提案書

**ファイル**: `Shop_Feature_Proposal.md`  
**所属**: Shop Department  
**運用エージェント正本**: [Shop_Manager.agent.md](./Shop_Manager.agent.md)  
**ステータス**: 提案 + **MVP 部分実装済**（2026-07-11 更新）  
**最終更新**: 2026-07-11（設定出品・無料決済・DL・商品管理）

---

## 1. 概要

Eldonia-Nex SHOP を **Amazon 型 EC UX**（検索・カテゴリ・Buy Box・カート）のまま、クリエイターが **自主出品** できるマーケットプレイスへ拡張する。出品者は商品情報を登録し、販売前に **純利益を試算** できる。購入後は **サンキューメール → 発送通知 → 到着後フィードバック** の標準フローで購入体験を完結させる。

**採用拡張**: Gallery 連携、デジタル配布、Connect・返品、**海外配送（DDU）**、**4 言語商品翻訳**（§3.11〜§3.15）。

**タグライン**: `Treasures of the Nexus`

---

## 2. 現状（実装済み）

| 領域 | 内容 | パス |
|------|------|------|
| 一覧 | Nexus 検索・Realms サイドバー・商品グリッド | `/shop` |
| 詳細 | Buy Box・仕様テーブル・出品者名・**無料/入手済 DL** | `/shop/[id]` |
| カート | Cookie カート・合計（**¥0 は「無料」表示**）・Checkout / 無料入手 | `/shop/cart` |
| カートバッジ | ヘッダー・Shop ツールバーに **件数**（金額に依存しない） | `site-header`, `shop-toolbar` |
| **設定出品** | 商品登録・商品管理・作品→Shop 引き継ぎ | `/settings#shop`, `/settings/post/product` |
| **無料決済** | 合計 ¥0 → Stripe なし API / 物理無料は送料のみ | `/api/checkout/free` |
| **デジタル DL（MVP）** | `image_url` 経由・出品者/購入済みのみ | `/api/shop/products/[id]/download` |
| **商品非公開** | 設定から削除（`is_active=false`、物理削除なし） | `DELETE /api/shop/products/[id]` |
| データ | `shop_products`（physical / digital） | `004_shop.sql` |
| フォールバック | DB 未適用時サンプル商品 | `sample-products.ts` |

**未実装（本提案の対象）**: 多段出品ウィザード、利益計算、梱包マスタ、注文メール、レビュー、署名付き DL Storage、Connect。  
**採用済み拡張（§3.11〜§3.15）**: 設定経由 Gallery 引き継ぎ（§3.11 一部）、デジタル DL（§3.12 MVP）、返品・Connect、**海外配送**、**翻訳**（未実装）。

---

### 2.1 MVP 更新ログ（2026-07-11）

本セッションで合意・実装した内容の正本。

#### 方針決定

| 項目 | 決定 |
|------|------|
| 商品登録の正本 | **ユーザー設定** `/settings/post/product`（Gallery 作品詳細からは **非採用**） |
| 無料配布 | Gallery 公開と **併用可**。Shop に **¥0** で掲載 |
| 有料販売 | 同上 + 通常 Stripe Checkout |
| 作品→Shop | **設定 → 作品管理**「SHOP で販売」のみ（`?from_artwork=`） |
| データ削除 | 商品 **物理削除しない**。`is_active = false` で非公開（§23） |

#### 実装コンポーネント・API

| 区分 | パス | 説明 |
|------|------|------|
| 商品登録 | `src/app/settings/post/product/page.tsx` | フォーム・無料チェック・作品 prefill |
| 商品管理 | `src/components/settings/settings-shop-management.tsx` | 一覧・DL・削除/再公開 |
| 作品管理 | `src/components/settings/settings-artwork-management.tsx` | 「SHOP で販売」ボタン |
| 登録フォーム | `src/components/settings/product-create-form.tsx` | INSERT `shop_products` |
| 作品 prefill | `src/lib/shop/artwork-product-prefill.ts` | タイトル・説明・画像・種別 |
| Buy Box | `src/components/shop/product-buy-box.tsx` | 無料デジタル即入手・DL |
| カート決済 | `src/components/cart/cart-checkout-panel.tsx` | 無料入手 / 送料 Stripe |
| 無料入手 | `src/components/cart/free-claim-button.tsx` | `POST /api/checkout/free` |
| カート追加 | `src/components/cart/add-to-cart-button.tsx` | カート / buyNow / 無料即入手 |
| カートバッジ | `src/components/cart/cart-nav-link.tsx` | ヘッダー件数 |
| DL リンク | `src/components/shop/product-download-link.tsx` | デジタル DL UI |
| カート集計 | `src/lib/cart/resolve-cart.ts` | 小計・送料・`canFreeCheckout` |
| 国内送料 MVP | `src/lib/cart/shipping.ts` | 定額 **¥770/注文** |
| DL 権限 | `src/lib/shop/product-download-access.ts` | 出品者 or `paid` 注文 |
| DL ユーティリティ | `src/lib/shop/product-download.ts` | URL 解決・Client 安全 |
| 出品者商品 | `src/lib/shop/get-user-products.ts` | 設定 `#shop` 一覧 |
| 互換リダイレクト | `src/app/shop/sell/page.tsx` | → `/settings/post/product` |

| API | メソッド | 説明 |
|-----|----------|------|
| `/api/cart` | GET/POST | Cookie カート add/remove/clear |
| `/api/checkout` | POST | Stripe（有料・**送料のみ**）。`shipping` body |
| `/api/checkout/free` | POST | 合計 ¥0 注文（デジタル）。`direct` で即入手 |
| `/api/shop/products/[id]` | DELETE/PATCH | 非公開 / 再公開 |
| `/api/shop/products/[id]/download` | GET | デジタル DL リダイレクト |

#### 購入フロー（MVP）

```text
【有料】商品詳細 → カート → Stripe Checkout → /checkout/success

【無料デジタル】
  商品詳細「無料で入手」→ POST /api/checkout/free（direct）→ success
  または カート → 合計「無料」→「無料で入手」

【無料物理】
  カート → 配送先入力 → 送料 ¥770 のみ Stripe → success
  （商品代 ¥0 + DEFAULT_DOMESTIC_SHIPPING_YEN）

【デジタル DL】
  出品者 or paid 注文後 → GET /api/shop/products/[id]/download
  （現状配布元 = image_url。§3.12 Storage は未接続）
```

#### 未実装・次ステップ

- `source_artwork_id` カラム保存（§3.11 DB）
- 専用 `shop-digital/` Storage・署名 URL・回数制限（§3.12 本番）
- 利益計算・梱包ウィザード・料金マスタ（§3.2 / §3.8 / §3.10）
- 都道府県別送料（現状国内定額 ¥770 のみ）
- 購入者向け `/shop/orders/[id]` DL 画面
- Gallery 作品詳細の Shop CTA（**意図的に非採用**）

---

## 3. 機能提案

### 3.1 商品出品（クリエイター自主掲載）

出品者が **ユーザー設定** の `/settings/post/product` から商品を登録し、審査なしで **即時公開**（MVP）。設定トップ `/settings#shop` からも同画面へ誘導する。将来の多段ウィザードは `/shop/sell`（リダイレクト先は上記）で拡張可能。将来 Moderation でフラグ審査を追加可能。

#### 配布と販売の使い分け（MVP）

| 目的 | 手段 | 備考 |
|------|------|------|
| **無料配布（デジタル）** | Shop **¥0** 登録 → **無料で入手** API | Stripe 不要。カート合計 ¥0 |
| **無料配布（物理）** | Shop **¥0** 登録 + **配送先** + **送料**（MVP ¥770 定額） | 送料のみ Stripe |
| **有料販売** | 価格付き登録 | 通常 Stripe Checkout |

Gallery **作品詳細ページ**（`/gallery/[id]`）に Shop 導線は **付けない**（作者向け操作は設定に集約）。

#### 入力項目

| 区分 | 項目 | 必須 | 備考 |
|------|------|:----:|------|
| 基本 | 商品名 | ○ | 1〜120 文字（既存制約） |
| 基本 | 説明文 | ○ | 特徴・用途・注意事項 |
| 基本 | 領域（Realm） | ○ | apparel / digital / goods / tools / books |
| 基本 | 商品種別 | ○ | physical / digital |
| 価格 | 販売価格（税込） | ○ | 整数円。**0 = 無料配布**（Shop 掲載） |
| 価格 | 参考価格（定価） | — | 割引率表示用 |
| 画像 | メイン画像 | ○ | 1 枚以上 |
| 画像 | ギャラリー | — | 最大 8 枚 |
| 物販 | サイズ・寸法 | 物販時 | 例: `W210×H297mm` / `Free` |
| 物販 | 主原料・素材 | 物販時 | 例: 綿 100%、アクリル、レザー |
| 物販 | 在庫数 | 物販時 | null = 在庫管理なし |
| 物販 | 配送業者・梱包方法 | 物販時 | §3.8。利益計算の送料目安に連動 |
| 物販 | 重量・送料目安 | — | 梱包プリセットから自動入力可 |
| デジタル | 配布ファイル / ライセンス | デジタル時 | Digital Delivery Sub Agent |
| 共通 | タグ | — | 検索補助 |

#### 出品フロー（MVP 実装済）

```text
設定 #shop または #posts → /settings/post/product
  → 基本情報（名前・Realm・説明・種別）
  → 価格（「無料配布 ¥0」チェック可）
  → 画像 URL
  → shop_products INSERT → /shop/[id]
```

**計画（未実装）** — Amazon 型多段ウィザード:

```text
種別選択（物販 / デジタル）
  → 基本情報（名前・Realm・説明）
  → 画像アップロード
  → 価格・在庫（種別に応じた項目のみ）
  → 配送・梱包（物販のみ: 業者別梱包プリセット §3.8）
  → 利益プレビュー（§3.2）
  → 公開確認 → shop_products INSERT
```

Gallery の upload-wizard と同様、将来は **種別を先に選び、該当ステップだけ表示** する。

---

### 3.2 利益計算カリキュレーター

出品画面および商品編集画面に常設。販売価格から **送料・プラットフォーム手数料・決済手数料** を差し引いた **出品者の受取見込み（純利益）** をリアルタイム表示する。

#### 計算式

```text
純利益 = 販売価格 − 送料（出品者負担分）− Eldonia 手数料 − 決済手数料
```

| 項目 | ルール |
|------|--------|
| Eldonia 手数料 | 出品者プラン × 商品種別（[Shop_Manager](./Shop_Manager.agent.md) 採用済み表） |
| 送料 | **手数料対象外**（Eldonia 手数料は送料にかけない） |
| 決済手数料 | Stripe 等の実費を別途表示（概算 3.6% 等、Revenue/Payment と同期） |
| デジタル | 送料 0。手数料率はデジタル列を適用 |
| 物販 | 送料入力 or 配送テンプレートから自動 |

#### 手数料表（再掲）

| プラン | デジタル | 物販・送料あり |
|--------|--------:|-------------:|
| Free | 25% | 12% |
| Standard | 20% | 10% |
| Premium | 15% | 8% |
| Business | 10% | 5% |

#### UI 要件

- 価格入力と連動して **内訳テーブル** を更新（販売価格 / 手数料 / 送料 / 決済 / **あなたの受取**）
- 「この価格で公開してよいか」の判断材料として **警告しきい値**（例: 純利益 < 0 で公開ボタン無効）
- Sub Agent: **Profit Calculator**

---

### 3.3 購入後メール・到着後フィードバック

Fan Notification / メール基盤（さくら SMTP、`docs/12_メール・Supabase Auth運用設定書.md`）と連携。

| タイミング | メール | 送信先 | 主な内容 |
|------------|--------|--------|----------|
| 決済完了 | **サンキューメール** | 購入者 | 注文番号・商品名・合計・領収書リンク |
| 決済完了 | **新規注文通知** | 出品者 | 注文概要・発送期限の目安 |
| 発送時 | **商品発送メール** | 購入者 | 追跡番号・配送業者・到着予定 |
| 配達完了 + N 日 | **感想・レビュー依頼** | 購入者 | 星評価 + 短文レビュー URL（`/shop/[id]#review`） |
| デジタル即時 | **ダウンロード案内** | 購入者 | 署名付き URL・有効期限 |

#### 到着後フィードバック

- 購入確定から **7 日後**（設定可）にレビュー依頼メールを 1 回送信
- レビュー投稿で `shop_products.rating` / `review_count` を更新（将来 `shop_reviews` テーブル）
- 未投稿でも再送は最大 1 回まで（スパム防止）

Sub Agents: **Digital Delivery**, **Shipping**, **Product Review**

---

### 3.4 Shop への掲載（Amazon Like × Eldonia 世界観）

一覧・詳細は **Amazon 型レイアウト** を維持し、用語とビジュアルだけ Eldonia 化する。出品商品も同一グリッドに混在表示（マーケットプレイス）。

| Amazon | Eldonia-Nex |
|--------|-------------|
| Departments | **Realms**（左サイドバー） |
| Amazon Prime | **Nexus Prime** |
| Amazon's Choice | **Nexus Choice** |
| Best Seller | **Realm Bestseller** |
| 白背景・青 CTA | **黒背景・金 CTA**（禁止: 紫/白ベース Shop UI） |

#### 掲載ルール

- `is_active = true` の商品のみ公開 SELECT（RLS 既存）
- 検索 `?q=`・カテゴリ `?category=` はサーバー側フィルタ（既存）
- 出品者プロフィール（`profiles`）から **ショップ名・出品一覧** へリンク
- Works / Gallery から「Shop で販売」導線（**P2 任意** — 正本入口は設定 §3.1）

---

### 3.5 在庫管理機能

物販商品の **在庫数の登録・自動減算・欠品制御** を行う。デジタル商品は在庫管理対象外（無制限販売）。

#### 在庫モード

| モード | `stock_quantity` | 用途 |
|--------|------------------|------|
| **在庫管理あり** | 0 以上の整数 | 限定数・受注生産・在庫品 |
| **在庫管理なし** | `null` | 受注都度制作・在庫∞扱い（Buy Box は常に購入可） |

既存スキーマ `shop_products.stock_quantity` をそのまま利用。Buy Box は `stock_quantity > 0` または `null` で購入ボタン有効（`product-buy-box.tsx` 実装済み）。

#### 在庫ライフサイクル

```text
出品登録（初期在庫 N）
  → カート追加（在庫はまだ減らない）
  → Checkout 開始（任意: 在庫仮押さえ 15 分）
  → 決済成功 Webhook → 在庫確定減算（quantity 分）
  → 在庫 0 → Buy Box「在庫切れ」・カート追加不可
  → キャンセル・返金承認 → 在庫戻し（監査ログ付き）
```

| イベント | 在庫操作 | 備考 |
|----------|----------|------|
| 決済成功 | `stock_quantity -= 注文数量` | DB トランザクション内で実行 |
| 決済失敗・タイムアウト | 仮押さえ解除 | 在庫数は変化なし |
| 返金（全額） | 在庫戻し | 再販可。部分返金は数量に応じて |
| 出品者手動調整 | ± 入力 | `/shop/sell/[id]/edit`、理由を監査ログに記録 |
| 入荷・補充 | 加算 | 同一画面または `/shop/seller/inventory` |

#### 出品者向け UI

| 機能 | 説明 |
|------|------|
| 在庫一覧 | 全出品商品の現在庫・直近 7 日販売数 |
| 一括更新 | CSV インポート（フェーズ 2） |
| 低在庫アラート | しきい値以下でメール / 通知（デフォルト 5 個） |
| 自動非公開 | 在庫 0 かつ「欠品時非公開 ON」のとき `is_active = false`（任意） |

#### 同時購入（競合）対策

- 決済確定時に `UPDATE ... WHERE stock_quantity >= :qty` で **楽観的ロック**
- 不足時は Checkout をエラーにし、購入者へ「在庫不足」を表示
- デジタルは在庫チェックをスキップ

Sub Agent: **Shipping**（物販在庫）、在庫テーブル拡張時は Backend 協議

---

### 3.6 収益計算・精算

**2 層** に分ける。

1. **販売前試算**（§3.2 利益計算カリキュレーター）— 出品者が価格設定時に使う  
2. **販売後収益**（本節）— 注文確定後の売上・手数料・受取の記録と集計

#### 用語

| 用語 | 定義 |
|------|------|
| **売上（Gross）** | 購入者が支払った商品代金（税込）。送料を別行にした場合は商品行のみ |
| **Eldonia 手数料** | 売上 × プラン別率（デジタル / 物販列） |
| **決済手数料** | Stripe 実費（売上 + 送料に対する % + 固定） |
| **出品者受取（Net）** | 売上 − Eldonia 手数料 − 決済手数料 − 出品者負担送料 |
| **プラットフォーム収益** | Eldonia 手数料の合計（Admin / Django 集計） |

送料は **Eldonia 手数料の計算基数に含めない**（Shop_Manager 採用済みルール）。

#### 1 件あたりの計算式（物販・送料別行の例）

```text
商品売上     = unit_price × quantity
Eldonia 手数料 = floor(商品売上 × fee_rate)        -- 送料は対象外
決済手数料   = stripe_fee(商品売上 + 送料)          -- Revenue/Payment 正本
出品者受取   = 商品売上 − Eldonia 手数料 − 決済手数料の按分 − 出品者負担送料
```

デジタルは送料 0、`fee_rate` はデジタル列。

#### 記録タイミング

| タイミング | 処理 |
|------------|------|
| Stripe `checkout.session.completed` | `shop_orders` + `shop_order_items` 作成 |
| 同上 | `shop_ledger_entries` に gross / fee / net を **注文行ごと** に記録 |
| 返金 Webhook | マイナス行を追加（元取引へのリンク） |
| 月次締め | 出品者 **出金可能残高** を確定（チャージバック猶予 14 日等） |

#### 出品者ダッシュボード（`/shop/seller/revenue`）

| 表示 | 内容 |
|------|------|
| 今月の受取見込み | 確定済み Net − 返金 − 保留 |
| 内訳 | 売上 / Eldonia 手数料 / 決済手数料 / 送料 |
| 商品別ランキング | 販売数・Net 順 |
| 注文履歴 | 注文番号・日付・Net・ステータス |
| エクスポート | CSV（会計・確定申告用、フェーズ 2） |

#### プラットフォーム側（Admin / Django）

- 月次 **GMV**・**手数料収入**・**決済コスト**（Revenue Dashboard Sub Agent）
- プラン別・Realm 別の集計
- 大きな返金・手数料変更は **人間承認**（§22）

#### §3.2 との関係

| | 利益計算カリキュレーター（§3.2） | 収益計算・精算（§3.6） |
|--|--------------------------------|------------------------|
| タイミング | 出品・価格変更時 | 決済確定後 |
| 目的 | 価格設定の判断 | 売上・出金の正本 |
| データ | クライアント試算 + 同一式をサーバー検証 | `shop_ledger_entries` |
| 送料 | 出品者入力の目安 | 注文確定時の実額 |

試算と実績で **同一の fee_rate ロジック**（`src/lib/shop/fees.ts` 等）を共有し、表示差異を防ぐ。

Sub Agents: **Profit Calculator**（試算）、**Fee Calculation**（Revenue）、**Payout**（出金）

---

### 3.7 配送状況・各社追跡リンク

出品者が発送登録時に **配送業者 + 追跡番号** を入力すると、購入者向け画面・メールに **業者公式の追跡 URL** を自動生成して表示する。MVP は日本国内の主要 4 社 + その他。

#### 表示箇所

| 場所 | 内容 |
|------|------|
| `/shop/orders/[id]` | 業者名・追跡番号・「配送状況を確認」リンク（新規タブ） |
| 発送メール（§3.3） | 同上 + 到着目安 |
| `/shop/seller/orders` | 出品者の発送登録フォーム（業者プルダウン + 番号入力） |

#### 業者マスタ（`src/lib/shop/shipping-carriers.ts` 想定）

`carrier` は enum。URL は `{tracking_number}` を URL エンコードして差し替え。

| ID | 表示名 | 追跡 URL テンプレート | 番号例 |
|----|--------|----------------------|--------|
| `yamato` | ヤマト運輸（クロネコ） | `https://toi.kuronekoyamato.co.jp/cgi-bin/tneko?number={tracking_number}` | 12 桁前後 |
| `sagawa` | 佐川急便 | `https://k2k.sagawa-exp.co.jp/p/web/okurijoinput?okurijoNo={tracking_number}` | 10〜12 桁 |
| `japanpost` | 日本郵便（ゆうパック等） | `https://trackings.post.japanpost.jp/services/srv/search/direct?reqCodeNo1={tracking_number}&searchKind=S002&locale=ja` | 11〜13 桁 |
| `seino` | 西濃運輸 | `https://inquiry.seino.co.jp/ssx/search/search.html?NO={tracking_number}` | 10 桁 |
| `fukuyama` | 福山通運 | `https://corp.fukutsu.co.jp/situation/tracking_no_hunt/{tracking_number}` | 10〜20 桁 |
| `letterpack` | レターパック | `japanpost` と同一 URL | 12 桁 |
| `yu_packet` | ゆうパケット | `japanpost` と同一 URL | 11〜13 桁 |
| `dhl` | DHL（海外） | `https://www.dhl.com/jp-ja/home/tracking.html?tracking-id={tracking_number}` | 10 桁 |
| `fedex` | FedEx | `https://www.fedex.com/fedextrack/?trknbr={tracking_number}` | 12 桁 |
| `ups` | UPS | `https://www.ups.com/track?tracknum={tracking_number}` | 18 桁 |
| `other` | その他 | 出品者が `tracking_url` を手入力 | — |

#### 実装ルール

```typescript
// 例: buildTrackingUrl(carrier, trackingNumber, customUrl?)
// - carrier !== 'other' → テンプレートから生成
// - carrier === 'other' → shop_shipments.tracking_url をそのまま使用
// - 番号は trim + ハイフン除去してから encodeURIComponent
```

- リンクは **外部公式サイト** へ `target="_blank" rel="noopener noreferrer"`
- 追跡番号のバリデーションは業者ごとに **緩め**（桁数警告のみ、登録は可能）
- 日本郵便系（`japanpost` / `letterpack` / `yu_packet`）は同一トラッカー URL を共有
- 業者 URL 変更時は `shipping-carriers.ts` のみ更新（DB マイグレーション不要）

#### DB（`shop_shipments` 拡張）

```sql
-- carrier: text not null  -- shipping-carriers の ID
-- tracking_number: text not null
-- tracking_url: text       -- other 時必須。それ以外は生成値をキャッシュ可
-- shipped_at, delivered_at
```

#### UI（Amazon 型）

注文詳細の配送ブロック例:

```text
配送業者: ヤマト運輸
追跡番号: 1234-5678-9012
[ 配送状況を確認 → ]   ← eldonia-link、公式サイトへ
```

Sub Agent: **Shipping**

---

### 3.8 商品登録時の配送業者別梱包方法

物販出品ウィザードの **「配送・梱包」ステップ** で、出品者が使う配送業者と **梱包サイズ（サービス種別）** を登録する。§3.2 の送料目安・§3.7 の発送登録の **デフォルト値** として使う。

#### 登録 UI

| 項目 | 必須 | 説明 |
|------|:----:|------|
| 主配送業者 | ○ | 1 つ選択（発送時の初期値） |
| 梱包プリセット | ○ | 業者に応じたプルダウン（下表） |
| 商品重量（g） | △ | プリセット上限を超える場合は手入力 |
| 追加梱包 | — | 複数業者対応可（サブオプション、最大 3） |
| 梱包メモ | — | 例: 筒梱包・二重箱・割れ物注意 |
| 送料目安（円） | — | **登録時点の最新料金表**から自動（§3.10）。手動上書き可 |

```text
[ 配送業者 ▼ ヤマト運輸 ]
[ 梱包方法 ▼ 宅急便 60サイズ ]
  料金表: 2026-04-01 版（各社改定に追随）
  送料目安: 同一県 ¥880 / 全国通常 ¥1,080 / 北海道・沖縄 ¥1,280
  [ 最新料金に更新 ]  ← ウィザード表示時は自動取得
[ + 別業者の梱包を追加 ]  （任意）
```

商品詳細 `/shop/[id]` の仕様表に **「発送の目安」** として表示（購入者向け。確定送料ではない）。

#### 梱包プリセットマスタ（`src/lib/shop/shipping-packaging.ts` 想定）

§3.7 の `carrier` ID と対応。`packaging_id` + サイズ上限 + 重量上限 + **全国同サイズの送料目安（参考）**。

##### ヤマト運輸（`yamato`）

| packaging_id | 表示名 | サイズ・重量目安 | 用途 |
|--------------|--------|------------------|------|
| `yamato_nekopos` | ネコポス | A4 厚さ 3cm / 1kg | ステッカー・小冊子・薄いグッズ |
| `yamato_compact` | 宅急便コンパクト | 専用箱 / 2kg | 小物・アクスタ |
| `yamato_60` | 宅急便 60 サイズ | 三方合計 60cm / 2kg | 標準小箱 |
| `yamato_80` | 宅急便 80 サイズ | 80cm / 5kg | 書籍数冊・衣類 |
| `yamato_100` | 宅急便 100 サイズ | 100cm / 10kg | 版画・中型グッズ |
| `yamato_120` | 宅急便 120 サイズ | 120cm / 15kg | 大型ポスター・複数点 |
| `yamato_cool` | クール宅急便 | 60〜100 サイズ相当 | 要冷蔵・要冷凍（メモ必須） |

##### 佐川急便（`sagawa`）

| packaging_id | 表示名 | サイズ・重量目安 | 用途 |
|--------------|--------|------------------|------|
| `sagawa_yu_mail` | 飛脚ゆうメール便 | 34×25×3cm / 1kg | 薄型同梱物 |
| `sagawa_60` | 飛脚宅配便 60 サイズ | 60cm / 2kg | 小箱 |
| `sagawa_80` | 飛脚宅配便 80 サイズ | 80cm / 5kg | 中箱 |
| `sagawa_100` | 飛脚宅配便 100 サイズ | 100cm / 10kg | 大箱 |
| `sagawa_large` | 飛脚ラージサイズ | 140cm 超〜260cm | 傘・長物（要相談表示） |

##### 日本郵便（`japanpost` / `yu_packet` / `letterpack`）

| packaging_id | 表示名 | サイズ・重量目安 | 用途 |
|--------------|--------|------------------|------|
| `jp_clickpost` | クリックポスト | A4 厚さ 3cm / 1kg | 最安・薄型 |
| `jp_yu_packet` | ゆうパケット | 34×25×3cm / 1kg | ポスト投函系 |
| `jp_yu_packet_plus` | ゆうパケットプラス | 縦長・厚み制限あり | タペストリー等 |
| `jp_yu_pack_60` | ゆうパック 60 サイズ | 60cm / 2kg | 標準 |
| `jp_yu_pack_80` | ゆうパック 80 サイズ | 80cm / 5kg | 中型 |
| `jp_letterpack` | レターパック | 340×248mm 以内 | 書類・薄い商品（`letterpack`） |

##### 西濃・福山（`seino` / `fukuyama`）

| packaging_id | 表示名 | 備考 |
|--------------|--------|------|
| `seino_standard` | カンガルー便 標準 | 60〜100 サイズ相当から選択 |
| `fukuyama_standard` | 福山通運 宅配 | エリア・サイズにより要見積もり |

##### その他（`other`）

| packaging_id | 表示名 | 備考 |
|--------------|--------|------|
| `other_custom` | 独自梱包 | サイズ・送料を手入力。発送時も §3.7 `other` |

#### ビジネスルール

- **1 商品に主梱包 1 件必須**（`is_default = true`）。追加梱包は「同一商品を別サイズで送れる場合」のみ
- プリセット選択で `weight_grams` と **送料目安** を §3.2 に自動反映（出品者が上書き可）
- 割れ物・液体・生ものは梱包メモに必須チェック項目（Shop Safety 協議）
- 発送登録（§3.7）時、注文の **デフォルト業者・梱包** を商品マスタから引き継ぎ、変更可
- 送料目安は **参考値**（離島・サイズ超過は購入者へ Checkout 前に注記）

詳細な地域別料金・Checkout 確定ロジックは **§3.9**。

#### DB

```sql
-- 商品ごとの配送・梱包（1 商品 n 行、default は 1 件）
-- shop_product_shipping_options (
--   id, product_id, carrier, packaging_id,
--   weight_grams, estimated_shipping_yen,
--   packaging_note text, is_default boolean,
--   created_at, updated_at
-- )
```

#### 他セクションとの関係

| セクション | 連携 |
|------------|------|
| §3.2 利益計算 | `estimated_shipping_yen` を出品者負担送料の初期値に |
| §3.7 追跡リンク | 発送時 `carrier` の初期値 |
| §3.1 商品詳細 | 仕様表「発送の目安」に業者名 + 梱包名を表示 |
| §3.9 送料計算 | 梱包プリセット ID → 地域別料金の lookup キー |
| §3.10 料金更新 | 登録・編集時に最新 `shipping_rates` を取得して目安を反映 |

Sub Agent: **Shipping**, **Profit Calculator**

---

### 3.9 送料目安（地域別）と Checkout 確定送料

§3.8 の梱包プリセットをキーに、**出品者の発送元都道府県** と **購入者の届け先** から送料を算出する。出品時は目安、Checkout 時は **確定額** を Stripe 合計に含める。

#### 送料負担モデル（出品者が商品ごとに選択）

| ID | 表示名 | 購入者 Checkout | §3.2 出品者試算 |
|----|--------|-----------------|-----------------|
| `buyer_pays` | 購入者負担（標準） | 送料行を加算 | 送料 0（出品者負担なし） |
| `seller_pays` | 送料込み（出品者負担） | 送料 0 表示 | 送料を純利益から控除 |
| `free_over` | ¥X 以上で送料無料 | 条件達成で 0、未達で buyer_pays | 未達時は seller_pays と同試算 |

デフォルト: `buyer_pays`。

#### 地域ゾーン（`src/lib/shop/shipping-zones.ts` 想定）

47 都道府県を **5 ゾーン** に集約。MVP はマスタ JSON、将来は Django Admin で加算額編集可。

| zone_id | 名称 | 対象例 |
|---------|------|--------|
| `local` | 同一地方 | 発送元と同一都道府県 |
| `near` | 近隣 | 隣接都道府県（発送元から 1 段） |
| `standard` | 本州・四国・通常 | 上記以外の本州・四国・対馬等 |
| `distant` | 北海道・沖縄本島 | 北海道全域、沖縄本島 |
| `remote` | 離島・小規模離島 | 奄美離島、小笠原、利島等（下表参照） |

**離島判定**: 届け先郵便番号を `remote_postal_codes` プレフィックスリストと照合。該当時は `remote` 固定（または **Checkout ブロック + 「お問い合わせ」**）。

##### 離島・追加料金が発生しやすい地域（参考）

| 区分 | 例 | MVP 扱い |
|------|-----|----------|
| 沖縄本島 | 900〜901 頭 | `distant` 加算 |
| 沖縄離島 | 907 等 | `remote` 加算 or 配送不可 |
| 奄美・トカラ | 894, 891 等 | `remote` |
| 小笠原 | 100-2101 | `remote` または配送不可 |
| 北海道 | 040〜099 | `distant` |
| その他離島 | 郵便番号マスタ | `remote_postal_codes` で自動 |

#### 地域別送料テーブル（目安・同一業者内）

`packaging_id` × `zone_id` → **参考送料（円）**。数値は **2026 年時点の概算**、年 1 回見直し（Revenue 承認）。

##### ヤマト運輸 — 宅急便系（円・税込目安）

| packaging_id | local | near | standard | distant | remote |
|--------------|------:|-----:|---------:|--------:|-------:|
| `yamato_nekopos` | 385 | 385 | 385 | 385 | 485 |
| `yamato_compact` | 450 | 520 | 580 | 680 | 880 |
| `yamato_60` | 880 | 980 | 1,080 | 1,280 | 1,580 |
| `yamato_80` | 1,080 | 1,180 | 1,280 | 1,480 | 1,880 |
| `yamato_100` | 1,380 | 1,480 | 1,580 | 1,880 | 2,280 |
| `yamato_120` | 1,780 | 1,880 | 1,980 | 2,380 | 2,880 |

##### 佐川急便 — 飛脚宅配便（円・税込目安）

| packaging_id | local | near | standard | distant | remote |
|--------------|------:|-----:|---------:|--------:|-------:|
| `sagawa_yu_mail` | 330 | 330 | 330 | 330 | 430 |
| `sagawa_60` | 850 | 950 | 1,050 | 1,250 | 1,550 |
| `sagawa_80` | 1,050 | 1,150 | 1,250 | 1,450 | 1,850 |
| `sagawa_100` | 1,350 | 1,450 | 1,550 | 1,850 | 2,250 |

##### 日本郵便 — ゆうパック系（円・税込目安）

| packaging_id | local | near | standard | distant | remote |
|--------------|------:|-----:|---------:|--------:|-------:|
| `jp_clickpost` | 185 | 185 | 185 | 185 | 285 |
| `jp_yu_packet` | 430 | 430 | 430 | 430 | 530 |
| `jp_yu_pack_60` | 770 | 870 | 970 | 1,170 | 1,470 |
| `jp_yu_pack_80` | 970 | 1,070 | 1,170 | 1,370 | 1,770 |
| `jp_letterpack` | 430 | 430 | 430 | 430 | 530 |

ネコポス・ゆうパケット等 **全国一律料金** のサービスはゾーン差なし（離島のみ加算）。

#### 出品者発送元

| 項目 | 保存先 | 用途 |
|------|--------|------|
| 発送元都道府県 | `profiles.ship_from_prefecture` または `/settings/shop` | ゾーン判定の起点 |
| 発送元郵便番号 | 任意 | より精密な zone 判定（フェーズ 2） |

未設定時: 出品者のプロフィール `prefecture` → なければ `standard` 基準で目安表示。

#### Checkout 確定送料ロジック

```text
/shop/cart
  → [ レジに進む ]（ログイン必須）
  → /shop/checkout
      1. 届け先入力（都道府県 + 郵便番号 必須）
      2. カートを seller_id でグループ化
      3. 各商品: default packaging_id + ship_from → zone → lookup 送料
      4. 同一出品者・同一 zone 内は「最大送料 1 件」にまとめ（同梱）
      5. 複数出品者 → 送料行を出品者別に表示
      6. free_over 判定 → 送料 0 に更新
      7. 合計 = 商品小計 + 確定送料 → Stripe Checkout Session
```

##### 計算 API（サーバー側）

```typescript
// POST /api/shop/shipping/quote
// Input:  items[{ productId, quantity }], shipTo: { postalCode, prefecture }
// Output: { lines[{ sellerId, productId, packagingId, zone, yen }], totalShippingYen }

function resolveShippingZone(
  shipFromPrefecture: string,
  shipTo: { postalCode: string; prefecture: string },
): ShippingZone;

function quoteShipping(
  packagingId: string,
  zone: ShippingZone,
): number; // shipping-rates.json から lookup

function consolidateBySeller(lines): SellerShippingLine[];
// 同一 seller + 同一 checkout では max(shipping) を 1 回のみ課金
```

##### Checkout UI（Amazon 型）

```text
── 出品者: @creator_a ──
  商品 A  ×1     ¥3,000
  商品 B  ×1     ¥1,500
  送料（宅急便60・standard）  ¥1,080
── 出品者: @creator_b ──
  商品 C  ×1     ¥800
  送料（ネコポス・全国一律）   ¥385
────────────────────
  小計           ¥5,300
  送料合計       ¥1,465
  お支払い合計   ¥6,765
  [ Stripe で支払う ]
```

- 郵便番号変更で **送料を再計算**（クライアント debounce → API）
- `remote` かつ `delivery_blocked: true` の商品は Checkout 不可 + 理由表示
- 確定送料は `shop_orders.shipping_total` と `shop_order_items.shipping_yen` に保存（Webhook 前に Session metadata にも）

#### §3.2 との連携

| 場面 | 使う zone |
|------|-----------|
| 出品ウィザード（目安） | 発送元 `local` または `standard` をデフォルト表示 |
| 出品者が送料込み設定 | `standard` zone の料金を §3.2 控除 |
| Checkout | 購入者届け先から **実 zone** |

#### DB 追加

```sql
-- profiles または shop_seller_settings
-- ship_from_prefecture text

-- shop_products
-- shipping_burden text default 'buyer_pays'  -- buyer_pays | seller_pays | free_over
-- free_shipping_threshold_yen integer

-- shop_orders
-- ship_to_prefecture, ship_to_postal_code, shipping_total

-- shop_order_items
-- packaging_id, shipping_zone, shipping_yen

-- マスタは JSON / Django: shipping_rates (packaging_id, zone_id, yen, effective_from)
-- remote_postal_codes (prefix, note, block_checkout boolean)
```

#### 更新・運用

料金マスタの更新フロー・商品登録時の再取得は **§3.10** を正本とする。

Sub Agents: **Shipping**, **Profit Calculator**, **Fee Calculation**（Revenue）

---

### 3.10 商品登録時点での配送業各社の料金更新

各社公式改定に追随し、**出品ウィザード表示時は常に最新の有効料金表** から送料目安を算出する。商品に古い固定単価を埋め込まず、**マスタ参照 + スナップショット日時** で管理する。

#### 設計原則

| 原則 | 内容 |
|------|------|
| **正本はマスタ** | 送料円は `shipping_rates`（DB または JSON）。商品行はキャッシュのみ |
| **登録時は最新** | ウィザード open / 業者・梱包変更時に API で再 lookup |
| **Checkout も最新** | 決済時はその時点の有効料金（注文に `rate_version` を記録） |
| **スナップショット** | 商品保存時に `rates_effective_from` を記録（後から「いつの表か」追える） |
| **改定通知** | マスタ更新後、古いスナップショットの出品商品に編集画面でバナー |

#### 料金マスタ構造

```typescript
// shipping_rates 1 行 = packaging_id × zone_id × 有効期間
type ShippingRate = {
  packaging_id: string;   // §3.8
  zone_id: string;        // §3.9
  yen: number;            // 税込
  carrier: string;        // §3.7（冗長だが検索用）
  effective_from: string; // ISO date "2026-04-01"
  effective_to: string | null; // null = 現行
  source_url: string;     // 公式料金表 URL
  updated_by: string;     // admin / sync script
};
```

**有効行の取得**:

```typescript
function getActiveRates(asOf: Date = new Date()): ShippingRate[] {
  // effective_from <= asOf AND (effective_to IS NULL OR effective_to > asOf)
}
```

#### 各社料金の更新ソース

| carrier | 公式参照（運用メモ） |  typical 改定 |
|---------|---------------------|---------------|
| `yamato` | [ヤマト運輸 料金表](https://www.kuronekoyamato.co.jp/ytc/search/estimate.html) | 毎年 **4 月** |
| `sagawa` | [佐川急便 料金](https://www.sagawa-exp.co.jp/customer/send/rates/) | 毎年 **4 月** |
| `japanpost` | [日本郵便 料金](https://www.post.japanpost.jp/fee/simulator/kokunai/parcel.html) | 毎年 **4 月**前後 |
| `seino` | 西濃運輸 公式 | 年 1 回 |
| `fukuyama` | 福山通運 公式 | 年 1 回 |

MVP: 数値は **手動または半自動スクリプト** で `shipping-rates.json` に反映。完全スクレイピングは行わない（各社 ToS・構造変更リスク）。

#### 更新フロー（運用）

```text
[ 各社公式改定 ]（例: 4/1）
  → Revenue / Admin が新料金を入力
      方法 A: Django Admin `ShippingRate` 新行（effective_from 指定）
      方法 B: shipping-rates.json 更新 + npm run sync:shipping-rates
  → 旧行に effective_to を設定（履歴保持）
  → shipping_rate_versions に改定ログ
  → （任意）既存出品者へ「料金表更新」通知メール
  → 出品編集画面で stale 商品にバナー表示
```

**人間承認（§22）**: 本番料金表の一括改定（年次改定含む）。

#### 商品登録ウィザードでの取得

```text
/shop/sell 配送・梱包ステップ表示
  → GET /api/shop/shipping/rates?asOf=today
  → 出品者 ship_from_prefecture で zone 別目安を UI 表示
  → 業者 or 梱包変更のたびに再 fetch（debounce 300ms）
  → §3.2 利益計算の送料欄を同期更新
  → 公開保存時:
       shop_product_shipping_options.estimated_shipping_yen  ← standard zone 等
       shop_product_shipping_options.rates_effective_from  ← マスタの effective_from
       shop_product_shipping_options.rate_version_id         ← 改定バッチ ID
```

##### API

```typescript
// GET /api/shop/shipping/rates
// Query: carrier?, packagingId?, asOf?
// Response: {
//   effectiveFrom: "2026-04-01",
//   carriers: { yamato: { yamato_60: { local: 880, standard: 1080, ... } } }
// }

// GET /api/shop/shipping/rates/preview  （出品ウィザード用）
// Query: carrier, packagingId, shipFromPrefecture
// Response: { effectiveFrom, zones: { local, near, standard, distant, remote } }
```

#### 商品編集時の再更新

| 状態 | UI |
|------|-----|
| 保存時 `rates_effective_from` = 現行マスタ | 通常表示 |
| 保存時 < 現行 `effective_from` | 金枠バナー「**料金表が更新されました**（2026-04-01）。送料目安を確認してください」 |
| バナー表示中 | **[ 最新料金に更新 ]** → 再 lookup → `estimated_shipping_yen` 上書き（確認ダイアログ） |
| `seller_pays` 商品 | 更新後 §3.2 で純利益が再計算。マイナスなら警告 |

既存公開商品の **販売価格は自動変更しない**。送料目安・利益試算のみ更新。

#### 業者別の同時更新

改定時は **キャリア単位で一括** 更新可能。

```json
{
  "version_id": "2026-04-01",
  "effective_from": "2026-04-01",
  "carriers": {
    "yamato": { "source": "...", "rates": [ /* packaging × zone */ ] },
    "sagawa": { "source": "...", "rates": [ ... ] },
    "japanpost": { "source": "...", "rates": [ ... ] }
  }
}
```

`npm run sync:shipping-rates`（想定）:

1. `data/shipping-rates.json` を読む  
2. バリデーション（全 packaging_id × 5 zone が揃うか）  
3. Supabase `shipping_rates` に upsert  
4. `shipping_rate_versions` に checksum 記録  

#### DB 追加

```sql
-- 料金マスタ（履歴付き）
-- shipping_rates (
--   id, packaging_id, zone_id, yen,
--   carrier, effective_from, effective_to,
--   source_url, created_at
-- )

-- 改定バッチログ
-- shipping_rate_versions (
--   id, effective_from, carrier, note, synced_at, synced_by
-- )

-- shop_product_shipping_options 拡張
-- rates_effective_from date,
-- rate_version_id uuid references shipping_rate_versions,
-- estimated_shipping_yen integer  -- standard zone 基準の目安キャッシュ
```

#### Checkout との整合

| タイミング | 使う料金 |
|------------|----------|
| 商品登録 | 登録日時点の有効マスタ |
| Checkout | **決済開始日時**の有効マスタ（登録時より新しければ新料金） |
| 注文確定後 | `shop_order_items.rate_version_id` + `shipping_yen` を固定（後から改定しても遡及しない） |

#### スクリプト・パス（想定）

| パス | 役割 |
|------|------|
| `data/shipping-rates.json` | 改定 PR 用の正本（git 管理） |
| `scripts/sync-shipping-rates.mjs` | JSON → DB 同期 |
| `src/lib/shop/shipping-rates.ts` | 有効料金 lookup・preview |
| `src/app/api/shop/shipping/rates/route.ts` | 出品ウィザード API |

Sub Agents: **Shipping**, **Profit Calculator**, **Fee Calculation**, Django_Manager（Admin 入力）

---

### 3.11 設定・作品管理 → Shop 連携（MVP）

**有料・無料**どちらも Shop 出品可。**無料配布は ¥0 登録**。設定の作品管理から Shop 出品へ **ワンクリック引き継ぎ**（MVP）。Gallery 作品詳細ページには Shop ボタンを置かない。

#### 導線

| 起点 | アクション | 遷移 |
|------|------------|------|
| `/settings#artworks` | **「SHOP で販売」**（作者のみ） | `/settings/post/product?from_artwork={id}` |
| Lab 成果（P2） | 共同出品（§10.1 残） | 将来 `?from_lab_room=` |

**非採用**: `/gallery/[id]` への「Shop で販売」ボタン（作者操作は設定に集約）

#### 引き継ぎフィールド

| Gallery | Shop 出品ウィザード |
|---------|---------------------|
| `title` | 商品名（編集可） |
| `description` | 説明文 |
| `image_url` / メディア | メイン画像・ギャラリー |
| `seller_id` | 出品者（固定） |
| `tags` | タグ |
| `media_type` | 物販/デジタル判定のヒント（3D→物販グッズ等は手動確認） |

#### DB

```sql
alter table shop_products add column if not exists
  source_artwork_id uuid references public.artworks (id) on delete set null;
```

- 1 作品 → 複数 SKU 可（例: ポスター版・デジタル版）
- 引き継ぎ時 **権利確認チェックボックス** 必須（「自身が販売権を保有」）

Sub Agents: Gallery Manager 協議、Shop Safety

---

### 3.12 デジタル署名付き DL・ライセンス（採用）

デジタル商品（`product_type = digital`）の納品と利用条件。

#### MVP 実装済（2026-07-11）

| 項目 | MVP | 本番（§3.12 計画） |
|------|-----|-------------------|
| 配布元 | `shop_products.image_url`（または `gallery_urls[0]`） | Storage `shop-digital/{product_id}/` |
| API | `GET /api/shop/products/[id]/download` | 署名 URL 72h / 5 回 |
| 権限 | 出品者 or `orders.status=paid` に含まれる購入者 | + `shop_download_grants` |
| UI | 設定 `#shop`・商品詳細 Buy Box | `/shop/orders/[id]` |
| トリガー | 無料: `/api/checkout/free` 即 `paid` / 有料: Stripe Webhook | 同一 |

#### 配布（本番計画）

| 項目 | 仕様 |
|------|------|
| 保存 | Supabase Storage `shop-digital/{product_id}/` |
| ダウンロード | 署名付き URL、**有効 72 時間**、**最大 5 回** |
| トリガー | Stripe 決済成功 Webhook |
| 画面 | `/shop/orders/[id]` に DL ボタン + 残回数 |

#### ライセンス（出品時選択・Buy Box 表示）

| license_id | 表示名 | 概要 |
|------------|--------|------|
| `personal` | 個人利用 | 非商用・再配布不可 |
| `commercial_small` | 商用（小規模） | indie / 同人誌 1 タイトル等（説明テンプレ） |
| `commercial` | 商用 | 案件・商品化可（範囲は説明に明記） |
| `redistribution_no` | 再配布禁止 | 全ライセンス共通条項 |

```sql
-- shop_digital_assets (product_id, storage_path, file_name, file_size)
-- shop_download_grants (order_item_id, expires_at, max_downloads, download_count)
-- shop_products.license_type text
```

Sub Agent: **Digital Delivery**, Shop Safety

---

### 3.13 返品 RMA・Stripe Connect（採用）

マーケットプレイス決済・返金の正本。

#### Stripe Connect

- 出品者 onboarding: **Stripe Connect Express**（`/settings/shop/payouts`）
- Checkout: `application_fee_amount` = Eldonia 手数料、`transfer_data.destination` = 出品者 Connect ID
- 未 onboarding の出品者は **出品不可**（ウィザード最終ステップで警告）

#### 返品 RMA

| 項目 | ルール |
|------|--------|
| 申請期限 | 配達完了から **14 日** |
| 条件 | 未使用・未開封（出品者が商品ごとにテンプレ選択可） |
| フロー | 購入者申請 → 出品者承認/拒否 → 承認時 Refund Agent（§22 大額は人間） |
| 在庫 | 全額返金承認 → §3.5 在庫戻し |

```sql
-- shop_returns (order_item_id, reason, status, requested_at, resolved_at)
-- profiles.stripe_connect_account_id
```

Sub Agents: **Refund**, Revenue/Payment

---

### 3.14 海外配送（採用）

国内（§3.9）に加え、**国際発送** に対応。MVP は EMS / DHL / FedEx、**DDU（関税・輸入税は購入者負担）**。

#### 出品登録（§3.8 拡張）

| 項目 | 必須 | 説明 |
|------|:----:|------|
| 海外発送 | ○ | `ships_internationally` boolean |
| 対応地域 | 海外 ON 時 | `worldwide` / `asia` / `custom_countries[]` |
| 除外国 | — | 制裁国・配送不可リスト（平台マスタ） |
| 重量・寸法 | 海外 ON 時 ○ | 関税・料金計算に必須（§3.8 梱包と連動） |
| 海外用業者 | 海外 ON 時 | `ems` / `dhl` / `fedex`（§3.7 拡張） |

#### 地域ゾーン（国際）

| zone_id | 対象 |
|---------|------|
| `intl_asia` | 韓国・台湾・中国・香港・シンガポール等 |
| `intl_oceania` | 豪州・NZ |
| `intl_na_eu` | 米・加・主要 EU |
| `intl_other` | その他 |

国内 `local`〜`remote`（§3.9）とは **別 lookup** `shipping_rates_intl`。

##### 国際送料目安（概算・EMS 60サイズ相当）

| zone_id | 目安（円） |
|---------|----------:|
| `intl_asia` | 1,400 |
| `intl_oceania` | 2,200 |
| `intl_na_eu` | 3,500 |
| `intl_other` | 4,500 |

料金更新は §3.10 と同様（`effective_from`、日本郵便 EMS / 各社 tariff）。

#### Checkout

```text
届け先国 = JP → §3.9 国内ロジック
届け先国 ≠ JP →
  カート内に ships_internationally=false の商品があればブロック
  intl zone lookup → 送料加算
  関税注記: 「関税・輸入税はお届け先国でお客様負担（DDU）」
```

- 通貨: MVP は **JPY のみ**（Stripe）。多通貨は P3
- 追跡: EMS / DHL / FedEx の §3.7 URL を使用

#### DB

```sql
-- shop_products.ships_internationally, intl_zone_policy, blocked_countries
-- shipping_rates_intl (packaging_id, intl_zone_id, yen, effective_from)
-- shop_orders.ship_to_country_code char(2)
```

Sub Agent: **Shipping**

---

### 3.15 Shop 商品翻訳（採用）

`docs/translation-architecture.md` v1.1（2026-07-13）Layer 2 に準拠。UI ロケール `ja` / `en` / `ko` / `zh-CN` で商品名・説明を表示。

**表示方針**: 購入者 UI locale ≠ `source_locale` のとき **キャッシュ訳を主表示**、原文は `ContentLine` / `eldonia-localized-hint` で従表示。Google ウィジェットは使わない。

#### 対象フィールド

| フィールド | 翻訳 | 表示 |
|------------|------|------|
| `title` | ○ | 一覧・詳細・カート |
| `description` | ○ | 詳細・Buy Box 下 |
| 梱包メモ・ライセンス条文 | — | 出品者言語のみ（法的文案は手動多言語可） |

#### フロー

```text
出品者が母語で title / description 入力（source_locale = プロフィール or 選択）
  → 公開保存時 Product Translation Agent
  → content_translations (entity_type = 'shop_product') にキャッシュ
  → 他 3 ロケールへ自動翻訳（GCP Translation 本番 / 開発は nexus demo）
  → 購入者 UI: getUiLocale() + ContentLine（Gallery 同様）
```

#### API・キャッシュ

- API: `/api/nexus/translate` → 本番 GCP Translation（[Translation_Manager](../business/Translation_Manager.agent.md)）
- キャッシュ: `content_translations`（`source_hash` 変更時のみ再翻訳）
- 出品者 **手動修正** 可（`translation_overrides`）

#### 出品ウィザード UI

```text
[ 商品名（母語）          ]
[ 説明（母語）            ]
  ↳ プレビュー: EN / KO / ZH — [ 再翻訳 ]
```

#### ルール

- モジュール名 **SHOP**・Realm 名は taxonomy（H1 非翻訳ルール維持）
- 空文字・同一ロケールはスキップ
- Premium: Layer 3 AI ローカライズ — 将来

#### DB

```sql
-- shop_products.source_locale text default 'ja'
-- content_translations entity_type 'shop_product', fields title / description
```

Sub Agents: **Product Translation**, Translation Quality

---

## 4. データモデル拡張（案）

既存 `shop_products` に加え、MVP 以降で以下を検討。

```sql
-- 物販属性（JSON でも可）
alter table shop_products add column if not exists
  size_label text,
  material text,
  weight_grams integer;

-- 配送・梱包（§3.8）
-- shop_product_shipping_options (
--   product_id, carrier, packaging_id, weight_grams,
--   estimated_shipping_yen, packaging_note, is_default,
--   rates_effective_from, rate_version_id
-- )

-- 料金マスタ（§3.10）
-- shipping_rates, shipping_rate_versions

-- 在庫（既存カラム + 拡張）
-- shop_products.stock_quantity  … 0=欠品, null=管理なし
alter table shop_products add column if not exists
  low_stock_threshold integer default 5,
  hide_when_out_of_stock boolean default false;

-- 在庫変動ログ（手動調整・返金戻しの監査）
-- shop_inventory_events (
--   product_id, delta, reason, order_id, created_by, created_at
-- )

-- 注文・配送（Stripe Webhook 連携）
-- shop_orders (buyer_id, total, shipping_total, status, stripe_session_id,
--   ship_to_prefecture, ship_to_postal_code)
-- shop_order_items (..., packaging_id, shipping_zone, shipping_yen)

-- 送料マスタ（JSON または Django）
-- shipping_rates (packaging_id, zone_id, yen, effective_from)
-- remote_postal_codes (prefix, block_checkout)
-- shop_shipments (order_id, carrier, tracking_number, tracking_url, shipped_at, delivered_at)

-- 収益台帳（返金はマイナス行）
-- shop_ledger_entries (
--   seller_id, order_item_id, entry_type, gross_yen, eldonia_fee_yen,
--   stripe_fee_yen, seller_net_yen, created_at
-- )

-- レビュー
-- shop_reviews (product_id, buyer_id, rating, body, created_at)

-- §3.11 Gallery 連携
-- shop_products.source_artwork_id

-- §3.12 デジタル
-- shop_digital_assets, shop_download_grants, shop_products.license_type

-- §3.13 Connect・返品
-- shop_returns, profiles.stripe_connect_account_id

-- §3.14 海外
-- shop_products.ships_internationally, shipping_rates_intl, shop_orders.ship_to_country_code

-- §3.15 翻訳
-- shop_products.source_locale, content_translations (entity_type shop_product)
```

物理削除は行わず、`is_active = false` で非公開（§23 データ保持方針）。

---

## 5. 画面一覧

| パス | 状態 | 説明 |
|------|------|------|
| `/shop` | 実装済 | 一覧・検索・Realms |
| `/shop/[id]` | 実装済 | 詳細・Buy Box |
| `/shop/cart` | 実装済 | カート・無料入手・送料フォーム |
| `/checkout/success` | 実装済 | Stripe / `?free=1` 完了 |
| `/shop/checkout` | **新規** | 届け先・**確定送料**・Stripe 導線（§3.9） |
| `/settings/post/product` | **実装済（MVP）** | 商品登録フォーム（設定から） |
| `/settings#shop` | **実装済** | 出品商品一覧・登録導線 |
| `/settings#artworks` | **実装済** | 作品管理から **SHOP で販売** → `?from_artwork=` |
| `/shop/sell` | **リダイレクト** | → `/settings/post/product` |
| `/shop/sell/[id]/edit` | **新規** | 編集・在庫更新 |
| `/shop/orders` | **新規** | 購入者注文履歴 |
| `/shop/seller/orders` | **新規** | 出品者受注・発送管理 |
| `/shop/seller/inventory` | **新規** | 在庫一覧・補充・低在庫アラート |
| `/shop/seller/revenue` | **新規** | 収益ダッシュボード・注文別 Net |
| `/settings/shop` | **新規** | 出品者設定・利益計算デフォルト |
| `/settings/shop/payouts` | **新規** | Stripe Connect onboarding（§3.13） |
| `/settings/post/product?from_artwork=` | **実装済** | 作品管理からの引き継ぎ登録 |
| `/shop/sell?from_artwork=` | **リダイレクト** | → 上記（互換） |

#### API（MVP 実装済）

| パス | メソッド | 説明 |
|------|----------|------|
| `/api/cart` | GET, POST | カート取得・add/remove/clear |
| `/api/checkout` | POST | Stripe Checkout（`shipping` body 可） |
| `/api/checkout/free` | POST | 無料注文（`direct` でデジタル即入手） |
| `/api/shop/products/[id]` | DELETE, PATCH | 非公開 / 再公開 |
| `/api/shop/products/[id]/download` | GET | デジタル DL |

---

## 6. 受け入れ条件・テスト観点

### 6.1 出品

- [x] 設定 `/settings/post/product` から商品登録・即時公開（MVP フォーム）
- [x] 無料配布「¥0」チェックで Shop 掲載
- [x] 公開後 `/shop` および `/shop/[id]` に即反映
- [x] 他ユーザーの商品は編集できない（RLS）
- [x] 設定 `#shop` から削除（非公開）・再公開
- [ ] 物販のみサイズ・素材・**配送業者・梱包**フィールドが表示される
- [ ] デジタルのみ配布設定（Storage アップロード）が表示される

### 6.2 利益計算（販売前試算）

- [ ] プラン・種別ごとに手数料率が正しい
- [ ] 送料は手数料計算基数に含まれない
- [ ] 純利益がマイナスのとき警告または公開不可
- [ ] 価格変更で内訳がリアルタイム更新
- [ ] 試算式と決済後 `shop_ledger_entries` の式が一致

### 6.3 在庫管理

- [ ] `stock_quantity = null` の物販は常に購入可
- [ ] `stock_quantity = 0` で Buy Box が在庫切れ表示・CTA 無効
- [ ] 決済成功で在庫が quantity 分減算される
- [ ] 同時購入で在庫不足の注文は失敗する（ oversell しない）
- [ ] 全額返金で在庫が戻る
- [ ] 出品者が手動で在庫を増減でき、監査ログが残る
- [ ] 低在庫しきい値以下で通知（設定時）

### 6.4 収益計算・精算

- [ ] 注文確定時に gross / eldonia_fee / stripe_fee / seller_net が記録される
- [ ] 返金時にマイナス台帳行が追加される
- [ ] `/shop/seller/revenue` に今月 Net 合計が表示される
- [ ] デジタルは物販手数料率ではなくデジタル列が適用される
- [ ] Admin / Django で月次手数料収入が参照できる

### 6.5 メール

- [ ] 決済成功 Webhook でサンキューメール送信
- [ ] 出品者に新規注文通知
- [ ] 発送登録で追跡番号付きメール
- [ ] 発送メールに **業者別追跡リンク** が含まれる（§3.7）
- [ ] 配達後 N 日でレビュー依頼（1 商品 1 回）
- [ ] From: `support@eldonia-nex.com`、SPF/DKIM 設定済み環境で届く

### 6.6 配送追跡リンク

- [ ] 主要 4 社（ヤマト・佐川・日本郵便・西濃）+ その他で URL が生成される
- [ ] `/shop/orders/[id]` に「配送状況を確認」リンクが表示される
- [ ] `other` 選択時は手入力 URL が使われる
- [ ] リンクは公式ドメイン（kuronekoyamato / sagawa-exp / japanpost 等）
- [ ] 追跡番号未登録時はリンク非表示（「発送準備中」）

### 6.7 配送・梱包（商品登録）

- [ ] 物販出品時に業者 + 梱包プリセットが必須
- [ ] 業者変更で梱包プルダウンが切り替わる（§3.8 マスタ）
- [ ] **登録時に最新料金表 API** から zone 別目安が表示される（§3.10）
- [ ] 保存時 `rates_effective_from` / `rate_version_id` が記録される
- [ ] 料金表改定後、古い商品編集画面に更新バナーが出る
- [ ] 「最新料金に更新」で `estimated_shipping_yen` が再計算される
- [ ] プリセット選択で重量・送料目安が §3.2 に反映される
- [ ] 商品詳細に「発送の目安」が表示される
- [ ] 発送登録時、商品のデフォルト業者が初期選択される
- [ ] 割れ物等の梱包メモ未入力時に警告（該当カテゴリ）

### 6.8 料金マスタ更新（§3.10）

- [ ] `sync:shipping-rates` で JSON → DB 同期が成功する
- [ ] 新 `effective_from` 行のみが lookup に使われる
- [ ] 旧料金行に `effective_to` が設定され履歴が残る
- [ ] ヤマト・佐川・日本郵便を **carrier 単位** で一括更新できる
- [ ] Checkout は決済時点の最新料金を使用する
- [ ] 確定済み注文の `shipping_yen` は改定後も変わらない

### 6.9 送料・Checkout（§3.9）

- [ ] 届け先都道府県・郵便番号で zone が決まる
- [ ] 離島郵便番号で `remote` 加算または Checkout ブロック
- [ ] 梱包プリセット × zone の lookup 送料が API で返る
- [ ] 同一出品者・同一 Checkout は送料 **高い 1 件に同梱**
- [ ] 複数出品者カートで送料行が出品者別に表示される
- [ ] `free_over` 条件で送料 0 になる
- [ ] `seller_pays` 商品は Checkout 送料 0・§3.2 で出品者控除
- [ ] Stripe Session 金額 = 商品小計 + 確定送料
- [ ] 注文レコードに `shipping_total` / 行別 `shipping_yen` が保存される
- [ ] 郵便番号変更で送料が再計算される

### 6.10 掲載 UX

- [ ] Nexus Prime / Choice 表記（Prime 単独表記なし）
- [ ] `.eldonia-btn-primary` CTA、ダーク×金トークン
- [ ] `npm run lint` / `npm run build` 成功
- [ ] DB 未適用時もサンプル商品で一覧表示（回帰）

### 6.11 決済（Revenue/Payment 協議）

- [ ] Stripe Checkout 完了 → 注文レコード作成
- [ ] デジタル商品は決済後即ダウンロード
- [ ] 返金・チャージバックは Admin 承認フロー（§22）

### 6.12 設定・作品管理 → Shop（§3.11）

- [x] 設定 `#artworks` に作者のみ「SHOP で販売」
- [x] `/settings/post/product?from_artwork=` に title / 説明 / 画像が prefill
- [x] Gallery 作品詳細 `/gallery/[id]` に Shop CTA **なし**（非採用）
- [ ] `source_artwork_id` が DB に保存される
- [ ] 権利確認チェックボックス必須

### 6.13 デジタル DL（§3.12）

- [x] 出品者が設定 `#shop` から DL（`image_url`）
- [x] 購入者（`paid` 注文）が商品詳細から DL
- [x] 無料デジタルは `/api/checkout/free` 後に DL 可
- [ ] 決済後に Storage 署名 URL が発行される
- [ ] 期限・回数上限が機能する
- [ ] Buy Box にライセンス種別が表示される

### 6.17 カート・無料決済 MVP（2026-07-11）

- [x] カート合計 ¥0 を「無料」表示（`formatProductPrice`）
- [x] ヘッダーカートアイコンに **商品件数** バッジ（¥0 でも表示）
- [x] `POST /api/checkout/free` で Stripe なし `paid` 注文
- [x] 無料デジタル「無料で入手」で即 API（カート省略可）
- [x] 無料物理: 配送先 + 送料 ¥770 のみ Stripe
- [x] カート空で Checkout 不可・権限エラー時メッセージ
- [ ] 都道府県別送料 lookup（現状定額のみ）

### 6.14 Connect・返品（§3.13）

- [ ] Connect 未完了では出品不可
- [ ] 手数料が application_fee として控除される
- [ ] 14 日以内 RMA 申請 → 承認 → 返金 + 在庫戻し

### 6.15 海外配送（§3.14）

- [ ] `ships_internationally=false` 商品が海外届け先でブロック
- [ ] 国際 zone 送料が Checkout に表示される
- [ ] DDU 関税注記が表示される
- [ ] EMS/DHL 追跡リンクが §3.7 で生成される

### 6.16 翻訳（§3.15）

- [ ] 公開保存で en/ko/zh-CN キャッシュが作成される
- [ ] UI ロケール切替で title/description が切り替わる
- [ ] 原文変更時のみ再翻訳（hash）
- [ ] 出品者が翻訳プレビュー・再翻訳できる

---

## 7. 実装フェーズ

| フェーズ | 内容 | 優先度 |
|----------|------|--------|
| **P0** | ~~設定出品 MVP~~（**実装済** §2.1） | 高 |
| **P0** | 多段 `/shop/sell` ウィザード + 梱包（§3.8） | 高 |
| **P0** | 利益計算・在庫・精算（§3.2 / §3.5 / §3.6） | 高 |
| **P1** | 国内配送・料金更新（§3.7〜§3.10）+ Checkout 本番 | 高 |
| **P1** | ~~設定・作品管理 → Shop~~（**MVP 済** §3.11） | 高 |
| **P1** | **デジタル DL Storage + ライセンス**（§3.12 本番） | 高 |
| **P1** | **Stripe Connect + 返品 RMA**（§3.13） | 高 |
| **P1** | **商品翻訳**（§3.15） | 高 |
| **P1** | 収益ダッシュボード・発送メール | 高 |
| **P2** | **海外配送**（§3.14）+ `shipping_rates_intl` | 中 |
| **P2** | 翻訳手動修正・料金改定バナー | 中 |
| **P2** | 離島マスタ・在庫一覧・レビュー | 中 |
| **P2** | §10 残（ウィッシュリスト・Q&A・ストアfront） | 中 |
| **P3** | 多通貨・DDP・Nexus Prime 海外 | 低 |

---

## 8. 関連エージェント・参照

| 部署 | ファイル | 役割 |
|------|----------|------|
| Shop | [Shop_Manager.agent.md](./Shop_Manager.agent.md) | 運用エージェント・UX 規約・実装済み一覧 |
| Design | [UI_UX_Designer.agent.md](../design/UI_UX_Designer.agent.md) | トークン・Amazon 型レイアウト |
| Frontend | [Frontend_Manager.agent.md](../development/Frontend_Manager.agent.md) | `src/app/shop/`, `src/components/shop/` |
| Backend | [Backend_Manager.agent.md](../development/Backend_Manager.agent.md) | マイグレーション・RLS |
| Revenue | [Revenue_Payment_Manager.agent.md](../business/Revenue_Payment_Manager.agent.md) | Stripe・手数料・返金 |
| Fan Notification | [Fan_Notification_Manager.agent.md](./Fan_Notification_Manager.agent.md) | メール・プッシュ |
| Translation | [Translation_Manager.agent.md](../business/Translation_Manager.agent.md) | 商品翻訳 §3.15 |
| Gallery | [Gallery_Manager.agent.md](./Gallery_Manager.agent.md) | §3.11 引き継ぎ |
| QA | [QA_Test_Agent.agent.md](../development/QA_Test_Agent.agent.md) | §6 テスト実行 |

**コード参照**: `004_shop.sql`, `src/lib/shop/`, `data/shipping-rates.json`, `docs/translation-architecture.md`, `/api/nexus/translate`（未実装含む）

---

## 9. 用語

| 用語 | 意味 |
|------|------|
| Realm | 商品カテゴリ（Shop 左サイドバー） |
| Buy Box | 詳細ページ右側の購入パネル |
| 純利益 | 出品者受取見込み（手数料・送料・決済控除後）— §3.2 試算 |
| 出品者受取（Net） | 決済確定後の実績受取 — §3.6 台帳 |
| 在庫管理なし | `stock_quantity = null`、購入制限なし |
| 梱包プリセット | 業者別サービス（ネコポス・60 サイズ等）の登録用マスタ |
| 送料ゾーン | local / near / standard / distant / remote の 5 段階 |
| 料金表 effective_from | その送料が有効になる改定日（例: 2026-04-01） |
| rate_version | 年次改定など料金バッチの ID。注文・商品に紐付け |
| 確定送料 | Checkout 時に届け先から算出し Stripe に渡す送料 |
| 追跡リンク | 業者マスタから生成する公式配送状況 URL |
| 自主出品 | クリエイターが **設定** `/settings/post/product` から直接掲載 |
| DDU | 関税・輸入税を購入者負担とする国際配送条件 |
| source_locale | 出品者が入力した商品文案の言語 |
| intl zone | 海外向け送料ゾーン（asia / oceania / na_eu / other） |

---

## 10. 追加提案（未採用バックログ）

§3.11〜§3.15 **採用済み**。以下は未採用の残件。

### 10.1 Eldonia コア連携（残）

| 提案 | 概要 | 協議部署 |
|------|------|----------|
| ~~**Gallery → Shop**~~ | **§3.11 採用** | — |
| **Lab 共同商品** | Lab ルーム成果物の共同出品・収益分配 | Lab, Works |
| **Events 物販** | イベントページと Shop SKU 連携 | Events |
| **出品者ストアfront** | `/shop/seller/[handle]` | Community |
| **Portfolio 実績** | 販売数・レビューを Portfolio に反映 | Portfolio |

### 10.2 デジタル・安全（残）

| 提案 | 概要 |
|------|------|
| ~~**署名付き DL**~~ | **§3.12 採用** |
| ~~**ライセンス表示**~~ | **§3.12 採用** |
| **禁止商品チェック** | 出品時 Moderation |
| **権利侵害申立** | DMCA 型フロー |

### 10.3 購入体験（Amazon 型・P2〜P3）

| 提案 | 概要 |
|------|------|
| **ウィッシュリスト** | ログインユーザーの「あとで買う」— Shop_Manager バックログ既出 |
| **商品 Q&A** | 購入前質問・出品者回答（詳細ページ下部） |
| **バリエーション SKU** | サイズ・色別在庫（T シャツ等。梱包 §3.8 と連動） |
| **セット・バンドル** | 複数 SKU を 1 商品として販売 |
| **最近見た商品** | Cookie / ログイン履歴ベースのレコメンド帯 |
| **クーポン・セール** | 出品者発行 or 平台キャンペーン（Revenue 承認） |

### 10.4 運用・法務（残）

| 提案 | 概要 |
|------|------|
| ~~**返品・RMA**~~ | **§3.13 採用** |
| ~~**Stripe Connect**~~ | **§3.13 採用** |
| **インボイス対応** | 適格請求書・領収書 PDF |
| **注文キャンセル** | 発送前キャンセル |
| **受注生産・予約** | リードタイム表示 |
| ~~**海外配送**~~ | **§3.14 採用**（多通貨・DDP は P3） |

### 10.5 Nexus Prime・データ

| 提案 | 概要 |
|------|------|
| **Prime 送料特典** | 会員は `standard` zone 送料割引 or 月 N 回無料 |
| **出品者アナリティクス** | 閲覧数・カート追加率・転換（`/shop/seller/analytics`） |
| **下書き・予約公開** | 出品ウィザードの draft / `published_at` |
| **商品複製** | 既存出品をテンプレートに新規作成 |
| ~~**多言語出品**~~ | **§3.15 採用** |

### 10.6 採用済みサマリ

| § | 内容 | フェーズ |
|---|------|----------|
| 3.11 | Gallery → Shop | P1 |
| 3.12 | デジタル DL + ライセンス | P1 |
| 3.13 | Connect + 返品 RMA | P1 |
| 3.14 | 海外配送（DDU・EMS/DHL） | P2 |
| 3.15 | 商品翻訳（4 ロケール） | P1 |
