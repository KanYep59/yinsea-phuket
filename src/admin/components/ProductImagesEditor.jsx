import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  ACCEPTED_IMAGE_TYPES,
  deleteStorageObject,
  downloadExternalImage,
  storagePathFromPublicUrl,
  uploadImageFile,
  validateImageFile,
} from "../lib/storage";

// 产品图片编辑器——只在「编辑已有产品」时渲染（productId 非空）。
// 新建产品时不显示上传入口，提示先保存产品。
//
// 关键规则（图片上传 V1）：
//   - 只有点击上传 / 删除 / 排序按钮时才会写 products.images；
//     打开、浏览这个编辑器本身绝不写库。
//   - 上传成功后把新 URL 追加进 products.images 并立刻写库；
//     如果写库失败，删除刚刚上传到 Storage 的对象，避免留下垃圾文件。
//   - 删除图片：先把新的（去掉该项的）images 数组安全写入数据库，
//     写库成功后，如果这张图确实是本项目 product-images 桶里的对象
//     （而不是历史遗留的外部链接），才去删除对应的 Storage 对象；
//     外部旧链接只从数组里移除，绝不尝试删除任何 Storage 文件。
//   - 排序：只重新排列数组顺序后写库，不触碰 Storage。
export default function ProductImagesEditor({ productId, images, onImagesChanged }) {
  const [list, setList] = useState(() => (Array.isArray(images) ? images : []));
  const [uploading, setUploading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [busyIndex, setBusyIndex] = useState(null); // 正在删除/移动的图片下标
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // 切换到不同产品时，同步图片列表并清空上一个产品残留的错误提示，
  // 避免误显示上一个产品的图片或报错信息。
  useEffect(() => {
    setList(Array.isArray(images) ? images : []);
    setError("");
    setBusyIndex(null);
    setMigrating(false);
  }, [productId]);

  if (!productId) {
    return <div className="adm-notice">请先保存产品，再编辑上传图片</div>;
  }

  const persist = async (next) => {
    const { error: updErr } = await supabase.from("products").update({ images: next }).eq("id", productId);
    if (updErr) throw updErr;
    setList(next);
    onImagesChanged?.(productId, next);
  };

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // 允许连续选择同一个文件
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) { setError(validationError); return; }

    setError("");
    setUploading(true);
    let uploaded = null;
    try {
      uploaded = await uploadImageFile(file, `products/${productId}`);
      const next = [...list, uploaded.url];
      try {
        await persist(next);
      } catch (dbErr) {
        // 写库失败：尝试删除刚刚上传的对象，避免产生无人引用的垃圾文件。
        // 清理是否成功都不能覆盖原始的数据库错误——管理员需要看到的是
        // "写库失败"这个真正的原因，而不是清理步骤自身的错误。
        try {
          await deleteStorageObject(uploaded.path);
        } catch {
          // 静默忽略：清理失败不应掩盖上面 dbErr 才是真正的失败原因。
          // 可能会留下一个孤儿文件，但这不影响 products.images 的正确性。
        }
        throw dbErr;
      }
    } catch (err) {
      setError(err.message || "上传失败，请重试");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (idx) => {
    const url = list[idx];
    const next = list.filter((_, i) => i !== idx);
    setError("");
    setBusyIndex(idx);

    // 第一步：先把去掉该链接的数组安全写入数据库。写库失败就直接停止，
    // 不触碰 Storage，也不需要"写回"，因为 persist 失败时 list 状态本来
    // 就还没有被更新。
    try {
      await persist(next);
    } catch (err) {
      setError(err.message || "删除失败，请重试");
      setBusyIndex(null);
      return;
    }

    // 第二步：数据库已成功移除该链接。只有确认这张图属于本项目
    // product-images 桶时，才尝试删除对应的 Storage 对象；外部旧链接、
    // 其他项目的链接完全不触碰，storagePathFromPublicUrl 会返回 null。
    const path = storagePathFromPublicUrl(url);
    if (path) {
      try {
        await deleteStorageObject(path);
      } catch {
        // 数据库已经更新成功，不能再把链接写回去——只能明确告知管理员
        // 存储文件可能仍然留在桶里，需要必要时手动清理。
        setError("图片已从产品移除，但存储文件删除失败，文件可能仍在图片桶中。");
      }
    }
    setBusyIndex(null);
  };

  const handleMove = async (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const next = list.slice();
    [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
    setError("");
    setBusyIndex(idx);
    try {
      await persist(next);
    } catch (err) {
      setError(err.message || "排序失败，请重试");
    } finally {
      setBusyIndex(null);
    }
  };

  // 一次仅处理当前正在编辑的产品。旧外链必须全部完成下载与上传后，
  // 才会用新的 Supabase URL 一次性替换数据库中的原数组；任一步失败都
  // 保留原外链，并清理本次已上传的临时文件。
  const handleMigrateExternalImages = async () => {
    const sourceUrls = list.slice();
    const legacyUrls = sourceUrls.filter((url) => !storagePathFromPublicUrl(url));
    if (!legacyUrls.length) return;

    const confirmed = window.confirm(
      `将迁移当前产品的 ${legacyUrls.length} 张旧外链图片到图片库。\n全部迁移成功前不会改动当前图片；成功后会保留原顺序并替换为 Supabase 图片。`
    );
    if (!confirmed) return;

    setError("");
    setMigrating(true);
    const uploaded = [];
    const replacements = new Map();

    try {
      for (let index = 0; index < sourceUrls.length; index += 1) {
        const url = sourceUrls[index];
        if (storagePathFromPublicUrl(url)) continue;

        let file;
        try {
          file = await downloadExternalImage(url, `legacy-${index + 1}.jpg`);
        } catch (err) {
          throw new Error(`第 ${index + 1} 张图片迁移失败：${err.message || "无法下载"}`);
        }
        const result = await uploadImageFile(file, `products/${productId}`);
        uploaded.push(result);
        replacements.set(url, result.url);
      }

      const next = sourceUrls.map((url) => replacements.get(url) || url);
      try {
        await persist(next);
      } catch (dbErr) {
        await Promise.allSettled(uploaded.map((item) => deleteStorageObject(item.path)));
        throw dbErr;
      }
    } catch (err) {
      await Promise.allSettled(uploaded.map((item) => deleteStorageObject(item.path)));
      setError(err.message || "旧图片迁移失败，原图片没有改动");
    } finally {
      setMigrating(false);
    }
  };

  const legacyImageCount = list.filter((url) => !storagePathFromPublicUrl(url)).length;

  return (
    <div>
      {error && <div className="adm-notice danger" style={{ marginBottom: 10 }}>{error}</div>}

      {list.length === 0 ? (
        <div className="adm-notice" style={{ marginBottom: 10 }}>暂无图片</div>
      ) : (
        <div className="adm-image-grid" style={{ marginBottom: 12 }}>
          {list.map((url, idx) => (
            <div className="adm-image-card" key={`${url}-${idx}`}>
              <img className="adm-image-thumb" src={url} alt="产品图片" loading="lazy" />
              <div className="adm-image-actions">
                <button
                  type="button"
                  className="adm-btn adm-btn-outline adm-btn-sm"
                  onClick={() => handleMove(idx, -1)}
                  disabled={idx === 0 || busyIndex !== null}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn-outline adm-btn-sm"
                  onClick={() => handleMove(idx, 1)}
                  disabled={idx === list.length - 1 || busyIndex !== null}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className="adm-btn adm-btn-danger adm-btn-sm"
                  onClick={() => handleDelete(idx)}
                  disabled={busyIndex !== null}
                >
                  {busyIndex === idx ? "处理中…" : "删除"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <button
        type="button"
        className="adm-btn adm-btn-outline adm-btn-sm"
        onClick={handlePickFile}
        disabled={uploading || migrating || busyIndex !== null}
      >
        {uploading ? "上传中…" : "+ 上传图片"}
      </button>
      {legacyImageCount > 0 && (
        <button
          type="button"
          className="adm-btn adm-btn-outline adm-btn-sm"
          onClick={handleMigrateExternalImages}
          disabled={uploading || migrating || busyIndex !== null}
          style={{ marginLeft: 8 }}
        >
          {migrating ? `正在迁移 ${legacyImageCount} 张旧图片…` : `迁移 ${legacyImageCount} 张旧图片到图片库`}
        </button>
      )}
      <div style={{ fontSize: 11, color: "var(--fog)", marginTop: 6 }}>
        支持 JPEG、PNG、WebP，单张最大 10MB。不支持手动填写外部图片链接。
      </div>
    </div>
  );
}
