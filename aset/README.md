# Eldonia–Nex アセット（`aset/`）

LP およびブランド用画像の **正本** はリポジトリルートの `aset/` に置きます。

## ディレクトリ構成（正規ファイル）

```
aset/
├── logo.png                      # EN 紋章 + ワードマーク
├── gallery_icon_1024.png         # Services: Gallery
├── community_icon_1024.png
├── shop_icon_1024.png
├── event_icon_1024.png
├── work_icon_1024.png
├── lab_icon_1024.png
├── lp/
│   ├── hero.png                  # Hero 背景（魔法都市・月夜）
│   ├── cta-bg.png                # CTA 最背面（テラス・月夜都市）
│   ├── world.png                 # World セクション背景
│   ├── pin-badge.png             # EN 記念ピンバッジ
│   ├── globe.png                 # Translation 地球儀
│   ├── owl.png                   # CTA フクロウ（next/image）
│   ├── border-sheet.png          # 枠線・区切り線リファレンス（正本）
│   └── borders/                  # border-sheet から切り出し（scripts/extract-lp-borders.py）
│       ├── frame-ornate.png      # 装飾枠（744×202、border-image 9-slice 用）
│       ├── divider-star.png      # セクション区切り（星）
│       ├── divider-en-ornate.png # EN 紋章付き区切り（フッター等）
│       └── …
└── README.md
```

> `ChatGPT Image *.png` や UUID 名のファイルは生成元エクスポート。正規名へ整理済みのものは上記を編集してください。

## Web 公開

Next.js は `public/` のみ配信するため、同期スクリプトで `public/aset/` にコピーします。

```bash
npm run aset:sync
```

`npm run dev` / `npm run build` 前にも自動実行されます（`predev` / `prebuild`）。

アプリ内 URL: `/aset/...`（定義: `src/lib/lp/assets.ts`）

## 差し替え手順

1. `aset/` のファイルを更新
2. `npm run aset:sync`
3. ローカル確認またはデプロイ

詳細: [docs/14_LPブランドデザイン設定書.md](../docs/14_LPブランドデザイン設定書.md)
