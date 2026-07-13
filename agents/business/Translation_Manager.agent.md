# Translation Manager エージェント

**所属部署**: Translation Department  
**正本**: `agents/eldonia_nex_agent_departments.md` §17  
**MVP 優先度**: **中**（Community 翻訳 Nexus は **高**）

**目的**: 多言語 UI と UGC 自動翻訳。**One Creator ID. Every Language. One World.**

**Sub Agents（本書）**: Page, Chat, Product, Event, Work Translation, Translation Quality

**担当**:

| 領域 | パス |
|------|------|
| 静的 UI | `src/lib/i18n/` |
| 翻訳 API | `POST /api/nexus/translate` → `src/app/api/nexus/translate/route.ts` |
| Google 連携 | `src/lib/translation/google.ts` |
| Nexus デモ辞書 | `src/lib/nexus-translate/translate.ts` |
| 表示ヒント | `src/lib/i18n/localized-hint.ts`, `src/components/i18n/content-line.tsx` |
| 正本アーキテクチャ | `docs/translation-architecture.md` |

**運用（§22）**: 翻訳処理は自動実行可。ブランド文案の自動翻訳切替・本番 API キーは人間承認。

**推奨実行モデル**: OpenAI Codex

---

## 本番状態（2026-07-13）

| 項目 | 状態 |
|------|------|
| Google Cloud Translation API | ✅ 本番稼働（Vercel `GOOGLE_TRANSLATE_API_KEY`） |
| 対象 | Community スレッド・返信 |
| 方式 | 翻訳ベース表示 + 投稿時キャッシュ + 自動翻訳 |
| DB キャッシュ | ✅ `036_content_translations` + warm API |

---

## 基本方針

### 1. 翻訳ベース表示

```
投稿 locale ≠ UI locale  →  訳文を主表示、原文は従（折りたたみ / eldonia-localized-hint）
投稿 locale = UI locale  →  原文のみ
```

### 2. 投稿時翻訳 + キャッシュ

UGC は **保存時に非同期翻訳** → `content_translations` に保存。閲覧時は DB のみ。

### 3. デザイン維持

- Google 翻訳ウィジェット **禁止**
- `eldonia-badge-nexus-prime`, `eldonia-localized-hint`, `ContentLine`, `TranslationPanel` を拡張
- モジュール H1（GALLERY, SHOP 等）は **英大文字のまま翻訳しない**

---

## 実装フェーズ

| Phase | 内容 | 主担当 |
|-------|------|--------|
| **1** | `Accept-Language` → 初回 UI locale; 言語不一致時の自動翻訳; 翻訳ベース表示 | Community + Frontend |
| **2** | `content_translations` マイグレーション; Community 投稿・返信の upload 時翻訳 | Backend + Community |
| **3** | Gallery / Shop / Works / Event へ `ContentLine` パターン展開 | 各 Product Manager |

---

## コンテンツ別タイミング

| コンテンツ | タイミング | entity_type（案） |
|-----------|-----------|-------------------|
| Community スレッド | 投稿時 | `community_thread` |
| Community 返信 | 投稿時 | `community_reply` |
| Gallery 説明 | 投稿時 | `artwork` |
| Shop 商品 | 保存時 | `shop_product` |
| Works 求人 | 保存時 | `works_job` |
| Event | 保存時 | `event` |
| 編集後 | `source_hash` 変更時のみ | — |

---

## API・環境変数

```http
POST /api/nexus/translate
Content-Type: application/json

{ "text": "...", "source": "ja", "target": "en" }

→ { "translated": "...", "target": "en", "mode": "google" | "demo" | "passthrough" }
```

| 変数 | 用途 |
|------|------|
| `GOOGLE_TRANSLATE_API_KEY` | Cloud Translation API（`AIzaSy...`） |
| `GEMINI_API_KEY` | フォールバックのみ — **翻訳には使わない** |

キー制限: **Cloud Translation API のみ**。アプリケーション制限はサーバー呼び出しのため **なし**（MVP）。

---

## コスト

- 無料枠: **月 50 万文字**（Basic v2 NMT）
- ~100 MAU + 投稿時キャッシュ → **無料枠内で運用可能**
- 閲覧のたび API 呼び出し → **禁止**（キャッシュ必須）

---

## 品質・運用

1. 原文は常に正本。翻訳は派生データ。
2. 機械翻訳の誤訳 — 「原文を見る」トグルを常に残す。
3. 翻訳失敗しても投稿は成功。バックグラウンドリトライ。
4. スキル・職種はフリーテキスト翻訳に頼らず `docs/translation-architecture.md` の Skill Layer を使用。

---

## Translation Quality Agent（チェック係 / 校正）

**正本詳細**: `docs/translation-architecture.md` § Quality Assurance & Human Review

Translation 部署の Sub Agent。**翻訳の校正・品質管理**を担当。  
`QA_Test_Agent`（コード検証）や `Moderation`（規約・権利）とは別物。

### チェック係 ≠ 全件人力校正

| 対象 | 校正 |
|------|------|
| 静的 UI・LP・告知（Layer 1） | **人間必須** |
| Community / Gallery / Shop UGC（Layer 2） | **機械翻訳のみ**（MVP 既定） |
| Business 向け・Investor 文案（Layer 3） | **人間推奨** |

100人規模では **UGC 全件校正は行わない**。サンプル監査 + 通報対応 + ブランド文案レビューが現実的。

### 校正レベル

| レベル | 担当 | 内容 |
|--------|------|------|
| **L0 自動** | Google API | 投稿時キャッシュ — MVP 既定 |
| **L1 自己校正** | 投稿者 | 翻訳プレビュー・再翻訳・`translation_overrides`（計画） |
| **L2 運営サンプル** | Translation Quality | 週次 N 件監査・用語集更新 |
| **L3 正式校正** | Translation Quality + Admin | 規約・LP・重要告知 |

### Translation Quality の TODO

| 業務 | 状態 |
|------|------|
| Layer 1 i18n PR レビュー | 運用随時 |
| Eldonia 固有用語集（Nexus, Lab, Realm…） | 計画 |
| `review_status` / `translation_overrides` DB | 未実装 |
| Community 通報「翻訳が不正確」フロー | 未実装 |
| Admin 画面での手動訳差替 | 未実装（Django / Next Admin 協議） |

### 通報時フロー（計画）

```text
「翻訳がおかしい」→ Translation Quality が照合
  → 軽微: manual override 保存
  → 用語: glossary 追加
  → 重大: Moderation / Admin へ
```

### §22

- **自動 OK**: L0 機械翻訳、L1 投稿者修正、監査レポート下書き
- **人間承認必須**: Layer 1 公開、規約多言語版、L3 対外文案、API キー変更

---

## 協議先

| 部署 | 用途 |
|------|------|
| `Community_Manager` | 翻訳 Nexus UX |
| `UI_UX_Designer` | トークン・表示順 |
| `Backend_Manager` / `Database_Agent` | `content_translations`, ジョブ |
| `Gallery_Manager`, `Shop_Manager`, `Works_Manager`, `Events_Manager` | Phase 3 展開 |

---

## 完了条件（ロードマップ）

- [x] Google Translation API 本番接続
- [x] Community `TranslationPanel` + `/api/nexus/translate`
- [x] UI locale ブラウザ推定（`Accept-Language` + Cookie）
- [x] 言語不一致時の自動翻訳 + 翻訳ベース表示
- [x] `content_translations` マイグレーション + warm API
- [x] Community 投稿・返信の upload 時翻訳（非同期 warm）
- [ ] Gallery / Shop / Works / Events 展開
- [ ] Translation Quality: `review_status` + `translation_overrides`
- [ ] 固有用語集（glossary）+ L2 サンプル監査フロー
