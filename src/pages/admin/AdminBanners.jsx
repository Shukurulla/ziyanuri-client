import { useEffect, useState } from "react";
import { HiPlus, HiPencil, HiTrash, HiPhotograph } from "react-icons/hi";
import api from "../../api";
import Drawer from "../../components/admin/Drawer";
import LangTabs, { LANGS } from "../../components/admin/LangTabs";
import { Field, inputClass } from "../../components/admin/FormField";
import ImageUpload from "../../components/admin/ImageUpload";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { useToast } from "../../components/admin/Toast";

export default function AdminBanners() {
  const [items, setItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [activeLang, setActiveLang] = useState("kk_lat");
  const toast = useToast();
  const [confirmState, setConfirmState] = useState({ open: false, id: null });

  const load = () => api.get("/banners/admin/all").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ image: "", link: "", sortOrder: 0, active: true, translations: LANGS.map((lang) => ({ lang, title: "", subtitle: "" })) }); setEditing(null); setDrawerOpen(true); };
  const openEdit = (item) => {
    setEditing(item._id);
    setForm({ image: item.image, link: item.link || "", sortOrder: item.sortOrder, active: item.active, translations: LANGS.map((lang) => { const ex = item.translations.find((t) => t.lang === lang); return { lang, title: ex?.title || "", subtitle: ex?.subtitle || "" }; }) });
    setDrawerOpen(true);
  };
  const save = async () => { try { if (editing) await api.put(`/banners/${editing}`, form); else await api.post("/banners", form); toast.success("Saqlandi"); setDrawerOpen(false); load(); } catch (err) { toast.error(err.response?.data?.error || "Xatolik"); } };
  const askRemove = (id) => setConfirmState({ open: true, id });
  const doRemove = async () => {
    try { await api.delete(`/banners/${confirmState.id}`); toast.success("O'chirildi"); load(); } catch { toast.error("O'chirishda xatolik"); }
    setConfirmState({ open: false, id: null });
  };
  const updateTr = (lang, field, value) => { setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, [field]: value } : t) }); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Bannerlar</h1><p className="text-sm text-gray-500 mt-1">{items.length} ta</p></div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800"><HiPlus className="w-4 h-4" /> Yangi</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
            {item.image ? <img src={item.image} alt="" className="w-full h-48 object-cover" /> : <div className="w-full h-48 bg-gray-100 flex items-center justify-center"><HiPhotograph className="w-10 h-10 text-gray-200" /></div>}
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.translations?.[0]?.title || "Banner"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.translations?.[0]?.subtitle || ""}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${item.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{item.active ? "Faol" : "Nofaol"}</span>
              </div>
              <div className="flex gap-1 mt-3 pt-3 border-t border-gray-100">
                <button onClick={() => openEdit(item)} className="flex-1 py-1.5 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"><HiPencil className="w-3.5 h-3.5" /> Tahrirlash</button>
                <button onClick={() => askRemove(item._id)} className="py-1.5 px-3 text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><HiTrash className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full py-16 text-center"><HiPhotograph className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-400 text-sm">Bannerlar yo'q</p></div>}
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? "Tahrirlash" : "Yangi banner"}>
        {form && (
          <div className="space-y-5">
            <ImageUpload value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tartib raqami"><input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className={inputClass} /></Field>
              <Field label="Havola"><input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className={inputClass} placeholder="https://..." /></Field>
            </div>
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer"><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 rounded" /><span className="text-sm font-medium text-gray-700">Faol</span></label>
            <div className="border-t pt-5"><LangTabs activeLang={activeLang} onChange={setActiveLang} /></div>
            {LANGS.filter((l) => l === activeLang).map((lang) => {
              const tr = form.translations.find((t) => t.lang === lang);
              return (<div key={lang} className="space-y-4"><Field label="Sarlavha"><input value={tr?.title || ""} onChange={(e) => updateTr(lang, "title", e.target.value)} className={inputClass} /></Field><Field label="Qo'shimcha matn"><input value={tr?.subtitle || ""} onChange={(e) => updateTr(lang, "subtitle", e.target.value)} className={inputClass} /></Field></div>);
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
