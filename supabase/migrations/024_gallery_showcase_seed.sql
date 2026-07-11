-- Eldonia-Nex: 公式 GALLERY ショーケース作品（エンゲージメント用 DB 登録）
-- 023_faq_platform_overview_revenue.sql 実行後に適用

do $$
declare
  official_id uuid := '00000000-0000-4000-8000-000000000001';
  artwork_key_visual uuid := '00000000-0000-4000-8000-000000000601';
  artwork_nexus_gate uuid := '00000000-0000-4000-8000-000000000602';
  official_email text := 'official@eldonia-nex.internal';
begin
  if not exists (select 1 from auth.users where id = official_id) then
    insert into auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      is_sso_user
    )
    values (
      official_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      official_email,
      extensions.crypt('showcase-only-not-for-login', extensions.gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Eldonia-Nex Official"}'::jsonb,
      now(),
      now(),
      false
    );
  end if;

  if not exists (
    select 1 from auth.identities where user_id = official_id and provider = 'email'
  ) then
    insert into auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    )
    values (
      official_id,
      official_id,
      official_id::text,
      jsonb_build_object(
        'sub', official_id::text,
        'email', official_email,
        'email_verified', true
      ),
      'email',
      now(),
      now(),
      now()
    );
  end if;

  insert into public.profiles (
    id,
    username,
    display_name,
    avatar_url,
    bio,
    is_creator
  )
  values (
    official_id,
    'eldonia_official',
    'Eldonia-Nex Official',
    '/logo.png',
    'Eldonia-Nex 公式アカウント',
    true
  )
  on conflict (id) do update
  set
    username = excluded.username,
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url,
    bio = excluded.bio,
    is_creator = excluded.is_creator,
    updated_at = now();

  insert into public.artworks (
    id,
    creator_id,
    title,
    description,
    media_type,
    media_url,
    thumbnail_url,
    category,
    tags,
    is_public,
    view_count
  )
  values
    (
      artwork_key_visual,
      official_id,
      'Eldonia-Nex',
      '黒と金の Nexus を象徴する公式キービジュアル。創作経済圏の世界観を体現したブランドイラスト。',
      'image',
      '/design/gallery/eldonia-nex-key-visual.png',
      null,
      'illustration',
      array['公式', 'キービジュアル', 'ファンタジー'],
      true,
      12840
    ),
    (
      artwork_nexus_gate,
      official_id,
      'Nexus Gate — Realm of Creators',
      'Quest・作品・コマース・コミュニティが交差する創作の門。Home v2 ヒーローアート。',
      'image',
      '/design/v2/home-hero.png',
      null,
      'illustration',
      array['公式', 'ヒーロー', 'Nexus'],
      true,
      9620
    )
  on conflict (id) do update
  set
    creator_id = excluded.creator_id,
    title = excluded.title,
    description = excluded.description,
    media_type = excluded.media_type,
    media_url = excluded.media_url,
    category = excluded.category,
    tags = excluded.tags,
    is_public = excluded.is_public,
    view_count = greatest(public.artworks.view_count, excluded.view_count),
    updated_at = now();
end $$;
