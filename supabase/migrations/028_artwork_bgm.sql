-- Optional ambient BGM for gallery artworks (photo albums, manga, illustrations, etc.)
alter table public.artworks
  add column if not exists bgm_url text;

comment on column public.artworks.bgm_url is
  'Optional looped background audio URL (Supabase storage). Not used when media_type is audio.';
