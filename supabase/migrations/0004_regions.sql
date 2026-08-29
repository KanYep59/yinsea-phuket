-- ============================================================================
-- YINSEA 后台管理系统 — 地区（城市）支持
-- ============================================================================
-- 目的：让产品同时归属于「地区」和「分类」。
--   地区：普吉岛、曼谷、苏梅岛……
--   分类：游艇、别墅、SPA、直升机、旅拍、定制……
--
-- 本迁移只做增量变更：
--   1. 新增 public.regions 表；
--   2. 在已有 public.products 表新增 region_id 字段；
--   3. 把当前没有地区的已有产品统一标记为「普吉岛」。
--
-- 不会重建或删除 products、categories，也不会修改产品的价格、内容或图片。
-- 可安全重复执行。
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. 地区（城市）
-- ---------------------------------------------------------------------------
create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,             -- 技术标识，例如 phuket / bangkok
  name text not null unique,             -- 中文名称，例如 普吉岛
  name_en text default '',               -- 英文名称，例如 Phuket
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.regions add column if not exists name_en text default '';
alter table public.regions add column if not exists sort_order int not null default 0;
alter table public.regions add column if not exists is_active boolean not null default true;
alter table public.regions add column if not exists updated_at timestamptz not null default now();

insert into public.regions (slug, name, name_en, sort_order)
values ('phuket', '普吉岛', 'Phuket', 1)
on conflict (slug) do update
set name = excluded.name,
    name_en = excluded.name_en,
    sort_order = excluded.sort_order;

-- ---------------------------------------------------------------------------
-- 2. 给保留的 products 表增加地区关联
-- ---------------------------------------------------------------------------
alter table public.products add column if not exists region_id uuid;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_region_id_fkey'
  ) then
    alter table public.products
      add constraint products_region_id_fkey
      foreign key (region_id) references public.regions(id) on delete restrict;
  end if;
end $$;

create index if not exists products_region_idx on public.products(region_id);

-- 当前网站的既有产品均为普吉岛产品；只填充尚未设置地区的产品。
update public.products
set region_id = (select id from public.regions where slug = 'phuket')
where region_id is null;

-- ---------------------------------------------------------------------------
-- 3. 自动更新时间与地区访问权限
-- ---------------------------------------------------------------------------
drop trigger if exists set_updated_at on public.regions;
create trigger set_updated_at
before update on public.regions
for each row execute function public.set_updated_at();

alter table public.regions enable row level security;

drop policy if exists regions_admin_all on public.regions;
create policy regions_admin_all on public.regions for all
  using (public.current_role_is_admin())
  with check (public.current_role_is_admin());

drop policy if exists regions_active_user_read on public.regions;
create policy regions_active_user_read on public.regions for select
  using (public.is_logged_in_active());

grant select on public.regions to authenticated;

-- ---------------------------------------------------------------------------
-- 4. 代理商安全视图加入 region_id，供其按地区筛选。
--    保留白名单策略：成本、供应商、内部备注仍不会被代理商读取。
-- ---------------------------------------------------------------------------
create or replace view public.agent_products
with (security_barrier = true)
as
select
  id,
  name,
  name_en,
  slug,
  category_id,
  status,
  sort_order,
  featured,
  emoji,
  created_at,
  retail,
  agent,
  images,
  description,
  summary,
  faq,
  specifications,
  includes,
  highlights,
  region_id
from public.products
where public.is_logged_in_active();

grant select on public.agent_products to authenticated;

-- ============================================================================
-- 完成后：管理员可为每个产品选择地区；代理商可按地区筛选，且不能读取内部字段。
-- ============================================================================
