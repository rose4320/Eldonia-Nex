# Eldinia-Nex クリエイタープラットフォーム

## 統合要件定義書準拠のクリエイター支援プラットフォーム

[![Django](https://img.shields.io/badge/Django-5.1+-green.svg)](https://www.djangoproject.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0+-blue.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17+-blue.svg)](https://www.postgresql.org/)

---

## 🎯 プロジェクト概要

**Eldonia-Nex**は、すべてのクリエイターが自由に表現し、正当な評価と収益を得られる世界の実現を目指すクリエイタープラットフォームです。

### 主要機能

- 🎨 **作品ギャラリー**: 高品質な作品投稿・販売システム

- 🎮 **ゲーミフィケーション**: EXP・レベル・実績システム

- 🌐 **Live配信**: リアルタイムストリーミング機能

- 💰 **マーケットプレイス**: デジタル・物理商品販売

- 🤝 **コラボレーション**: クリエイター間のプロジェクト協力

- 📅 **イベント管理**: オンライン・オフラインイベント開催

- 🌍 **多言語対応**: 日本語・英語・韓国語・中国語・ベトナム語

---

## ⚠️ 重要: 開発環境実行ルール

**統合要件定義書準拠の必須ルール**:

### 📁 ディレクトリ別実行規則

#### Django Backend（必須: backendフォルダで実行）

```bash

## ❌ 間違った実行方法

cd eldinia-nex/
python manage.py runserver  # エラー: manage.pyが見つからない

## ✅ 正しい実行方法

cd eldinia-nex/backend/
python manage.py runserver 0.0.0.0:8000

```text

#### Next.js Frontend（必須: frontendフォルダで実行）

```bash

## ❌ 間違った実行方法

cd eldinia-nex/
npm run dev  # エラー: package.jsonが見つからない

## ✅ 正しい実行方法

cd eldinia-nex/frontend/
npm run dev

```text

---

## 🚀 クイックスタート

### 自動セットアップ（推奨）

## Windows:

```powershell
.\scripts\start-dev.bat

```text

## Linux/Mac:

```bash
./scripts/start-dev.sh

```text

### 手動開発サーバー起動

```bash

## ターミナル1: Django Backend（backend/で実行）

cd backend/
python manage.py runserver 0.0.0.0:8000

## ターミナル2: Next.js Frontend（frontend/で実行）

cd frontend/
npm run dev

```text

### 🌐 アクセス先

- 🎨 **フロントエンド**: <<http://localhost:3000>>

- 🔌 **バックエンド API**: <<http://localhost:8000>>

- ⚙️ **Django Admin**: <<http://localhost:8000/admin/>>

- 💊 **Health Check**: <<http://localhost:8000/api/v1/health/>>

---

## 📁 プロジェクト構造

```text

eldinia-nex/
├── 📁 frontend/          # Next.js SSR アプリケーション（ポート3000）
│   ├── app/             # App Router（Next.js 15+）
│   ├── components/      # 再利用可能UIコンポーネント
│   ├── lib/             # ユーティリティ・設定
│   └── package.json     # フロントエンド依存関係
├── 📁 backend/           # Django REST API（ポート8000）
│   ├── users/           # ユーザー管理
│   ├── content/         # 作品管理
│   ├── marketplace/     # 販売・決済
│   ├── collaboration/   # コラボレーション
│   ├── events/          # イベント管理
│   ├── streaming/       # Live配信
│   ├── jobs/            # 仕事マッチング
│   ├── gamification/    # ゲーミフィケーション
│   └── manage.py        # Django管理コマンド
├── 📁 docs/             # プロジェクト文書
│   ├── 00_統合要件定義書.md      # 全体仕様書
│   └── 11_開発環境ルール設定書.md # 開発ルール
├── 📁 scripts/          # 自動化スクリプト
└── 📄 DEVELOPMENT_RULES.md      # 開発環境統一ルール

```text

---

## ⚙️ 技術スタック

### フロントエンド（frontend/）

- **React 18.3+** / **Next.js 15.0+** / **TypeScript 5.7+**

- **TailwindCSS** / **Radix UI** / **Framer Motion**

- **PWA対応** / **レスポンシブデザイン**

### バックエンド（backend/）

- **Python 3.12+** / **Django 5.1+** / **Django REST Framework 3.15+**

- **PostgreSQL 17+** (本番) / **SQLite** (開発)

- **Redis 7.4+** / **Celery 5.4+** / **Django Channels 4.1+**

---

## 🎮 ゲーミフィケーション仕様

```python

## EXP獲得システム（統合要件定義書準拠）

EXP_ACTIONS = {
    'artwork_post': 100,      # 作品投稿
    'artwork_purchase': 50,   # 作品購入
    'like_received': 10,      # いいね獲得
    'comment_post': 5,        # コメント投稿
    'sale_completed': 500,    # 販売成約
    'stream_minute': 10,      # Live配信（分）
    'daily_login': 10,        # デイリーログイン
}

```text

### レベル・実績システム

- **レベル計算**: 前レベル×1.5の累積EXP

- **バッジ階層**: Bronze/Silver/Gold/Platinum

- **ランキング**: 総合レベル・月間EXP・売上・人気作品

---

## 💰 サブスクリプションプラン

| プラン | 月額 | 月間投稿 | 手数料 | Live配信 |
|--------|------|----------|--------|----------|
| FREE | ¥0 | 3作品 | 15% | ❌ |
| STANDARD | ¥800 | 20作品 | 12% | 50人 |
| PRO | ¥1,500 | 無制限 | 8% | 200人 |
| BUSINESS | ¥10,000 | 無制限 | 5% | 1,000人 |

---

## 🎨 ブランディング

### カラーパレット

```css
/* ブランドカラー */
Primary: #6366F1 (Indigo-500)
Brand Gradient: linear-gradient(180deg, #FCD34D 0%, #F97316 100%)

/* ダークモード（デフォルト） */
Background: #111827 / #1F2937
Text Primary: #F9FAFB

```text

### ブランドアイデンティティ

- **ロゴ**: ファンタジー魔法陣 + ENモノグラム

- **フォント**: PT Serif（ブランド）/ Noto Sans JP（UI）

---

## 🌐 多言語・多通貨対応

### 対応言語

- 🇯🇵 日本語（デフォルト）

- 🇺🇸 英語

- 🇰🇷 韓国語

- 🇨🇳 中国語（簡体・繁体）

- 🇻🇳 ベトナム語

### 対応通貨

- **JPY** (日本円) / **USD** (米ドル) / **EUR** (ユーロ)

- **KRW** (韓国ウォン) / **CNY** (中国元) / **VND** (ベトナムドン)

---

## 📝 開発ルール

### 日次開発フロー

```bash

## 1. 作業開始

git pull origin main
cd backend/ && python manage.py migrate
cd ../frontend/ && npm install

## 2. 開発サーバー起動（必須ルール遵守）

## ターミナル1: cd backend/ && python manage.py runserver

## ターミナル2: cd frontend/ && npm run dev

## 3. 作業完了

git add .
git commit -m "feat: 新機能の説明"
git push origin feature/branch-name

```text

### コーディング規約

- **Python**: PEP 8 + Black formatter

- **TypeScript**: ESLint + Prettier

- **Git**: Conventional Commits

---

## 🧪 テスト・品質管理

### テスト実行（各フォルダで実行）

```bash

## フロントエンド（frontend/で実行）

cd frontend/
npm run test
npm run lint

## バックエンド（backend/で実行）

cd backend/
python manage.py test
flake8 .

```text

---

## 📚 関連ドキュメント

1. **[統合要件定義書](./docs/00_統合要件定義書.md)** - プロジェクト全体仕様

2. **[開発環境ルール設定書](./docs/11_開発環境ルール設定書.md)** - 開発ルール詳細

3. **[DEVELOPMENT_RULES.md](./DEVELOPMENT_RULES.md)** - クイックリファレンス

---

## 🚀 ロードマップ

### Phase 1: 基盤構築（3ヶ月）

- ✅ ユーザー認証・管理

- ✅ 作品投稿・閲覧

- 🔄 決済システム

### Phase 2: コア機能（4ヶ月）

- 📋 ゲーミフィケーション

- 📋 Live配信

- 📋 ソーシャル機能

### Phase 3: 拡張機能（3ヶ月）

- 📋 多言語・多通貨

- 📋 AI推薦システム

- 📋 モバイルPWA

---

## 🤝 コントリビューション

### 重要な注意事項

- **統合要件定義書**に準拠した開発をお願いします

- Django は `backend/` フォルダで実行

- Next.js は `frontend/` フォルダで実行

### コントリビューション手順

1. リポジトリをフォーク
2. フィーチャーブランチ作成: `git checkout -b feature/amazing-feature`
3. 変更をコミット: `git commit -m 'feat: Add amazing feature'`
4. ブランチをプッシュ: `git push origin feature/amazing-feature`
5. プルリクエストを開く

---

## 📞 サポート

- 📧 **Email**: dev@eldonia-nex.com

- 📱 **Discord**: [開発コミュニティ](https://discord.gg/eldonia-nex)

- 📝 **Issues**: [GitHub Issues](https://github.com/organization/eldonia-nex/issues)

---

*🎨 Eldonia-Nex - すべてのクリエイターが輝く場所 ✨*

## 統合要件定義書準拠 | 開発環境ルール適用済み
