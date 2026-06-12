-- Eldonia-Nex: EVENTS テーブル
-- 001_profiles.sql 実行後に適用

do $$
begin
  if not exists (select 1 from pg_type where typname = 'event_format') then
    create type public.event_format as enum ('online', 'offline', 'hybrid');
  end if;
  if not exists (select 1 from pg_type where typname = 'event_status') then
    create type public.event_status as enum ('draft', 'published', 'cancelled', 'completed');
  end if;
end $$;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references public.profiles (id) on delete set null,
  title text not null,
  description text,
  category text not null default 'meetup',
  format public.event_format not null default 'offline',
  status public.event_status not null default 'published',
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue_name text,
  venue_address text,
  online_url text,
  cover_image_url text,
  ticket_price integer not null default 0 check (ticket_price >= 0),
  compare_price integer check (compare_price is null or compare_price >= 0),
  capacity integer check (capacity is null or capacity > 0),
  tickets_sold integer not null default 0 check (tickets_sold >= 0),
  is_featured boolean not null default false,
  is_nexus_verified boolean not null default false,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_title_length check (char_length(title) between 1 and 120),
  constraint events_description_length check (
    description is null or char_length(description) <= 4000
  )
);

create index if not exists events_starts_at_idx on public.events (starts_at);
create index if not exists events_category_idx on public.events (category);
create index if not exists events_status_idx on public.events (status)
  where status = 'published';

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row
  execute function public.set_updated_at();

comment on table public.events is 'EVENTS イベント';

alter table public.events enable row level security;

drop policy if exists "events_select_published" on public.events;
create policy "events_select_published"
  on public.events
  for select
  using (status = 'published' or auth.uid() = organizer_id);

drop policy if exists "events_insert_organizer" on public.events;
create policy "events_insert_organizer"
  on public.events
  for insert
  with check (auth.uid() = organizer_id);

drop policy if exists "events_update_organizer" on public.events;
create policy "events_update_organizer"
  on public.events
  for update
  using (auth.uid() = organizer_id)
  with check (auth.uid() = organizer_id);

drop policy if exists "events_delete_organizer" on public.events;
create policy "events_delete_organizer"
  on public.events
  for delete
  using (auth.uid() = organizer_id);

insert into public.events (
  title, description, category, format, starts_at, ends_at,
  venue_name, venue_address, ticket_price, compare_price,
  capacity, tickets_sold, is_featured, is_nexus_verified, tags
)
values
  (
    'Nexus Creator Summit 2026',
    '国内外のクリエイターが集う年次サミット。基調講演・ポートフォリオレビュー・ネットワーキング。',
    'meetup', 'hybrid',
    (now() + interval '14 days'), (now() + interval '14 days 8 hours'),
    'Eldonia Hall Tokyo', '東京都渋谷区（詳細は購入後に表示）',
    4500, 5500, 200, 87, true, true,
    array['サミット', 'ネットワーキング']
  ),
  (
    'Golden Ink Live — Digital Art Session',
    'ライブデジタルペイント配信。チャット参加・限定ブラシ配布あり。',
    'streaming', 'online',
    (now() + interval '3 days'), (now() + interval '3 days 2 hours'),
    null, null,
    1500, null, 500, 312, true, true,
    array['配信', 'ライブ', 'イラスト']
  ),
  (
    'Fantasy Orchestra Night',
    'ゲーム・ファンタジー系楽曲のオーケストラコンサート。VIP席あり。',
    'concert', 'offline',
    (now() + interval '30 days'), (now() + interval '30 days 3 hours'),
    'Realm Concert Hall', '大阪府大阪市北区',
    6800, 7800, 120, 45, false, true,
    array['コンサート', '音楽']
  ),
  (
    'Worldbuilding Workshop — Lore & Maps',
    '世界観設計・地図制作の実践ワークショップ。少人数制。',
    'workshop', 'offline',
    (now() + interval '7 days'), (now() + interval '7 days 4 hours'),
    'Creator Studio Shibuya', '東京都渋谷区',
    3200, null, 24, 18, false, false,
    array['ワークショップ', '設定']
  ),
  (
    'Indie Game Showcase & Pitch',
    'インディーゲーム展示とピッチコンテスト。審査員フィードバック付き。',
    'competition', 'hybrid',
    (now() + interval '21 days'), (now() + interval '21 days 6 hours'),
    'Nexus Expo Center', 'オンライン同時配信',
    0, null, 300, 156, true, false,
    array['ゲーム', 'コンテスト', '無料']
  ),
  (
    'Gallery Night — Creator Exhibition',
    'GALLEY 出品作家による期間限定展示。入場無料・作品即売あり。',
    'exhibition', 'offline',
    (now() - interval '2 days'), (now() + interval '5 days'),
    'Eldonia Gallery Space', '東京都目黒区',
    0, null, null, 890, false, true,
    array['展示', '無料']
  )
on conflict do nothing;
