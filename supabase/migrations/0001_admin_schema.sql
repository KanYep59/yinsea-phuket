-- ============================================================================
-- YINSEA 后台管理系统 — 数据库结构 (Supabase / Postgres)
-- ============================================================================
-- 使用方法：
--   1. 打开你的 Supabase 项目 → SQL Editor
--   2. 新建一个查询，粘贴本文件全部内容
--   3. 点击 Run 执行一次即可（脚本可安全重复执行）
--   4. 执行完成后，按照文件末尾"创建第一个管理员账号"的说明操作
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. 角色与用户档案 (profiles)
-- ----------------------------------------------------------------------------
-- 每个可以登录后台的账号（管理员或代理商）在 auth.users 中都有一条记录，
-- 并在这里补充角色、姓名等信息。

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default '',
  role text not null default 'agent' check (role in ('admin', 'agent')),
  agent_id uuid, -- 若 role = 'agent'，关联下面的 agents.id
  status text not null default 'active' check (status in ('active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- 若 profiles 表因为其他原因已提前存在且缺少 updated_at 列，这里补齐，
-- 避免后面创建触发器/索引时报错 42703 column "updated_at" does not exist。
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

comment on table public.profiles is '后台登录账号：角色为 管理员(admin) 或 代理商(agent)';

-- ----------------------------------------------------------------------------
-- 权限判断函数（SECURITY DEFINER，避免 RLS 递归问题）
-- ----------------------------------------------------------------------------
create or replace function public.current_role_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'active'
  );
$$;

create or replace function public.current_agent_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select agent_id from public.profiles
  where id = auth.uid() and role = 'agent' and status = 'active';
$$;

create or replace function public.is_logged_in_active()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and status = 'active'
  );
$$;

-- ----------------------------------------------------------------------------
-- 2. 产品分类 (categories)
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,          -- 技术字段，如 yacht / villa / heli
  name text not null,                 -- 分类中文名，如 游艇出海
  icon text default '',               -- emoji 图标
  cover_url text default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.categories add column if not exists updated_at timestamptz not null default now();

-- ----------------------------------------------------------------------------
-- 3. 产品 (products)
-- ----------------------------------------------------------------------------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,                 -- 产品中文名
  name_en text default '',            -- 英文名（技术/资料用）
  emoji text default '',
  description text default '',
  status text not null default 'avail' check (status in ('avail', 'hot', 'full', 'offline')),
  retail_price numeric(12,2) default 0,   -- 市场价
  agent_price numeric(12,2) default 0,    -- 代理价（代理商可见）
  cost_price numeric(12,2) default 0,     -- 成本价（仅管理员可见）
  includes text[] default '{}',
  excludes text[] default '{}',
  itinerary text default '',
  faq jsonb default '[]',
  suppliers jsonb default '[]',           -- 内部：供应商与成本，仅管理员可见
  internal_notes text default '',         -- 内部备注，仅管理员可见
  materials text[] default '{}',          -- 可下载资料说明（代理商可见）
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- 关键修复点：如果 public.products 在本次脚本运行之前就已经存在（例如上一次
-- 运行中途失败，Supabase SQL Editor 是逐条语句提交的，之前已成功的 create table
-- 会被保留），"create table if not exists" 不会补上缺失的列，下面这行强制补齐，
-- 这样后面紧跟着的 updated_at 索引就不会再报 42703 column "updated_at" does not exist。
alter table public.products add column if not exists updated_at timestamptz not null default now();

create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_updated_idx on public.products(updated_at desc);

-- 产品图片（图片库）
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  url text not null,
  storage_path text default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists product_images_product_idx on public.product_images(product_id);

-- ----------------------------------------------------------------------------
-- 4. 代理商 (agents) — 业务信息，区别于登录账号 profiles
-- ----------------------------------------------------------------------------
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text default '',
  phone text default '',
  wechat text default '',
  email text default '',
  tier text default '标准',           -- 代理等级，如 标准 / 核心 / VIP
  commission_note text default '',
  status text not null default 'active' check (status in ('active', 'disabled')),
  notes text default '',              -- 内部备注，仅管理员可见
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.agents add column if not exists updated_at timestamptz not null default now();

alter table public.profiles
  add constraint profiles_agent_id_fkey foreign key (agent_id)
  references public.agents(id) on delete set null;

-- ----------------------------------------------------------------------------
-- 5. 客户管理 (customers)
-- ----------------------------------------------------------------------------
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete set null, -- 归属代理商（为空则为管理员直客）
  name text not null,
  phone text default '',
  wechat text default '',
  source text default '',
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.customers add column if not exists updated_at timestamptz not null default now();

create index if not exists customers_agent_idx on public.customers(agent_id);

-- ----------------------------------------------------------------------------
-- 6. 订单管理 (orders)
-- ----------------------------------------------------------------------------
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique default ('YS' || to_char(now(), 'YYMMDD') || substr(replace(gen_random_uuid()::text,'-',''),1,6)),
  product_id uuid references public.products(id) on delete set null,
  customer_id uuid references public.customers(id) on delete set null,
  agent_id uuid references public.agents(id) on delete set null,
  unit_price numeric(12,2) default 0,   -- 下单时的单价快照（代理价或市场价）
  quantity int not null default 1,
  total_price numeric(12,2) default 0,
  travel_date date,
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.orders add column if not exists updated_at timestamptz not null default now();

create index if not exists orders_agent_idx on public.orders(agent_id);
create index if not exists orders_status_idx on public.orders(status);

-- ----------------------------------------------------------------------------
-- 7. 系统设置 (site_settings) — 单行表
-- ----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id int primary key default 1,
  company_name text default '隐海 YINSEA PHUKET',
  contact_wechat text default '',
  contact_whatsapp text default '',
  notice text default '',
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
alter table public.site_settings add column if not exists updated_at timestamptz not null default now();
insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- updated_at 自动更新触发器
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['profiles','categories','products','agents','customers','orders','site_settings']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ============================================================================
-- 行级安全策略 (Row Level Security)
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.agents enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.site_settings enable row level security;

-- profiles：本人可读自己；管理员可读写全部
drop policy if exists profiles_self_select on public.profiles;
create policy profiles_self_select on public.profiles for select
  using (id = auth.uid() or public.current_role_is_admin());
drop policy if exists profiles_admin_write on public.profiles;
create policy profiles_admin_write on public.profiles for insert
  with check (public.current_role_is_admin());
drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles for update
  using (id = auth.uid() or public.current_role_is_admin());
drop policy if exists profiles_admin_delete on public.profiles;
create policy profiles_admin_delete on public.profiles for delete
  using (public.current_role_is_admin());

-- categories：管理员完全管理；代理商只读
drop policy if exists categories_admin_all on public.categories;
create policy categories_admin_all on public.categories for all
  using (public.current_role_is_admin()) with check (public.current_role_is_admin());
drop policy if exists categories_agent_read on public.categories;
create policy categories_agent_read on public.categories for select
  using (public.is_logged_in_active());

-- products：只有管理员可以直接读写基础表（含成本价/内部备注）。
-- 代理商不通过本表读取，而是通过下面的 agent_products 视图读取（不含敏感字段）。
drop policy if exists products_admin_all on public.products;
create policy products_admin_all on public.products for all
  using (public.current_role_is_admin()) with check (public.current_role_is_admin());

-- product_images：管理员管理；代理商可读（用于查看/下载素材图）
drop policy if exists product_images_admin_all on public.product_images;
create policy product_images_admin_all on public.product_images for all
  using (public.current_role_is_admin()) with check (public.current_role_is_admin());
drop policy if exists product_images_agent_read on public.product_images;
create policy product_images_agent_read on public.product_images for select
  using (public.is_logged_in_active());

-- agents：管理员完全管理；代理商只能读到自己那一条
drop policy if exists agents_admin_all on public.agents;
create policy agents_admin_all on public.agents for all
  using (public.current_role_is_admin()) with check (public.current_role_is_admin());
drop policy if exists agents_self_read on public.agents;
create policy agents_self_read on public.agents for select
  using (id = public.current_agent_id());

-- customers：管理员全部；代理商仅自己名下客户
drop policy if exists customers_admin_all on public.customers;
create policy customers_admin_all on public.customers for all
  using (public.current_role_is_admin()) with check (public.current_role_is_admin());
drop policy if exists customers_agent_own on public.customers;
create policy customers_agent_own on public.customers for all
  using (agent_id = public.current_agent_id())
  with check (agent_id = public.current_agent_id());

-- orders：管理员全部；代理商仅自己名下订单
drop policy if exists orders_admin_all on public.orders;
create policy orders_admin_all on public.orders for all
  using (public.current_role_is_admin()) with check (public.current_role_is_admin());
drop policy if exists orders_agent_own on public.orders;
create policy orders_agent_own on public.orders for all
  using (agent_id = public.current_agent_id())
  with check (agent_id = public.current_agent_id());

-- site_settings：仅管理员
drop policy if exists site_settings_admin_all on public.site_settings;
create policy site_settings_admin_all on public.site_settings for all
  using (public.current_role_is_admin()) with check (public.current_role_is_admin());

-- ============================================================================
-- 代理商专用产品视图（不含成本价 cost_price / 供应商 suppliers / 内部备注 internal_notes）
-- ============================================================================
-- 注意：这里刻意不设置 security_invoker = true。
-- 该视图必须以创建者（视图 owner，通常拥有 products 表并因此可绕过其 RLS）的身份
-- 读取 products 表全部数据，再只对外暴露下面列出的这几列；
-- 若改为 security_invoker，则会改用当前登录代理商自身的权限读取 products 表，
-- 而代理商在 products 表上没有任何 SELECT 策略，会导致查询直接返回 0 行。
create or replace view public.agent_products
as
select
  p.id, p.category_id, p.name, p.name_en, p.emoji, p.description, p.status,
  p.retail_price, p.agent_price, p.includes, p.excludes, p.itinerary, p.faq,
  p.materials, p.created_at, p.updated_at
from public.products p
where public.is_logged_in_active();

grant select on public.agent_products to authenticated;

-- ============================================================================
-- Storage：产品图片存储桶
-- ============================================================================
insert into storage.buckets (id, name, public)
  values ('product-images', 'product-images', true)
  on conflict (id) do nothing;

drop policy if exists "product-images admin write" on storage.objects;
create policy "product-images admin write" on storage.objects for insert
  with check (bucket_id = 'product-images' and public.current_role_is_admin());
drop policy if exists "product-images admin update" on storage.objects;
create policy "product-images admin update" on storage.objects for update
  using (bucket_id = 'product-images' and public.current_role_is_admin());
drop policy if exists "product-images admin delete" on storage.objects;
create policy "product-images admin delete" on storage.objects for delete
  using (bucket_id = 'product-images' and public.current_role_is_admin());
drop policy if exists "product-images public read" on storage.objects;
create policy "product-images public read" on storage.objects for select
  using (bucket_id = 'product-images');

-- ============================================================================
-- 创建第一个管理员账号（脚本执行完后，手动操作两步）：
--   第 1 步：Supabase 后台 → Authentication → Users → Add user
--            填写邮箱和密码，创建一个登录账号
--   第 2 步：回到 SQL Editor，执行下面这条语句（把邮箱换成你刚创建的邮箱）：
--
--   insert into public.profiles (id, email, display_name, role)
--   select id, email, '管理员', 'admin' from auth.users where email = '你的邮箱@example.com'
--   on conflict (id) do update set role = 'admin', status = 'active';
--
-- 之后即可用该邮箱和密码登录 /admin
-- ============================================================================
