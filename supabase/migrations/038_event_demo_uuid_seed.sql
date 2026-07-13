-- Eldonia-Nex: canonical demo events with fixed UUIDs (matches src/lib/events/sample-events.ts)
-- Ensures free-ticket claim + QR issuance works for demo URLs and catalog rows.

insert into public.events (
  id,
  title,
  description,
  category,
  format,
  status,
  starts_at,
  ends_at,
  venue_name,
  venue_address,
  online_url,
  ticket_price,
  compare_price,
  capacity,
  tickets_sold,
  is_featured,
  is_nexus_verified,
  tags
)
values
  (
    '00000000-0000-4000-8000-000000000101',
    'Nexus Creator Summit 2026',
    '国内外のクリエイターが集う年次サミット。基調講演・ポートフォリオレビュー・ネットワーキング。',
    'meetup', 'hybrid', 'published',
    (now() + interval '14 days'), (now() + interval '14 days 8 hours'),
    'Eldonia Hall Tokyo', '東京都渋谷区（詳細は購入後に表示）',
    'https://example.com/stream',
    4500, 5500, 200, 87, true, true,
    array['サミット', 'ネットワーキング']
  ),
  (
    '00000000-0000-4000-8000-000000000102',
    'Golden Ink Live — Digital Art Session',
    'ライブデジタルペイント配信。チャット参加・限定ブラシ配布あり。',
    'streaming', 'online', 'published',
    (now() + interval '3 days'), (now() + interval '3 days 2 hours'),
    null, null,
    'https://example.com/live',
    1500, null, 500, 312, true, true,
    array['配信', 'ライブ', 'イラスト']
  ),
  (
    '00000000-0000-4000-8000-000000000103',
    'Fantasy Orchestra Night',
    'ゲーム・ファンタジー系楽曲のオーケストラコンサート。VIP席あり。',
    'concert', 'offline', 'published',
    (now() + interval '30 days'), (now() + interval '30 days 3 hours'),
    'Realm Concert Hall', '大阪府大阪市北区',
    null,
    6800, 7800, 120, 45, false, true,
    array['コンサート', '音楽']
  ),
  (
    '00000000-0000-4000-8000-000000000104',
    'Worldbuilding Workshop — Lore & Maps',
    '世界観設計・地図制作の実践ワークショップ。少人数制。',
    'workshop', 'offline', 'published',
    (now() + interval '7 days'), (now() + interval '7 days 4 hours'),
    'Creator Studio Shibuya', '東京都渋谷区',
    null,
    3200, null, 24, 18, false, false,
    array['ワークショップ', '設定']
  ),
  (
    '00000000-0000-4000-8000-000000000105',
    'Indie Game Showcase & Pitch',
    'インディーゲーム展示とピッチコンテスト。審査員フィードバック付き。',
    'competition', 'hybrid', 'published',
    (now() + interval '21 days'), (now() + interval '21 days 6 hours'),
    'Nexus Expo Center', 'オンライン同時配信',
    'https://example.com/expo',
    0, null, 300, 156, true, false,
    array['ゲーム', 'コンテスト', '無料']
  ),
  (
    '00000000-0000-4000-8000-000000000106',
    'Gallery Night — Creator Exhibition',
    'GALLERY 出品作家による期間限定展示。入場無料・作品即売あり。',
    'exhibition', 'offline', 'published',
    (now() - interval '2 days'), (now() + interval '5 days'),
    'Eldonia Gallery Space', '東京都目黒区',
    null,
    0, null, null, 890, false, true,
    array['展示', '無料']
  )
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  category = excluded.category,
  format = excluded.format,
  status = excluded.status,
  starts_at = excluded.starts_at,
  ends_at = excluded.ends_at,
  venue_name = excluded.venue_name,
  venue_address = excluded.venue_address,
  online_url = excluded.online_url,
  ticket_price = excluded.ticket_price,
  compare_price = excluded.compare_price,
  capacity = excluded.capacity,
  is_featured = excluded.is_featured,
  is_nexus_verified = excluded.is_nexus_verified,
  tags = excluded.tags,
  updated_at = now();

-- Remove legacy seed rows (random UUID) when no tickets were issued yet.
delete from public.events e
where e.id not in (
  '00000000-0000-4000-8000-000000000101',
  '00000000-0000-4000-8000-000000000102',
  '00000000-0000-4000-8000-000000000103',
  '00000000-0000-4000-8000-000000000104',
  '00000000-0000-4000-8000-000000000105',
  '00000000-0000-4000-8000-000000000106'
)
and e.title in (
  'Nexus Creator Summit 2026',
  'Golden Ink Live — Digital Art Session',
  'Fantasy Orchestra Night',
  'Worldbuilding Workshop — Lore & Maps',
  'Indie Game Showcase & Pitch',
  'Gallery Night — Creator Exhibition'
)
and not exists (
  select 1 from public.event_tickets t where t.event_id = e.id
);
