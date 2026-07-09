-- Eldonia-Nex: サポートデスク（FAQ・問い合わせチケット）
-- 001_profiles.sql 実行後に適用

-- ---------------------------------------------------------------------------
-- enums
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'support_ticket_category') then
    create type public.support_ticket_category as enum (
      'account',
      'billing',
      'gallery',
      'shop',
      'events',
      'community',
      'works',
      'technical',
      'other'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'support_ticket_priority') then
    create type public.support_ticket_priority as enum (
      'low',
      'normal',
      'high',
      'urgent'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'support_ticket_status') then
    create type public.support_ticket_status as enum (
      'open',
      'in_progress',
      'waiting_user',
      'resolved',
      'closed'
    );
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- support_faq_articles
-- ---------------------------------------------------------------------------
create table if not exists public.support_faq_articles (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint support_faq_question_length check (char_length(question) between 1 and 300),
  constraint support_faq_answer_length check (char_length(answer) between 1 and 5000)
);

create index if not exists support_faq_category_idx
  on public.support_faq_articles (category, sort_order);

drop trigger if exists support_faq_set_updated_at on public.support_faq_articles;
create trigger support_faq_set_updated_at
  before update on public.support_faq_articles
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- support_tickets
-- ---------------------------------------------------------------------------
create or replace function public.generate_support_ticket_number()
returns text
language plpgsql
as $$
declare
  candidate text;
begin
  candidate := 'ENX-'
    || to_char(now(), 'YYYYMMDD')
    || '-'
    || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
  return candidate;
end;
$$;

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  ticket_number text not null unique default public.generate_support_ticket_number(),
  user_id uuid references auth.users (id) on delete set null,
  contact_name text not null,
  contact_email text not null,
  category public.support_ticket_category not null default 'other',
  priority public.support_ticket_priority not null default 'normal',
  status public.support_ticket_status not null default 'open',
  subject text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz,
  constraint support_tickets_subject_length check (char_length(subject) between 1 and 200),
  constraint support_tickets_contact_name_length check (char_length(contact_name) between 1 and 100),
  constraint support_tickets_contact_email_length check (char_length(contact_email) between 3 and 320)
);

create index if not exists support_tickets_user_id_idx on public.support_tickets (user_id);
create index if not exists support_tickets_status_idx on public.support_tickets (status);
create index if not exists support_tickets_created_at_idx
  on public.support_tickets (created_at desc);

drop trigger if exists support_tickets_set_updated_at on public.support_tickets;
create trigger support_tickets_set_updated_at
  before update on public.support_tickets
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- support_ticket_messages
-- ---------------------------------------------------------------------------
create table if not exists public.support_ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.support_tickets (id) on delete cascade,
  author_user_id uuid references auth.users (id) on delete set null,
  author_name text not null,
  is_staff boolean not null default false,
  body text not null,
  created_at timestamptz not null default now(),
  constraint support_ticket_messages_body_length check (char_length(body) between 1 and 5000)
);

create index if not exists support_ticket_messages_ticket_id_idx
  on public.support_ticket_messages (ticket_id, created_at);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.support_faq_articles enable row level security;
alter table public.support_tickets enable row level security;
alter table public.support_ticket_messages enable row level security;

drop policy if exists "support_faq_select_published" on public.support_faq_articles;
create policy "support_faq_select_published"
  on public.support_faq_articles
  for select
  using (is_published = true);

drop policy if exists "support_tickets_select_own" on public.support_tickets;
create policy "support_tickets_select_own"
  on public.support_tickets
  for select
  using (auth.uid() = user_id);

drop policy if exists "support_tickets_insert" on public.support_tickets;
create policy "support_tickets_insert"
  on public.support_tickets
  for insert
  with check (
    auth.uid() is null
    or user_id is null
    or auth.uid() = user_id
  );

drop policy if exists "support_ticket_messages_select_own" on public.support_ticket_messages;
create policy "support_ticket_messages_select_own"
  on public.support_ticket_messages
  for select
  using (
    exists (
      select 1
      from public.support_tickets t
      where t.id = ticket_id
        and t.user_id = auth.uid()
    )
  );

drop policy if exists "support_ticket_messages_insert_own" on public.support_ticket_messages;
create policy "support_ticket_messages_insert_own"
  on public.support_ticket_messages
  for insert
  with check (
    is_staff = false
    and exists (
      select 1
      from public.support_tickets t
      where t.id = ticket_id
        and t.user_id = auth.uid()
        and t.status not in ('resolved', 'closed')
    )
  );

-- ---------------------------------------------------------------------------
-- 初期 FAQ
-- ---------------------------------------------------------------------------
insert into public.support_faq_articles (category, question, answer, sort_order)
values
  (
    'getting_started',
    'Eldonia-Nex とは何ですか？',
    'Eldonia-Nex（エルドニア・ネクス）は、クリエイターが Quest（制作依頼・協業）に挑戦し、作品づくり・ファンとのつながり・販売・イベントをひとつの循環で楽しめる創作経済圏です。Gallery で作品を公開し、Shop や Events でファンと出会い、Works で Quest に応募したり依頼を受けたり、Community で交流できます。活動は EXP（経験値）や信用として可視化され、「挑戦が収益や次の機会につながる」Nexus を目指しています。',
    1
  ),
  (
    'getting_started',
    'アカウント登録は無料ですか？',
    'はい、基本機能は無料でご利用いただけます。有料プランやデジタル商品の販売機能は今後追加予定です。',
    2
  ),
  (
    'getting_started',
    'クリエイターはどうやって収益を得られますか？',
    $faq$クリエイターの主な収益の柱は次のとおりです（※順次提供・拡充予定の機能があります）。

・Quest / Works：制作依頼・協業の報酬
・Shop：デジタル商品やグッズの販売
・Events：ライブ・ワークショップ・展示などのチケット収入
・ファンとのつながり：支援や継続的な購入

EXP やポートフォリオで実績が見える化されるため、信頼の蓄積が新しい依頼や販売機会につながります。料金プランや手数料の詳細は、今後の告知および「請求・お支払い」カテゴリの FAQ で順次お知らせします。$faq$,
    3
  ),
  (
    'account',
    'ログインできない場合はどうすればよいですか？',
    'メールアドレスとパスワードが正しいかご確認ください。大文字・小文字や全角・半角の入力ミスにもご注意ください。パスワードをお忘れの場合は、ログイン画面の案内に従って再設定してください（機能準備中の場合はお問い合わせください）。解決しない場合はお問い合わせフォームから「アカウント」カテゴリでご連絡ください。',
    1
  ),
  (
    'account',
    'プロフィールはどこで編集できますか？',
    'ログイン後、ダッシュボードの「プロフィール編集」から、表示名・ユーザー名・自己紹介を変更できます。',
    2
  ),
  (
    'gallery',
    '作品はどのような形式で投稿できますか？',
    '画像（JPEG/PNG/GIF/WebP）、動画（MP4/MOV）、音声（MP3/WAV/FLAC）、PDF に対応しています。ギャラリーの「作品を投稿」からアップロードできます。',
    1
  ),
  (
    'gallery',
    '投稿した作品がギャラリーに表示されません',
    '作品の「公開」設定がオンになっているかご確認ください。アップロード直後は反映に数秒かかる場合があります。それでも表示されない場合は、対応しているファイル形式か、ファイルサイズが上限以内かをご確認ください。解決しない場合はお問い合わせフォームから「GALLERY（作品）」カテゴリでご連絡ください。',
    2
  ),
  (
    'billing',
    '支払い方法は何が使えますか？',
    'SHOP モジュールは準備中です。Stripe 等による決済連携は今後リリース予定です。料金に関するご質問は「請求・お支払い」カテゴリでお問い合わせください。',
    1
  ),
  (
    'technical',
    'ページが表示されない・エラーが出る',
    'ブラウザのキャッシュを削除するか、別のブラウザ・シークレット（プライベート）ウィンドウで再度お試しください。インターネット接続を確認し、ページを再読み込みしてください。問題が続く場合は、表示されているエラーメッセージとあわせてお問い合わせフォームから「技術的な問題」カテゴリでご連絡ください。',
    1
  ),
  (
    'technical',
    '対応ブラウザは？',
    '最新版の Chrome、Firefox、Safari、Edge を推奨しています。Internet Explorer には対応していません。',
    2
  ),
  (
    'support',
    '問い合わせ後、どのくらいで返信がありますか？',
    '通常 1〜2 営業日以内に初回返信を目指しています。アカウント停止・決済障害など緊急度の高い案件は優先対応します。チケット番号（ENX-YYYYMMDD-XXXXXX）を控えておいてください。',
    1
  ),
  (
    'support',
    '問い合わせ内容を追加・返信したい',
    'ログイン済みの場合は「マイチケット」から該当チケットを開き、追加メッセージを送信できます。未ログインで送信した場合は、同じメールアドレスから再度お問い合わせいただくか、アカウント作成後にサポートへチケット番号をお知らせください。',
    2
  );
