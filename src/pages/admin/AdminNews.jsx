import { useEffect, useState } from "react";
import { HiPlus, HiPencil, HiTrash } from "react-icons/hi";
import api from "../../api";
import ImageUpload from "../../components/admin/ImageUpload";

const LANGS = ["kk_lat", "kk_cyr", "uz", "ru", "en"];
const LANG_LABELS = { kk_lat: "QQ Lat", kk_cyr: "QQ Кир", uz: "UZ", ru: "RU", en: "EN" };

export default function AdminNews() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);

  const load = () => api.get("/news/admin/all").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({
      slug: "",
      image: "",
      published: false,
      publishedAt: "",
      translations: LANGS.map((lang) => ({ lang, title: "", summary: "", content: "" })),
    });
    setEditing(null);
  };

  const openEdit = (item) => {
    setEditing(item.id);
    setForm({
      slug: item.slug,
      image: item.image || "",
      published: item.published,
      publishedAt: item.publishedAt ? item.publishedAt.slice(0, 10) : "",
      translations: LANGS.map((lang) => {
        const existing = item.translations.find((t) => t.lang === lang);
        return { lang, title: existing?.title || "", summary: existing?.summary || "", content: existing?.content || "" };
      }),
    });
  };

  const save = async () => {
    try {
      if (editing) {
        await api.put(`/news/${editing}`, form);
      } else {
        await api.post("/news", form);
      }
      setForm(null);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Xatolik");
    }
  };

  const remove = async (id) => {
    if (!confirm("O'chirmoqchimisiz?")) return;
    await api.delete(`/news/${id}`);
    load();
  };

  const updateTr = (lang, field, value) => {
    setForm({
      ...form,
      translations: form.translations.map((t) => (t.lang === lang ? { ...t, [field]: value } : t)),
    });
  };

  const [activeLang, setActiveLang] = useState("kk_lat");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Yangiliklar</h1>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <HiPlus /> Yangi
        </button>
      </div>

      {form && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="font-semibold text-lg mb-4">{editing ? "Tahrirlash" : "Yangi yangilik"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              placeholder="Slug (masalan: yangilik-1)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <ImageUpload value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            <input
              type="date"
              value={form.publishedAt}
              onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
              className="px-3 py-2 border rounded-lg"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              Nashr qilingan
            </label>
          </div>

          {/* Language tabs */}
          <div className="flex gap-1 mb-4 border-b">
            {LANGS.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-3 py-2 text-sm font-medium border-b-2 ${
                  activeLang === lang ? "border-primary-500 text-primary-500" : "border-transparent text-gray-500"
                }`}
              >
                {LANG_LABELS[lang]}
              </button>
            ))}
          </div>

          {LANGS.filter((l) => l === activeLang).map((lang) => {
            const tr = form.translations.find((t) => t.lang === lang);
            return (
              <div key={lang} className="space-y-3">
                <input
                  placeholder="Sarlavha"
                  value={tr?.title || ""}
                  onChange={(e) => updateTr(lang, "title", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <input
                  placeholder="Qisqa tavsif"
                  value={tr?.summary || ""}
                  onChange={(e) => updateTr(lang, "summary", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="To'liq matn (HTML)"
                  rows={6}
                  value={tr?.content || ""}
                  onChange={(e) => updateTr(lang, "content", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg resize-none"
                />
              </div>
            );
          })}

          <div className="flex gap-2 mt-4">
            <button onClick={save} className="btn-primary">Saqlash</button>
            <button onClick={() => setForm(null)} className="px-4 py-2 border rounded-lg">Bekor</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">Sarlavha</th>
              <th className="text-left px-4 py-3">Slug</th>
              <th className="text-left px-4 py-3">Holat</th>
              <th className="text-left px-4 py-3">Sana</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.translations?.[0]?.title || "—"}</td>
                <td className="px-4 py-3 text-gray-500">{item.slug}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-xs ${item.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {item.published ? "Nashr" : "Qoralama"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(item)} className="text-blue-500 hover:text-blue-700 mr-2">
                    <HiPencil size={18} />
                  </button>
                  <button onClick={() => remove(item.id)} className="text-red-500 hover:text-red-700">
                    <HiTrash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
