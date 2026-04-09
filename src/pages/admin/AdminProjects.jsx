import { useEffect, useState } from "react";
import { HiPlus, HiPencil, HiTrash, HiCollection } from "react-icons/hi";
import api from "../../api";
import Drawer from "../../components/admin/Drawer";
import LangTabs, { LANGS } from "../../components/admin/LangTabs";
import { Field, inputClass, selectClass } from "../../components/admin/FormField";
import ImageUpload from "../../components/admin/ImageUpload";
import RichEditor from "../../components/admin/RichEditor";
import { toSlug } from "../../components/admin/SlugField";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { useToast } from "../../components/admin/Toast";

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [activeLang, setActiveLang] = useState("kk_cyr");
  const toast = useToast();
  const [confirmState, setConfirmState] = useState({ open: false, id: null });

  const load = () => api.get("/projects").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ slug: "", image: "", status: "current", translations: LANGS.map((lang) => ({ lang, title: "", description: "", results: "" })) }); setEditing(null); setDrawerOpen(true); };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({ slug: item.slug, image: item.image || "", status: item.status, translations: LANGS.map((lang) => { const ex = item.translations.find((t) => t.lang === lang); return { lang, title: ex?.title || "", description: ex?.description || "", results: ex?.results || "" }; }) });
    setDrawerOpen(true);
  };

  const save = async () => { try { const data = { ...form, slug: form.slug || toSlug(form.translations?.find(t => t.lang === "kk_lat")?.title || form.translations?.[0]?.title || "") }; if (editing) await api.put(`/projects/${editing}`, data); else await api.post("/projects", data); toast.success("Saqlandi"); setDrawerOpen(false); load(); } catch (err) { toast.error(err.response?.data?.error || "Xatolik"); } };
  const askRemove = (id) => setConfirmState({ open: true, id });
  const doRemove = async () => {
    try { await api.delete(`/projects/${confirmState.id}`); toast.success("O'chirildi"); load(); } catch { toast.error("O'chirishda xatolik"); }
    setConfirmState({ open: false, id: null });
  };
  const updateTr = (lang, field, value) => { setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, [field]: value } : t) }); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Loyihalar</h1><p className="text-sm text-gray-500 mt-1">{items.length} ta</p></div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800"><HiPlus className="w-4 h-4" /> Yangi</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
            {item.image ? <img src={item.image} alt="" className="w-full h-40 object-cover" /> : <div className="w-full h-40 bg-gray-100 flex items-center justify-center"><HiCollection className="w-10 h-10 text-gray-200" /></div>}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.translations?.[0]?.title || "—"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.slug}</p>
                </div>
                <span className={`shrink-0 ml-2 px-2 py-0.5 rounded-lg text-[11px] font-medium ${item.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>{item.status === "completed" ? "Tugallangan" : "Joriy"}</span>
              </div>
              <div className="flex gap-1 mt-3 pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(item)} className="flex-1 py-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"><HiPencil className="w-3.5 h-3.5" /> Tahrirlash</button>
                <button onClick={() => askRemove(item._id)} className="py-1.5 px-3 text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><HiTrash className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full py-16 text-center"><HiCollection className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-400 text-sm">Loyihalar yo'q</p></div>}
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? "Tahrirlash" : "Yangi loyiha"} wide>
        {form && (
          <div className="space-y-5">
            <Field label="Holat"><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={selectClass}><option value="current">Joriy</option><option value="completed">Tugallangan</option></select></Field>
            <ImageUpload value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            <div className="border-t pt-5"><LangTabs activeLang={activeLang} onChange={setActiveLang} /></div>
            {LANGS.filter((l) => l === activeLang).map((lang) => {
              const tr = form.translations.find((t) => t.lang === lang);
              return (
                <div key={lang} className="space-y-4">
                  <Field label="Nomi"><input value={tr?.title || ""} onChange={(e) => updateTr(lang, "title", e.target.value)} className={inputClass} /></Field>
                  <Field label="Tavsif"><RichEditor value={tr?.description || ""} onChange={(val) => updateTr(lang, "description", val)} /></Field>
                  <Field label="Natijalar"><RichEditor value={tr?.results || ""} onChange={(val) => updateTr(lang, "results", val)} /></Field>
                </div>
              );
            })}
            <div className="flex gap-3 pt-4 border-t pt-4">
              <button onClick={save} className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800">{editing ? "Saqlash" : "Yaratish"}</button>
              <button onClick={() => setDrawerOpen(false)} className="px-4 py-2.5 border border-gray-200 text-sm rounded-xl hover:bg-gray-50">Bekor</button>
            </div>
          </div>
        )}
      </Drawer>
      <ConfirmModal open={confirmState.open} onClose={() => setConfirmState({ open: false, id: null })} onConfirm={doRemove} title="O'chirish" message="Haqiqatan ham o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi." />
    </div>
  );
}
