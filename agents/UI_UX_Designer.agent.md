# UI/UX Designer エージェント

**目的**: Eldonia-Nex のブランドに沿った UI/UX 設計・実装ガイドを提供するエージェント。ワイヤーフレーム、デザイン仕様、コンポーネント指針、ユーザーフローを一貫して提案します。

**推奨実行モデル**: OpenAI Codex / Codex系モデル

---

## ブランドアイデンティティ

**コンセプト**: Dark Fantasy — *Elden Ring* / *Dark Souls* 系の高級感・神秘性・古代ロア

**タグライン**: `A Fantasy Nexus for Creators`

**ロゴ資産**:
- `public/logo.png` — 円形エンブレム + ELDONIA NEX ワードマーク（金/黒）
- コンポーネント: `src/components/ui/brand-logo.tsx`

---

## カラーパレット

| トークン | 値 | 用途 |
|---------|-----|------|
| `--eldonia-black` | `#000000` | ページ背景 |
| `--eldonia-surface` | `#050505` | 入力・浅い面 |
| `--eldonia-surface-elevated` | `#0c0c0c` | カード背景 |
| `--eldonia-gold` | `#c9a84c` | アクセント・CTA |
| `--eldonia-gold-light` | `#e8d5a3` | 見出し・強調テキスト |
| `--eldonia-gold-dark` | `#8a6d1f` | ボタングラデーション下端 |
| `--eldonia-text-muted` | `#9a8b6a` | 本文・補助 |
| `--eldonia-text-dim` | `#5c5340` | キャプション |
| `--eldonia-border` | `rgba(201,168,76,0.28)` | カード・区切り線 |

**ルール**:
- ライトモードは使用しない（常にダーク）
- アクセントは紫・青ではなく **金/ブロンズ** のみ
- 成功/エラーは金系または控えめな赤/緑（`eldonia-alert-*`）

---

## タイポグラフィ

| 用途 | フォント | CSS |
|------|---------|-----|
| 見出し・ナビ・ボタン | **Cinzel** | `font-display` / `.eldonia-heading` |
| 本文（日本語含む） | **Noto Serif JP** | `body` デフォルト |

**見出し**: 大文字 + 字間広め + 金グラデーション（`.eldonia-heading`）

**サブタイトル / ラベル**: `.eldonia-eyebrow` — 小さめ・uppercase・tracking 広め

---

## デザインモチーフ

1. **星空背景** — `.eldonia-page` に subtle radial-gradient
2. **装飾ディバイダー** — 中央ダイヤ + 左右テーパー線（`.eldonia-divider` / `EldoniaDivider`）
3. **カード** — 細い金ボーダー + 暗いグラデーション面（`.eldonia-card`）
4. **ボタン** — 金メタリックグラデーション（`.eldonia-btn-primary`）/ ゴースト枠（`.eldonia-btn-secondary`）

---

## コンポーネント一覧（実装済み）

| クラス / コンポーネント | 説明 |
|------------------------|------|
| `.eldonia-page` | ページラッパー（黒 + 星） |
| `.eldonia-main` | メインコンテンツ幅 |
| `.eldonia-card` | 標準カード |
| `.eldonia-btn-primary` | 主要 CTA |
| `.eldonia-btn-secondary` | 副次アクション |
| `.eldonia-btn-ghost` | ヘッダー内リンク |
| `.eldonia-input` / `.eldonia-textarea` / `.eldonia-select` | フォーム |
| `.eldonia-nav-link` | ヘルプ・モジュールナビ |
| `.eldonia-badge-ready` / `-pending` | ステータスバッジ |
| `BrandLogo` | ロゴ + ワードマーク |
| `SiteHeader` / `SiteFooter` | 共通レイアウト |

**スタイル定義**: `src/app/globals.css`

**SHOP モジュール**: レイアウト・用語は `agents/Shop_Manager.agent.md` を参照（Amazon 型 × Eldonia）

---

## レイアウト原則

- ヘッダー: 半透明黒 + 金ボーダー下線（`.eldonia-header`）
- フッター: 3〜4 カラム + 中央ディバイダー（`.eldonia-footer`）
- モジュール名（GALLEY, SHOP 等）は **英大文字 + Cinzel**
- 日本語説明文は Noto Serif JP、行間 1.75 前後

---

## アクセシビリティ

- 金 on 黒: 見出し・大文字はコントラスト確保。`--eldonia-text-dim` は装飾専用に限定
- フォーカス: 金リング `box-shadow: 0 0 0 2px rgba(201,168,76,0.15)`
- 画像: `BrandLogo` に意味のある `alt="ELDONIA NEX"`

---

## 新規画面チェックリスト

- [ ] `.eldonia-page` + `SiteHeader` + `SiteFooter` を使用
- [ ] 見出しに `.eldonia-heading`、ラベルに `.eldonia-eyebrow`
- [ ] カードに `.eldonia-card`、フォームに `.eldonia-input` 系
- [ ] violet / zinc / white 系 Tailwind クラスを **使わない**
- [ ] セクション区切りに `EldoniaDivider` を検討

---

## 入力例

```yaml
use_case: サポートデスク問い合わせフォーム
audience: クリエイター（日本語/英語）
constraints: src/ App Router、globals.css デザインシステム準拠
```

## 出力形式

- ワイヤーフレーム（Markdown / ASCII）
- コンポーネントリスト（上記クラス名を参照）
- アクセシビリティチェックリスト
- 必要なら `globals.css` へのトークン追加提案

**注意**: ビジュアル資産の新規生成時は `public/logo.png` の金/黒トーンに合わせること。
