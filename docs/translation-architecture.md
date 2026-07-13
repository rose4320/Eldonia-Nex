# Eldonia-Nex Translation Architecture v1.1

**最終更新**: 2026-07-13

## Purpose

Eldonia-Nex is designed for global creators from day one. Language should never be a barrier to creation, collaboration, Quest participation, or revenue.

## Current UI Locales

The current product supports four UI locales:

- `ja` — Japanese
- `en` — English
- `ko` — Korean
- `zh-CN` — Simplified Chinese

## Translation Layers

### Layer 1: Static UI Translation

Static product text is managed in code.

Examples:

- Navigation
- Buttons
- Forms
- Error messages
- Help text
- Plan labels

This should remain manually reviewed because it represents the brand voice.

### Layer 2: User Content Translation

User-generated content should be translated with Google Cloud Translation first.

Examples:

- Quest title and body
- Gallery artwork description
- Creator profile biography
- Works listings
- Event descriptions
- Community posts and comments

Translations must be cached in the database so the same text is not translated repeatedly.

### Layer 3: Premium AI Translation

Premium or business users can use higher-quality AI rewriting or localization.

Examples:

- Natural English localization for international Quest posts
- Investor-facing descriptions
- Product launch copy
- Contract or business communication drafts
- Creator profile polishing

Possible providers:

- OpenAI
- DeepL
- Google Cloud Translation Advanced

## Storage Policy

Store the original text, translated text, source locale, target locale, provider, hash, and timestamp.

Recommended table shape:

```sql
create table content_translations (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  field_name text not null,
  source_locale text not null,
  target_locale text not null,
  provider text not null,
  source_hash text not null,
  source_text text not null,
  translated_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entity_type, entity_id, field_name, target_locale, source_hash)
);
```

## Production Status (2026-07-13)

| Item | Status |
|------|--------|
| Google Cloud Translation API (Basic v2) | Production — `GOOGLE_TRANSLATE_API_KEY` on Vercel |
| API route | `POST /api/nexus/translate` — Google first, demo dictionary fallback |
| UI scope | Community threads and replies only |
| Display | Opt-in via **翻訳 Nexus** panel (original-first) |
| `content_translations` cache | Migration `036` — `src/lib/translation/content-cache.ts` |
| Display | Translation-first when locales differ; auto-translate on view; warm on post |

---

## UX Policy: Translation-First for Cross-Language Readers

When **post locale ≠ UI locale**, show **translated text as primary** and **original as secondary** (collapsible or `eldonia-localized-hint`).

When **post locale = UI locale**, show **original only** — hide translation UI.

Do **not** use the Google Translate widget or light-theme overlays. Extend existing Nexus tokens only.

### Display components (no new visual language)

| Context | Component | Primary | Secondary |
|---------|-----------|---------|-----------|
| Thread / reply detail | `TranslationPanel` | Cached or live translation | Original (`eldonia-localized-hint`) |
| List cards | `ContentLine` | Translated title/body | Original in parentheses |
| Tags / short labels | `TagWithHint` | Original + inline hint | — |
| Brand marker | `eldonia-badge-nexus-prime` | Always visible when translation is active | — |

---

## Translation Timing

| Content | When to translate | Notes |
|---------|-------------------|-------|
| Community thread (title, body) | **On post** | Async after save; do not block submit |
| Community reply | **On post** | Same |
| Gallery artwork description | **On post / save** | Phase 3 |
| Shop product title / description | **On post / save** | Phase 3 — see Shop §3.15 |
| Works job / Event description | **On save** | Phase 3 |
| Profile bio | **On save** | Low frequency |
| After edit | **Re-translate when `source_hash` changes** | Skip unchanged fields |
| Cache miss at read time | **On demand** | Fallback only |

### Post flow

```text
User submits content (locale = author UI locale)
  → Save original to entity table (source of truth)
  → Enqueue translation job (en, ko, zh-CN — exclude source locale)
  → Google Cloud Translation API
  → Upsert content_translations (entity_type, entity_id, field_name, target_locale, source_hash)
Reader (UI locale ≠ post locale)
  → Read cache from content_translations
  → Render translation-first UI
  → Optional: toggle original
```

Translation failure must **not** fail the post. Retry in background or fall back to on-demand `/api/nexus/translate`.

---

## UI Locale Bootstrap

Default UI locale is currently `ja` when no cookie is set. Planned:

1. On first visit, infer from `Accept-Language` → `ja` / `en` / `ko` / `zh-CN`
2. Persist in `eldonia_locale` cookie (existing `HeaderLanguageSelect`)
3. User override always wins

---

## Implementation Phases

| Phase | Scope | Priority |
|-------|-------|----------|
| **1** | Browser locale bootstrap; auto-translate when locales differ; translation-first display in Community | High |
| **2** | `content_translations` migration + cache layer; translate on Community post/reply | High |
| **3** | Gallery, Shop, Works, Events via `ContentLine` / same cache | Medium |

---

## Cost Control Rules

1. Do not translate empty text.
2. Do not translate when source and target locales match.
3. Normalize text before hashing (`createTranslationHash` in `src/lib/translation/hash.ts`).
4. **Always check `content_translations` before calling Google.**
5. **Translate on save for UGC**; on-demand only as fallback.
6. Store provider metadata (`google`, `manual`, etc.) for quality comparison.
7. Do not translate on every page view without cache.

### Free tier estimate (~100 MAU)

Google Cloud Translation Basic v2: **500,000 characters / month** free ($10 credit).

With post-time translation + DB cache:

- ~200 threads × 500 chars × 3 target locales ≈ 300k chars/month — **within free tier**
- Without cache, cost scales with **views** — avoid

API: `translation.googleapis.com/language/translate/v2` (see `src/lib/translation/google.ts`).

Env: `GOOGLE_TRANSLATE_API_KEY` (not Gemini / Generative Language API key).

## Skill Layer

Do not rely only on free-text translation for skills, occupations, and tools. Use a language-neutral skill dictionary.

Example:

- Internal skill ID: `environment_artist`
- Japanese: `背景デザイナー`
- English: `Environment Artist`
- Korean: `환경 디자이너`
- Chinese: `环境美术师`

This improves matching, recommendations, Quest search, and Creator Passport accuracy.

---

## Quality Assurance & Human Review（Translation Quality Agent）

**チェック係 = 翻訳の校正・品質管理担当**（`Translation Quality Agent`）。  
**全 UGC を人間が全件校正する運用ではない。** Layer と重要度で役割を分ける。

### 誰が何をチェックするか

| Layer | 対象 | 機械翻訳 | 人間校正 | 担当 |
|-------|------|---------|---------|------|
| **1** | 静的 UI（ナビ・CTA・エラー・LP 文案） | 使わない | **必須**（PR レビュー） | Translation + Design |
| **2** | UGC（Community / Gallery / Shop 等） | **Google（投稿時）** | 原則不要 | 自動 + 投稿者任意 |
| **3** | Premium ローカライズ | AI リライト | **推奨**（Business 等） | Translation Quality |

**QA_Test_Agent**（lint/build）や **Moderation**（規約・権利）とは別。Translation Quality は **文言の正確さ・自然さ** が専門。

### 校正レベル（4段階）

| レベル | 名称 | 誰が | いつ | MVP |
|--------|------|------|------|-----|
| **L0** | 自動のみ | Google API | 投稿・保存時 | ✅ 既定 |
| **L1** | 自己校正 | 投稿者・出品者 | 公開前プレビュー・再翻訳 | Shop §3.15 計画 |
| **L2** | 運営サンプル | Translation Quality | 週次サンプリング・通報時 | 将来 |
| **L3** | 正式校正 | Translation Quality + Admin | LP・告知・規約・Investor 向け | Layer 1 必須 |

### UGC の原則（Layer 2）

1. **原文が正本** — 翻訳は派生。削除・アーカイブは原文に追随。
2. **機械翻訳をそのまま公開** — 100人規模 MVP では現実的。
3. **「原文を見る」は常に残す** — 誤訳時の逃げ道。
4. **投稿者が直せる** — `translation_overrides`（計画）で machine 訳を上書き可。
5. **再翻訳** — 原文編集（`source_hash` 変更）時のみ Google を再実行。

### Translation Quality Agent の業務

| 業務 | 頻度 | 内容 |
|------|------|------|
| ブランド文案レビュー | リリース前 | Layer 1 の i18n キー・LP・メールテンプレ |
| 用語集メンテ | 随時 | Nexus / Lab / Realm 等の固有名詞（glossary 将来） |
| サンプル監査 | 週 1 回（目安） | Community / Shop から N 件を原文↔訳文照合 |
| 通報対応 | 随時 | 「翻訳がおかしい」報告 → 該当 `content_translations` を `manual` に差替 |
| Layer 3 依頼 | オンデマンド | Business 求人・Investor 向け文案 |

### 校正フロー（通報・重要コンテンツ）

```text
ユーザー/運営が「翻訳不自然」を検知
  → Translation Quality が原文・機械訳を照合
  → 軽微: translation_overrides に手動訳を保存（provider = 'manual'）
  → 用語問題: glossary に追加 → 同語句は次回から一貫
  → 重大（誤解・法令）: Moderation / Admin にエスカレーション
  → 監査ログに記録（Admin/Audit 協議）
```

### DB 拡張（計画）

`content_translations` に品質メタを追加:

```sql
-- 計画: content_translations 拡張
-- provider: 'google' | 'manual' | 'openai' | 'deepl'
-- review_status: 'auto' | 'author_edited' | 'staff_reviewed' | 'flagged'
-- reviewed_at, reviewed_by (nullable)
```

出品者上書き用（Shop §3.15）:

```sql
-- 計画: translation_overrides
-- entity_type, entity_id, field_name, target_locale
-- override_text, updated_by, updated_at
```

表示優先度: `translation_overrides` > `content_translations`（`provider=manual`）> Google キャッシュ。

### §22 承認境界

| 自動 OK | 人間承認必須 |
|---------|-------------|
| Layer 2 機械翻訳・キャッシュ・再翻訳ジョブ | Layer 1 ブランド文案の公開切替 |
| L0 公開 | 規約・料金表の多言語版 |
| 投稿者による L1 自己校正 | L3 正式校正の対外公開 |
| サンプル監査レポート下書き | API キー・翻訳プロバイダ変更 |

---

## Investor Message

> One Creator ID. Every Language. One World.

Eldonia-Nex is not only multilingual. It is built so global creators can collaborate, work, sell, and build reputation across language barriers.
