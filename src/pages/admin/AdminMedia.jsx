import { useEffect, useState } from "react";
import { HiPlus, HiTrash } from "react-icons/hi";
import api from "../../api";

const LANGS = ["kk_lat", "kk_cyr", "uz", "ru", "en"];

export default function AdminMedia() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [filter, setFilter] = useState("photo");

  const load = () => api.get("/media", { params: { type: filter } }).then((r) => setItems(r.data));
  useEffect(() => { load(); }, [filter]);

  const openNew = () => {
    setForm({ type: filter, url: "", category: "general", translations: LANGS.map((lang) => ({ lang, title: "" })) });
  };

  const save = async () => {
    try {
      await api.post("/media", form);
      setForm(null);
      load();
    } catch (err) { alert(err.response?.data?.error || "Xatolik"); }
  };

  const remove = async (id) => {
    if (!confirm("O'chirmoqchimisiz?")) return;
    await api.delete(`/media/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Media</h1>
        <button onClick={openNew} className="btn-primary flex items-center gap-2"><HiPlus /> Yangi</button>
      </div>

      <div className="flex gap-2 mb-6">
        {["photo", "video", "audio", "book"].map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-lg text-sm ${filter === t ? "bg-primary-500 text-white" : "bg-gray-100"}`}>
            {t}
          </button>
        ))}
      </div>

      {form && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="px-3 py-2 border rounded-lg">
              <option value="photo">Foto</option>
              <option value="video">Video</option>
              <option value="audio">Audio</option>
              <option value="book">Kitob</option>
            </select>
            <input placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input placeholder="Kategoriya" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 border rounded-lg" />
          </div>
          <input
            placeholder="Nomi (barcha tillar uchun)"
            value={form.translations[0]?.title || ""}
            onChange={(e) => setForm({ ...form, translations: form.translations.map((t) => ({ ...t, title: e.target.value })) })}
            className="w-full px-3 py-2 border rounded-lg mb-4"
          />
          <div className="flex gap-2">
            <button onClick={save} className="btn-primary">Saqlash</button>
            <button onClick={() => setForm(null)} className="px-4 py-2 border rounded-lg">Bekor</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm p-3">
            {item.type === "photo" && <img src={item.url} alt="" className="w-full h-32 object-cover rounded-lg mb-2" />}
            <p className="text-sm truncate">{item.translations?.[0]?.title || item.url}</p>
            <button onClick={() => remove(item.id)} className="text-red-500 mt-2"><HiTrash size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
