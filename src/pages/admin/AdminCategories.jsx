import { useEffect, useState } from "react";
import { HiPlus, HiPencil, HiTrash, HiTag } from "react-icons/hi";
import api from "../../api";
import Drawer from "../../components/admin/Drawer";
import LangTabs, { LANGS } from "../../components/admin/LangTabs";
import { Field, inputClass, selectClass } from "../../components/admin/FormField";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { useToast } from "../../components/admin/Toast";

const TYPES = [
  { value: "heritage", label: "Meros" },
  { value: "media", label: "Media" },
  { value: "news", label: "Yangiliklar" },
  { value: "event", label: "Tadbirlar" },
];

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [activeLang, setActiveLang] = useState("kk_cyr");
  const toast = useToast();
  const [confirmState, setConfirmState] = useState({ open: false, id: null });

  const load = () => {
    const params = filter ? { type: filter } : {};
    api.get("/categories", { params }).then((r) => setItems(r.data));
  };
  useEffect(() => { load(); }, [filter]);

  const openNew = () => {
    setForm({ slug: "", type: filter || "heritage", sortOrder: 0, translations: LANGS.map((lang) => ({ lang, name: "" })) });
    setEditing(null); setDrawerOpen(true);
  };
  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      slug: item.slug, type: item.type, sortOrder: item.sortOrder || 0,
      translations: LANGS.map((lang) => { const ex = item.translations.find((t) => t.lang === lang); return { lang, name: ex?.name || "" }; }),
    });
    setDrawerOpen(true);
  };
  const save = async () => {
    try {
      const slug = form.slug || form.translations.find(t => t.lang === "kk_lat")?.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "";
      const data = { ...form, slug };
      if (editing) await api.put(`/categories/${editing}`, data); else await api.post("/categories", data);
      toast.success("Saqlandi"); setDrawerOpen(false); load();
    } catch (err) { toast.error(err.response?.data?.error || "Xatolik"); }
  };
  const askRemove = (id) => setConfirmState({ open: true, id });
  const doRemove = async () => {
    try { await api.delete(`/categories/${confirmState.id}`); toast.success("O'chirildi"); load(); } catch { toast.error("O'chirishda xatolik"); }
    setConfirmState({ open: false, id: null });
  };
  const updateTr = (lang, value) => { setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, name: value } : t) }); };

  const grouped = {};
  items.forEach((item) => {
    if (!grouped[item.type]) grouped[item.type] = [];
    grouped[item.type].push(item);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Kategoriyalar</h1><p className="text-sm text-gray-500 mt-1">{items.length} ta</p></div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800"><HiPlus className="w-4 h-4" /> Yangi</button>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        <button onClick={() => setFilter("")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!filter ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Barchasi</button>
        {TYPES.map((t) => (
          <button key={t.value} onClick={() => setFilter(t.value)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === t.value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>{t.label}</button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {items.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 group">
                <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <HiTag className="w-4 h-4 text-primary-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.translations?.[0]?.name || item.slug}</p>
                  <p className="text-xs text-gray-400">{item.slug}</p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gray-50 text-gray-600 border border-gray-200">
                  {TYPES.find(t => t.value === item.type)?.label || item.type}
                </span>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><HiPencil className="w-4 h-4" /></button>
                  <button onClick={() => askRemove(item._id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600"><HiTrash className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : <div className="py-16 text-center"><HiTag className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-400 text-sm">Kategoriyalar yo'q</p><button onClick={openNew} className="mt-2 text-sm text-primary-500">Birinchisini qo'shing</button></div>}
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? "Tahrirlash" : "Yangi kategoriya"}>
        {form && (
          <div className="space-y-5">
            <Field label="Turi">
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={selectClass}>
                {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>
            <Field label="Tartib raqami">
              <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className={inputClass} />
            </Field>
            <div className="border-t pt-5"><LangTabs activeLang={activeLang} onChange={setActiveLang} /></div>
            {LANGS.filter((l) => l === activeLang).map((lang) => {
              const tr = form.translations.find((t) => t.lang === lang);
              return (
                <Field key={lang} label="Nomi">
                  <input value={tr?.name || ""} onChange={(e) => updateTr(lang, e.target.value)} className={inputClass} placeholder="Kategoriya nomi" />
                </Field>
              );
            })}
            <div className="flex gap-3 pt-4 border-t">
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
