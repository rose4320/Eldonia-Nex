-- UGC translation cache (Google Cloud Translation + manual overrides)

create table if not exists public.content_translations (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  field_name text not null,
  source_locale text not null,
  target_locale text not null,
  provider text not null default 'google',
  review_status text not null default 'auto',
  source_hash text not null,
  source_text text not null,
  translated_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (entity_type, entity_id, field_name, target_locale)
);

create index if not exists content_translations_entity_idx
  on public.content_translations (entity_type, entity_id);

create index if not exists content_translations_target_idx
  on public.content_translations (target_locale);

alter table public.content_translations enable row level security;

create policy "content_translations_public_read"
  on public.content_translations
  for select
  to anon, authenticated
  using (true);
