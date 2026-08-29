-- ============================================================================
-- YINSEA 后台管理系统 — 补充后台业务表 (Supabase / Postgres)
-- ============================================================================
-- 范围严格限定：本文件只创建下列 5 张后台管理系统缺失的新表，并只为这 5 张
-- 新表开启行级安全策略 (RLS)：
--     profiles / agents / customers / orders / site_settings
--
-- 本文件不会以任何方式创建、修改、迁移或删除 public.products 与
-- public.categories —— 这两张表在你的生产数据库中已经存在并且已有数据
-- （products 72 条，categories 7 条），脚本从头到尾没有一条
-- CREATE TABLE / ALTER TABLE / DROP TABLE 语句涉及这两张表。
--
-- 与 products 相关的唯一一处touch：orders.product_id 上的外键约束，
-- 仅仅是"引用"（REFERENCES）products(id) 用于保证订单指向真实产品，
-- 不会创建、不会修改、不会删除 products 表本身或它的任何一列。
-- 已确认 products.id 的类型为 bigint，因此 orders.product_id 使用 bigint。
--
-- 本文件所有语句均使用 IF NOT EXISTS / OR REPLACE / 存在性判断等写法，
-- 可以安全地在已有生产数据库上重复执行。
--
-- 使用方法：打开 Supabase 项目 → SQL Editor → 粘贴本文件全部内容 → Run
-- 执行完成后，按文件末尾"创建第一个管理员账号"的说明操作。
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. 角色与用户档案 (profiles) —— 新表
-- ----------------------------------------------------------------------------
-- 每个可以登录后台的账号（管理员或代理商）在 auth.users 中都有一条记录，
-- 并在这里补充角色、姓名等信息。

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default '',
  role text not null default 'agent' check (role in ('admin', 'agent')),
  agent_id uuid, -- 若 role = 'agent'，关联下面的 agents.id（外键在 agents 表建好后追加）
  status text not null default 'active' check (status in ('active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

comment on table public.profiles is '后台登录账号：角色为 管理员(admin) 或 代理商(agent)';

-- ----------------------------------------------------------------------------
-- 权限判断函数（SECURITY DEFINER，避免 RLS 递归问题）
-- 这些函数只读取 public.profiles，与 products / categories 无关。
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
-- 2. 代理商 (agents) —— 新表，业务信息，区别于登录账号 profiles
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

-- 补上 profiles.agent_id -> agents.id 的外键（幂等：先判断约束是否已存在）
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_agent_id_fkey'
  ) then
    alter table public.profiles
      add constraint profiles_agent_id_fkey foreign key (agent_id)
      references public.agents(id) on delete set null;
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- 3. 客户管理 (customers) —— 新表
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
-- 4. 订单管理 (orders) —— 新表
-- ----------------------------------------------------------------------------
-- product_id 引用已存在的 public.products(id)（bigint，已由你确认）。
-- 这里只是"引用"，不会创建/修改/删除 products 表本身。
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_no text not null unique default ('YS' || to_char(now(), 'YYMMDD') || substr(replace(gen_random_uuid()::text,'-',''),1,6)),
  product_id bigint references public.products(id) on delete set null,
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
create index if not exists orders_product_idx on public.orders(product_id);

-- ----------------------------------------------------------------------------
-- 5. 系统设置 (site_settings) —— 新表，单行表
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
-- updated_at 自动更新触发器 —— 只挂载在上面这 5 张新表上
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
  foreach t in array array['profiles','agents','customers','orders','site_settings']
  loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ============================================================================
-- 行级安全策略 (Row Level Security) —— 只针对这 5 张新表
-- 完全不涉及 public.products / public.categories 的 RLS 或权限变更。
-- ============================================================================
alter table public.profiles enable row level security;
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
-- 关于 products / categories 的权限：本文件刻意不添加任何策略。
--
-- 原因：products / categories 是你已有的生产表，其真实列结构（例如是否有
-- 独立的成本价、内部备注等字段，以及具体列名）我这边并不掌握。RLS 策略本身
-- 虽然只做"按行过滤"，不会隐藏列，但如果贸然为 agent 角色开一条
-- "for select using (...)" 策略，代理商就会通过 `select *` 看到该表当前
-- 拥有的全部列——如果其中包含任何仅限内部查看的字段，将在我不知情的情况下
-- 被直接暴露。
--
-- 如果需要让代理商也能读取 products / categories，请告诉我：
--   1) products 表当前的完整列清单（尤其是哪些列属于"仅管理员可见"的内部信息）
--   2) 这两张表目前是否已经开启了 RLS（Table Editor 中该表的 RLS 开关状态）
-- 拿到这些信息后，我会单独生成一份"只包含 create policy 语句、不触碰表结构"
-- 的迁移文件，且如果存在敏感列，会通过一个只读视图排除这些列，
-- 而不是直接对 products 表开放整表 SELECT。
-- ============================================================================

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
