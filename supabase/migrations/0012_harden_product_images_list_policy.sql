-- ============================================================================
-- YINSEA — product-images Storage policy hardening
-- ============================================================================
-- The product-images bucket is public, so product image URLs remain readable
-- without a storage.objects SELECT policy. Removing the broad SELECT policy
-- prevents clients from listing every object in the bucket through the API.
-- This migration changes no bucket setting, object, product, or other policy.
-- It is safe to run repeatedly.
-- ============================================================================

drop policy if exists "product-images public read" on storage.objects;
