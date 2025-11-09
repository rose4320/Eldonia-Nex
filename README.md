# Eldinia-Nex プロジェクトルートのREADME

## 🎨 Eldinia-Nex

## Creative Platform for Artists and Creators

Eldinia-Nex は、アーティストやクリエイター向けの包括的なプラットフォームです。

## 🌟 主要機能

### 🔐 ユーザー管理

- マルチアカウント対応（個人・企業・団体）

- ソーシャルログイン連携

- プロフィール管理、ポートフォリオ

### 🎭 コンテンツ管理

- 多様な作品投稿（画像、動画、3D、音楽等）

- 高度な検索・フィルタリング

- いいね、コメント、共有機能

### 🤝 コラボレーション

- プロジェクト管理システム

- グループ作業環境

- 協力申請システム

### 🎪 イベント管理

- イベント作成・管理

- チケット販売システム

- 出展者管理

### 🛒 マーケットプレイス

- デジタル・物理商品販売

- 決済・配送システム

- 収益分析

### 📺 ライブ配信

- リアルタイム配信

- 有料配信・投げ銭

- 録画・アーカイブ

### 💼 求人・案件

- クリエーター検索

- 案件・求人管理

- スキルマッチング

## 🧩 UI/UXコンポーネント設計

### 設計原則（統合要件定義書準拠）

- **UI/UX設計書**: [docs/05_UI_UX設計書.md](./docs/05_UI_UX設計書.md) 必須準拠

- **デザインシステム**: ダークモード優先、アクセシブルデザイン

- **ブランディング**: PT Serif + ゴールドグラデーション必須使用

### ヘッダーコンポーネント（3カラムレイアウト）

```text
┌─────────────────────────────────────────────────────┐
│ [� Eldonia-Nex] | [GALLERY][COMMUNITY] | [🛒][👤] │
│ プラットフォーム  | [検索ボックス______] | EXPバー   │
└─────────────────────────────────────────────────────┘
    30%                    40%                 30%

```text

### ブランド要素（必須実装）

```css
/* PT Serif + ゴールドグラデーション */
.brand-title {
  font-family: 'PT Serif', serif;
  background: linear-gradient(180deg, #FCD34D 0%, #F97316 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

```text

## �🎮 ゲーミフィケーション機能

- EXP・レベルシステム

- 実績・バッジ

- ランキング機能

## 🏗️ 技術構成

### フロントエンド

- **React 19.0** + **Next.js 15.0** + **TypeScript 5.7**

- **Tailwind CSS** + **Headless UI**

- **Zustand** (状態管理) + **React Query** (データ取得)

### バックエンド

- **Python 3.13.3** + **Django 5.1.3** + **Django REST Framework 3.15.2**

- **PostgreSQL 17** + **Redis 7.4**

- **Celery** (非同期処理) + **Channels** (WebSocket)

### インフラ

- **Docker** + **Docker Compose**

- **GitHub Actions** (CI/CD)

- **AWS/Azure/GCP** (マルチクラウド対応)

## 🚀 クイックスタート

### 1. 環境構築

```bash
## リポジトリのクローン

git clone <https://github.com/your-org/eldinia-nex.git>
cd eldinia-nex

## 開発環境セットアップ

./scripts/setup-dev.sh  # Linux/macOS

## または

.\scripts\setup-dev.bat  # Windows

```text

### 2. 開発サーバー起動

```bash
## 全サービス起動

./scripts/start-dev.sh  # Linux/macOS

## または

.\scripts\start-dev.bat  # Windows

```text

### 3. アクセス

- **フロントエンド**: <http://localhost:3000>

- **バックエンド API**: <http://localhost:8000>

- **Django Admin**: <http://localhost:8000/admin>

- **PgAdmin**: <http://localhost:5050>

## 📂 プロジェクト構造

```text

eldinia-nex/
├── backend/                 # Django バックエンド
│   ├── eldinia_nex/        # プロジェクト設定
│   ├── users/              # ユーザー管理
│   ├── content/            # コンテンツ管理
│   ├── collaboration/      # コラボレーション
│   ├── events/             # イベント管理
│   ├── marketplace/        # マーケットプレイス
│   ├── streaming/          # ライブ配信
│   ├── jobs/               # 求人・案件
│   └── gamification/       # ゲーミフィケーション
├── frontend/               # Next.js フロントエンド
│   ├── src/
│   │   ├── app/           # App Router
│   │   ├── components/     # 再利用可能コンポーネント
│   │   ├── hooks/         # カスタムフック
│   │   └── lib/           # ユーティリティ
├── docs/                   # プロジェクト文書
├── scripts/                # 開発スクリプト
├── docker/                 # Docker 設定
└── .github/                # GitHub Actions

```text

## 🔧 開発ツール

### バックエンド

- **Black** - コードフォーマッター

- **isort** - インポート並び替え

- **flake8** - リンター

- **mypy** - 型チェック

- **pytest** - テスト

### フロントエンド

- **ESLint** - リンター

- **Prettier** - フォーマッター

- **TypeScript** - 型チェック

## 📖 ドキュメント

詳細なドキュメントは `docs/` フォルダを参照してください：

- [機能要件定義書](docs/01_機能要件定義書.md)

- [非機能要件定義書](docs/02_非機能要件定義書.md)

- [データベース設計書](docs/03_データベース設計書.md)

- [API設計書](docs/04_API設計書.md)

- [UI/UX設計書](docs/05_UI_UX設計書.md)

- [システム構成設計書](docs/06_システム構成設計書.md)

## 🤝 コントリビューション

1. フォークしてブランチを作成
2. 変更を加えてコミット
3. テストを実行して品質チェック
4. プルリクエストを作成

## 📄 ライセンス

MIT License

## 📞 サポート

- **Issue Tracker**: GitHub Issues

- **Discord**: [開発者コミュニティ]

- **Email**: support@eldinia-nex.com

