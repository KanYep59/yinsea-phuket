import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes("your-project") &&
    !SUPABASE_ANON_KEY.includes("your-anon-key")
);

// The public site deliberately uses an isolated, non-persistent anonymous client.
// It never shares the admin application's login session or writes any data.
const publicCatalogClient = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
  : null;

const CATEGORY_ID_ALIASES = {
  helicopter: "heli",
  shooting: "spa",
  transfer: "car",
};

function stringList(value) {
  return Array.isArray(value)
    ? value.filter((item) => typeof item === "string" && item.trim())
    : [];
}

function faqList(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      q: typeof item.q === "string" ? item.q : "",
      a: typeof item.a === "string" ? item.a : "",
    }))
    .filter((item) => item.q || item.a);
}

function publicCategoryId(row) {
  return CATEGORY_ID_ALIASES[row.slug] || row.slug || `category-${row.id}`;
}

function mapCategories(rows, fallbackCategories) {
  return rows.map((row) => {
    const id = publicCategoryId(row);
    const fallback = fallbackCategories.find((category) => category.id === id);
    return {
      ...(fallback || {}),
      id,
      dbId: row.id,
      name: row.name || fallback?.name || "未分类",
      en: row.name_en || fallback?.en || "",
      icon: row.emoji || fallback?.icon || "✦",
      cover: row.cover_image || fallback?.cover || "",
    };
  });
}

function mapProducts(rows, categories, regions) {
  const categoryIdByDbId = new Map(categories.map((category) => [String(category.dbId), category.id]));
  const regionByDbId = new Map(regions.map((region) => [String(region.id), region]));

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug || "",
    cat: categoryIdByDbId.get(String(row.category_id)) || "uncategorized",
    categoryId: row.category_id,
    region: regionByDbId.get(String(row.region_id)) || null,
    regionId: row.region_id || null,
    status: row.status || "avail",
    sortOrder: Number(row.sort_order) || 0,
    featured: Boolean(row.featured),
    name: row.name || "未命名产品",
    nameEn: row.name_en || "",
    emoji: row.emoji || "✦",
    images: stringList(row.images),
    desc: row.description || row.summary || "",
    summary: row.summary || "",
    retail: Number(row.retail) || 0,
    includes: stringList(row.includes),
    highlights: stringList(row.highlights),
    faq: faqList(row.faq),
    specifications: row.specifications && typeof row.specifications === "object" ? row.specifications : {},
  }));
}

// Returns null on any configuration or read error. The caller keeps its current
// safe catalog state, so no private product data is ever bundled as a fallback.
export async function loadPublicCatalog({ fallbackCategories }) {
  if (!publicCatalogClient) return null;

  const [productsResult, categoriesResult, regionsResult] = await Promise.all([
    publicCatalogClient
      .from("public_catalog_products")
      .select("id, name, name_en, slug, category_id, region_id, status, sort_order, featured, emoji, retail, images, description, summary, faq, specifications, includes, highlights, created_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    publicCatalogClient
      .from("public_catalog_categories")
      .select("id, name, name_en, slug, emoji, cover_image, sort_order")
      .order("sort_order", { ascending: true }),
    publicCatalogClient
      .from("public_catalog_regions")
      .select("id, slug, name, name_en, sort_order")
      .order("sort_order", { ascending: true }),
  ]);

  if (productsResult.error || categoriesResult.error || regionsResult.error) return null;

  const categories = mapCategories(categoriesResult.data || [], fallbackCategories);
  const regions = regionsResult.data || [];
  return {
    categories,
    regions,
    products: mapProducts(productsResult.data || [], categories, regions),
  };
}
