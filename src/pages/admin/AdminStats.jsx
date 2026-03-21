import { useEffect, useState } from "react";
import { HiPencil } from "react-icons/hi";
import api from "../../api";

const LANGS = ["kk_lat", "kk_cyr", "uz", "ru", "en"];

export default function AdminStats() {
  const [stats, setStats] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);

  const load = () => api.get("/stats").then((r) => setStats(r.data));
  useEffect(() => { load(); }, []);

  const openEdit = (stat) => {
    setEditing(stat.id);
    setForm({
      key: stat.key,
      value: stat.value,
      translations: LANGS.map((lang) => {
        const ex = stat.translations?.find((t) => t.lang === lang);
        return { lang, label: ex?.label || "" };
      }),
    });
  };

  const save = async () => {
    try {
      await api.put(`/stats/${editing}`, form);
      setForm(null);
      setEditing(null);
      load();
    } catch (err) { alert(err.response?.data?.error || "Xatolik"); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Statistika</h1>

      {form && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input placeholder="Kalit" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} className="px-3 py-2 border rounded-lg" />
            <input type="number" placeholder="Qiymat" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="px-3 py-2 border rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
            {LANGS.map((lang) => {
              const tr = form.translations.find((t) => t.lang === lang);
              return (
                <input
                  key={lang}
                  placeholder={`Label (${lang})`}
                  value={tr?.label || ""}
                  onChange={(e) => setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, label: e.target.value } : t) })}
                  className="px-3 py-2 border rounded-lg"
                />
              );
            })}
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="btn-primary">Saqlash</button>
            <button onClick={() => { setForm(null); setEditing(null); }} className="px-4 py-2 border rounded-lg">Bekor</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.id} className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-3xl font-bold text-accent-500">{s.value}+</div>
            <div className="text-gray-600 mt-1">{s.translations?.[0]?.label || s.key}</div>
            <button onClick={() => openEdit(s)} className="text-blue-500 mt-3"><HiPencil size={18} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
