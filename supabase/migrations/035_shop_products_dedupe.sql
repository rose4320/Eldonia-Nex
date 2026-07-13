-- Shop: 重複商品の整理 + 同一作品の二重出品防止

-- 034 未適用環境向け（download_url / source_artwork_id）
alter table public.shop_products
  add column if not exists download_url text;

alter table public.shop_products
  add column if not exists source_artwork_id uuid references public.artworks (id) on delete set null;

create index if not exists shop_products_source_artwork_id_idx
  on public.shop_products (source_artwork_id)
  where source_artwork_id is not null;

-- 1) 既存の重複 active 商品を非公開（最新1件だけ残す）
with ranked as (
  select
    id,
    row_number() over (
      partition by
        coalesce(seller_id::text, 'platform'),
        coalesce(
          source_artwork_id::text,
          nullif(trim(image_url), ''),
          lower(trim(title))
        )
      order by created_at desc nulls last, id desc
    ) as rn
  from public.shop_products
  where is_active = true
)
update public.shop_products sp
set
  is_active = false,
  updated_at = now()
from ranked r
where sp.id = r.id
  and r.rn > 1;

-- 2) 同一出品者 × 同一 Gallery 作品の active 商品は1件のみ
create unique index if not exists shop_products_seller_source_artwork_active_uidx
  on public.shop_products (seller_id, source_artwork_id)
  where source_artwork_id is not null
    and is_active = true;

comment on index shop_products_seller_source_artwork_active_uidx is
  '同一作品からの Shop 二重出品を防止（active のみ）';
