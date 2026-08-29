-- ============================================================================
-- YINSEA 后台管理系统 — products 权限层 (Supabase / Postgres)
-- ============================================================================
-- 范围严格限定：本文件只创建"权限"，不创建、不修改、不删除 public.products
-- 或 public.categories 这两张表本身，也不修改其中任何一行数据。
-- 全文没有一条 CREATE TABLE / ALTER TABLE ... ADD|DROP|ALTER COLUMN /
-- DROP TABLE / INSERT / UPDATE / DELETE 语句作用于 products 或 categories。
--
-- 唯一涉及 products 表定义的两处：
--   1) ALTER TABLE public.products ENABLE ROW LEVEL SECURITY
--      —— 这只是打开"行级安全"这个访问控制开关，不改表结构、不改数据。
--      如果不开启，下面的策略和视图都形同虚设：任何持有 anon/authenticated
--      角色的人都能直接绕过策略读到 products 全表全部列（包括 cost）。
--   2) CREATE POLICY ... ON public.products
--      —— 权限规则，同样不改表结构、不改数据。
--
-- 依赖：本文件使用 public.current_role_is_admin() 与 public.is_logged_in_active()
-- 这两个函数，它们已经在 0002_backend_tables.sql 中创建。请确保 0002 已经
-- 执行成功后，再运行本文件。
--
-- 权限模型：
--   管理员（role = 'admin'）——可以读、写 products 的每一列，通过直接访问
--   public.products 基表实现（RLS 按行放行，不做列级过滤，管理员本来就该看到
--   全部列）。
--
--   代理商（role = 'agent'）——完全不能访问 public.products 基表（本文件不会
--   为 agent 在基表上开任何策略），只能通过下面新建的只读视图
--   public.agent_products 访问，该视图只暴露以下列（已对照
--   information_schema.columns 的真实查询结果逐一核对，全部确认存在于
--   public.products 表中）：
--     id, name, name_en, slug, category_id, status, sort_order, featured,
--     emoji, created_at, retail, agent, images, description, summary, faq,
--     specifications, includes, highlights
--   cost、legacy_cat、notes，以及任何未来新增的内部字段，因为视图采用"白名单"
--   写法（只写出允许暴露的列），不会自动包含，因此永远不会通过这个视图泄露，
--   无需每次新增列时都记得去修改排除名单。
--   （legacy_cat、notes 两列确认存在于表中，但不在你要求代理商可见的清单里，
--   故未加入视图；如需开放请告知。）
--
-- 可以安全地在已有生产数据库上重复执行（ENABLE ROW LEVEL SECURITY 本身是幂等
-- 操作；策略与视图均使用 DROP POLICY IF EXISTS / CREATE OR REPLACE VIEW）。
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. 开启 products 表的行级安全（不改表结构、不改数据）
-- ----------------------------------------------------------------------------
alter table public.products enable row level security;

-- 管理员：对 products 基表拥有完整的增删改查权限（因此也就能读/写每一列）。
-- 代理商在基表上没有任何策略 —— 也就是完全没有访问权限，只能走下面的视图。
drop policy if exists products_admin_all on public.products;
create policy products_admin_all on public.products for all
  using (public.current_role_is_admin())
  with check (public.current_role_is_admin());

-- ----------------------------------------------------------------------------
-- 2. 代理商专用只读视图：白名单列出允许代理商查看的字段，
--    cost 及其他未在名单中的列（含未来新增列）一律不会出现在这里。
-- ----------------------------------------------------------------------------
-- 注意：这里刻意不设置 security_invoker，视图以创建者（拥有 products 表、
-- 因而可绕过其 RLS）的身份读取 products 全部数据，再只对外暴露下面这些列；
-- 如果改成 security_invoker，会改用当前登录代理商自身的权限读取 products，
-- 而代理商在 products 基表上没有任何 SELECT 策略，查询将直接返回 0 行。
-- security_barrier = true 进一步防止查询计划把外部传入的过滤条件"下推"到
-- 视图内部、绕开这里的列白名单和行过滤，是 Postgres 官方推荐的安全视图写法。
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
  highlights
from public.products
where public.is_logged_in_active();

-- 注意：这里不对 public.products 做 REVOKE。Supabase 里管理员和代理商登录后
-- 都是同一个 Postgres 角色 authenticated（区分身份靠 auth.uid() + RLS 策略，
-- 不是靠不同的数据库角色），如果在这里 REVOKE authenticated 对 products 的
-- 权限，会连管理员的直接读写也一并切断，违反"管理员可以读写每一列"的要求。
-- 代理商访问不到基表，完全是因为上面第 1 步只给 products 开了管理员策略、
-- 没有给 agent 开任何策略——RLS 在没有匹配策略时默认拒绝，这就够了。
grant select on public.agent_products to authenticated;

-- ============================================================================
-- 完成。管理员登录后台后，代码里查询 public.products 基表即可读写全部列；
-- 代理商登录后台后，代码里应查询 public.agent_products 视图 —— cost 列
-- 在数据库层面就不存在于这个视图里，代理商无论如何都读不到。
-- ============================================================================
