import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../lib/AuthContext";
import { Loading } from "../components/ui";

export default function Settings() {
  const { isAdmin, profile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [savingPwd, setSavingPwd] = useState(false);
  const [pwdMsg, setPwdMsg] = useState("");

  const saveProfile = async () => {
    setSavingProfile(true);
    setProfileMsg("");
    const { error } = await supabase.from("profiles").update({ display_name: displayName }).eq("id", profile.id);
    setSavingProfile(false);
    setProfileMsg(error ? error.message : "已保存");
  };

  const changePassword = async () => {
    if (pwd.length < 6) { setPwdMsg("新密码至少 6 位"); return; }
    if (pwd !== pwd2) { setPwdMsg("两次输入的密码不一致"); return; }
    setSavingPwd(true);
    setPwdMsg("");
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setSavingPwd(false);
    setPwdMsg(error ? error.message : "密码已更新");
    if (!error) { setPwd(""); setPwd2(""); }
  };

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-title">系统设置</div>
          <div className="adm-page-sub">管理个人账号信息{isAdmin ? "与网站基础信息" : ""}</div>
        </div>
      </div>

      <div className="adm-panel">
        <div className="adm-panel-title">个人资料</div>
        <div className="adm-form-grid">
          <div className="adm-field">
            <label className="adm-label">登录邮箱</label>
            <input className="adm-input" value={profile?.email || ""} disabled />
          </div>
          <div className="adm-field">
            <label className="adm-label">显示名称</label>
            <input className="adm-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
        </div>
        {profileMsg && <div className="adm-notice" style={{ marginTop: 6 }}>{profileMsg}</div>}
        <button className="adm-btn adm-btn-primary adm-btn-sm" style={{ marginTop: 10 }} onClick={saveProfile} disabled={savingProfile}>
          {savingProfile ? "保存中…" : "保存资料"}
        </button>
      </div>

      <div className="adm-panel">
        <div className="adm-panel-title">修改密码</div>
        <div className="adm-form-grid">
          <div className="adm-field">
            <label className="adm-label">新密码</label>
            <input className="adm-input" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
          </div>
          <div className="adm-field">
            <label className="adm-label">确认新密码</label>
            <input className="adm-input" type="password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} />
          </div>
        </div>
        {pwdMsg && <div className="adm-notice" style={{ marginTop: 6 }}>{pwdMsg}</div>}
        <button className="adm-btn adm-btn-primary adm-btn-sm" style={{ marginTop: 10 }} onClick={changePassword} disabled={savingPwd}>
          {savingPwd ? "更新中…" : "更新密码"}
        </button>
      </div>

      {isAdmin && <SiteSettingsPanel />}

      {isAdmin && <RegionsEntryPanel />}
    </div>
  );
}

// 地区管理入口——仅管理员可见；实际访问权限由 /admin/settings/regions
// 路由上的 <RequireAuth role="admin"> 兜底，代理商即使拿到链接也无法进入。
function RegionsEntryPanel() {
  return (
    <div className="adm-panel">
      <div className="adm-panel-title">地区管理</div>
      <div className="adm-notice" style={{ marginBottom: 10 }}>
        管理产品所在的地区（城市），例如普吉岛、曼谷、苏梅岛、芭提雅。
      </div>
      <Link to="/admin/settings/regions" className="adm-btn adm-btn-primary adm-btn-sm">
        进入地区管理 →
      </Link>
    </div>
  );
}

function SiteSettingsPanel() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.from("site_settings").select("*").eq("id", 1).maybeSingle().then(({ data }) => {
      setForm(data || { company_name: "", contact_wechat: "", contact_whatsapp: "", notice: "" });
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg("");
    const { error } = await supabase.from("site_settings").upsert({ id: 1, ...form });
    setSaving(false);
    setMsg(error ? error.message : "已保存");
  };

  if (loading) return <Loading />;

  return (
    <div className="adm-panel">
      <div className="adm-panel-title">网站基础信息</div>
      <div className="adm-form-grid">
        <div className="adm-field full">
          <label className="adm-label">公司名称</label>
          <input className="adm-input" value={form.company_name || ""} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
        </div>
        <div className="adm-field">
          <label className="adm-label">客服微信</label>
          <input className="adm-input" value={form.contact_wechat || ""} onChange={(e) => setForm({ ...form, contact_wechat: e.target.value })} />
        </div>
        <div className="adm-field">
          <label className="adm-label">客服 WhatsApp</label>
          <input className="adm-input" value={form.contact_whatsapp || ""} onChange={(e) => setForm({ ...form, contact_whatsapp: e.target.value })} />
        </div>
        <div className="adm-field full">
          <label className="adm-label">系统公告（内部使用）</label>
          <textarea className="adm-textarea" value={form.notice || ""} onChange={(e) => setForm({ ...form, notice: e.target.value })} />
        </div>
      </div>
      {msg && <div className="adm-notice" style={{ marginTop: 6 }}>{msg}</div>}
      <button className="adm-btn adm-btn-primary adm-btn-sm" style={{ marginTop: 10 }} onClick={save} disabled={saving}>
        {saving ? "保存中…" : "保存设置"}
      </button>
    </div>
  );
}
