import { useEffect, useState } from "react";
import { HiPencil, HiChartBar } from "react-icons/hi";
import api from "../../api";
import Drawer from "../../components/admin/Drawer";
import { LANGS, LANG_LABELS } from "../../components/admin/LangTabs";
import { Field, inputClass } from "../../components/admin/FormField";

export default function AdminStats() {
  const [stats, setStats] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const load = () => api.get("/stats").then((r) => setStats(r.data));
  useEffect(() => { load(); }, []);

  const openEdit = (stat) => {
    setEditing(stat._id);
    setForm({ key: stat.key, value: stat.value, translations: LANGS.map((lang) => { const ex = stat.translations?.find((t) => t.lang === lang); return { lang, label: ex?.label || "" }; }) });
    setDrawerOpen(true);
  };
  const save = async () => { try { await api.put(`/stats/${editing}`, form); setDrawerOpen(false); load(); } catch (err) { alert(err.response?.data?.error || "Xatolik"); } };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Statistika</h1><p className="text-sm text-gray-500 mt-1">Raqamli ko'rsatkichlar</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s._id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 bg-accent-50 rounded-xl flex items-center justify-center"><HiChartBar className="w-5 h-5 text-accent-600" /></div>
              <button onClick={() => openEdit(s)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-300 group-hover:text-gray-500 transition-colors"><HiPencil className="w-4 h-4" /></button>
            </div>
            <p className="text-3xl font-bold text-gray-900 mt-4">{s.value}<span className="text-accent-500">+</span></p>
            <p className="text-sm text-gray-500 mt-1">{s.translations?.[0]?.label || s.key}</p>
          </div>
        ))}
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Statistikani tahrirlash">
        {form && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Kalit"><input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} className={inputClass} readOnly /></Field>
              <Field label="Qiymat"><input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className={inputClass} /></Field>
            </div>
            <div className="border-t pt-5 space-y-3">
              <p className="text-sm font-medium text-gray-700">Til bo'yicha nom</p>
              {LANGS.map((lang) => {
                const tr = form.translations.find((t) => t.lang === lang);
                return (
                  <Field key={lang} label={LANG_LABELS[lang]}>
                    <input value={tr?.label || ""} onChange={(e) => setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, label: e.target.value } : t) })} className={inputClass} />
                  </Field>
                );
              })}
            </div>
            <div className="flex gap-3 pt-4 border-t pt-4">
              <button onClick={save} className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800">Saqlash</button>
              <button onClick={() => setDrawerOpen(false)} className="px-4 py-2.5 border border-gray-200 text-sm rounded-xl hover:bg-gray-50">Bekor</button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
