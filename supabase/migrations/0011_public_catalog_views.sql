-- ============================================================================
-- YINSEA public catalog: anonymous read-only API surface
-- ============================================================================
-- This migration creates three projection views for the public website.
-- It does not alter base tables, RLS policies, product/category/region data,
-- Storage, or any admin/agent permissions.
--
-- The views intentionally use the view owner's permissions rather than
-- security_invoker: anonymous visitors cannot read the RLS-protected base
-- tables directly. Each view is therefore a strict, security-barrier whitelist
-- of fields that are safe for public display. No cost, agent price, supplier,
-- internal notes, profile, or authentication data is exposed.
-- ============================================================================

create or replace view public.public_catalog_products
with (security_barrier = true)
as
select
  id,
  name,
  name_en,
  slug,
  category_id,
  region_id,
  status,
  sort_order,
  featured,
  emoji,
  retail,
  images,
  description,
  summary,
  faq,
  specifications,
  includes,
  highlights,
  created_at
from public.products
where coalesce(status, 'avail') <> 'offline';

create or replace view public.public_catalog_categories
with (security_barrier = true)
as
select
  id,
  name,
  name_en,
  slug,
  emoji,
  cover_image,
  sort_order
from public.categories
where status = 'active';

create or replace view public.public_catalog_regions
with (security_barrier = true)
as
select
  id,
  slug,
  name,
  name_en,
  sort_order
from public.regions
where is_active = true;

-- The views are not readable through PUBLIC. Only the website's anonymous
-- visitor role and signed-in user role can select the safe projections.
revoke all on public.public_catalog_products from public;
revoke all on public.public_catalog_categories from public;
revoke all on public.public_catalog_regions from public;

grant select on public.public_catalog_products to anon, authenticated;
grant select on public.public_catalog_categories to anon, authenticated;
grant select on public.public_catalog_regions to anon, authenticated;
