import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Modal, ConfirmDialog, Loading, EmptyState, StatusBadge } from "../components/ui";

// 管理员分类管理页（/admin/categories，仅管理员可进入）。
// 真实字段（已核对 information_schema）：
//   id, created_at, name, name_en, slug, emoji, cover_image, sort_order, status
// status 固定两个值：active = 启用，inactive = 停用。
// cover_image 在这里完全不读、不写、不清空——分类图片留到图片库阶段统一管理。
const STATUS_LABEL = { active: "启用", inactive: "停用" };

const emptyForm = { id: null, name: "", name_en: "", slug: "", emoji: "", sort_order: 0, status: "active" };

export default function Categories() {
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBlockedMsg, setDeleteBlockedMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    const [{ data: cats, error: catErr }, { data: prods, error: prodErr }] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order", { ascending: true }),
      supabase.from("products").select("category_id"),
    ]);
    if (catErr || prodErr) {
      setError((catErr || prodErr).message);
    } else {
      const countMap = {};
      (prods || []).forEach((p) => {
        if (p.category_id == null) return;
        const key = String(p.category_id);
        countMap[key] = (countMap[key] || 0) + 1;
      });
      setCounts(countMap);
      setRows(cats || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return rows;
    return rows.filter((c) => c.status === statusFilter);
  }, [rows, statusFilter]);

  const productCount = (id) => counts[String(id)] || 0;

  const openCreate = () => setForm({ ...emptyForm });
  const openEdit = (row) => setForm({
    id: row.id,
    name: row.name || "",
    name_en: row.name_en || "",
    slug: row.slug || "",
    emoji: row.emoji || "",
    sort_order: row.sort_order ?? 0,
    status: row.status === "inactive" ? "inactive" : "active",
  });

  const save = async () => {
    if (!form.name.trim()) { setError("请填写分类名称"); return; }
    if (!form.slug.trim()) { setError("请填写 slug"); return; }
    setSaving(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      name_en: form.name_en.trim(),
      slug: form.slug.trim(),
      emoji: form.emoji,
      sort_order: Number(form.sort_order) || 0,
      status: form.status === "inactive" ? "inactive" : "active",
      // 不包含 cover_image：新建/编辑分类都不会写入或清空分类图片。
    };
    const { error } = form.id
      ? await supabase.from("categories").update(payload).eq("id", form.id)
      : await supabase.from("categories").insert(payload);
    setSaving(false);
    if (error) { setError(error.message); return; }
    setForm(null);
    load();
  };

  const toggleStatus = async (row) => {
    const next = row.status === "active" ? "inactive" : "active";
    setError("");
    const { error } = await supabase.from("categories").update({ status: next }).eq("id", row.id);
    if (error) { setError(error.message); return; }
    load();
  };

  const requestDelete = (row) => {
    const n = productCount(row.id);
    if (n > 0) {
      setDeleteBlockedMsg(`该分类仍有 ${n} 个产品，请先重新分类产品`);
      return;
    }
    setDeleteTarget(row);
  };

  const remove = async () => {
    const { error } = await supabase.from("categories").delete().eq("id", deleteTarget.id);
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
              <div className="adm-page-title">产品分类</div>
              <div className="adm-page-sub">管理分类的名称、排序与启用状态</div>
            </div>
            <button className="adm-btn adm-btn-primary" onClick={openCreate}>+ 新建分类</button>
          </div>

          {error && <div className="adm-notice danger">{error}</div>}

          <div className="adm-filter-row" style={{ marginBottom: 18 }}>
            <button
              className={`adm-filter-chip ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              全部
            </button>
            <button
              className={`adm-filter-chip ${statusFilter === "active" ? "active" : ""}`}
              onClick={() => setStatusFilter("active")}
            >
              启用
            </button>
            <button
              className={`adm-filter-chip ${statusFilter === "inactive" ? "active" : ""}`}
              onClick={() => setStatusFilter("inactive")}
            >
              停用
            </button>
          </div>

          {filtered.length === 0 ? (
            <EmptyState title="暂无分类" desc="点击右上角新建第一个分类" />
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>分类名称</th>
                    <th>Emoji</th>
                    <th>英文名</th>
                    <th>Slug</th>
                    <th>排序</th>
                    <th>状态</th>
                    <th>产品数量</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td style={{ fontSize: 18 }}>{c.emoji || "—"}</td>
                      <td className="adm-cell-muted">{c.name_en || "—"}</td>
                      <td className="adm-cell-muted">{c.slug}</td>
                      <td className="adm-cell-muted">{c.sort_order}</td>
                      <td><StatusBadge status={c.status} labels={STATUS_LABEL} /></td>
                      <td className="adm-cell-muted">{productCount(c.id)}</td>
                      <td>
                        <div className="adm-cell-actions">
                          <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => openEdit(c)}>编辑</button>
                          <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => toggleStatus(c)}>
                            {c.status === "active" ? "停用" : "启用"}
                          </button>
                          <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => requestDelete(c)}>删除</button>
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

      {form && (
        <Modal
          title={form.id ? "编辑分类" : "新建分类"}
          onClose={() => setForm(null)}
          footer={
            <>
              <button className="adm-btn adm-btn-outline" onClick={() => setForm(null)}>取消</button>
              <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>
                {saving ? "保存中…" : "保存"}
              </button>
            </>
          }
        >
          <div className="adm-form-grid">
            <div className="adm-field">
              <label className="adm-label">分类中文名称</label>
              <input
                className="adm-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="如：游艇出海"
              />
            </div>
            <div className="adm-field">
              <label className="adm-label">英文名称</label>
              <input
                className="adm-input"
                value={form.name_en}
                onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                placeholder="如：Yacht"
              />
            </div>
            <div className="adm-field">
              <label className="adm-label">Slug（技术字段）</label>
              <input
                className="adm-input"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="如：yacht"
              />
            </div>
            <div className="adm-field">
              <label className="adm-label">Emoji</label>
              <input
                className="adm-input"
                value={form.emoji}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
                placeholder="⛵"
              />
            </div>
            <div className="adm-field">
              <label className="adm-label">排序（数字越小越靠前）</label>
              <input
                className="adm-input"
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              />
            </div>
            <div className="adm-field">
              <label className="adm-label">状态</label>
              <select
                className="adm-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="active">启用</option>
                <option value="inactive">停用</option>
              </select>
            </div>
            <div className="adm-field full">
              <label className="adm-label">分类图片</label>
              <div className="adm-notice">分类图片将在图片库阶段统一管理</div>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="删除分类"
          message={`确定要删除分类「${deleteTarget.name}」吗？此操作不可撤销。`}
          confirmLabel="删除"
          danger
          onConfirm={remove}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {deleteBlockedMsg && (
        <Modal
          title="无法删除"
          onClose={() => setDeleteBlockedMsg("")}
          footer={
            <button className="adm-btn adm-btn-primary" onClick={() => setDeleteBlockedMsg("")}>知道了</button>
          }
        >
          <div className="adm-notice danger">{deleteBlockedMsg}</div>
        </Modal>
      )}
    </>
  );
}
