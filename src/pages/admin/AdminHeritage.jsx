import { useEffect, useState } from "react";
import { HiPlus, HiPencil, HiTrash, HiGlobe, HiLocationMarker } from "react-icons/hi";
import api from "../../api";
import Drawer from "../../components/admin/Drawer";
import LangTabs, { LANGS } from "../../components/admin/LangTabs";
import { Field, inputClass, selectClass } from "../../components/admin/FormField";
import ImageUpload from "../../components/admin/ImageUpload";
import RichEditor from "../../components/admin/RichEditor";

export default function AdminHeritage() {
  const [items, setItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [activeLang, setActiveLang] = useState("kk_lat");

  const load = () => api.get("/heritage").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ slug: "", image: "", lat: "", lng: "", category: "historical", translations: LANGS.map((lang) => ({ lang, title: "", description: "" })) }); setEditing(null); setDrawerOpen(true); };
  const openEdit = (item) => {
    setEditing(item.id);
    setForm({ slug: item.slug, image: item.image || "", lat: item.lat || "", lng: item.lng || "", category: item.category, translations: LANGS.map((lang) => { const ex = item.translations.find((t) => t.lang === lang); return { lang, title: ex?.title || "", description: ex?.description || "" }; }) });
    setDrawerOpen(true);
  };
  const save = async () => { try { const data = { ...form, lat: form.lat ? Number(form.lat) : null, lng: form.lng ? Number(form.lng) : null }; if (editing) await api.put(`/heritage/${editing}`, data); else await api.post("/heritage", data); setDrawerOpen(false); load(); } catch (err) { alert(err.response?.data?.error || "Xatolik"); } };
  const remove = async (id) => { if (!confirm("O'chirmoqchimisiz?")) return; await api.delete(`/heritage/${id}`); load(); };
  const updateTr = (lang, field, value) => { setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, [field]: value } : t) }); };

  const catLabels = { historical: "Tarixiy joy", monument: "Yodgorlik", tradition: "An'ana", cuisine: "Oshxona" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Meros</h1><p className="text-sm text-gray-500 mt-1">{items.length} ta</p></div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800"><HiPlus className="w-4 h-4" /> Yangi</button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {items.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 group">
                {item.image ? <img src={item.image} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0 border" /> : <div className="w-16 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><HiGlobe className="w-5 h-5 text-gray-300" /></div>}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.translations?.[0]?.title || "—"}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{item.slug}</span>
                    {item.lat && <span className="text-xs text-gray-400 flex items-center gap-0.5"><HiLocationMarker className="w-3 h-3" /> Geolokatsiya</span>}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gray-50 text-gray-600 border border-gray-200">{catLabels[item.category] || item.category}</span>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><HiPencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(item.id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600"><HiTrash className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : <div className="py-16 text-center"><HiGlobe className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-400 text-sm">Meros yo'q</p></div>}
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? "Tahrirlash" : "Yangi meros"} wide>
        {form && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Slug"><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} /></Field>
              <Field label="Kategoriya"><select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={selectClass}><option value="historical">Tarixiy joy</option><option value="monument">Yodgorlik</option><option value="tradition">An'ana</option><option value="cuisine">Oshxona</option></select></Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Latitude"><input value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} className={inputClass} placeholder="42.46" /></Field>
              <Field label="Longitude"><input value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} className={inputClass} placeholder="59.60" /></Field>
            </div>
            <ImageUpload value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            <div className="border-t pt-5"><LangTabs activeLang={activeLang} onChange={setActiveLang} /></div>
            {LANGS.filter((l) => l === activeLang).map((lang) => {
              const tr = form.translations.find((t) => t.lang === lang);
              return (<div key={lang} className="space-y-4"><Field label="Nomi"><input value={tr?.title || ""} onChange={(e) => updateTr(lang, "title", e.target.value)} className={inputClass} /></Field><Field label="Tavsif"><RichEditor value={tr?.description || ""} onChange={(val) => updateTr(lang, "description", val)} /></Field></div>);
            })}
            <div className="flex gap-3 pt-4 border-t pt-4">
              <button onClick={save} className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800">{editing ? "Saqlash" : "Yaratish"}</button>
              <button onClick={() => setDrawerOpen(false)} className="px-4 py-2.5 border border-gray-200 text-sm rounded-xl hover:bg-gray-50">Bekor</button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
