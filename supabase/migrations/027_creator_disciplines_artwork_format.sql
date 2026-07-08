-- Eldonia-Nex: 創作者領域（disciplines）・作品フォーマット・複数ページ・シリーズ

-- ---------------------------------------------------------------------------
-- profiles.disciplines
-- ---------------------------------------------------------------------------
alter table public.profiles
  add column if not exists disciplines text[] not null default '{}';

comment on column public.profiles.disciplines is
  '創作者の活動領域（illustrator, manga_artist, photographer, writer 等）';

-- ---------------------------------------------------------------------------
-- artworks: format / pages / series / story
-- ---------------------------------------------------------------------------
alter table public.artworks
  add column if not exists format text not null default 'single';

alter table public.artworks
  add column if not exists page_count integer not null default 1;

alter table public.artworks
  add column if not exists series_id uuid references public.artworks (id) on delete set null;

alter table public.artworks
  add column if not exists story_excerpt text;

alter table public.artworks
  drop constraint if exists artworks_format_check;

alter table public.artworks
  add constraint artworks_format_check
  check (format in ('single', 'multi_page', 'story', 'series_album'));

alter table public.artworks
  drop constraint if exists artworks_page_count_check;

alter table public.artworks
  add constraint artworks_page_count_check
  check (page_count >= 1);

alter table public.artworks
  drop constraint if exists artworks_story_excerpt_length;

alter table public.artworks
  add constraint artworks_story_excerpt_length
  check (story_excerpt is null or char_length(story_excerpt) <= 500);

create index if not exists artworks_category_idx on public.artworks (category)
  where is_public = true;

create index if not exists artworks_series_id_idx on public.artworks (series_id)
  where series_id is not null;

-- ---------------------------------------------------------------------------
-- artwork_pages（漫画・写真エッセイ等の複数ページ）
-- ---------------------------------------------------------------------------
create table if not exists public.artwork_pages (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks (id) on delete cascade,
  page_index integer not null,
  media_url text not null,
  caption text,
  created_at timestamptz not null default now(),
  constraint artwork_pages_index_check check (page_index >= 1),
  constraint artwork_pages_unique_index unique (artwork_id, page_index),
  constraint artwork_pages_caption_length check (
    caption is null or char_length(caption) <= 500
  )
);

create index if not exists artwork_pages_artwork_id_idx
  on public.artwork_pages (artwork_id, page_index);

comment on table public.artwork_pages is 'GALLEY 複数ページ作品（漫画・写真シリーズ等）';

alter table public.artwork_pages enable row level security;

drop policy if exists "artwork_pages_select_public" on public.artwork_pages;
create policy "artwork_pages_select_public"
  on public.artwork_pages
  for select
  using (
    exists (
      select 1
      from public.artworks a
      where a.id = artwork_pages.artwork_id
        and (a.is_public = true or a.creator_id = auth.uid())
    )
  );

drop policy if exists "artwork_pages_insert_own" on public.artwork_pages;
create policy "artwork_pages_insert_own"
  on public.artwork_pages
  for insert
  with check (
    exists (
      select 1
      from public.artworks a
      where a.id = artwork_pages.artwork_id
        and a.creator_id = auth.uid()
    )
  );

drop policy if exists "artwork_pages_delete_own" on public.artwork_pages;
create policy "artwork_pages_delete_own"
  on public.artwork_pages
  for delete
  using (
    exists (
      select 1
      from public.artworks a
      where a.id = artwork_pages.artwork_id
        and a.creator_id = auth.uid()
    )
  );
