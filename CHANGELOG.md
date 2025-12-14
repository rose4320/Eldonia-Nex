# Eldonia-Nex Version History

## Version 0.5.0 (2025-12-14)

### 🎨 新機能

#### **ポートフォリオシステム**
- ユーザーポートフォリオ作成・管理機能
- 公開/限定公開/非公開の可視性設定
- 作品タイプ別分類（イラスト、漫画、3D、動画、音楽等）
- いいね機能、閲覧数カウント
- ダッシュボードからのポートフォリオ管理

#### **求人・案件応募システム（WORKSページ）**
- 2タブ構成: 求人検索 / クリエイター検索
- 求人応募時にユーザー情報自動添付
  - Lv、EXP、称号（レベルに応じて自動決定）
  - 公開設定のポートフォリオのみ自動添付
- クリエイター検索・オファー機能
- 称号システム: ルーキー → ビギナー → インターミディエイト → アドバンス → エキスパート → マスター → レジェンド

#### **ユーザープロフィール拡張**
- UserAddress モデル: 詳細住所情報
- UserSkill モデル: スキル情報（カテゴリ、レベル、経験年数）
- UserDetail モデル: その他詳細情報（職業、学歴等）
- フルプロフィールAPI（統合取得）

### 🔧 改善

- ダッシュボードのプラン同期修正
- プラン変更タブとヘッダーのプラン表示統一
- アバター表示の修正（相対URL→絶対URL変換）
- 応募時のポートフォリオ自動添付ロジック最適化

### 🗄️ データベース

- `portfolios` テーブル追加
- `portfolio_likes` テーブル追加
- `user_addresses` テーブル追加
- `user_skills` テーブル追加
- `user_details` テーブル追加

### 📡 API エンドポイント

- `GET/POST /api/v1/portfolios/me/` - マイポートフォリオ
- `GET/PATCH/DELETE /api/v1/portfolios/me/<id>/` - ポートフォリオ詳細
- `GET /api/v1/portfolios/` - 公開ポートフォリオ一覧
- `POST /api/v1/portfolios/<id>/like/` - いいね
- `GET/PATCH /api/v1/users/me/address/` - 住所情報
- `GET/POST /api/v1/users/me/skills/` - スキル情報
- `GET/PATCH /api/v1/users/me/detail/` - 詳細情報
- `GET /api/v1/users/me/full-profile/` - フルプロフィール

---

## Version 0.4.0 (2025-12-13)

### 🌍 新機能

#### **多言語・多通貨対応**
- 5言語対応: 日本語、English、한국어、简体中文、繁體中文
- 6通貨対応: JPY, USD, EUR, KRW, CNY, TWD
- リアルタイム為替レート換算機能
- ユーザー別言語・通貨設定保存
- next-intl による完全なi18n対応

#### **バックエンド実装**
- `localization` アプリ新規作成
- `Language` モデル: 対応言語マスタ
- `Currency` モデル: 対応通貨マスタ
- `ExchangeRate` モデル: 為替レート履歴
- `ContentTranslation` モデル: コンテンツ翻訳データ
- Userモデルに `preferred_language`, `preferred_currency`, `timezone` フィールド追加

#### **API エンドポイント**
- `GET /api/v1/localization/languages/` - 対応言語一覧
- `GET /api/v1/localization/currencies/` - 対応通貨一覧
- `GET /api/v1/localization/currencies/rates/` - 為替レート取得
- `POST /api/v1/localization/currencies/convert/` - 通貨換算
- `GET /api/v1/localization/users/me/locale/` - ユーザー地域設定取得
- `PUT /api/v1/localization/users/me/language/` - 言語設定更新
- `PUT /api/v1/localization/users/me/currency/` - 通貨設定更新

#### **フロントエンド実装**
- `LanguageSwitcher` コンポーネント: 言語切り替えUI（国旗表示）
- `LocalizationSettings` コンポーネント: 言語・通貨設定画面
- `CurrencyDisplay` コンポーネント: 自動通貨換算表示
- next-intl ミドルウェア設定
- 多言語メッセージファイル（ja.json, en.json, ko.json）

### 🔧 改善

- 初期データ投入用マネジメントコマンド `load_localization_data` 追加
- 為替レート自動計算（逆レート生成）
- 通貨表示の小数点桁数自動調整（JPY/KRW: 0桁、USD/EUR: 2桁）
- 為替レート自動更新コマンド `update_exchange_rates` 追加（ExchangeRate-API連携）
- PostgreSQL 17への移行完了
- 全5言語のメッセージファイル完備（ja, en, ko, zh-CN, zh-TW）
- PlanLimitsInfoコンポーネントの多言語対応完了

### 📚 ドキュメント

- 多言語・多通貨対応のドキュメント更新

---

## Version 0.3.0 (2025-12-12)

### 🎉 新機能

#### **EXP報酬システム**
- イベント作成時に50 EXPを自動付与
- イベント成功時の参加率別EXP付与:
  - 即完売 (100%): 500 EXP
  - ギリギリ完売 (95-99%): 400 EXP
  - 90%達成: 300 EXP
  - 80%達成: 250 EXP
  - 70%達成: 200 EXP
  - 60%達成: 150 EXP
  - 50%達成: 100 EXP
  - 40%達成: 80 EXP
  - 30%達成: 60 EXP
  - 20%達成: 40 EXP
  - 10%達成: 20 EXP
- レベルシステム実装（level × 100 EXPで次レベル）
- `gamification/exp_rewards.py` にヘルパー関数追加

#### **イベント完了API**
- `POST /api/v1/events/{event_id}/complete/` エンドポイント追加
- 実際の参加者数を記録して参加率を計算
- 参加率に応じたEXP自動付与
- レベルアップ判定とレスポンス情報

#### **プラン制限システム**
- サブスクリプションプラン別の制限実装:
  - フリープラン: 月2イベント、最大50名、無料イベントのみ
  - プレミアムプラン: 月10イベント、最大200名、有料イベント可
  - プロプラン: 無制限
- `api/events/permissions.py` に制限ロジック実装
- イベント作成時のプラン検証
- 月間イベント数、収容人数、有料イベント可否をチェック

#### **プラン制限UI**
- `PlanLimitsInfo.tsx` コンポーネント作成
- プログレスバーで月間イベント作成数を視覚化
- プランバッジ表示（Free/Premium/Pro）
- 残り作成可能イベント数表示
- アップグレード促進ボタン（フリープラン時）
- `/api/v1/users/plan-limits/` でプラン情報取得API追加

#### **Google Maps統合**
- `VenueMapSearch.tsx` コンポーネント作成
- Google Maps JavaScript API統合
- Places API で会場検索機能
- インタラクティブな地図表示
- 検索結果のマーカー表示
- 会場の評価・レビュー数表示
- 選択した会場情報の自動入力
- TypeScript型定義追加 (`types/google-maps.d.ts`)

### 📚 ドキュメント

- `docs/Google_Maps_Setup.md` セットアップガイド追加
- `.env.local.example` 環境変数テンプレート作成
- Google Cloud Console設定手順
- APIキー取得と制限設定方法
- トラブルシューティングガイド

### 🔧 改善

- **EventCreateView** にEXP付与ロジック統合
- **CurrentUserView** でEXPとレベル情報を正確に返すように修正
- **EventForm** に地図検索ボタン追加
- イベント作成レスポンスに `exp_reward` 情報を含めるように変更
- ユーザー情報APIのフィールド名を正しく修正

### 🐛 バグ修正

- ユーザー情報APIでEXPフィールドが正しく返されない問題を修正
- プラン情報の取得時にDBから最新情報をrefresh
- 認証トークンの永続化問題を解決

## Version 0.2.0 (2025-11-30)

### 🎉 新機能

#### **作品アップロード機能**
- 全メディア対応のアップロード機能実装
  - 🖼️ 画像: JPG, PNG, GIF, WebP, BMP, SVG (最大10MB)
  - 🎬 動画: MP4, MOV, AVI, MKV, WebM, FLV (最大500MB)
  - 🎵 音楽: MP3, WAV, OGG, FLAC, AAC, M4A (最大50MB)
  - 🧊 3Dモデル: OBJ, FBX, GLTF, GLB, BLEND, STL (最大100MB)
  - 📄 ドキュメント: PDF, TXT, DOC, DOCX (最大20MB)
  - 📦 アーカイブ: ZIP, RAR, 7Z (最大200MB)

#### **紹介コード機能**
- ユーザーベースの紹介コード生成
- QRコード生成・ダウンロード機能
- 紹介統計表示（総紹介数、アクティブ、報酬）
- 紹介特典システム

#### **プロフィール設定機能**
- 表示名、メールアドレス、自己紹介編集
- アバター画像アップロード（ドラッグ&ドロップ対応）
- タイムゾーン設定（6地域対応）
- リアルタイム文字数カウント

#### **ダッシュボード強化**
- 統計カード表示（作品数、フォロワー、いいね、閲覧数、収益）
- クイックアクション（作品投稿、ギャラリー、紹介コード）
- タブナビゲーション（概要、プロフィール、設定、紹介コード、アクティビティ）

### 🛡️ セキュリティ

#### **ファイルアップロードセキュリティ**
- ディレクトリトラバーサル攻撃対策
- 二重拡張子攻撃対策
- NULLバイト攻撃対策
- SVG XSS攻撃対策
- MIMEタイプ検証（libmagic使用）
- ファイル内容検証（マジックナンバーチェック）
- ファイルサイズ検証（最小・最大）
- ファイルハッシュ計算（SHA-256）
- ファイル名サニタイズ
- メタデータ記録（監査ログ）

#### **Django セキュリティ設定**
- HTTPS リダイレクト（本番環境）
- HSTS 設定
- CSRF トークン検証
- XSS 対策
- Secure Cookie 設定
- SameSite Cookie 設定

### 🎨 UI/UX改善

#### **ダッシュボード**
- プロフェッショナルなグラデーションデザイン
- レスポンシブ対応（モバイル、タブレット、デスクトップ）
- ホバーエフェクト・アニメーション
- カラフルな統計カード

#### **作品アップロードページ**
- 直感的なフォームデザイン
- 対応ファイル形式の明確な表示
- リアルタイムバリデーション
- エラーハンドリング

#### **紹介コードページ**
- QRコード自動生成（白地に黒）
- ワンクリックコピー機能
- 紹介統計の視覚化
- 使い方ガイド

### 🔧 技術改善

#### **バックエンド API**
- 作品アップロードAPI (`POST /api/v1/artworks/upload-image/`)
- 作品作成API (`POST /api/v1/artworks/create/`)
- 作品一覧API (`GET /api/v1/artworks/list/`)
- 紹介コードAPI (`GET /api/v1/users/{user_id}/referral-code/`)
- 紹介リストAPI (`GET /api/v1/users/{user_id}/referrals/`)
- アバターアップロードAPI (`POST /api/v1/users/upload-avatar/`)

#### **フロントエンド**
- QRコード生成ライブラリ統合 (qrcode)
- 画像アップロードコンポーネント (ImageUpload)
- ダミー認証システム（開発用）
- AuthContext強化

#### **データベース**
- PostgreSQL 17 対応
- マイグレーション実行

### 📚 ドキュメント

- ユーザープロフィール設定機能仕様書 (`docs/user-profile-settings-spec.md`)
- ファイルアップロード機能仕様書 (`docs/file-upload-spec.md`)
- 紹介コード機能仕様書 (`docs/referral-code-spec.md`)
- セキュリティ対策仕様書 (`docs/security-upload-spec.md`)

### 🐛 バグ修正

- インポートエラー修正（Referralモデルの場所）
- フィールド名修正（referred → referred_user）
- プロトコル判定修正（HTTPS判定）
- HSTS キャッシュ問題の解決（ポート変更 8000 → 8001）
- フロントエンドビルドエラー修正
- ダミー認証システム実装

### 🔄 変更

#### **カテゴリー拡張**
- 8カテゴリー → 16カテゴリー
- アイコン追加（視認性向上）

#### **ポート変更**
- バックエンド: 8000 → 8001（HSTS対策）

---

## Version 0.1.0 (2025-11-29)

### 初期リリース
- プロジェクト構造作成
- Django バックエンドセットアップ
- Next.js フロントエンドセットアップ
- 基本認証機能
- ギャラリーページ
- Docker 構成

---

**最終更新**: 2025-11-30
**次期バージョン予定**: 0.3.0


