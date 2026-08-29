-- ============================================================================
-- YINSEA 后台管理系统 — 图片上传 V1：Supabase Storage 桶 + 权限
-- ============================================================================
-- 目的：为「产品管理 → 编辑已有产品」提供图片上传能力。管理员上传后自动获得
-- 公开 URL，由前端代码负责把该 URL 追加写入 products.images（本迁移不涉及
-- 任何应用层写入逻辑，只负责 Storage 桶本身与桶内对象的访问权限）。
--
-- 严格限制（本迁移只做以下变更）：
--   - 不创建 product_images 或任何新表；不改 products / categories / regions
--     的表结构或数据；现有 72 个产品的 images 数据完全不受影响。
--   - 只创建/配置 storage.buckets 里的 "product-images" 一个桶，以及
--     storage.objects 上仅针对该桶 id 的四条策略；不触碰任何其他桶
--     （包括 yinsea-speed-test 测试桶），不修改、不删除其他桶的策略。
--   - 复用现有 public.current_role_is_admin()（0002_backend_tables.sql 中
--     已创建），不新建权限判断函数。
--   - 桶为 public read：任何人（含未登录访客）可读取桶内对象，用于前台网站
--     直接显示图片；只有管理员可以新增、更新、删除桶内对象，代理商和访客
--     都没有写权限。
-- 可安全重复执行（bucket 用 on conflict do update set public = true，确保
-- 无论桶是新建还是已存在都保持 public read；policy 用
-- drop policy if exists 再 create）。
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. 创建（或确认存在）product-images 桶，public read。
--    用 on conflict (id) do update 而不是 do nothing：如果这个桶此前已经
--    以 public = false（或其他配置）存在，本迁移会把它纠正为 public = true，
--    保证"public read"这条约束无论桶是新建还是已存在都能生效；对已有对象
--    本身没有任何影响，且可安全重复执行。
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('product-images', 'product-images', true)
  on conflict (id) do update set public = true;

-- ----------------------------------------------------------------------------
-- 2. storage.objects 权限：只作用于 bucket_id = 'product-images' 这一个桶，
--    不影响 yinsea-speed-test 或其他任何桶里的对象。
-- ----------------------------------------------------------------------------

-- 公开读取：前台网站和代理后台直接用公开 URL 显示图片，无需登录。
drop policy if exists "product-images public read" on storage.objects;
create policy "product-images public read" on storage.objects for select
  using (bucket_id = 'product-images');

-- 仅管理员可上传新对象。
drop policy if exists "product-images admin insert" on storage.objects;
create policy "product-images admin insert" on storage.objects for insert
  with check (bucket_id = 'product-images' and public.current_role_is_admin());

-- 仅管理员可更新（如替换同路径对象）。
drop policy if exists "product-images admin update" on storage.objects;
create policy "product-images admin update" on storage.objects for update
  using (bucket_id = 'product-images' and public.current_role_is_admin())
  with check (bucket_id = 'product-images' and public.current_role_is_admin());

-- 仅管理员可删除对象。
drop policy if exists "product-images admin delete" on storage.objects;
create policy "product-images admin delete" on storage.objects for delete
  using (bucket_id = 'product-images' and public.current_role_is_admin());

-- ============================================================================
-- 完成后：
--   - 管理员在后台上传的图片经 product-images 桶获得公开 URL；
--   - 该 URL 由前端代码追加写入对应产品的 products.images（jsonb 数组）；
--   - products 表本身的写入权限仍由 0003_products_permissions.sql 中的
--     products_admin_all 策略控制——代理商在 products 基表上没有任何策略，
--     因此即使拿到桶的公开读取地址，也完全没有写 products.images 的能力，
--     更不可能通过本迁移新增的策略上传或删除 Storage 里的对象。
-- ============================================================================
