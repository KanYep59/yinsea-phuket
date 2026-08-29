import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../lib/AuthContext";
import { Loading, StatusBadge, EmptyState, ConfirmDialog, Modal } from "../components/ui";
import { formatTHB, STATUS_LABELS } from "../lib/format";
import ProductForm from "../components/ProductForm";

export default function Products() {
  const { isAdmin } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");

  const [editing, setEditing] = useState(null); // {} = 新建, product = 编辑, null = 关闭
  const [viewing, setViewing] = useState(null); // 代理商只读查看
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    const table = isAdmin ? "products" : "agent_products";
    const [{ data: cats, error: catErr }, { data: regs, error: regErr }, { data: prods, error: prodErr }] =
      await Promise.all([
        supabase.from("categories").select("*").order("sort_order", { ascending: true }),
        supabase.from("regions").select("*").order("sort_order", { ascending: true }),
        supabase.from(table).select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: false }),
      ]);
    const firstError = catErr || regErr || prodErr;
    if (firstError) setError(firstError.message);
    setCategories(cats || []);
    setRegions(regs || []);
    setProducts(prods || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [isAdmin]);

  const activeRegions = useMemo(() => regions.filter((r) => r.is_active), [regions]);

  const categoryName = (id) =>
    categories.find((c) => String(c.id) === String(id))?.name || "未分类";
  const regionName = (id) =>
    regions.find((r) => String(r.id) === String(id))?.name || "—";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchRegion = regionFilter === "all" || String(p.region_id) === String(regionFilter);
      const matchCat = catFilter === "all" || String(p.category_id) === String(catFilter);
      const matchQ = !q || p.name?.toLowerCase().includes(q) || (p.name_en || "").toLowerCase().includes(q);
      return matchRegion && matchCat && matchQ;
    });
  }, [products, catFilter, regionFilter, search]);

  const remove = async () => {
    const { error } = await supabase.from("products").delete().eq("id", deleteTarget.id);
    if (error) setError(error.message);
    setDeleteTarget(null);
    load();
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="adm-page-header">
            <div>
              <div className="adm-page-title">产品管理</div>
              <div className="adm-page-sub">
                {isAdmin ? "管理全部产品信息、价格与地区" : "查看产品资料、代理价格与所在地区"}
              </div>
            </div>
            {isAdmin && (
              <button className="adm-btn adm-btn-primary" onClick={() => setEditing({})}>+ 新建产品</button>
            )}
          </div>

          {error && <div className="adm-notice danger">{error}</div>}

          <div className="adm-toolbar">
            <div className="adm-search">
              <span>🔍</span>
              <input placeholder="搜索产品名称…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          <div style={{ fontSize: 12, color: "var(--fog)", marginBottom: 8 }}>地区</div>
          <div className="adm-filter-row" style={{ marginBottom: 14 }}>
            <button
              className={`adm-filter-chip ${regionFilter === "all" ? "active" : ""}`}
              onClick={() => setRegionFilter("all")}
            >
              全部地区
            </button>
            {activeRegions.map((r) => (
              <button
                key={r.id}
                className={`adm-filter-chip ${regionFilter === r.id ? "active" : ""}`}
                onClick={() => setRegionFilter(r.id)}
              >
                {r.name}
              </button>
            ))}
          </div>

          <div style={{ fontSize: 12, color: "var(--fog)", marginBottom: 8 }}>分类</div>
          <div className="adm-filter-row" style={{ marginBottom: 18 }}>
            <button
              className={`adm-filter-chip ${catFilter === "all" ? "active" : ""}`}
              onClick={() => setCatFilter("all")}
            >
              全部分类
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                className={`adm-filter-chip ${String(catFilter) === String(c.id) ? "active" : ""}`}
                onClick={() => setCatFilter(String(c.id))}
              >
                {c.emoji} {c.name}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState title="暂无产品" desc={isAdmin ? "点击右上角新建第一个产品" : "暂时没有可查看的产品"} />
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>产品名称</th>
                    <th>地区</th>
                    <th>分类</th>
                    <th>状态</th>
                    <th>零售价</th>
                    <th>代理价</th>
                    {isAdmin && <th>成本价</th>}
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id}>
                      <td>{p.emoji} {p.name}</td>
                      <td className="adm-cell-muted">{regionName(p.region_id)}</td>
                      <td className="adm-cell-muted">{categoryName(p.category_id)}</td>
                      <td><StatusBadge status={p.status} labels={STATUS_LABELS} /></td>
                      <td className="adm-cell-muted">{formatTHB(p.retail)}</td>
                      <td className="adm-cell-gold">{formatTHB(p.agent)}</td>
                      {isAdmin && <td style={{ color: "var(--danger)" }}>{formatTHB(p.cost)}</td>}
                      <td>
                        <div className="adm-cell-actions">
                          {isAdmin ? (
                            <>
                              <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => setEditing(p)}>编辑</button>
                              <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => setDeleteTarget(p)}>删除</button>
                            </>
                          ) : (
                            <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => setViewing(p)}>查看资料</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {isAdmin && editing && (
        <ProductForm
          product={editing.id ? editing : null}
          categories={categories}
          regions={activeRegions}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
          onImagesChanged={(id, imgs) =>
            setProducts((list) => list.map((p) => (p.id === id ? { ...p, images: imgs } : p)))
          }
        />
      )}

      {isAdmin && deleteTarget && (
        <ConfirmDialog
          title="删除产品"
          message={`确定要删除产品「${deleteTarget.name}」吗？此操作不可撤销。`}
          confirmLabel="删除"
          danger
          onConfirm={remove}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {!isAdmin && viewing && (
        <Modal title={`${viewing.emoji || ""} ${viewing.name}`} onClose={() => setViewing(null)} wide>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, fontSize: 13, color: "var(--mist)", lineHeight: 1.8 }}>
            <div>
              <span className="adm-cell-gold" style={{ fontSize: 15 }}>代理价 {formatTHB(viewing.agent)}</span>{" "}
              <span style={{ color: "var(--fog)", fontSize: 12 }}>（零售价 {formatTHB(viewing.retail)}）</span>
            </div>
            <div>
              <strong style={{ color: "var(--pearl)" }}>所在地区：</strong>{regionName(viewing.region_id)}
            </div>
            {viewing.description && (
              <div><strong style={{ color: "var(--pearl)" }}>产品描述：</strong>{viewing.description}</div>
            )}
            {Array.isArray(viewing.highlights) && viewing.highlights.length > 0 && (
              <div>
                <strong style={{ color: "var(--pearl)" }}>产品亮点：</strong>
                <ul style={{ listStyle: "none", marginTop: 6 }}>
                  {viewing.highlights.map((h, idx) => (
                    <li key={idx}>✦ {typeof h === "string" ? h : JSON.stringify(h)}</li>
                  ))}
                </ul>
              </div>
            )}
            {Array.isArray(viewing.images) && viewing.images.length > 0 && (
              <div>
                <strong style={{ color: "var(--pearl)" }}>产品图片：</strong>
                <div className="adm-image-grid" style={{ marginTop: 10 }}>
                  {viewing.images.filter((u) => typeof u === "string").map((url, idx) => (
                    <div className="adm-image-card" key={idx}>
                      <a href={url} target="_blank" rel="noreferrer">
                        <img className="adm-image-thumb" src={url} alt="产品图片" loading="lazy" />
                      </a>
                      <div className="adm-image-actions">
                        <a className="adm-btn adm-btn-outline adm-btn-sm" href={url} target="_blank" rel="noreferrer">下载</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(viewing.faq) && viewing.faq.length > 0 && (
              <div>
                <strong style={{ color: "var(--pearl)" }}>常见问题：</strong>
                <ul style={{ listStyle: "none", marginTop: 6 }}>
                  {viewing.faq.map((f, idx) => (
                    <li key={idx} style={{ marginBottom: 6 }}>
                      Q：{f?.q}<br />A：{f?.a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
