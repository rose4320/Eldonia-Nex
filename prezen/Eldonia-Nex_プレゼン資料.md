# Eldonia-Nex プレゼン資料

---

## 1. プロジェクト概要

- **名称**: Eldonia-Nex
- **副題**: クリエイターのための創作プラットフォーム
- **ビジョン**: すべてのクリエイターが自由に表現し、正当な評価と収益を得られる世界の実現
- **ミッション**: 創作活動を通じた経済的自立と創造性の向上を支援する包括的プラットフォームの提供
- **ターゲット**: 個人クリエイター、企業・団体、アート愛好家

---

## 2. 技術スタック・システム構成

### フロントエンド

- React 18.3+ / Next.js 15.0+ / TypeScript 5.7+
- TailwindCSS / Radix UI / Framer Motion
- PWA対応・レスポンシブデザイン

### バックエンド

- Django 5.1+ / Django REST Framework 3.15+
- Celery 5.4+ / Django Channels 4.1+
- Python 3.12+

### インフラ

- PostgreSQL 17+ / Redis 7.4+ / ElasticSearch 8.15+
- Docker Composeによる開発環境構築
- Vercel Edge CDN, Nginxリバースプロキシ

---

## 3. 主要機能

### WORKS（作品管理）

- 作品投稿（画像/動画/音声/ドキュメント）
- メタデータ・タグ・カテゴリ・価格設定
- AI審査・著作権チェック

### SHOP（ショップ）

- 作品販売・購入
- 決済（Stripe連携）
- 多言語・多通貨対応

### EVENT（イベント管理）

- 展示会・コンテスト・コラボ企画の開催・参加
- イベント専用ページ・応募・審査・結果発表

### COMMUNITY（コミュニティ）

- SNS連携・コメント・フォロー
- ファン・サポーター機能
- グループ作業機能

### STREAMING（ストリーミング）

- ライブ配信・録画
- RTMPサーバー連携

---

## 4. UI/UX設計

- モダン・シンプル・アクセシブル
- 3クリック以内で主要機能へアクセス
- カラーパレット: Indigo, Green, Yellow, Red, Blue
- ダーク/ライトモード対応

---

## 5. API設計

- RESTful API + JWT認証
- Django REST Framework
- OAuth2.0, JWT, Session認証
- ページネーション・権限管理

---

## 6. システム構成・アーキテクチャ

- Phase 1: モノリシック（Next.js + Django）
- Phase 2: ハイブリッド（分離・拡張）
- Phase 3: マイクロサービス（完全分離・スケール）

---

## 7. Docker構成

| サービス | イメージ           | ポート | 説明       |
| -------- | ------------------ | ------ | ---------- |
| postgres | postgres:17-alpine | 5432   | DB         |
| redis    | redis:7.4-alpine   | 6379   | キャッシュ |
| backend  | Django             | 8000   | API        |
| frontend | Next.js            | 3000   | Web        |
| nginx    | nginx:alpine       | 80,443 | Proxy      |

---

## 8. 開発ルール・運用

- .envによる環境変数管理
- GitHub管理・CI/CD
- テスト・Lint・コードレビュー
- 多言語・多通貨・レート制限

---

## 9. 今後の展望

- 機能拡張（AI生成、NFT、外部API連携）
- グローバル展開・スケーラビリティ
- コミュニティ強化・収益化モデル

---

## 参考: 詳細ドキュメント

- docs/00_統合要件定義書.md
- docs/01_機能要件定義書.md
- docs/04_API設計書.md
- docs/05_UI_UX設計書.md
- docs/06_システム構成設計書.md
- docs/07_Docker構成サマリー.md
- docs/09_技術スタック更新サマリー.md
