import { supabase } from "./supabaseClient";

const BUCKET = "product-images";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

// 产品图片上传限制：仅这三种格式，单张最大 10MB。
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

// 上传前的前端校验，返回错误文案（string）或 null（表示通过）。
// 只做提示用途，真正的写入权限仍然由 0010_product_images_storage.sql
// 里针对 storage.objects 的管理员策略把关。
export function validateImageFile(file) {
  if (!file) return "请选择要上传的图片";
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return "只支持 JPEG、PNG、WebP 格式的图片";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "单张图片不能超过 10MB";
  }
  return null;
}

// 将历史外链图片下载成可沿用现有上传流程的 File。
// 这一步只读取外部链接；调用方必须在全部下载、上传成功后，才允许写回
// products.images，避免半迁移状态覆盖原有图片列表。
export async function downloadExternalImage(url, fallbackName = "legacy-image.jpg") {
  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error("无法下载旧图片，请确认该外链仍可访问后重试");
  }

  if (!response.ok) {
    throw new Error(`无法下载旧图片（HTTP ${response.status}）`);
  }

  const blob = await response.blob();
  const contentType = (blob.type || response.headers.get("content-type") || "").split(";")[0].toLowerCase();
  const filename = (() => {
    try {
      return decodeURIComponent(new URL(response.url || url).pathname.split("/").pop() || fallbackName);
    } catch {
      return fallbackName;
    }
  })();
  const file = new File([blob], filename, { type: contentType });
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(`旧图片不符合上传要求：${validationError}`);
  return file;
}

function safeExt(filename) {
  const m = /\.[a-zA-Z0-9]+$/.exec(filename || "");
  return m ? m[0].toLowerCase() : ".jpg";
}

// 上传一张图片到 Supabase Storage，并返回可公开访问的 URL。
// folder 传入 `products/<product-id>`，实际存储路径即为
// `products/<product-id>/<时间戳>-<随机值>.<扩展名>`。
export async function uploadImageFile(file, folder = "misc") {
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}${safeExt(file.name)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

// 删除 Storage 对象。必须检查返回的 error 并抛出——不能在删除失败时
// 假装成功，否则调用方（ProductImagesEditor）无法感知文件其实还留在桶里。
export async function deleteStorageObject(path) {
  if (!path) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

// 判断一个 URL 是否确实是"当前项目" product-images 桶里的对象，是则返回
// 桶内路径，否则返回 null（例如历史遗留的外部图片链接、其他 Supabase 项目
// 的链接，或伪造/篡改过的 URL）。
// 必须同时满足两个条件才认定为"本项目本桶的对象"：
//   1. URL 的 origin 与当前项目 VITE_SUPABASE_URL 的 origin 完全一致；
//   2. URL 的 pathname 以 /storage/v1/object/public/product-images/ 开头。
// 任一条件不满足都返回 null。调用方据此区分：只有返回非 null 路径时才能
// 删除 Storage 文件；历史外链、其他项目的链接一律只从 products.images
// 数组里移除，绝不能触碰任何 Storage 对象。
export function storagePathFromPublicUrl(url) {
  if (typeof url !== "string" || !url) return null;
  if (!SUPABASE_URL) return null;

  let parsed;
  let projectOrigin;
  try {
    parsed = new URL(url);
    projectOrigin = new URL(SUPABASE_URL).origin;
  } catch {
    return null;
  }

  if (parsed.origin !== projectOrigin) return null;

  const prefix = `/storage/v1/object/public/${BUCKET}/`;
  if (!parsed.pathname.startsWith(prefix)) return null;

  const path = decodeURIComponent(parsed.pathname.slice(prefix.length));
  return path || null;
}
