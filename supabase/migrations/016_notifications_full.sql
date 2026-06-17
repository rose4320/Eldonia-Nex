-- Eldonia-Nex: 通知システム拡張（エンゲージメント・設定・Realtime）
-- 015_collab_lab.sql 実行後に適用

-- ---------------------------------------------------------------------------
-- user_settings: 通知 ON/OFF
-- ---------------------------------------------------------------------------
alter table public.user_settings
  add column if not exists notify_fan boolean not null default true,
  add column if not exists notify_like boolean not null default true,
  add column if not exists notify_comment boolean not null default true,
  add column if not exists notify_collab boolean not null default true,
  add column if not exists notify_lab boolean not null default true,
  add column if not exists notify_order boolean not null default true,
  add column if not exists notify_support boolean not null default true,
  add column if not exists notify_announcement boolean not null default true;

comment on column public.user_settings.notify_fan is 'ファン登録通知';
comment on column public.user_settings.notify_like is 'いいね通知';
comment on column public.user_settings.notify_comment is 'コメント通知';
comment on column public.user_settings.notify_collab is 'コラボ申請通知';
comment on column public.user_settings.notify_lab is 'Lab メモ通知';
comment on column public.user_settings.notify_order is '注文・決済通知';
comment on column public.user_settings.notify_support is 'サポート返信通知';
comment on column public.user_settings.notify_announcement is '運営からの告知';

-- ---------------------------------------------------------------------------
-- user_notifications: kind 拡張
-- ---------------------------------------------------------------------------
alter table public.user_notifications
  drop constraint if exists user_notifications_kind_check;

alter table public.user_notifications
  add constraint user_notifications_kind_check
  check (kind in (
    'notification',
    'announcement',
    'collab_request',
    'collab_accepted',
    'collab_declined',
    'fan_registered',
    'artwork_liked',
    'artwork_commented',
    'lab_post',
    'order_paid',
    'support_reply'
  ));

-- ---------------------------------------------------------------------------
-- 通知設定チェック（未設定ユーザーはすべて ON）
-- ---------------------------------------------------------------------------
create or replace function public.user_wants_notification(
  p_user_id uuid,
  p_category text
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_prefs public.user_settings%rowtype;
begin
  select * into v_prefs from public.user_settings where user_id = p_user_id;
  if not found then
    return true;
  end if;

  case p_category
    when 'fan' then return v_prefs.notify_fan;
    when 'like' then return v_prefs.notify_like;
    when 'comment' then return v_prefs.notify_comment;
    when 'collab' then return v_prefs.notify_collab;
    when 'lab' then return v_prefs.notify_lab;
    when 'order' then return v_prefs.notify_order;
    when 'support' then return v_prefs.notify_support;
    when 'announcement' then return v_prefs.notify_announcement;
    else return true;
  end case;
end;
$$;

-- ---------------------------------------------------------------------------
-- ファン登録 → クリエイターへ
-- ---------------------------------------------------------------------------
create or replace function public.handle_fan_registered()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_fan_name text;
begin
  if not public.user_wants_notification(new.creator_id, 'fan') then
    return new;
  end if;

  select coalesce(display_name, username, 'ユーザー') into v_fan_name
  from public.profiles where id = new.fan_id;

  insert into public.user_notifications (user_id, kind, title, body, href)
  values (
    new.creator_id,
    'fan_registered',
    '新しいファン登録',
    coalesce(v_fan_name, 'ユーザー') || ' さんがファン登録しました。',
    '/settings#notifications'
  );

  return new;
end;
$$;

drop trigger if exists on_fan_registered on public.creator_fans;
create trigger on_fan_registered
  after insert on public.creator_fans
  for each row
  execute function public.handle_fan_registered();

-- ---------------------------------------------------------------------------
-- いいね → 作品作者へ（自分自身は除外）
-- ---------------------------------------------------------------------------
create or replace function public.handle_artwork_liked()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_creator_id uuid;
  v_artwork_title text;
  v_liker_name text;
begin
  select creator_id, title into v_creator_id, v_artwork_title
  from public.artworks where id = new.artwork_id;

  if v_creator_id is null or v_creator_id = new.user_id then
    return new;
  end if;

  if not public.user_wants_notification(v_creator_id, 'like') then
    return new;
  end if;

  select coalesce(display_name, username, 'ユーザー') into v_liker_name
  from public.profiles where id = new.user_id;

  insert into public.user_notifications (user_id, kind, title, body, href)
  values (
    v_creator_id,
    'artwork_liked',
    'いいね: ' || coalesce(v_artwork_title, '作品'),
    coalesce(v_liker_name, 'ユーザー') || ' さんが「' ||
      coalesce(v_artwork_title, '作品') || '」にいいねしました。',
    '/gallery/' || new.artwork_id
  );

  return new;
end;
$$;

drop trigger if exists on_artwork_liked on public.artwork_likes;
create trigger on_artwork_liked
  after insert on public.artwork_likes
  for each row
  execute function public.handle_artwork_liked();

-- ---------------------------------------------------------------------------
-- コメント → 作品作者へ（自分自身は除外）
-- ---------------------------------------------------------------------------
create or replace function public.handle_artwork_commented()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_creator_id uuid;
  v_artwork_title text;
  v_author_name text;
  v_preview text;
begin
  select creator_id, title into v_creator_id, v_artwork_title
  from public.artworks where id = new.artwork_id;

  if v_creator_id is null or v_creator_id = new.author_id then
    return new;
  end if;

  if not public.user_wants_notification(v_creator_id, 'comment') then
    return new;
  end if;

  select coalesce(display_name, username, 'ユーザー') into v_author_name
  from public.profiles where id = new.author_id;

  v_preview := left(replace(new.body, E'\n', ' '), 80);
  if length(new.body) > 80 then
    v_preview := v_preview || '…';
  end if;

  insert into public.user_notifications (user_id, kind, title, body, href)
  values (
    v_creator_id,
    'artwork_commented',
    'コメント: ' || coalesce(v_artwork_title, '作品'),
    coalesce(v_author_name, 'ユーザー') || ' さん: ' || v_preview,
    '/gallery/' || new.artwork_id
  );

  return new;
end;
$$;

drop trigger if exists on_artwork_commented on public.artwork_comments;
create trigger on_artwork_commented
  after insert on public.artwork_comments
  for each row
  execute function public.handle_artwork_commented();

-- ---------------------------------------------------------------------------
-- Lab メモ → 他メンバーへ
-- ---------------------------------------------------------------------------
create or replace function public.handle_lab_post_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lab record;
  v_author_name text;
  v_preview text;
  v_member record;
begin
  select l.id, l.title, l.artwork_id into v_lab
  from public.collab_labs l
  where l.id = new.lab_id;

  select coalesce(display_name, username, 'ユーザー') into v_author_name
  from public.profiles where id = new.author_id;

  v_preview := left(replace(new.body, E'\n', ' '), 60);
  if length(new.body) > 60 then
    v_preview := v_preview || '…';
  end if;

  for v_member in
    select user_id from public.collab_lab_members
    where lab_id = new.lab_id and user_id <> new.author_id
  loop
    if public.user_wants_notification(v_member.user_id, 'lab') then
      insert into public.user_notifications (user_id, kind, title, body, href)
      values (
        v_member.user_id,
        'lab_post',
        'Lab: ' || coalesce(v_lab.title, '共同作業'),
        coalesce(v_author_name, 'メンバー') || ' さん: ' || v_preview,
        '/gallery/' || v_lab.artwork_id || '/lab'
      );
    end if;
  end loop;

  return new;
end;
$$;

drop trigger if exists on_lab_post_created on public.collab_lab_posts;
create trigger on_lab_post_created
  after insert on public.collab_lab_posts
  for each row
  execute function public.handle_lab_post_created();

-- ---------------------------------------------------------------------------
-- 注文完了 → 購入者へ
-- ---------------------------------------------------------------------------
create or replace function public.handle_order_paid()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.user_id is null then
    return new;
  end if;

  if old.status is not distinct from new.status then
    return new;
  end if;

  if new.status <> 'paid' then
    return new;
  end if;

  if not public.user_wants_notification(new.user_id, 'order') then
    return new;
  end if;

  insert into public.user_notifications (user_id, kind, title, body, href)
  values (
    new.user_id,
    'order_paid',
    'ご注文が完了しました',
    'お支払いが確認されました（' ||
      to_char(new.total_amount, 'FM999,999,999') || ' ' || upper(new.currency) || '）。',
    '/dashboard/orders'
  );

  return new;
end;
$$;

drop trigger if exists on_order_paid on public.orders;
create trigger on_order_paid
  after update on public.orders
  for each row
  execute function public.handle_order_paid();

-- ---------------------------------------------------------------------------
-- サポート返信（スタッフ）→ チケット所有者へ
-- ---------------------------------------------------------------------------
create or replace function public.handle_support_staff_reply()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ticket record;
  v_preview text;
begin
  if not new.is_staff then
    return new;
  end if;

  select id, user_id, ticket_number, subject into v_ticket
  from public.support_tickets
  where id = new.ticket_id;

  if v_ticket.user_id is null then
    return new;
  end if;

  if not public.user_wants_notification(v_ticket.user_id, 'support') then
    return new;
  end if;

  v_preview := left(replace(new.body, E'\n', ' '), 80);
  if length(new.body) > 80 then
    v_preview := v_preview || '…';
  end if;

  insert into public.user_notifications (user_id, kind, title, body, href)
  values (
    v_ticket.user_id,
    'support_reply',
    'サポート返信: ' || v_ticket.ticket_number,
    '「' || v_ticket.subject || '」への返信: ' || v_preview,
    '/help/tickets'
  );

  return new;
end;
$$;

drop trigger if exists on_support_staff_reply on public.support_ticket_messages;
create trigger on_support_staff_reply
  after insert on public.support_ticket_messages
  for each row
  execute function public.handle_support_staff_reply();

-- ---------------------------------------------------------------------------
-- コラボ申請トリガー: 通知設定を尊重
-- ---------------------------------------------------------------------------
create or replace function public.handle_collab_request_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_artwork_title text;
  v_requester_name text;
begin
  if not public.user_wants_notification(new.creator_id, 'collab') then
    return new;
  end if;

  select title into v_artwork_title from public.artworks where id = new.artwork_id;
  select coalesce(display_name, username, 'ユーザー') into v_requester_name
    from public.profiles where id = new.requester_id;

  insert into public.user_notifications (
    user_id,
    kind,
    title,
    body,
    href,
    collab_request_id
  )
  values (
    new.creator_id,
    'collab_request',
    'コラボ申請: ' || coalesce(v_artwork_title, '作品'),
    coalesce(v_requester_name, 'ユーザー') || ' さんからコラボの申請が届きました。',
    '/settings#notifications',
    new.id
  );

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Realtime（ヘッダー 🔔 用）
-- ---------------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'user_notifications'
    ) then
      alter publication supabase_realtime add table public.user_notifications;
    end if;
  end if;
end $$;
