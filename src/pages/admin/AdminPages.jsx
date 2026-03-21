import { useEffect, useState } from "react";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import api from "../../api";

const LANGS = ["kk_lat", "kk_cyr", "uz", "ru", "en"];
const LANG_LABELS = { kk_lat: "QQ Lat", kk_cyr: "QQ Кир", uz: "UZ", ru: "RU", en: "EN" };

export default function AdminPages() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [activeLang, setActiveLang] = useState("kk_lat");

  const load = () => api.get("/pages/admin/all").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({
      slug: "",
      published: true,
      translations: LANGS.map((lang) => ({ lang, title: "", content: "" })),
      meta: LANGS.map((lang) => ({ lang, metaTitle: "", metaDesc: "" })),
    });
    setEditing(null);
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({
      slug: item.slug,
      published: item.published,
      translations: LANGS.map((lang) => {
        const ex = item.translations.find((t) => t.lang === lang);
        return { lang, title: ex?.title || "", content: ex?.content || "" };
      }),
      meta: LANGS.map((lang) => {
        const ex = item.meta?.find((m) => m.lang === lang);
        return { lang, metaTitle: ex?.metaTitle || "", metaDesc: ex?.metaDesc || "" };
      }),
    });
  };

  const save = async () => {
    try {
      if (editing) await api.put(`/pages/${editing}`, form);
      else await api.post("/pages", form);
      setForm(null);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Xatolik");
    }
  };

  const remove = async (id) => {
    if (!confirm("O'chirmoqchimisiz?")) return;
    await api.delete(`/pages/${id}`);
    load();
  };

  const updateTr = (lang, field, value) => {
    setForm({
      ...form,
      translations: form.translations.map((t) => (t.lang === lang ? { ...t, [field]: value } : t)),
    });
  };

  const updateMeta = (lang, field, value) => {
    setForm({
      ...form,
      meta: form.meta.map((m) => (m.lang === lang ? { ...m, [field]: value } : m)),
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sahifalar</h1>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <HiPlus /> Yangi
        </button>
      </div>

      {form && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Nashr qilingan
            </label>
          </div>

          <div className="flex gap-1 mb-4 border-b">
            {LANGS.map((lang) => (
              <button key={lang} onClick={() => setActiveLang(lang)} className={`px-3 py-2 text-sm font-medium border-b-2 ${activeLang === lang ? "border-primary-500 text-primary-500" : "border-transparent text-gray-500"}`}>
                {LANG_LABELS[lang]}
              </button>
            ))}
          </div>

          {LANGS.filter((l) => l === activeLang).map((lang) => (
            <div key={lang} className="space-y-3">
              <input placeholder="Sarlavha" value={form.translations.find((t) => t.lang === lang)?.title || ""} onChange={(e) => updateTr(lang, "title", e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
              <textarea placeholder="Kontent (HTML)" rows={8} value={form.translations.find((t) => t.lang === lang)?.content || ""} onChange={(e) => updateTr(lang, "content", e.target.value)} className="w-full px-3 py-2 border rounded-lg resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Meta Title" value={form.meta.find((m) => m.lang === lang)?.metaTitle || ""} onChange={(e) => updateMeta(lang, "metaTitle", e.target.value)} className="px-3 py-2 border rounded-lg" />
                <input placeholder="Meta Description" value={form.meta.find((m) => m.lang === lang)?.metaDesc || ""} onChange={(e) => updateMeta(lang, "metaDesc", e.target.value)} className="px-3 py-2 border rounded-lg" />
              </div>
            </div>
          ))}

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
              <th className="text-left px-4 py-3">Sahifa</th>
              <th className="text-left px-4 py-3">Slug</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.translations?.[0]?.title || "—"}</td>
                <td className="px-4 py-3 text-gray-500">{item.slug}</td>
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
