import { useEffect, useState } from "react";
import { HiPlus, HiTrash, HiPhotograph, HiFilm, HiMusicNote, HiBookOpen } from "react-icons/hi";
import api from "../../api";
import Drawer from "../../components/admin/Drawer";
import LangTabs, { LANGS } from "../../components/admin/LangTabs";
import { Field, inputClass, selectClass } from "../../components/admin/FormField";
import ImageUpload from "../../components/admin/ImageUpload";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { useToast } from "../../components/admin/Toast";

const typeIcons = { photo: HiPhotograph, video: HiFilm, audio: HiMusicNote, book: HiBookOpen };
const typeLabels = { photo: "Foto", video: "Video", audio: "Audio", book: "Kitob" };

export default function AdminMedia() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("photo");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeLang, setActiveLang] = useState("kk_cyr");
  const toast = useToast();
  const [confirmState, setConfirmState] = useState({ open: false, id: null });

  const load = () => api.get("/media", { params: { type: filter } }).then((r) => setItems(r.data));
  useEffect(() => { load(); }, [filter]);
  useEffect(() => { api.get("/categories", { params: { type: "media" } }).then((r) => setCategories(r.data)).catch(() => {}); }, []);

  const openNew = () => { setForm({ type: filter, url: "", category: categories[0]?.slug || "", translations: LANGS.map((lang) => ({ lang, title: "" })) }); setDrawerOpen(true); };
  const save = async () => { try { await api.post("/media", form); toast.success("Saqlandi"); setDrawerOpen(false); load(); } catch (err) { toast.error(err.response?.data?.error || "Xatolik"); } };
  const askRemove = (id) => setConfirmState({ open: true, id });
  const doRemove = async () => {
    try { await api.delete(`/media/${confirmState.id}`); toast.success("O'chirildi"); load(); } catch { toast.error("O'chirishda xatolik"); }
    setConfirmState({ open: false, id: null });
  };

  const getCatName = (slug) => {
    const cat = categories.find(c => c.slug === slug);
    return cat?.translations?.[0]?.name || slug;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Media</h1><p className="text-sm text-gray-500 mt-1">{items.length} ta</p></div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800"><HiPlus className="w-4 h-4" /> Yangi</button>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {Object.entries(typeLabels).map(([key, label]) => {
          const Icon = typeIcons[key];
          return <button key={key} onClick={() => setFilter(key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}><Icon className="w-4 h-4" /> {label}</button>;
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const Icon = typeIcons[item.type] || HiPhotograph;
          return (
            <div key={item._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden group hover:shadow-md transition-shadow">
              {item.type === "photo" && item.url ? <img src={item.url} alt="" className="w-full h-36 object-cover" /> : <div className="w-full h-36 bg-gray-50 flex items-center justify-center"><Icon className="w-10 h-10 text-gray-200" /></div>}
              <div className="p-3">
                <p className="text-sm font-medium text-gray-800 truncate">{item.translations?.[0]?.title || "—"}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-400">{getCatName(item.category)}</p>
                  <button onClick={() => askRemove(item._id)} className="text-xs text-gray-400 hover:text-red-600"><HiTrash className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          );
        })}
        {items.length === 0 && <div className="col-span-full py-16 text-center"><HiPhotograph className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-400 text-sm">Media yo'q</p></div>}
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Yangi media">
        {form && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Turi">
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={selectClass}>
                  <option value="photo">Foto</option><option value="video">Video</option><option value="audio">Audio</option><option value="book">Kitob</option>
                </select>
              </Field>
              <Field label="Kategoriya">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={selectClass}>
                  {categories.map(c => <option key={c._id} value={c.slug}>{c.translations?.[0]?.name || c.slug}</option>)}
                  {categories.length === 0 && <option value="">Kategoriya qo'shing</option>}
                </select>
              </Field>
            </div>

            {form.type === "photo" ? (
              <ImageUpload value={form.url} onChange={(v) => setForm({ ...form, url: v })} />
            ) : (
              <Field label={form.type === "video" ? "Video URL" : form.type === "audio" ? "Audio fayl" : "Kitob fayli"} hint="Fayl URL manzili">
                <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputClass} placeholder="https://..." />
              </Field>
            )}

            <div className="border-t pt-5"><LangTabs activeLang={activeLang} onChange={setActiveLang} /></div>
            {LANGS.filter((l) => l === activeLang).map((lang) => (
              <Field key={lang} label="Nomi">
                <input value={form.translations.find(t => t.lang === lang)?.title || ""} onChange={(e) => setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, title: e.target.value } : t) })} className={inputClass} />
              </Field>
            ))}

            <div className="flex gap-3 pt-4 border-t">
              <button onClick={save} className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800">Yaratish</button>
              <button onClick={() => setDrawerOpen(false)} className="px-4 py-2.5 border border-gray-200 text-sm rounded-xl hover:bg-gray-50">Bekor</button>
            </div>
          </div>
        )}
      </Drawer>
      <ConfirmModal open={confirmState.open} onClose={() => setConfirmState({ open: false, id: null })} onConfirm={doRemove} title="O'chirish" message="Haqiqatan ham o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi." />
    </div>
  );
}
