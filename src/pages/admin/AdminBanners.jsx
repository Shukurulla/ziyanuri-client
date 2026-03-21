import { useEffect, useState } from "react";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import api from "../../api";
import ImageUpload from "../../components/admin/ImageUpload";

const LANGS = ["kk_lat", "kk_cyr", "uz", "ru", "en"];
const LANG_LABELS = { kk_lat: "QQ Lat", kk_cyr: "QQ Кир", uz: "UZ", ru: "RU", en: "EN" };

export default function AdminBanners() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [activeLang, setActiveLang] = useState("kk_lat");

  const load = () => api.get("/banners/admin/all").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ image: "", link: "", sortOrder: 0, active: true, translations: LANGS.map((lang) => ({ lang, title: "", subtitle: "" })) });
    setEditing(null);
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({
      image: item.image, link: item.link || "", sortOrder: item.sortOrder, active: item.active,
      translations: LANGS.map((lang) => {
        const ex = item.translations.find((t) => t.lang === lang);
        return { lang, title: ex?.title || "", subtitle: ex?.subtitle || "" };
      }),
    });
  };

  const save = async () => {
    try {
      if (editing) await api.put(`/banners/${editing}`, form);
      else await api.post("/banners", form);
      setForm(null);
      load();
    } catch (err) { alert(err.response?.data?.error || "Xatolik"); }
  };

  const remove = async (id) => {
    if (!confirm("O'chirmoqchimisiz?")) return;
    await api.delete(`/banners/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bannerlar</h1>
        <button onClick={openNew} className="btn-primary flex items-center gap-2"><HiPlus /> Yangi</button>
      </div>

      {form && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <ImageUpload value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            <input placeholder="Havola" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input type="number" placeholder="Tartib" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="px-3 py-2 border rounded-lg" />
          </div>

          <div className="flex gap-1 mb-4 border-b">
            {LANGS.map((lang) => (
              <button key={lang} onClick={() => setActiveLang(lang)} className={`px-3 py-2 text-sm font-medium border-b-2 ${activeLang === lang ? "border-primary-500 text-primary-500" : "border-transparent text-gray-500"}`}>
                {LANG_LABELS[lang]}
              </button>
            ))}
          </div>

          {LANGS.filter((l) => l === activeLang).map((lang) => {
            const tr = form.translations.find((t) => t.lang === lang);
            return (
              <div key={lang} className="space-y-3">
                <input placeholder="Sarlavha" value={tr?.title || ""} onChange={(e) => setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, title: e.target.value } : t) })} className="w-full px-3 py-2 border rounded-lg" />
                <input placeholder="Qo'shimcha matn" value={tr?.subtitle || ""} onChange={(e) => setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, subtitle: e.target.value } : t) })} className="w-full px-3 py-2 border rounded-lg" />
              </div>
            );
          })}

          <div className="flex gap-2 mt-4">
            <button onClick={save} className="btn-primary">Saqlash</button>
            <button onClick={() => setForm(null)} className="px-4 py-2 border rounded-lg">Bekor</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            {item.image && <img src={item.image} alt="" className="h-40 w-full object-cover" />}
            <div className="p-4">
              <p className="font-medium">{item.translations?.[0]?.title || "Banner"}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(item)} className="text-blue-500"><HiPencil size={18} /></button>
                <button onClick={() => remove(item.id)} className="text-red-500"><HiTrash size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
