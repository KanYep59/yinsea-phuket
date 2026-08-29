import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../lib/AuthContext";
import { Modal, ConfirmDialog, Loading, EmptyState } from "../components/ui";
import { formatDate } from "../lib/format";

const emptyForm = { id: null, name: "", phone: "", wechat: "", source: "", notes: "", agent_id: "" };

export default function Customers() {
  const { isAdmin, profile } = useAuth();
  const [rows, setRows] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    const reqs = [supabase.from("customers").select("*").order("created_at", { ascending: false })];
    if (isAdmin) reqs.push(supabase.from("agents").select("id, company_name"));
    const [custRes, agentRes] = await Promise.all(reqs);
    if (custRes.error) setError(custRes.error.message);
    setRows(custRes.data || []);
    if (agentRes) setAgents(agentRes.data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [isAdmin]);

  const agentName = (id) => agents.find((a) => a.id === id)?.company_name || "隐海直客";

  const openCreate = () => setForm({ ...emptyForm, agent_id: isAdmin ? "" : profile.agent_id });
  const openEdit = (row) => setForm({ ...row });

  const save = async () => {
    if (!form.name.trim()) { setError("请填写客户姓名"); return; }
    setSaving(true);
    setError("");
    const payload = {
      name: form.name.trim(),
      phone: form.phone,
      wechat: form.wechat,
      source: form.source,
      notes: form.notes,
      agent_id: isAdmin ? (form.agent_id || null) : profile.agent_id,
    };
    const { error } = form.id
      ? await supabase.from("customers").update(payload).eq("id", form.id)
      : await supabase.from("customers").insert(payload);
    setSaving(false);
    if (error) { setError(error.message); return; }
    setForm(null);
    load();
  };

  const remove = async () => {
    const { error } = await supabase.from("customers").delete().eq("id", deleteTarget.id);
    if (error) setError(error.message);
    setDeleteTarget(null);
    load();
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-title">客户管理</div>
          <div className="adm-page-sub">{isAdmin ? "管理全部客户线索" : "管理你名下的客户线索"}</div>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={openCreate}>+ 新建客户</button>
      </div>

      {error && <div className="adm-notice danger">{error}</div>}

      {rows.length === 0 ? (
        <EmptyState title="暂无客户" desc="点击右上角新建第一个客户" />
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>客户姓名</th>
                <th>联系方式</th>
                <th>来源</th>
                {isAdmin && <th>归属代理商</th>}
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td className="adm-cell-muted">{c.phone || c.wechat || "—"}</td>
                  <td className="adm-cell-muted">{c.source || "—"}</td>
                  {isAdmin && <td className="adm-cell-muted">{agentName(c.agent_id)}</td>}
                  <td className="adm-cell-muted">{formatDate(c.created_at)}</td>
                  <td>
                    <div className="adm-cell-actions">
                      <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => openEdit(c)}>编辑</button>
                      <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => setDeleteTarget(c)}>删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <Modal
          title={form.id ? "编辑客户" : "新建客户"}
          onClose={() => setForm(null)}
          footer={
            <>
              <button className="adm-btn adm-btn-outline" onClick={() => setForm(null)}>取消</button>
              <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>{saving ? "保存中…" : "保存"}</button>
            </>
          }
        >
          <div className="adm-form-grid">
            <div className="adm-field full">
              <label className="adm-label">客户姓名</label>
              <input className="adm-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="adm-field">
              <label className="adm-label">电话</label>
              <input className="adm-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="adm-field">
              <label className="adm-label">微信</label>
              <input className="adm-input" value={form.wechat} onChange={(e) => setForm({ ...form, wechat: e.target.value })} />
            </div>
            <div className="adm-field">
              <label className="adm-label">客户来源</label>
              <input className="adm-input" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="如：小红书 / 朋友介绍" />
            </div>
            {isAdmin && (
              <div className="adm-field">
                <label className="adm-label">归属代理商</label>
                <select className="adm-select" value={form.agent_id || ""} onChange={(e) => setForm({ ...form, agent_id: e.target.value })}>
                  <option value="">隐海直客</option>
                  {agents.map((a) => <option key={a.id} value={a.id}>{a.company_name}</option>)}
                </select>
              </div>
            )}
            <div className="adm-field full">
              <label className="adm-label">备注</label>
              <textarea className="adm-textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="删除客户"
          message={`确定要删除客户「${deleteTarget.name}」吗？此操作不可撤销。`}
          confirmLabel="删除"
          danger
          onConfirm={remove}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
