-- Eldonia-Nex: user-facing EXP awards for Supabase app
-- 007_works.sql 実行後に適用

create table if not exists public.exp_actions (
  action_type text primary key,
  base_exp integer not null default 0 check (base_exp >= 0),
  description text not null,
  max_daily_count integer not null default 0 check (max_daily_count >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists exp_actions_set_updated_at on public.exp_actions;
create trigger exp_actions_set_updated_at
  before update on public.exp_actions
  for each row
  execute function public.set_updated_at();

create table if not exists public.user_exp_awards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  action_type text not null references public.exp_actions (action_type),
  reference_key text not null default '__once__',
  exp_gained integer not null check (exp_gained >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, action_type, reference_key)
);

create index if not exists user_exp_awards_user_created_idx
  on public.user_exp_awards (user_id, created_at desc);

alter table public.exp_actions enable row level security;
alter table public.user_exp_awards enable row level security;

drop policy if exists "exp_actions_select" on public.exp_actions;
create policy "exp_actions_select"
  on public.exp_actions for select using (true);

drop policy if exists "user_exp_awards_select_own" on public.user_exp_awards;
create policy "user_exp_awards_select_own"
  on public.user_exp_awards for select using (auth.uid() = user_id);

insert into public.exp_actions (action_type, base_exp, description, max_daily_count, is_active)
values
  ('user.signup', 20, '新規登録', 1, true),
  ('profile.basics', 100, '基本情報を登録', 1, true),
  ('artwork.upload', 50, '作品投稿', 20, true),
  ('product.create', 40, '商品作成', 20, true),
  ('event.create', 40, 'イベント作成', 10, true),
  ('job.create', 30, '求人作成', 10, true),
  ('job.apply', 25, 'WORKS応募', 20, true),
  ('community.thread', 15, 'スレッド作成', 20, true),
  ('community.reply', 8, 'コミュニティ返信', 50, true),
  ('comment.create', 10, 'コメント投稿', 50, true),
  ('like.create', 3, 'いいね', 100, true),
  ('fan.create', 8, 'ファン登録', 50, true),
  ('collab.request', 15, 'コラボ申請', 20, true),
  ('lab.post', 10, 'Collab Lab 投稿', 50, true)
on conflict (action_type) do update
set
  base_exp = excluded.base_exp,
  description = excluded.description,
  max_daily_count = excluded.max_daily_count,
  is_active = excluded.is_active;

create or replace function public.award_user_exp(
  p_action_type text,
  p_reference_key text default ''
)
returns integer
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid := auth.uid();
  v_action public.exp_actions%rowtype;
  v_reference_key text := coalesce(nullif(trim(p_reference_key), ''), '__once__');
  v_daily_count integer := 0;
  v_awarded integer;
  v_next_exp integer;
begin
  if v_user_id is null then
    return 0;
  end if;

  select *
    into v_action
    from public.exp_actions
   where action_type = p_action_type
     and is_active = true;

  if not found or v_action.base_exp <= 0 then
    return 0;
  end if;

  if v_action.max_daily_count > 0 then
    select count(*)
      into v_daily_count
      from public.user_exp_awards
     where user_id = v_user_id
       and action_type = p_action_type
       and created_at >= date_trunc('day', now());

    if v_daily_count >= v_action.max_daily_count then
      return 0;
    end if;
  end if;

  insert into public.user_exp_awards (
    user_id,
    action_type,
    reference_key,
    exp_gained
  )
  values (
    v_user_id,
    p_action_type,
    v_reference_key,
    v_action.base_exp
  )
  on conflict (user_id, action_type, reference_key) do nothing
  returning exp_gained into v_awarded;

  if v_awarded is null then
    return 0;
  end if;

  insert into public.portfolios (
    user_id,
    exp_points,
    level,
    title_badge,
    visibility,
    attach_on_apply
  )
  values (
    v_user_id,
    v_awarded,
    greatest(1, floor(v_awarded / 500)::integer + 1),
    'Nexus Initiate',
    'public',
    true
  )
  on conflict (user_id) do update
  set
    exp_points = public.portfolios.exp_points + v_awarded,
    level = greatest(1, floor((public.portfolios.exp_points + v_awarded) / 500)::integer + 1),
    title_badge = case
      when public.portfolios.exp_points + v_awarded >= 1000 then 'Nexus Artisan'
      when public.portfolios.exp_points + v_awarded >= 500 then 'Nexus Adept'
      else coalesce(public.portfolios.title_badge, 'Nexus Initiate')
    end,
    updated_at = now()
  returning exp_points into v_next_exp;

  return v_awarded;
end;
$$;

grant execute on function public.award_user_exp(text, text) to authenticated;
