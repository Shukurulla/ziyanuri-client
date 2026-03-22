import { useEffect, useState } from "react";
import { HiPlus, HiPencil, HiTrash, HiDocument } from "react-icons/hi";
import api from "../../api";
import Drawer from "../../components/admin/Drawer";
import LangTabs, { LANGS } from "../../components/admin/LangTabs";
import { Field, inputClass } from "../../components/admin/FormField";
import RichEditor from "../../components/admin/RichEditor";
import { toSlug } from "../../components/admin/SlugField";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { useToast } from "../../components/admin/Toast";

export default function AdminPages() {
  const [items, setItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [activeLang, setActiveLang] = useState("kk_lat");
  const toast = useToast();
  const [confirmState, setConfirmState] = useState({ open: false, id: null });

  const load = () => api.get("/pages/admin/all").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ slug: "", published: true, translations: LANGS.map((lang) => ({ lang, title: "", content: "" })), meta: LANGS.map((lang) => ({ lang, metaTitle: "", metaDesc: "" })) }); setEditing(null); setDrawerOpen(true); };
  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      slug: item.slug, published: item.published,
      translations: LANGS.map((lang) => { const ex = item.translations.find((t) => t.lang === lang); return { lang, title: ex?.title || "", content: ex?.content || "" }; }),
      meta: LANGS.map((lang) => { const ex = item.meta?.find((m) => m.lang === lang); return { lang, metaTitle: ex?.metaTitle || "", metaDesc: ex?.metaDesc || "" }; }),
    });
    setDrawerOpen(true);
  };
  const save = async () => { try { const data = { ...form, slug: form.slug || toSlug(form.translations?.find(t => t.lang === "kk_lat")?.title || form.translations?.[0]?.title || "") }; if (editing) await api.put(`/pages/${editing}`, data); else await api.post("/pages", data); toast.success("Saqlandi"); setDrawerOpen(false); load(); } catch (err) { toast.error(err.response?.data?.error || "Xatolik"); } };
  const askRemove = (id) => setConfirmState({ open: true, id });
  const doRemove = async () => {
    try { await api.delete(`/pages/${confirmState.id}`); toast.success("O'chirildi"); load(); } catch { toast.error("O'chirishda xatolik"); }
    setConfirmState({ open: false, id: null });
  };
  const updateTr = (lang, field, value) => { setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, [field]: value } : t) }); };
  const updateMeta = (lang, field, value) => { setForm({ ...form, meta: form.meta.map((m) => m.lang === lang ? { ...m, [field]: value } : m) }); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Sahifalar</h1><p className="text-sm text-gray-500 mt-1">{items.length} ta</p></div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800"><HiPlus className="w-4 h-4" /> Yangi</button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {items.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 group">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0"><HiDocument className="w-5 h-5 text-gray-400" /></div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.translations?.[0]?.title || "—"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">/{item.slug}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${item.published ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>{item.published ? "Nashr" : "Qoralama"}</span>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><HiPencil className="w-4 h-4" /></button>
                  <button onClick={() => askRemove(item._id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600"><HiTrash className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : <div className="py-16 text-center"><HiDocument className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-400 text-sm">Sahifalar yo'q</p></div>}
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? "Tahrirlash" : "Yangi sahifa"} wide>
        {form && (
          <div className="space-y-5">
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 rounded" /><span className="text-sm font-medium text-gray-700">Nashr qilish</span></label>
            <div className="border-t pt-5"><LangTabs activeLang={activeLang} onChange={setActiveLang} /></div>
            {LANGS.filter((l) => l === activeLang).map((lang) => (
              <div key={lang} className="space-y-4">
                <Field label="Sarlavha"><input value={form.translations.find((t) => t.lang === lang)?.title || ""} onChange={(e) => updateTr(lang, "title", e.target.value)} className={inputClass} /></Field>
                <Field label="Kontent"><RichEditor value={form.translations.find((t) => t.lang === lang)?.content || ""} onChange={(val) => updateTr(lang, "content", val)} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Meta Title"><input value={form.meta.find((m) => m.lang === lang)?.metaTitle || ""} onChange={(e) => updateMeta(lang, "metaTitle", e.target.value)} className={inputClass} /></Field>
                  <Field label="Meta Description"><input value={form.meta.find((m) => m.lang === lang)?.metaDesc || ""} onChange={(e) => updateMeta(lang, "metaDesc", e.target.value)} className={inputClass} /></Field>
                </div>
              </div>
            ))}
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
