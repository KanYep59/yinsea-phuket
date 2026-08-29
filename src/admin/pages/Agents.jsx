import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Modal, ConfirmDialog, Loading, EmptyState, StatusBadge, Notice } from "../components/ui";
import { formatDate, PROFILE_STATUS_LABELS } from "../lib/format";

// 代理商管理 V1（/admin/agents，仅管理员可进入）。
//
// 真实字段：
//   agents:   id, company_name, contact_name, phone, wechat, email, tier,
//             commission_note, status, notes, created_at, updated_at
//   profiles: id, email, display_name, role, agent_id, status, created_at, updated_at
//   profiles.id = auth.users.id；代理商资料通过 profiles.agent_id -> agents.id 关联。
//   status 固定两个值：active / disabled。
//
// 本页绝不在前端创建 Supabase Auth 账号、绝不处理密码——关联登录账号时，
// 管理员需要先在 Supabase → Authentication → Users 手动创建账号，
// 再把 User UID 粘贴到这里完成关联（写入 profiles）。
//
// 本页不查询、不引用 customers / orders：删除保护只检查是否已关联登录账号。
const emptyForm = {
  id: null, company_name: "", contact_name: "", phone: "", wechat: "", email: "",
  tier: "标准", commission_note: "", notes: "", status: "active",
};

export default function Agents() {
  const [rows, setRows] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBlockedMsg, setDeleteBlockedMsg] = useState("");
  const [linkAgent, setLinkAgent] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    const [
      { data: agents, error: agentErr },
      { data: profs, error: profErr },
    ] = await Promise.all([
      supabase.from("agents").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, email, display_name, agent_id, status").eq("role", "agent"),
    ]);
    const firstErr = agentErr || profErr;
    if (firstErr) {
      setError(firstErr.message);
      setLoading(false);
      return;
    }
    setRows(agents || []);
    setProfiles(profs || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const accountFor = (agentId) => profiles.find((p) => String(p.agent_id) === String(agentId));

  const openCreate = () => setForm({ ...emptyForm });
  const openEdit = (row) => setForm({
    id: row.id,
    company_name: row.company_name || "",
    contact_name: row.contact_name || "",
    phone: row.phone || "",
    wechat: row.wechat || "",
    email: row.email || "",
    tier: row.tier || "标准",
    commission_note: row.commission_note || "",
    notes: row.notes || "",
    status: row.status === "disabled" ? "disabled" : "active",
  });

  // 代理商资料状态与其关联登录账号（profiles.status）的启用/停用必须在同一个
  // 数据库事务内原子完成，避免"资料已停用、账号仍能登录"的不一致状态。
  // 因此启用/停用一律通过 0008_agents_status_rpc.sql 提供的
  // public.set_agent_status(p_agent_id, p_status) RPC 完成，前端不再分两步
  // 分别更新 agents 与 profiles。
  const setAgentStatus = async (agentId, status) => {
    return supabase.rpc("set_agent_status", { p_agent_id: agentId, p_status: status });
  };

  const save = async () => {
    if (!form.company_name.trim()) { setError("请填写代理商公司/名称"); return; }
    setSaving(true);
    setError("");
    const nextStatus = form.status === "disabled" ? "disabled" : "active";
    const payload = {
      company_name: form.company_name.trim(),
      contact_name: form.contact_name,
      phone: form.phone,
      wechat: form.wechat,
      email: form.email,
      tier: form.tier,
      commission_note: form.commission_note,
      notes: form.notes,
    };
    if (form.id) {
      const original = rows.find((r) => r.id === form.id);
      const statusChanged = original && original.status !== nextStatus;
      const { error } = await supabase.from("agents").update(payload).eq("id", form.id);
      if (error) {
        setSaving(false);
        setError(error.message);
        return;
      }
      if (statusChanged) {
        const { error: statusErr } = await setAgentStatus(form.id, nextStatus);
        if (statusErr) {
          setSaving(false);
          setError(statusErr.message);
          return;
        }
      }
    } else {
      const { error } = await supabase.from("agents").insert({ ...payload, status: nextStatus });
      if (error) {
        setSaving(false);
        setError(error.message);
        return;
      }
    }
    setSaving(false);
    setForm(null);
    load();
  };

  const toggleStatus = async (row) => {
    const next = row.status === "active" ? "disabled" : "active";
    setError("");
    const { error } = await setAgentStatus(row.id, next);
    if (error) { setError(error.message); return; }
    load();
  };

  const requestDelete = (row) => {
    const account = accountFor(row.id);
    if (account) {
      setDeleteBlockedMsg("该代理商已关联登录账号，请先停用，不可直接删除");
      return;
    }
    setDeleteTarget(row);
  };

  const remove = async () => {
    const { error } = await supabase.from("agents").delete().eq("id", deleteTarget.id);
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
              <div className="adm-page-title">代理商</div>
              <div className="adm-page-sub">管理代理商资料，并关联已在 Supabase 手动创建的登录账号</div>
            </div>
            <button className="adm-btn adm-btn-primary" onClick={openCreate}>+ 新建代理商</button>
          </div>

          {error && <div className="adm-notice danger">{error}</div>}

          {rows.length === 0 ? (
            <EmptyState title="暂无代理商" desc="点击右上角新建第一个代理商" />
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>公司 / 名称</th>
                    <th>联系人</th>
                    <th>联系方式</th>
                    <th>等级</th>
                    <th>资料状态</th>
                    <th>登录账号</th>
                    <th>创建时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a) => {
                    const account = accountFor(a.id);
                    return (
                      <tr key={a.id}>
                        <td>{a.company_name}</td>
                        <td className="adm-cell-muted">{a.contact_name || "—"}</td>
                        <td className="adm-cell-muted">{a.phone || a.wechat || "—"}</td>
                        <td><span className="adm-badge adm-badge-gold">{a.tier}</span></td>
                        <td><StatusBadge status={a.status} labels={PROFILE_STATUS_LABELS} /></td>
                        <td className="adm-cell-muted">
                          {account ? account.email : <span style={{ color: "var(--fog)" }}>未关联</span>}
                        </td>
                        <td className="adm-cell-muted">{formatDate(a.created_at)}</td>
                        <td>
                          <div className="adm-cell-actions">
                            <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => openEdit(a)}>编辑</button>
                            <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => toggleStatus(a)}>
                              {a.status === "active" ? "停用" : "启用"}
                            </button>
                            {!account && (
                              <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => setLinkAgent(a)}>关联登录账号</button>
                            )}
                            <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => requestDelete(a)}>删除</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {form && (
        <Modal
          title={form.id ? "编辑代理商" : "新建代理商"}
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
            <div className="adm-field full">
              <label className="adm-label">公司 / 代理商名称</label>
              <input className="adm-input" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
            </div>
            <div className="adm-field">
              <label className="adm-label">联系人</label>
              <input className="adm-input" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
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
              <label className="adm-label">邮箱（业务联系方式，非登录邮箱）</label>
              <input className="adm-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="adm-field">
              <label className="adm-label">代理等级</label>
              <select className="adm-select" value={form.tier} onChange={(e) => setForm({ ...form, tier: e.target.value })}>
                <option value="标准">标准</option>
                <option value="核心">核心</option>
                <option value="VIP">VIP</option>
              </select>
            </div>
            <div className="adm-field">
              <label className="adm-label">资料状态</label>
              <select className="adm-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">启用</option>
                <option value="disabled">停用</option>
              </select>
            </div>
            <div className="adm-field full">
              <label className="adm-label">佣金说明</label>
              <input className="adm-input" value={form.commission_note} onChange={(e) => setForm({ ...form, commission_note: e.target.value })} />
            </div>
            <div className="adm-field full">
              <label className="adm-label" style={{ color: "var(--danger)" }}>内部备注 — 仅管理员可见</label>
              <textarea className="adm-textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
          {form.id && (
            <div className="adm-notice" style={{ marginTop: 4 }}>
              修改这里的"资料状态"会同步更新该代理商已关联登录账号的状态（若已关联）。
            </div>
          )}
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="删除代理商"
          message={`确定要删除代理商「${deleteTarget.company_name}」吗？此操作不可撤销。`}
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

      {linkAgent && (
        <LinkAccountModal
          agent={linkAgent}
          onClose={() => setLinkAgent(null)}
          onLinked={() => { setLinkAgent(null); load(); }}
        />
      )}
    </>
  );
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function LinkAccountModal({ agent, onClose, onLinked }) {
  const [uid, setUid] = useState("");
  const [email, setEmail] = useState(agent.email || "");
  const [displayName, setDisplayName] = useState(agent.contact_name || agent.company_name || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (!UUID_RE.test(uid.trim())) { setError("请输入正确格式的 Auth 用户 UID（UUID）"); return; }
    if (!email.trim()) { setError("请填写登录邮箱"); return; }
    if (!displayName.trim()) { setError("请填写显示名称"); return; }
    setSaving(true);
    setError("");
    // 直接写入 profiles：id 必须已存在于 auth.users，否则外键约束会失败，
    // 这里如实展示 Postgres 返回的错误信息，不做任何猜测性提示。
    const { error: insertErr } = await supabase.from("profiles").insert({
      id: uid.trim(),
      email: email.trim(),
      display_name: displayName.trim(),
      role: "agent",
      agent_id: agent.id,
      status: agent.status === "disabled" ? "disabled" : "active",
    });
    setSaving(false);
    if (insertErr) { setError(insertErr.message); return; }
    onLinked();
  };

  return (
    <Modal
      title={`为「${agent.company_name}」关联登录账号`}
      onClose={onClose}
      footer={
        <>
          <button className="adm-btn adm-btn-outline" onClick={onClose}>取消</button>
          <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>
            {saving ? "关联中…" : "确认关联"}
          </button>
        </>
      }
    >
      {error && <div className="adm-notice danger">{error}</div>}
      <Notice>
        请先在 Supabase → Authentication → Users 手动创建邮箱账号；复制该用户的 User UID 后，在这里完成关联。
      </Notice>
      <div className="adm-field">
        <label className="adm-label">Auth 用户 UID</label>
        <input
          className="adm-input"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          placeholder="例如：3fa85f64-5717-4562-b3fc-2c963f66afa6"
        />
      </div>
      <div className="adm-field">
        <label className="adm-label">登录邮箱</label>
        <input
          className="adm-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="agent@example.com"
        />
      </div>
      <div className="adm-field">
        <label className="adm-label">显示名称</label>
        <input className="adm-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      </div>
    </Modal>
  );
}
