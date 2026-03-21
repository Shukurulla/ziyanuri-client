import { useEffect, useState } from "react";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import api from "../../api";
import ImageUpload from "../../components/admin/ImageUpload";

const LANGS = ["kk_lat", "kk_cyr", "uz", "ru", "en"];
const LANG_LABELS = { kk_lat: "QQ Lat", kk_cyr: "QQ Кир", uz: "UZ", ru: "RU", en: "EN" };

export default function AdminLeaders() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [activeLang, setActiveLang] = useState("kk_lat");

  const load = () => api.get("/leaders").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ photo: "", position: 0, translations: LANGS.map((lang) => ({ lang, fullName: "", role: "", bio: "" })) });
    setEditing(null);
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({
      photo: item.photo || "", position: item.position,
      translations: LANGS.map((lang) => {
        const ex = item.translations.find((t) => t.lang === lang);
        return { lang, fullName: ex?.fullName || "", role: ex?.role || "", bio: ex?.bio || "" };
      }),
    });
  };

  const save = async () => {
    try {
      if (editing) await api.put(`/leaders/${editing}`, form);
      else await api.post("/leaders", form);
      setForm(null);
      load();
    } catch (err) { alert(err.response?.data?.error || "Xatolik"); }
  };

  const remove = async (id) => {
    if (!confirm("O'chirmoqchimisiz?")) return;
    await api.delete(`/leaders/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Rahbariyat</h1>
        <button onClick={openNew} className="btn-primary flex items-center gap-2"><HiPlus /> Yangi</button>
      </div>

      {form && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <ImageUpload value={form.photo} onChange={(v) => setForm({ ...form, photo: v })} label="Foto" />
            <input type="number" placeholder="Pozitsiya" value={form.position} onChange={(e) => setForm({ ...form, position: Number(e.target.value) })} className="px-3 py-2 border rounded-lg" />
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
                <input placeholder="To'liq ism" value={tr?.fullName || ""} onChange={(e) => setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, fullName: e.target.value } : t) })} className="w-full px-3 py-2 border rounded-lg" />
                <input placeholder="Lavozim" value={tr?.role || ""} onChange={(e) => setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, role: e.target.value } : t) })} className="w-full px-3 py-2 border rounded-lg" />
                <textarea placeholder="Tarjimai hol" rows={4} value={tr?.bio || ""} onChange={(e) => setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, bio: e.target.value } : t) })} className="w-full px-3 py-2 border rounded-lg resize-none" />
              </div>
            );
          })}

          <div className="flex gap-2 mt-4">
            <button onClick={save} className="btn-primary">Saqlash</button>
            <button onClick={() => setForm(null)} className="px-4 py-2 border rounded-lg">Bekor</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm p-6 text-center">
            {item.photo ? <img src={item.photo} alt="" className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" /> : <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-gray-200" />}
            <p className="font-medium">{item.translations?.[0]?.fullName || "—"}</p>
            <p className="text-sm text-gray-500">{item.translations?.[0]?.role || ""}</p>
            <div className="flex justify-center gap-2 mt-3">
              <button onClick={() => openEdit(item)} className="text-blue-500"><HiPencil size={18} /></button>
              <button onClick={() => remove(item.id)} className="text-red-500"><HiTrash size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
