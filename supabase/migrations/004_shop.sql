-- Eldonia-Nex: SHOP 商品テーブル
-- 001_profiles.sql 実行後に適用

-- ---------------------------------------------------------------------------
-- enums
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'shop_product_type') then
    create type public.shop_product_type as enum ('physical', 'digital');
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- shop_products
-- ---------------------------------------------------------------------------
create table if not exists public.shop_products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.profiles (id) on delete set null,
  title text not null,
  description text,
  category text not null default 'goods',
  product_type public.shop_product_type not null default 'physical',
  price integer not null check (price >= 0),
  compare_at_price integer check (compare_at_price is null or compare_at_price >= 0),
  image_url text,
  gallery_urls text[] not null default '{}',
  rating numeric(2, 1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  stock_quantity integer check (stock_quantity is null or stock_quantity >= 0),
  is_nexus_prime boolean not null default false,
  is_nexus_choice boolean not null default false,
  is_bestseller boolean not null default false,
  is_active boolean not null default true,
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint shop_products_title_length check (char_length(title) between 1 and 120),
  constraint shop_products_description_length check (
    description is null or char_length(description) <= 4000
  )
);

create index if not exists shop_products_category_idx on public.shop_products (category);
create index if not exists shop_products_is_active_idx on public.shop_products (is_active)
  where is_active = true;
create index if not exists shop_products_created_at_idx on public.shop_products (created_at desc);

drop trigger if exists shop_products_set_updated_at on public.shop_products;
create trigger shop_products_set_updated_at
  before update on public.shop_products
  for each row
  execute function public.set_updated_at();

comment on table public.shop_products is 'SHOP 商品';

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.shop_products enable row level security;

drop policy if exists "shop_products_select_active" on public.shop_products;
create policy "shop_products_select_active"
  on public.shop_products
  for select
  using (is_active = true or auth.uid() = seller_id);

drop policy if exists "shop_products_insert_seller" on public.shop_products;
create policy "shop_products_insert_seller"
  on public.shop_products
  for insert
  with check (auth.uid() = seller_id);

drop policy if exists "shop_products_update_seller" on public.shop_products;
create policy "shop_products_update_seller"
  on public.shop_products
  for update
  using (auth.uid() = seller_id)
  with check (auth.uid() = seller_id);

drop policy if exists "shop_products_delete_seller" on public.shop_products;
create policy "shop_products_delete_seller"
  on public.shop_products
  for delete
  using (auth.uid() = seller_id);

-- ---------------------------------------------------------------------------
-- デモ商品（初回のみ）
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from public.shop_products limit 1) then
    insert into public.shop_products (
      title, description, category, product_type, price, compare_at_price,
      rating, review_count, stock_quantity,
      is_nexus_prime, is_nexus_choice, is_bestseller, tags
    )
    values
      (
        'Eldonia Crest Hoodie — Obsidian',
        '漆黒地に金のエンブレムを配した公式パーカー。創作の合間に纏う、Nexus 定番アイテム。',
        'apparel', 'physical', 8800, 11000,
        4.7, 128, 42,
        true, true, true,
        array['公式', 'アパレル', '限定']
      ),
      (
        'Digital Brush Pack Vol. I — Golden Ink',
        'ファンタジー描線向け Procreate / Photoshop ブラシ 48 本。金箔・古羊皮紙テクスチャ付き。',
        'digital', 'digital', 2400, null,
        4.9, 312, null,
        true, true, true,
        array['デジタル', 'ブラシ', 'イラスト']
      ),
      (
        'Artisan Desk Mat — Realm Map',
        '王国全図をあしらった超大判デスクマット。防水・滑り止め加工。',
        'goods', 'physical', 4500, 5200,
        4.5, 89, 18,
        false, false, false,
        array['グッズ', 'デスク']
      ),
      (
        'Nexus Prime Annual Scroll',
        'Nexus Prime 年間メンバーシップ。送料無料・限定セール早期アクセス・デジタル特典。',
        'digital', 'digital', 9800, null,
        4.8, 56, null,
        true, false, false,
        array['メンバーシップ', 'Prime']
      ),
      (
        'Lore Compendium PDF Bundle',
        '世界観設定資料・キャラクター档案・魔法体系ガイドの PDF 3 冊セット。',
        'books', 'digital', 1800, 2200,
        4.6, 44, null,
        true, false, false,
        array['PDF', '設定資料']
      ),
      (
        'Creator Toolkit — Sound FX Chest',
        '環境音・魔法効果音 120 点。ゲーム・動画・配信向けロイヤリティフリー。',
        'tools', 'digital', 3200, null,
        4.4, 67, null,
        false, true, false,
        array['音声', 'SFX', 'クリエイター']
      );
  end if;
end $$;
