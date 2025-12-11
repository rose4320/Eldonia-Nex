# Google Maps API セットアップガイド

## 📍 概要

イベント会場をGoogle Mapsで検索・選択できる機能を実装しました。

## 🔧 セットアップ手順

### 1. Google Cloud Console でAPIキーを取得

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. プロジェクトを作成または選択
3. **APIとサービス** → **認証情報** に移動
4. **認証情報を作成** → **APIキー** をクリック
5. 作成されたAPIキーをコピー

### 2. 必要なAPIを有効化

以下のAPIを有効にしてください:

1. **Maps JavaScript API**
   - [有効化リンク](https://console.cloud.google.com/apis/library/maps-backend.googleapis.com)

2. **Places API**
   - [有効化リンク](https://console.cloud.google.com/apis/library/places-backend.googleapis.com)

### 3. APIキーの制限設定（推奨）

セキュリティのため、以下の制限を設定してください:

1. **アプリケーションの制限**
   - HTTPリファラー（ウェブサイト）を選択
   - ウェブサイトの制限: `localhost:3000/*`, `yourdomain.com/*`

2. **APIの制限**
   - キーを制限
   - 以下のAPIのみを選択:
     - Maps JavaScript API
     - Places API

### 4. 環境変数の設定

`frontend/.env.local` ファイルを作成:

```bash
cd frontend
cp .env.local.example .env.local
```

`.env.local` にAPIキーを設定:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

⚠️ **重要**: `.env.local` は `.gitignore` に含まれています。APIキーをGitにコミットしないでください。

## 🎯 機能

### 会場検索機能

1. **検索ボックス**
   - 会場名、住所、施設タイプで検索可能
   - 例: "会議室 渋谷", "東京国際フォーラム", "セミナールーム 新宿"

2. **地図表示**
   - 検索結果が地図上にマーカーで表示
   - マーカークリックで会場詳細を表示

3. **検索結果リスト**
   - 会場名、住所、評価、レビュー数を表示
   - クリックで会場を選択

4. **自動入力**
   - 選択した会場の情報が自動的にフォームに反映
   - 会場名、住所が自動入力される

## 🚀 使い方

### イベント作成画面での使用

1. イベント作成ページ (`/events/create`) にアクセス
2. 会場情報セクションで **🗺️ 地図で会場を探す** ボタンをクリック
3. 検索ボックスに会場情報を入力
4. 検索結果から希望の会場をクリック
5. **この会場を選択** ボタンをクリック
6. 会場名と住所が自動的にフォームに入力されます

## 📊 実装詳細

### 新規作成ファイル

1. **VenueMapSearch.tsx**
   - Google Maps統合コンポーネント
   - Places APIを使った会場検索
   - マーカー表示と選択機能

2. **google-maps.d.ts**
   - TypeScript型定義
   - Google Maps APIの型サポート

3. **.env.local.example**
   - 環境変数のテンプレート

### 修正ファイル

1. **EventForm.tsx**
   - 地図検索ボタンの追加
   - VenueMapSearchコンポーネントの統合
   - 会場選択時の自動入力処理

## 💰 料金について

- Google Maps Platform は **月$200の無料枠** があります
- Maps JavaScript API: 1,000回のロードまで無料/月
- Places API: 基本的な検索は無料枠内で十分使用可能

詳細: [Google Maps Platform 料金](https://mapsplatform.google.com/pricing/)

## ⚠️ トラブルシューティング

### 地図が表示されない

1. `.env.local` にAPIキーが正しく設定されているか確認
2. ブラウザのコンソールでエラーを確認
3. APIキーの制限設定を確認
4. Maps JavaScript API と Places API が有効になっているか確認

### 検索が機能しない

1. Places API が有効になっているか確認
2. APIキーに Places API の権限があるか確認
3. ブラウザコンソールでエラーメッセージを確認

### APIキーエラー

```
Google Maps JavaScript API error: RefererNotAllowedMapError
```

→ APIキーのHTTPリファラー制限を確認してください

## 🔒 セキュリティ

- APIキーは必ず環境変数で管理
- HTTPリファラー制限を設定
- API制限で必要なAPIのみ許可
- 本番環境では必ずドメイン制限を設定

## 📝 今後の拡張案

- [ ] 周辺施設の表示（駅、駐車場など）
- [ ] ルート案内機能
- [ ] 会場のキャパシティ情報の自動取得
- [ ] 過去のイベント会場履歴
- [ ] お気に入り会場の保存
