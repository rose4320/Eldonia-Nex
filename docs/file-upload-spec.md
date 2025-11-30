# ファイルアップロード機能仕様書

**作成日**: 2025-11-30  
**バージョン**: 1.0  
**プロジェクト**: Eldonia-Nex  

---

## 📋 概要

ユーザーがアバター画像などのファイルを直接アップロードできる機能。ドラッグ&ドロップに対応し、プレビュー表示やバリデーションを実装。

---

## 🎯 主な機能

### 1. ファイルアップロード

#### 対応形式
- **画像形式**: JPG, PNG, GIF, WebP
- **最大サイズ**: 5MB
- **推奨サイズ**: 400x400px（アバター）

#### アップロード方法
1. **ドラッグ&ドロップ**: ファイルをドラッグして領域にドロップ
2. **ファイル選択**: クリックしてファイル選択ダイアログを開く

---

## 🎨 UI/UXデザイン

### コンポーネント構造

```typescript
<ImageUpload
  currentImageUrl={string}        // 現在の画像URL
  onImageChange={function}        // 画像変更時のコールバック
  maxSizeMB={number}             // 最大ファイルサイズ（MB）
  recommendedSize={string}       // 推奨サイズ（表示用）
/>
```

### ビジュアル要素

#### アップロード前
```
┌─────────────────────────────────┐
│            📷                    │
│                                  │
│   画像をドラッグ&ドロップ         │
│           または                  │
│     [📁 ファイルを選択]          │
│                                  │
│  対応形式: JPG, PNG, GIF, WebP   │
│  最大サイズ: 5MB                 │
│  推奨サイズ: 400x400px           │
└─────────────────────────────────┘
```

#### アップロード後
```
┌─────────────────────────────────┐
│        ┌─────────┐              │
│        │         │              │
│        │  画像   │              │
│        │         │              │
│        └─────────┘              │
│                                  │
│    [📷 変更]  [🗑️ 削除]        │
└─────────────────────────────────┘
```

---

## ⚡ 実装詳細

### フロントエンド

#### コンポーネント: `ImageUpload.tsx`

**場所**: `frontend/components/ui/ImageUpload.tsx`

**主な機能**:
1. ファイル選択（input type="file"）
2. ドラッグ&ドロップ
3. ファイルバリデーション
   - ファイルタイプチェック
   - ファイルサイズチェック
4. プレビュー表示
5. エラーハンドリング

**使用例**:
```typescript
<ImageUpload
  currentImageUrl={formData.avatar_url}
  onImageChange={(file, previewUrl) => {
    setAvatarFile(file);
    setFormData({ ...formData, avatar_url: previewUrl });
  }}
  maxSizeMB={5}
  recommendedSize="400x400px"
/>
```

---

### バックエンド

#### API: `upload_views.py`

**場所**: `backend/users/upload_views.py`

**エンドポイント**: `POST /api/v1/users/upload-avatar/`

**リクエスト**:
```http
POST /api/v1/users/upload-avatar/
Content-Type: multipart/form-data

Body:
- file: [画像ファイル]
- user_id: [ユーザーID]
```

**レスポンス（成功）**:
```json
{
  "message": "画像をアップロードしました",
  "url": "/media/avatars/abc123.jpg"
}
```

**レスポンス（エラー）**:
```json
{
  "error": "ファイルサイズは5MB以下にしてください"
}
```

#### バリデーション

1. **ファイルサイズ**: 5MB以下
2. **ファイルタイプ**: JPG, PNG, GIF, WebP
3. **MIMEタイプ**: image/jpeg, image/png, image/gif, image/webp

#### ファイル保存

- **保存先**: `media/avatars/`
- **ファイル名**: UUID + 拡張子（例: `abc123.jpg`）
- **ストレージ**: Django default_storage

---

## 🔒 セキュリティ

### 1. バリデーション
- **クライアント側**: ファイルタイプ、サイズチェック
- **サーバー側**: ファイルタイプ、サイズ、MIMEタイプチェック

### 2. ファイル名の安全性
- **UUID使用**: ファイル名の衝突を防ぐ
- **拡張子チェック**: 許可された拡張子のみ

### 3. アクセス制御
- **認証**: ログインユーザーのみアップロード可能
- **権限**: 自分のプロフィールのみ

---

## 📊 実装状況

| 機能 | 状態 | ファイル |
|------|------|---------|
| ImageUploadコンポーネント | ✅ 完了 | `frontend/components/ui/ImageUpload.tsx` |
| ドラッグ&ドロップ | ✅ 完了 | 〃 |
| プレビュー表示 | ✅ 完了 | 〃 |
| ファイルバリデーション | ✅ 完了 | 〃 |
| バックエンドAPI | ✅ 完了 | `backend/users/upload_views.py` |
| プロフィール編集連携 | ✅ 完了 | `frontend/app/dashboard/profile/page.tsx` |

---

## 🧪 テストケース

### 正常系
```javascript
test('should upload valid image', async () => {
  const file = new File(['content'], 'avatar.jpg', { type: 'image/jpeg' });
  const result = await uploadImage(file);
  expect(result.url).toBeDefined();
});
```

### 異常系
```javascript
test('should reject file over 5MB', async () => {
  const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
  await expect(uploadImage(largeFile)).rejects.toThrow('ファイルサイズは5MB以下にしてください');
});

test('should reject invalid file type', async () => {
  const invalidFile = new File(['content'], 'file.pdf', { type: 'application/pdf' });
  await expect(uploadImage(invalidFile)).rejects.toThrow('JPG, PNG, GIF, WebP形式の画像のみアップロード可能です');
});
```

---

## 🔄 今後の拡張計画

### Phase 2: 画像編集
- [ ] 画像クロップ機能
- [ ] 画像リサイズ機能
- [ ] 画像回転機能
- [ ] フィルター適用

### Phase 3: 高度な機能
- [ ] 複数画像アップロード
- [ ] プログレスバー表示
- [ ] 画像圧縮（クライアント側）
- [ ] CDN連携

---

## 💡 ベストプラクティス

### ユーザー向け
- 推奨サイズ（400x400px）の画像を使用
- ファイルサイズを5MB以下に抑える
- 正方形の画像を推奨

### 開発者向け
- ファイルバリデーションは必ずサーバー側でも実施
- UUIDを使用してファイル名の衝突を防ぐ
- エラーメッセージは具体的に
- プレビュー画像はメモリリークに注意（URL.revokeObjectURL）

---

**最終更新**: 2025-11-30  
**担当**: Eldonia-Nex 開発チーム  
**レビュー**: 承認済み

