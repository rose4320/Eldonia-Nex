-- Eldonia-Nex: Quest challenges (admin-published) + participations

do $$
begin
  if not exists (select 1 from pg_type where typname = 'quest_kind') then
    create type public.quest_kind as enum ('daily', 'brand', 'community');
  end if;
  if not exists (select 1 from pg_type where typname = 'quest_status') then
    create type public.quest_status as enum ('draft', 'open', 'closed');
  end if;
end $$;

alter table public.profiles
  add column if not exists is_ops_admin boolean not null default false;

create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  kind public.quest_kind not null default 'brand',
  status public.quest_status not null default 'draft',
  exp_reward integer not null default 25 check (exp_reward >= 0),
  prize_summary text,
  submission_hint text,
  starts_at timestamptz,
  ends_at timestamptz,
  is_featured boolean not null default false,
  published_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists quests_set_updated_at on public.quests;
create trigger quests_set_updated_at
  before update on public.quests
  for each row
  execute function public.set_updated_at();

create table if not exists public.quest_participations (
  id uuid primary key default gen_random_uuid(),
  quest_id uuid not null references public.quests (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'joined'
    check (status in ('joined', 'submitted', 'completed', 'winner')),
  submission_url text,
  submission_note text,
  exp_awarded integer not null default 0 check (exp_awarded >= 0),
  portfolio_entry jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (quest_id, user_id)
);

drop trigger if exists quest_participations_set_updated_at on public.quest_participations;
create trigger quest_participations_set_updated_at
  before update on public.quest_participations
  for each row
  execute function public.set_updated_at();

create index if not exists quests_status_featured_idx
  on public.quests (status, is_featured desc, created_at desc);

create index if not exists quest_participations_user_created_idx
  on public.quest_participations (user_id, created_at desc);

alter table public.quests enable row level security;
alter table public.quest_participations enable row level security;

drop policy if exists "quests_select_open" on public.quests;
create policy "quests_select_open"
  on public.quests for select
  using (
    status = 'open'
    or published_by = auth.uid()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_ops_admin = true
    )
  );

drop policy if exists "quests_insert_ops_admin" on public.quests;
create policy "quests_insert_ops_admin"
  on public.quests for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_ops_admin = true
    )
  );

drop policy if exists "quests_update_ops_admin" on public.quests;
create policy "quests_update_ops_admin"
  on public.quests for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_ops_admin = true
    )
  );

drop policy if exists "quest_participations_select_own" on public.quest_participations;
create policy "quest_participations_select_own"
  on public.quest_participations for select
  using (user_id = auth.uid());

drop policy if exists "quest_participations_insert_own" on public.quest_participations;
create policy "quest_participations_insert_own"
  on public.quest_participations for insert
  with check (user_id = auth.uid());

drop policy if exists "quest_participations_update_own" on public.quest_participations;
create policy "quest_participations_update_own"
  on public.quest_participations for update
  using (user_id = auth.uid());

insert into public.exp_actions (action_type, base_exp, description, max_daily_count, is_active)
values
  ('auth.daily_login', 10, '毎日ログイン', 1, true),
  ('quest.participate', 25, 'Quest参加', 50, true)
on conflict (action_type) do update
set
  base_exp = excluded.base_exp,
  description = excluded.description,
  max_daily_count = excluded.max_daily_count,
  is_active = excluded.is_active;

grant usage on type public.quest_kind to anon, authenticated, service_role;
grant usage on type public.quest_status to anon, authenticated, service_role;

insert into public.quests (
  title,
  description,
  kind,
  status,
  exp_reward,
  prize_summary,
  submission_hint,
  is_featured
)
values
  (
    '毎日ログイン Quest',
    'Eldonia-Nex にログインして EXP を獲得しましょう。毎日1回、自動で経験値が付与されます。',
    'daily',
    'open',
    10,
    null,
    null,
    false
  ),
  (
    '新製品PR動画チャレンジ',
    '指定の新製品をテーマに、60秒以内のPR動画を制作してください。優秀作品には現金5万円または高性能PCを贈呈。参加者全員にEXPとポートフォリオ実績が記録されます。',
    'brand',
    'open',
    50,
    '現金5万円 / 高性能PC / 限定グッズ',
    '完成動画のURL（YouTube・Google Drive等）を提出してください。',
    true
  ),
  (
    '初めてのGallery投稿',
    'Galleryに作品を1点以上公開して、クリエイターとしての第一歩を踏み出しましょう。',
    'community',
    'open',
    30,
    null,
    'Galleryに公開した作品のURLを任意で添付できます。',
    false
  );