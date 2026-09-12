import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Modal, ConfirmDialog, Loading, EmptyState, StatusBadge } from "../components/ui";
import {
  ACCEPTED_IMAGE_TYPES,
  deleteStorageObject,
  storagePathFromPublicUrl,
  uploadImageFile,
  validateImageFile,
} from "../lib/storage";

// 管理员分类管理页（/admin/categories，仅管理员可进入）。
// 真实字段（已核对 information_schema）：
//   id, created_at, name, name_en, slug, emoji, cover_image, sort_order, status
// status 固定两个值：active = 启用，inactive = 停用。
const STATUS_LABEL = { active: "启用", inactive: "停用" };

const emptyForm = {
  id: null,
  name: "",
  name_en: "",
  slug: "",
  emoji: "",
  cover_image: "",
  sort_order: 0,
  status: "active",
};

export default function Categories() {
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [coverShouldClear, setCoverShouldClear] = useState(false);
  const [coverError, setCoverError] = useState("");
  const [formError, setFormError] = useState("");
  const coverInputRef = useRef(null);
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

  useEffect(() => () => {
    if (coverPreview.startsWith("blob:")) URL.revokeObjectURL(coverPreview);
  }, [coverPreview]);

  const resetCoverEditor = (imageUrl = "") => {
    setCoverFile(null);
    setCoverPreview(imageUrl);
    setCoverShouldClear(false);
    setCoverError("");
    setFormError("");
    if (coverInputRef.current) coverInputRef.current.value = "";
  };

  const closeForm = () => {
    resetCoverEditor();
    setForm(null);
  };

  const openCreate = () => {
    resetCoverEditor();
    setForm({ ...emptyForm });
  };

  const openEdit = (row) => {
    const imageUrl = row.cover_image || "";
    resetCoverEditor(imageUrl);
    setForm({
      id: row.id,
      name: row.name || "",
      name_en: row.name_en || "",
      slug: row.slug || "",
      emoji: row.emoji || "",
      cover_image: imageUrl,
      sort_order: row.sort_order ?? 0,
      status: row.status === "inactive" ? "inactive" : "active",
    });
  };

  const selectCoverFile = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setCoverError(validationError);
      return;
    }

    setCoverError("");
    setCoverFile(file);
    setCoverShouldClear(false);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeSelectedCover = () => {
    setCoverFile(null);
    setCoverPreview("");
    setCoverShouldClear(Boolean(form?.cover_image));
    setCoverError("");
  };

  const restoreOriginalCover = () => {
    setCoverFile(null);
    setCoverPreview(form?.cover_image || "");
    setCoverShouldClear(false);
    setCoverError("");
  };

  const save = async () => {
    if (!form.name.trim()) { setFormError("请填写分类名称"); return; }
    if (!form.slug.trim()) { setFormError("请填写 slug"); return; }
    setSaving(true);
    setError("");
    setFormError("");
    const payload = {
      name: form.name.trim(),
      name_en: form.name_en.trim(),
      slug: form.slug.trim(),
      emoji: form.emoji,
      sort_order: Number(form.sort_order) || 0,
      status: form.status === "inactive" ? "inactive" : "active",
    };

    let categoryId = form.id;
    let insertedNewCategory = false;
    let uploadedImage = null;
    let nextCoverUrl = form.cover_image || null;

    try {
      // 新建分类要先得到 ID，才能把图片放到这个分类专属的文件夹中。
      if (!categoryId) {
        const { data, error } = await supabase
          .from("categories")
          .insert({ ...payload, cover_image: null })
          .select("id")
          .single();
        if (error) throw error;
        categoryId = data.id;
        insertedNewCategory = true;
      }

      if (coverFile) {
        uploadedImage = await uploadImageFile(coverFile, `categories/${categoryId}`);
        nextCoverUrl = uploadedImage.url;
      } else if (coverShouldClear) {
        nextCoverUrl = null;
      }

      // 新建且未选择图片时，上面的 insert 已经保存完所有字段，无需再写一次。
      if (!insertedNewCategory || coverFile || coverShouldClear) {
        const { error } = await supabase
          .from("categories")
          .update({ ...payload, cover_image: nextCoverUrl })
          .eq("id", categoryId);
        if (error) throw error;
      }
    } catch (saveError) {
      if (uploadedImage?.path) {
        // 数据库没有成功保存时，清理刚上传的新文件，避免留下无法使用的图片。
        await deleteStorageObject(uploadedImage.path).catch(() => {});
      }

      if (insertedNewCategory) {
        setForm((current) => current && { ...current, id: categoryId, cover_image: "" });
        await load();
        setFormError(`分类已创建，但封面图片未能保存：${saveError.message}。请重新选择图片后再次保存。`);
      } else {
        setFormError(saveError.message || "保存失败，请稍后重试");
      }
      setSaving(false);
      return;
    }

    const oldPath = storagePathFromPublicUrl(form.cover_image);
    let cleanupWarning = "";
    // 只清理本分类目录里的旧图，绝不删除产品图片或外部图片链接。
    if (
      oldPath?.startsWith(`categories/${categoryId}/`)
      && form.cover_image !== nextCoverUrl
    ) {
      try {
        await deleteStorageObject(oldPath);
      } catch {
        cleanupWarning = "分类已保存，但旧图片文件未能自动清理，不影响网站展示。";
      }
    }

    setSaving(false);
    closeForm();
    await load();
    if (cleanupWarning) setError(cleanupWarning);
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
    if (error) {
      setError(error.message);
      setDeleteTarget(null);
      return;
    }

    const coverPath = storagePathFromPublicUrl(deleteTarget.cover_image);
    let cleanupWarning = "";
    if (coverPath?.startsWith(`categories/${deleteTarget.id}/`)) {
      try {
        await deleteStorageObject(coverPath);
      } catch {
        cleanupWarning = "分类已删除，但关联图片文件未能自动清理。";
      }
    }
    setDeleteTarget(null);
    await load();
    if (cleanupWarning) setError(cleanupWarning);
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
          onClose={saving ? () => {} : closeForm}
          footer={
            <>
              <button className="adm-btn adm-btn-outline" onClick={closeForm} disabled={saving}>取消</button>
              <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>
                {saving ? "保存中…" : "保存"}
              </button>
            </>
          }
        >
          {formError && <div className="adm-notice danger">{formError}</div>}
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
              <label className="adm-label">分类封面图片</label>
              <div className="adm-category-cover">
                {coverPreview ? (
                  <div className="adm-category-cover-preview">
                    <img src={coverPreview} alt="分类封面预览" />
                  </div>
                ) : (
                  <div className="adm-category-cover-empty">暂未设置分类封面</div>
                )}

                <div className="adm-category-cover-actions">
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept={ACCEPTED_IMAGE_TYPES.join(",")}
                    onChange={selectCoverFile}
                    hidden
                  />
                  <button
                    type="button"
                    className="adm-btn adm-btn-outline adm-btn-sm"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={saving}
                  >
                    {coverPreview ? "替换图片" : "选择图片"}
                  </button>
                  {coverPreview && (
                    <button
                      type="button"
                      className="adm-btn adm-btn-danger adm-btn-sm"
                      onClick={removeSelectedCover}
                      disabled={saving}
                    >
                      移除图片
                    </button>
                  )}
                  {(coverFile || coverShouldClear) && form.cover_image && (
                    <button
                      type="button"
                      className="adm-btn adm-btn-ghost adm-btn-sm"
                      onClick={restoreOriginalCover}
                      disabled={saving}
                    >
                      恢复原图
                    </button>
                  )}
                </div>

                <div className="adm-category-cover-hint">
                  {coverFile
                    ? `已选择「${coverFile.name}」，点击“保存”后上传。`
                    : coverShouldClear
                      ? "当前图片将在保存后移除。"
                      : "支持 JPG、PNG、WebP，单张最大 10MB。首页分类卡会自动使用此图。"}
                </div>
                {coverError && <div className="adm-category-cover-error">{coverError}</div>}
              </div>
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
