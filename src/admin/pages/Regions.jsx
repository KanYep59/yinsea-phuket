import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Modal, ConfirmDialog, Loading, EmptyState, StatusBadge } from "../components/ui";

// 管理员地区管理页（/admin/settings/regions，仅管理员可进入）。
// 真实字段（已核对生产数据库）：
//   id uuid, slug text not null unique, name text not null unique,
//   name_en text nullable, sort_order integer not null,
//   is_active boolean not null, created_at timestamptz, updated_at timestamptz
// 状态使用真实字段 is_active（boolean），不使用 status。
// 地区没有图片字段，本页完全不读、不写任何图片相关内容。
const STATUS_LABEL = { active: "启用", inactive: "停用" };

const emptyForm = { id: null, name: "", name_en: "", slug: "", sort_order: 0, is_active: true };

export default function Regions() {
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [blockedMsg, setBlockedMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    const [{ data: regs, error: regErr }, { data: prods, error: prodErr }] = await Promise.all([
      supabase.from("regions").select("*").order("sort_order", { ascending: true }),
      supabase.from("products").select("region_id"),
    ]);
    if (regErr || prodErr) {
      setError((regErr || prodErr).message);
    } else {
      const countMap = {};
      (prods || []).forEach((p) => {
        if (p.region_id == null) return;
        const key = String(p.region_id);
        countMap[key] = (countMap[key] || 0) + 1;
      });
      setCounts(countMap);
      setRows(regs || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return rows;
    if (statusFilter === "active") return rows.filter((r) => r.is_active);
    return rows.filter((r) => !r.is_active);
  }, [rows, statusFilter]);

  const productCount = (id) => counts[String(id)] || 0;

  const openCreate = () => setForm({ ...emptyForm });
  const openEdit = (row) => setForm({
    id: row.id,
    name: row.name || "",
    name_en: row.name_en || "",
    slug: row.slug || "",
    sort_order: row.sort_order ?? 0,
    is_active: !!row.is_active,
  });

  const save = async () => {
    if (!form.name.trim()) { setError("请填写地区中文名称"); return; }
    if (!form.slug.trim()) { setError("请填写 slug"); return; }
    setSaving(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      name_en: form.name_en.trim(),
      slug: form.slug.trim(),
      sort_order: Number(form.sort_order) || 0,
      is_active: !!form.is_active,
    };
    const { error } = form.id
      ? await supabase.from("regions").update(payload).eq("id", form.id)
      : await supabase.from("regions").insert(payload);
    setSaving(false);
    if (error) { setError(error.message); return; }
    setForm(null);
    load();
  };

  // 停用地区前必须检查关联产品数量：仍在使用中的地区不能被停用，
  // 否则该地区会从代理商的地区筛选中消失，但产品仍然归属该地区，造成混乱。
  const toggleStatus = async (row) => {
    setError("");
    if (row.is_active) {
      const n = productCount(row.id);
      if (n > 0) {
        setBlockedMsg(`该地区仍有 ${n} 个产品，请先重新设置产品地区`);
        return;
      }
    }
    const next = !row.is_active;
    const { error } = await supabase.from("regions").update({ is_active: next }).eq("id", row.id);
    if (error) { setError(error.message); return; }
    load();
  };

  const requestDelete = (row) => {
    const n = productCount(row.id);
    if (n > 0) {
      setBlockedMsg(`该地区仍有 ${n} 个产品，请先重新设置产品地区`);
      return;
    }
    setDeleteTarget(row);
  };

  const remove = async () => {
    const { error } = await supabase.from("regions").delete().eq("id", deleteTarget.id);
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
              <div className="adm-page-title">地区管理</div>
              <div className="adm-page-sub">管理产品所在的地区（城市）的名称、排序与启用状态</div>
            </div>
            <button className="adm-btn adm-btn-primary" onClick={openCreate}>+ 新建地区</button>
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
            <EmptyState title="暂无地区" desc="点击右上角新建第一个地区" />
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>中文名</th>
                    <th>英文名</th>
                    <th>Slug</th>
                    <th>排序</th>
                    <th>状态</th>
                    <th>关联产品数量</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td>{r.name}</td>
                      <td className="adm-cell-muted">{r.name_en || "—"}</td>
                      <td className="adm-cell-muted">{r.slug}</td>
                      <td className="adm-cell-muted">{r.sort_order}</td>
                      <td><StatusBadge status={r.is_active ? "active" : "inactive"} labels={STATUS_LABEL} /></td>
                      <td className="adm-cell-muted">{productCount(r.id)}</td>
                      <td>
                        <div className="adm-cell-actions">
                          <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => openEdit(r)}>编辑</button>
                          <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => toggleStatus(r)}>
                            {r.is_active ? "停用" : "启用"}
                          </button>
                          <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => requestDelete(r)}>删除</button>
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
          title={form.id ? "编辑地区" : "新建地区"}
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
              <label className="adm-label">地区中文名称</label>
              <input
                className="adm-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="如：曼谷"
              />
            </div>
            <div className="adm-field">
              <label className="adm-label">英文名称</label>
              <input
                className="adm-input"
                value={form.name_en}
                onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                placeholder="如：Bangkok"
              />
            </div>
            <div className="adm-field">
              <label className="adm-label">Slug（技术字段）</label>
              <input
                className="adm-input"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="如：bangkok"
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
                value={form.is_active ? "active" : "inactive"}
                onChange={(e) => setForm({ ...form, is_active: e.target.value === "active" })}
              >
                <option value="active">启用</option>
                <option value="inactive">停用</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="删除地区"
          message={`确定要删除地区「${deleteTarget.name}」吗？此操作不可撤销。`}
          confirmLabel="删除"
          danger
          onConfirm={remove}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {blockedMsg && (
        <Modal
          title="无法操作"
          onClose={() => setBlockedMsg("")}
          footer={
            <button className="adm-btn adm-btn-primary" onClick={() => setBlockedMsg("")}>知道了</button>
          }
        >
          <div className="adm-notice danger">{blockedMsg}</div>
        </Modal>
      )}
    </>
  );
}
