import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { uploadImageFile, deleteStorageObject } from "../lib/storage";

// 产品图片面板：管理员可上传/删除；代理商只读，可点击下载/查看原图。
export default function ProductImagesPanel({ productId, editable }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });
    if (error) setError(error.message);
    else setImages(data || []);
    setLoading(false);
  };

  useEffect(() => { if (productId) load(); }, [productId]);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      for (const file of files) {
        const { url, path } = await uploadImageFile(file, `products/${productId}`);
        const { error } = await supabase.from("product_images").insert({
          product_id: productId, url, storage_path: path, sort_order: images.length,
        });
        if (error) throw error;
      }
      await load();
    } catch (e) {
      setError(e.message || "上传失败");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async (img) => {
    if (!confirm("确定删除这张图片吗？")) return;
    await deleteStorageObject(img.storage_path);
    await supabase.from("product_images").delete().eq("id", img.id);
    load();
  };

  if (!productId) return null;

  return (
    <div style={{ marginTop: 4 }}>
      <label className="adm-label">产品图片{editable ? "（可上传 / 删除）" : "（可下载）"}</label>
      {error && <div className="adm-notice danger" style={{ marginTop: 8 }}>{error}</div>}
      {loading ? (
        <div style={{ fontSize: 12, color: "var(--fog)", marginTop: 8 }}>加载中…</div>
      ) : images.length === 0 ? (
        <div style={{ fontSize: 12, color: "var(--fog)", marginTop: 8 }}>暂无图片</div>
      ) : (
        <div className="adm-image-grid" style={{ marginTop: 10 }}>
          {images.map((img) => (
            <div className="adm-image-card" key={img.id}>
              <a href={img.url} target="_blank" rel="noreferrer">
                <img className="adm-image-thumb" src={img.url} alt="产品图片" loading="lazy" />
              </a>
              {editable && (
                <div className="adm-image-actions">
                  <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleDelete(img)}>删除</button>
                </div>
              )}
              {!editable && (
                <div className="adm-image-actions">
                  <a className="adm-btn adm-btn-outline adm-btn-sm" href={img.url} target="_blank" rel="noreferrer">下载</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {editable && (
        <div style={{ marginTop: 12 }}>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleUpload} />
          <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
            {uploading ? "上传中…" : "+ 上传图片"}
          </button>
        </div>
      )}
    </div>
  );
}
