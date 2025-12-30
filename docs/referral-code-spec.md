# 紹介コード機能仕様書

**作成日**: 2025-11-30  
**バージョン**: 1.0  
**プロジェクト**: Eldonia-Nex  

---

## 📋 概要

ユーザーが友達を招待し、紹介特典を獲得できる機能。QRコード生成、紹介統計、報酬システムを実装。

---

## 🎯 目的

1. **ユーザー獲得**: 既存ユーザーによる新規ユーザー獲得
2. **エンゲージメント向上**: 紹介特典でモチベーション向上
3. **コミュニティ拡大**: 信頼できる友達同士のネットワーク形成

---

## 🌐 アクセス情報

### URL
```
/dashboard/referral
```

### アクセス権限
- **認証**: ログイン必須
- **権限**: 全ユーザー利用可能
- **未認証時**: `/signin` にリダイレクト

---

## 📝 主な機能

### 1. 紹介コード生成

#### フォーマット
```
ELDONIA-{USERNAME}-{USER_ID}
```

**例**:
- `ELDONIA-DEMO_USER-1`
- `ELDONIA-CREATOR_USER-2`

#### 紹介URL
```
https://eldonia-nex.com/register?ref=ELDONIA-DEMO_USER-1
```

---

### 2. QRコード生成 📱

#### 仕様
- **ライブラリ**: qrcode (npm)
- **サイズ**: 300x300px
- **カラー**: 紫色（#8B5CF6）
- **背景**: 白色（#FFFFFF）
- **エンコード内容**: 紹介URL

#### 機能
- リアルタイム生成
- PNG形式でダウンロード可能
- ファイル名: `eldonia-referral-{username}.png`

---

### 3. 紹介統計 📊

#### 表示項目

| 項目 | 説明 |
|------|------|
| 総紹介数 | 紹介したユーザーの総数 |
| アクティブユーザー | 現在アクティブな紹介ユーザー数 |
| 獲得報酬 | 紹介によって得た報酬（ポイント） |

---

### 4. 紹介特典 🎁

#### 特典内容

| イベント | あなた | 友達 | 説明 |
|---------|--------|------|------|
| 友達が登録 | 500pt | 500pt | 登録完了で両者に付与 |
| 友達が初購入 | 10% | - | 購入金額の10%をキャッシュバック |
| 10人紹介達成 | プレミアム1ヶ月無料 | - | 10人紹介達成で特典 |

---

## 🎨 UI/UXデザイン

### レイアウト

```
┌─────────────────┬─────────────────┐
│  紹介コード     │   紹介実績      │
│  ┌─────────┐   │   ┌─────────┐   │
│  │ELDONIA- │   │   │ 総紹介数 │   │
│  │DEMO-1   │   │   │    0    │   │
│  └─────────┘   │   └─────────┘   │
│  [📋 コピー]    │   ┌─────────┐   │
│                 │   │アクティブ│   │
│  QRコード       │   │    0    │   │
│  ┌─────────┐   │   └─────────┘   │
│  │ [QR画像]│   │   ┌─────────┐   │
│  └─────────┘   │   │獲得報酬  │   │
│  [💾ダウンロード]│   │  ¥0     │   │
│                 │   └─────────┘   │
├─────────────────┴─────────────────┤
│  紹介リンク                        │
│  https://eldonia.../ref=...       │
│  [🔗 リンクをコピー]               │
└───────────────────────────────────┘
```

---

## ⚡ 実装詳細

### フロントエンド

#### ページ: `referral/page.tsx`

**場所**: `frontend/app/dashboard/referral/page.tsx`

**主な機能**:
1. 紹介コード表示
2. QRコード生成・表示
3. 紹介統計表示
4. コピー機能（コード、URL）
5. QRコードダウンロード

**依存ライブラリ**:
```json
{
  "qrcode": "^1.5.3",
  "@types/qrcode": "^1.5.5"
}
```

**使用例**:
```typescript
// QRコード生成
const qrCodeUrl = await QRCode.toDataURL(referralUrl, {
  width: 300,
  margin: 2,
  color: {
    dark: "#8B5CF6",
    light: "#FFFFFF"
  }
});
```

---

### バックエンド

#### API: `referral_views.py`

**場所**: `backend/users/referral_views.py`

#### エンドポイント1: 紹介コード取得

**URL**: `GET /api/v1/users/{user_id}/referral-code/`

**レスポンス**:
```json
{
  "referral_code": "ELDONIA-DEMO_USER-1",
  "referral_url": "https://eldonia-nex.com/register?ref=ELDONIA-DEMO_USER-1",
  "stats": {
    "total_referrals": 5,
    "active_referrals": 3,
    "total_rewards": 2500
  }
}
```

#### エンドポイント2: 紹介リスト取得

**URL**: `GET /api/v1/users/{user_id}/referrals/`

**レスポンス**:
```json
{
  "referrals": [
    {
      "id": 10,
      "username": "new_user",
      "display_name": "新しいユーザー",
      "is_active": true,
      "joined_at": "2025-11-30T12:00:00Z",
      "status": "active"
    }
  ],
  "count": 1
}
```

---

## 🗄️ データベース

### Referralモデル

| フィールド | 型 | 説明 |
|-----------|-----|------|
| id | Integer | 主キー |
| referrer | ForeignKey(User) | 紹介したユーザー |
| referred | ForeignKey(User) | 紹介されたユーザー |
| created_at | DateTime | 紹介日時 |
| is_active | Boolean | アクティブ状態 |

---

## 🔒 セキュリティ

### 1. 紹介コードの一意性
- ユーザーID + ユーザー名で一意性を保証
- 大文字変換で可読性向上

### 2. 不正利用防止
- [ ] 同一IPからの重複登録チェック
- [ ] 自己紹介の禁止
- [ ] 紹介上限設定（例: 1日10人まで）

### 3. データ保護
- 紹介関係はプライベート情報
- 本人のみ統計閲覧可能

---

## 📊 実装状況

| 機能 | 状態 | ファイル |
|------|------|---------|
| 紹介コード生成 | ✅ 完了 | `backend/users/referral_views.py` |
| QRコード生成 | ✅ 完了 | `frontend/app/dashboard/referral/page.tsx` |
| 紹介統計表示 | ✅ 完了 | 〃 |
| コピー機能 | ✅ 完了 | 〃 |
| QRダウンロード | ✅ 完了 | 〃 |
| バックエンドAPI | ✅ 完了 | `backend/users/referral_views.py` |
| ダッシュボード連携 | ✅ 完了 | `frontend/app/dashboard/page.tsx` |

---

## 🧪 テストケース

### 正常系

```javascript
test('should generate referral code', async () => {
  const code = generateReferralCode({ username: 'demo', id: 1 });
  expect(code).toBe('ELDONIA-DEMO-1');
});

test('should generate QR code', async () => {
  const qrUrl = await generateQRCode('https://example.com');
  expect(qrUrl).toMatch(/^data:image\/png;base64,/);
});
```

### 異常系

```javascript
test('should reject self-referral', async () => {
  await expect(registerWithReferral('ELDONIA-DEMO-1', user1))
    .rejects.toThrow('自己紹介はできません');
});
```

---

## 🔄 紹介フロー

### ユーザージャーニー

```
1. [紹介者] ダッシュボードで「紹介コード」をクリック
   ↓
2. [紹介者] 紹介コードまたはQRコードを友達にシェア
   ↓
3. [友達] 紹介URLまたはQRコードから登録ページへ
   ↓
4. [友達] 紹介コードが自動入力された状態で登録
   ↓
5. [システム] 登録完了時に両者にポイント付与
   ↓
6. [紹介者] 紹介統計が更新される
```

---

## 📱 シェア方法

### 1. コード共有
- クリップボードにコピー
- メッセージアプリでシェア
- SNSで投稿

### 2. QRコード共有
- スクリーンショット
- PNG画像ダウンロード
- 印刷して配布

### 3. リンク共有
- URLをコピー
- メール送信
- SNS投稿

---

## 💰 報酬システム

### ポイント計算

```python
# 登録ボーナス
REGISTRATION_BONUS = 500  # 両者に付与

# 購入キャッシュバック
def calculate_cashback(purchase_amount):
    return purchase_amount * 0.10  # 10%

# 達成報酬
MILESTONE_REWARDS = {
    10: "premium_1month",  # 10人紹介
    50: "premium_3month",  # 50人紹介
    100: "premium_1year"   # 100人紹介
}
```

---

## 🎯 今後の拡張計画

### Phase 2: ソーシャルシェア
- [ ] Twitter/X連携
- [ ] LINE連携
- [ ] Facebook連携
- [ ] メール招待

### Phase 3: 高度な分析
- [ ] 紹介元トラッキング
- [ ] コンバージョン率分析
- [ ] ライフタイムバリュー計測
- [ ] A/Bテスト機能

### Phase 4: ゲーミフィケーション
- [ ] 紹介ランキング
- [ ] バッジシステム
- [ ] リーダーボード
- [ ] 紹介チャレンジイベント

---

## 📞 よくある質問

**Q: 紹介コードに有効期限はありますか？**  
A: いいえ、紹介コードは永続的に有効です。

**Q: 何人まで紹介できますか？**  
A: 現在は上限はありませんが、不正利用防止のため今後制限を設ける可能性があります。

**Q: 紹介報酬はいつ付与されますか？**  
A: 友達が登録を完了した時点で即座に付与されます。

---

## 📄 関連ドキュメント

- [ユーザーダッシュボード仕様書](./dashboard-spec.md)
- [ポイントシステム仕様書](./points-system-spec.md)
- [報酬システム仕様書](./rewards-spec.md)

---

**最終更新**: 2025-11-30  
**担当**: Eldonia-Nex 開発チーム  
**レビュー**: 承認済み





