-- Eldonia-Nex: LP 事前登録（ベータ先行案内 waitlist）
-- 匿名の LP 訪問者からのメール登録を保存する。
-- 書き込みは service role 経由の API ルートのみ（RLS で一般公開の読み書きは拒否）。

create table if not exists public.prelaunch_registrations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  locale text,
  referral_code text,
  source text not null default 'lp_cta',
  user_agent text,
  created_at timestamptz not null default now(),
  constraint prelaunch_registrations_email_unique unique (email)
);

create index if not exists prelaunch_registrations_created_idx
  on public.prelaunch_registrations (created_at desc);

comment on table public.prelaunch_registrations is 'LP 事前登録（ベータ先行案内）メールリスト';

-- RLS: 一般ロールからの参照・書き込みを禁止（service role のみが操作）
alter table public.prelaunch_registrations enable row level security;

-- 明示的な許可ポリシーは作らない（anon/authenticated からのアクセスを遮断）
