# Eldonia-Nex Translation Architecture v1.0

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

## Cost Control Rules

1. Do not translate empty text.
2. Do not translate when source and target locales match.
3. Normalize text before hashing.
4. Check the translation cache before calling an external API.
5. Translate on save for important fields, and on demand for comments.
6. Store provider metadata for future quality comparison.

## Skill Layer

Do not rely only on free-text translation for skills, occupations, and tools. Use a language-neutral skill dictionary.

Example:

- Internal skill ID: `environment_artist`
- Japanese: `背景デザイナー`
- English: `Environment Artist`
- Korean: `환경 디자이너`
- Chinese: `环境美术师`

This improves matching, recommendations, Quest search, and Creator Passport accuracy.

## Investor Message

> One Creator ID. Every Language. One World.

Eldonia-Nex is not only multilingual. It is built so global creators can collaborate, work, sell, and build reputation across language barriers.
