import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../lib/AuthContext";
import { Loading, EmptyState } from "../components/ui";
import { uploadImageFile, deleteStorageObject } from "../lib/storage";

export default function Images() {
  const { isAdmin } = useAuth();
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [uploadProduct, setUploadProduct] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = async () => {
    setLoading(true);
    const [{ data: imgs, error: err }, { data: prods }] = await Promise.all([
      supabase.from("product_images").select("*, products(name)").order("created_at", { ascending: false }),
      supabase.from(isAdmin ? "products" : "agent_products").select("id, name"),
    ]);
    if (err) setError(err.message);
    setImages(imgs || []);
    setProducts(prods || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [isAdmin]);

  const filtered = productFilter === "all" ? images : images.filter((i) => i.product_id === productFilter);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (!uploadProduct) { setError("请先选择要归属的产品"); if (fileRef.current) fileRef.current.value = ""; return; }
    setUploading(true);
    setError("");
    try {
      for (const file of files) {
        const { url, path } = await uploadImageFile(file, `products/${uploadProduct}`);
        const { error } = await supabase.from("product_images").insert({ product_id: uploadProduct, url, storage_path: path });
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

  if (loading) return <Loading />;

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-title">图片库</div>
          <div className="adm-page-sub">{isAdmin ? "管理全部产品图片" : "浏览并下载产品素材图片"}</div>
        </div>
      </div>

      {error && <div className="adm-notice danger">{error}</div>}

      {isAdmin && (
        <div className="adm-panel">
          <div className="adm-panel-title">上传新图片</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <select className="adm-select" style={{ maxWidth: 260 }} value={uploadProduct} onChange={(e) => setUploadProduct(e.target.value)}>
              <option value="">选择归属产品…</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleUpload} />
            <button className="adm-btn adm-btn-primary adm-btn-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? "上传中…" : "+ 选择图片上传"}
            </button>
          </div>
        </div>
      )}

      <div className="adm-filter-row" style={{ marginBottom: 18 }}>
        <button className={`adm-filter-chip ${productFilter === "all" ? "active" : ""}`} onClick={() => setProductFilter("all")}>全部产品</button>
        {products.map((p) => (
          <button key={p.id} className={`adm-filter-chip ${productFilter === p.id ? "active" : ""}`} onClick={() => setProductFilter(p.id)}>
            {p.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="暂无图片" desc={isAdmin ? "上传第一张产品图片" : "该产品暂无可下载图片"} />
      ) : (
        <div className="adm-image-grid">
          {filtered.map((img) => (
            <div className="adm-image-card" key={img.id}>
              <a href={img.url} target="_blank" rel="noreferrer">
                <img className="adm-image-thumb" src={img.url} alt={img.products?.name || "产品图片"} loading="lazy" />
              </a>
              <div className="adm-image-meta">{img.products?.name || "未关联产品"}</div>
              <div className="adm-image-actions">
                <a className="adm-btn adm-btn-outline adm-btn-sm" href={img.url} target="_blank" rel="noreferrer">下载</a>
                {isAdmin && <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => handleDelete(img)}>删除</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
