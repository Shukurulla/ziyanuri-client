import { useEffect, useState } from "react";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import api from "../../api";
import ImageUpload from "../../components/admin/ImageUpload";

const LANGS = ["kk_lat", "kk_cyr", "uz", "ru", "en"];
const LANG_LABELS = { kk_lat: "QQ Lat", kk_cyr: "QQ Кир", uz: "UZ", ru: "RU", en: "EN" };

export default function AdminProjects() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(null);
  const [activeLang, setActiveLang] = useState("kk_lat");

  const load = () => api.get("/projects").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ slug: "", image: "", status: "current", translations: LANGS.map((lang) => ({ lang, title: "", description: "", results: "" })) });
    setEditing(null);
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({
      slug: item.slug, image: item.image || "", status: item.status,
      translations: LANGS.map((lang) => {
        const ex = item.translations.find((t) => t.lang === lang);
        return { lang, title: ex?.title || "", description: ex?.description || "", results: ex?.results || "" };
      }),
    });
  };

  const save = async () => {
    try {
      if (editing) await api.put(`/projects/${editing}`, form);
      else await api.post("/projects", form);
      setForm(null);
      load();
    } catch (err) { alert(err.response?.data?.error || "Xatolik"); }
  };

  const remove = async (id) => {
    if (!confirm("O'chirmoqchimisiz?")) return;
    await api.delete(`/projects/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Loyihalar</h1>
        <button onClick={openNew} className="btn-primary flex items-center gap-2"><HiPlus /> Yangi</button>
      </div>

      {form && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <ImageUpload value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="px-3 py-2 border rounded-lg">
              <option value="current">Joriy</option>
              <option value="completed">Tugallangan</option>
            </select>
          </div>

          <div className="flex gap-1 mb-4 border-b">
            {LANGS.map((lang) => (
              <button key={lang} onClick={() => setActiveLang(lang)} className={`px-3 py-2 text-sm font-medium border-b-2 ${activeLang === lang ? "border-primary-500 text-primary-500" : "border-transparent text-gray-500"}`}>{LANG_LABELS[lang]}</button>
            ))}
          </div>

          {LANGS.filter((l) => l === activeLang).map((lang) => {
            const tr = form.translations.find((t) => t.lang === lang);
            return (
              <div key={lang} className="space-y-3">
                <input placeholder="Nomi" value={tr?.title || ""} onChange={(e) => setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, title: e.target.value } : t) })} className="w-full px-3 py-2 border rounded-lg" />
                <textarea placeholder="Tavsif (HTML)" rows={5} value={tr?.description || ""} onChange={(e) => setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, description: e.target.value } : t) })} className="w-full px-3 py-2 border rounded-lg resize-none" />
                <textarea placeholder="Natijalar (HTML)" rows={3} value={tr?.results || ""} onChange={(e) => setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, results: e.target.value } : t) })} className="w-full px-3 py-2 border rounded-lg resize-none" />
              </div>
            );
          })}

          <div className="flex gap-2 mt-4">
            <button onClick={save} className="btn-primary">Saqlash</button>
            <button onClick={() => setForm(null)} className="px-4 py-2 border rounded-lg">Bekor</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Nomi</th>
              <th className="text-left px-4 py-3">Holat</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.translations?.[0]?.title || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${item.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(item)} className="text-blue-500 mr-2"><HiPencil size={18} /></button>
                  <button onClick={() => remove(item.id)} className="text-red-500"><HiTrash size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
