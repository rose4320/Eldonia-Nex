-- Eldonia-Nex: コラボ Lab・通知連携
-- 013_gallery_engagement.sql 実行後に適用

-- ---------------------------------------------------------------------------
-- user_notifications 拡張
-- ---------------------------------------------------------------------------
alter table public.user_notifications
  drop constraint if exists user_notifications_kind_check;

alter table public.user_notifications
  add column if not exists collab_request_id uuid
    references public.collab_requests (id) on delete set null;

alter table public.user_notifications
  add constraint user_notifications_kind_check
  check (kind in (
    'notification',
    'announcement',
    'collab_request',
    'collab_accepted',
    'collab_declined'
  ));

create index if not exists user_notifications_collab_request_idx
  on public.user_notifications (collab_request_id)
  where collab_request_id is not null;

-- ---------------------------------------------------------------------------
-- collab_labs（承認後の共同作業スペース）
-- ---------------------------------------------------------------------------
create table if not exists public.collab_labs (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks (id) on delete cascade,
  collab_request_id uuid not null unique references public.collab_requests (id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  constraint collab_labs_title_length check (char_length(title) between 1 and 100)
);

create index if not exists collab_labs_artwork_id_idx
  on public.collab_labs (artwork_id);

comment on table public.collab_labs is 'GALLERY コラボ Lab（作品名ベースの共同作業）';

-- ---------------------------------------------------------------------------
-- collab_lab_members
-- ---------------------------------------------------------------------------
create table if not exists public.collab_lab_members (
  lab_id uuid not null references public.collab_labs (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'collaborator'
    check (role in ('owner', 'collaborator')),
  joined_at timestamptz not null default now(),
  primary key (lab_id, user_id)
);

comment on table public.collab_lab_members is 'Lab メンバー';

-- ---------------------------------------------------------------------------
-- collab_lab_posts（Lab 内メモ・共有）
-- ---------------------------------------------------------------------------
create table if not exists public.collab_lab_posts (
  id uuid primary key default gen_random_uuid(),
  lab_id uuid not null references public.collab_labs (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  constraint collab_lab_posts_body_length check (char_length(body) between 1 and 4000)
);

create index if not exists collab_lab_posts_lab_id_idx
  on public.collab_lab_posts (lab_id, created_at asc);

comment on table public.collab_lab_posts is 'Lab 共同作業メモ';

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.collab_labs enable row level security;
alter table public.collab_lab_members enable row level security;
alter table public.collab_lab_posts enable row level security;

drop policy if exists "collab_labs_select_member" on public.collab_labs;
create policy "collab_labs_select_member"
  on public.collab_labs
  for select
  using (
    exists (
      select 1 from public.collab_lab_members m
      where m.lab_id = id and m.user_id = auth.uid()
    )
  );

drop policy if exists "collab_lab_members_select_member" on public.collab_lab_members;
create policy "collab_lab_members_select_member"
  on public.collab_lab_members
  for select
  using (
    exists (
      select 1 from public.collab_lab_members m
      where m.lab_id = lab_id and m.user_id = auth.uid()
    )
  );

drop policy if exists "collab_lab_posts_select_member" on public.collab_lab_posts;
create policy "collab_lab_posts_select_member"
  on public.collab_lab_posts
  for select
  using (
    exists (
      select 1 from public.collab_lab_members m
      where m.lab_id = lab_id and m.user_id = auth.uid()
    )
  );

drop policy if exists "collab_lab_posts_insert_member" on public.collab_lab_posts;
create policy "collab_lab_posts_insert_member"
  on public.collab_lab_posts
  for insert
  with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.collab_lab_members m
      where m.lab_id = lab_id and m.user_id = auth.uid()
    )
  );

grant select on public.collab_labs to authenticated;
grant select on public.collab_lab_members to authenticated;
grant select, insert on public.collab_lab_posts to authenticated;

-- ---------------------------------------------------------------------------
-- コラボ申請時にクリエイターへ通知
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

drop trigger if exists on_collab_request_created on public.collab_requests;
create trigger on_collab_request_created
  after insert on public.collab_requests
  for each row
  execute function public.handle_collab_request_created();

-- ---------------------------------------------------------------------------
-- 承認 / 却下 RPC
-- ---------------------------------------------------------------------------
create or replace function public.respond_to_collab_request(
  p_request_id uuid,
  p_action text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.collab_requests%rowtype;
  v_artwork_title text;
  v_creator_name text;
  v_lab_id uuid;
begin
  if p_action not in ('accept', 'decline') then
    raise exception 'invalid action';
  end if;

  select * into v_request
  from public.collab_requests
  where id = p_request_id;

  if not found then
    raise exception 'request not found';
  end if;

  if v_request.creator_id <> auth.uid() then
    raise exception 'not authorized';
  end if;

  if v_request.status <> 'pending' then
    raise exception 'already processed';
  end if;

  select title into v_artwork_title
  from public.artworks where id = v_request.artwork_id;

  select coalesce(display_name, username, 'ユーザー') into v_creator_name
  from public.profiles where id = v_request.creator_id;

  if p_action = 'accept' then
    update public.collab_requests
    set status = 'accepted'
    where id = p_request_id;

    insert into public.collab_labs (artwork_id, collab_request_id, title)
    values (
      v_request.artwork_id,
      p_request_id,
      coalesce(v_artwork_title, 'コラボ Lab')
    )
    returning id into v_lab_id;

    insert into public.collab_lab_members (lab_id, user_id, role)
    values
      (v_lab_id, v_request.creator_id, 'owner'),
      (v_lab_id, v_request.requester_id, 'collaborator');

    insert into public.user_notifications (user_id, kind, title, body, href)
    values (
      v_request.requester_id,
      'collab_accepted',
      'コラボが承認されました',
      v_creator_name || ' さんが「' || coalesce(v_artwork_title, '作品') ||
        '」のコラボ申請を承認しました。Lab で共同作業を始められます。',
      '/gallery/' || v_request.artwork_id || '/lab'
    );
  else
    update public.collab_requests
    set status = 'declined'
    where id = p_request_id;

    insert into public.user_notifications (user_id, kind, title, body, href)
    values (
      v_request.requester_id,
      'collab_declined',
      'コラボ申請について',
      v_creator_name || ' さんより、「' || coalesce(v_artwork_title, '作品') ||
        '」に関するコラボ申請についてご連絡いたします。' ||
        '誠に恐れ入りますが、今回は見送らせていただく運びとなりました。' ||
        'お気持ちは大変ありがたく存じます。また別の機会がありましたら、ぜひお声がけください。',
      '/gallery/' || v_request.artwork_id
    );
  end if;

  update public.user_notifications
  set is_read = true
  where collab_request_id = p_request_id
    and user_id = v_request.creator_id;

  return v_lab_id;
end;
$$;

grant execute on function public.respond_to_collab_request(uuid, text) to authenticated;
