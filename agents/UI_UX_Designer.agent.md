# UI/UX Designer エージェント

**所属部署**: Design  
**正本**: `agents/eldonia_nex_agent_departments.md`

**目的**: Eldonia-Nex のブランドに沿った UI/UX 設計・実装ガイドを提供するエージェント。ワイヤーフレーム、デザイン仕様、コンポーネント指針、ユーザーフローを一貫して提案します。

**推奨実行モデル**: OpenAI Codex / Codex系モデル

---

## ブランドアイデンティティ

**コンセプト**: Dark Fantasy — *Elden Ring* / *Dark Souls* 系の高級感・神秘性・古代ロア

**タグライン / サブタイトル**: `A Fantasy Nexus for Creators`

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
- アプリ本体のアクセントは **金/ブロンズ** を基本とする
- **LP（`lp-*` / `src/lib/lp/`）** は Premium・Translation 等で **紫アクセント可**（`docs/14_LPブランドデザイン設定書.md`）
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

## グローバルレイアウト（Header / Footer）

### Header — 3 カラム構成

**コンポーネント**: `SiteHeader`（`src/components/layout/site-header.tsx`）  
**モバイル**: `MobileNav`（1024px 未満、同一情報を折りたたみ）

```
┌─────────────────┬──────────────────────────────┬─────────────────────────┐
│ 左              │ 中                           │ 右                      │
├─────────────────┼──────────────────────────────┼─────────────────────────┤
│ ロゴ            │ GALLEY · LAB · EVENTS ·      │ 言語選択                │
│ ELDONIA NEX     │ SHOP · COMMUNITY · WORKS     │ 通知 🔔                 │
│ サブタイトル    │ ─────────────────────────    │ ユーザーアバター        │
│                 │ [ 検索窓            ] [検索] │ ログアウト / ログイン   │
│                 │                              │ サインイン              │
│                 │                              │ ─────────────────────   │
│                 │                              │ EXP バー（ログイン時）  │
└─────────────────┴──────────────────────────────┴─────────────────────────┘
```

| 領域 | 内容 | ルール |
|------|------|--------|
| **左** | `BrandLogo` + タイトル + サブタイトル | ホーム `/` へリンク |
| **中（上段）** | モジュールナビ | **H1 モジュール名は常に英大文字**（GALLEY, LAB, …） |
| **中（下段）** | `HeaderSearch` | プレースホルダー等は選択言語で表示 |
| **右（上段）** | `HeaderLanguageSelect` · `NotificationBell` · `UserAvatarLink` · 認証 | UI ラベルのみ多言語 |
| **右（下段）** | `ExpBarCompact` | ログインユーザーのみ |

**言語切替（メインコンテンツ）**:
- Cookie: `eldonia_locale`（`ja` / `en` / `ko` / `zh-CN`）
- `src/lib/i18n/content/messages.ts` + `shop-messages.ts` — ページ本文（4言語）
- **ヘッダーナビ・検索・認証ボタンは翻訳しない**（`header-chrome.ts` 固定英語）
- `getContent(locale)` — サーバーコンポーネント
- `LocaleProvider` + `useContent()` — クライアントコンポーネント
- `src/lib/i18n/ui-messages.ts` — chrome 文言の薄いラッパー
- **モジュール名（GALLEY, LAB, EVENTS …）は翻訳しない**（H1 / ナビ）
- **分類ラベル**（ジャンル・領域・形式）: `src/lib/i18n/taxonomy.ts` — UI 言語で直接表示（例: en → Illustration）
- **ユーザー生成テキスト**（タイトル・説明・タグ）: `ContentLine` / `TagWithHint` — 原文の下に `(翻訳)` を表示
- `localizedHint()` + `phrases.ts` — 既知フレーズの翻訳辞書
- **ブラウザ自動翻訳は無効化**（`<html translate="no" class="notranslate">` + `meta google=notranslate`）— サイト内言語切替と二重翻訳を防ぐ

**ナビ定義**: `src/lib/layout/nav-links.ts` → `MODULE_NAV_LINKS`

---

### Footer — 3 カラム + 中央ブランド

**コンポーネント**: `SiteFooter`（`src/components/layout/site-footer.tsx`）

```
                    [ ELDONIA NEX + サブタイトル ]
        ─────────────────────────────────────────────────
        左                    中                    右
   技術スタック          ヘルプ・サイトマップ      協力・スポンサー
   Next.js / Supabase    FAQ / Guides / Contact    パートナー名
   PostgreSQL …          モジュールリンク        スポンサー枠
        ─────────────────────────────────────────────────
              © Eldonia-Nex. All rights reserved.
```

| 領域 | 内容 |
|------|------|
| **上中央** | タイトルロゴ + サブタイトル |
| **左** | 技術スタック一覧 |
| **中** | ヘルプリンク + サイトマップ（モジュール H1 リンク） |
| **右** | 協力会社・スポンサー |
| **下中央** | コピーライト |

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
| `.eldonia-header-grid` | ヘッダー 3 カラム |
| `.eldonia-footer-grid` | フッター 3 カラム |
| `.eldonia-card` | 標準カード |
| `.eldonia-btn-primary` | 主要 CTA |
| `.eldonia-btn-secondary` | 副次アクション |
| `.eldonia-btn-ghost` | ヘッダー内リンク |
| `.eldonia-input` / `.eldonia-textarea` / `.eldonia-select` | フォーム |
| `.eldonia-nav-link` | モジュールナビ（Cinzel 大文字） |
| `.eldonia-exp-bar-compact` | ヘッダー用 EXP バー |
| `BrandLogo` | ロゴ + ワードマーク + サブタイトル |
| `SiteHeader` / `SiteFooter` | 共通レイアウト |
| `HeaderLanguageSelect` | 言語選択 |
| `HeaderSearch` | グローバル検索（GALLEY へ） |

**スタイル定義**: `src/app/globals.css`

**SHOP モジュール**: レイアウト・用語は `agents/Shop_Manager.agent.md` を参照（Amazon 型 × Eldonia）

---

## レイアウト原則

- ヘッダー: 半透明黒 + 金ボーダー下線、**デスクトップ 3 カラム**
- フッター: **中央ブランド + 3 カラム + 下中央コピーライト**
- モジュール名（GALLEY, LAB 等）は **英大文字 + Cinzel** — 言語に依存しない
- 日本語説明文は Noto Serif JP、行間 1.75 前後
- ブレークポイント: ヘッダー 3 カラムは `lg`（1024px）以上

---

## アクセシビリティ

- 金 on 黒: 見出し・大文字はコントラスト確保。`--eldonia-text-dim` は装飾専用に限定
- フォーカス: 金リング `box-shadow: 0 0 0 2px rgba(201,168,76,0.15)`
- 画像: `BrandLogo` に意味のある `alt="ELDONIA NEX"`
- 言語 `<select>` に `aria-label="Language"`

---

## 新規画面チェックリスト

- [ ] `.eldonia-page` + `SiteHeader` + `SiteFooter` を使用
- [ ] ページ H1 がモジュール名の場合は **英大文字のまま**（翻訳しない）
- [ ] UI ラベル・プレースホルダーは `uiMessage(locale, key)` を使用
- [ ] 見出しに `.eldonia-heading`、ラベルに `.eldonia-eyebrow`
- [ ] カードに `.eldonia-card`、フォームに `.eldonia-input` 系
- [ ] violet / zinc / white 系 Tailwind クラスを **使わない**（LP セクションは例外）
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
