import { useEffect, useState } from "react";
import { HiPlus, HiPencil, HiTrash, HiUserGroup } from "react-icons/hi";
import api from "../../api";
import Drawer from "../../components/admin/Drawer";
import LangTabs, { LANGS } from "../../components/admin/LangTabs";
import { Field, inputClass } from "../../components/admin/FormField";
import ImageUpload from "../../components/admin/ImageUpload";
import RichEditor from "../../components/admin/RichEditor";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { useToast } from "../../components/admin/Toast";

export default function AdminLeaders() {
  const [items, setItems] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [activeLang, setActiveLang] = useState("kk_cyr");
  const toast = useToast();
  const [confirmState, setConfirmState] = useState({ open: false, id: null });

  const load = () => api.get("/leaders").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ photo: "", position: 0, translations: LANGS.map((lang) => ({ lang, fullName: "", role: "", bio: "" })) }); setEditing(null); setDrawerOpen(true); };
  const openEdit = (item) => {
    setEditing(item._id);
    setForm({ photo: item.photo || "", position: item.position, translations: LANGS.map((lang) => { const ex = item.translations.find((t) => t.lang === lang); return { lang, fullName: ex?.fullName || "", role: ex?.role || "", bio: ex?.bio || "" }; }) });
    setDrawerOpen(true);
  };
  const save = async () => { try { if (editing) await api.put(`/leaders/${editing}`, form); else await api.post("/leaders", form); toast.success("Saqlandi"); setDrawerOpen(false); load(); } catch (err) { toast.error(err.response?.data?.error || "Xatolik"); } };
  const askRemove = (id) => setConfirmState({ open: true, id });
  const doRemove = async () => {
    try { await api.delete(`/leaders/${confirmState.id}`); toast.success("O'chirildi"); load(); } catch { toast.error("O'chirishda xatolik"); }
    setConfirmState({ open: false, id: null });
  };
  const updateTr = (lang, field, value) => { setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, [field]: value } : t) }); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Rahbariyat</h1><p className="text-sm text-gray-500 mt-1">{items.length} ta</p></div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800"><HiPlus className="w-4 h-4" /> Yangi</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div key={item._id} className="bg-white rounded-2xl border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
            {item.photo ? <img src={item.photo} alt="" className="w-24 h-24 rounded-2xl mx-auto object-cover border-2 border-gray-100" /> : <div className="w-24 h-24 rounded-2xl mx-auto bg-gray-100 flex items-center justify-center"><HiUserGroup className="w-8 h-8 text-gray-300" /></div>}
            <h3 className="font-semibold text-gray-900 mt-4">{item.translations?.[0]?.fullName || "—"}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{item.translations?.[0]?.role || ""}</p>
            {item.translations?.[0]?.bio && <p className="text-xs text-gray-400 mt-2 line-clamp-2">{item.translations[0].bio}</p>}
            <div className="flex gap-1 mt-4 pt-3 border-t border-gray-100 justify-center">
              <button onClick={() => openEdit(item)} className="py-1.5 px-4 text-xs font-medium text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1"><HiPencil className="w-3.5 h-3.5" /> Tahrirlash</button>
              <button onClick={() => askRemove(item._id)} className="py-1.5 px-3 text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><HiTrash className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full py-16 text-center"><HiUserGroup className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-400 text-sm">Rahbarlar yo'q</p></div>}
      </div>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? "Tahrirlash" : "Yangi rahbar"}>
        {form && (
          <div className="space-y-5">
            <ImageUpload value={form.photo} onChange={(v) => setForm({ ...form, photo: v })} label="Foto" />
            <Field label="Pozitsiya (tartib)"><input type="number" value={form.position} onChange={(e) => setForm({ ...form, position: Number(e.target.value) })} className={inputClass} /></Field>
            <div className="border-t pt-5"><LangTabs activeLang={activeLang} onChange={setActiveLang} /></div>
            {LANGS.filter((l) => l === activeLang).map((lang) => {
              const tr = form.translations.find((t) => t.lang === lang);
              return (<div key={lang} className="space-y-4"><Field label="To'liq ism"><input value={tr?.fullName || ""} onChange={(e) => updateTr(lang, "fullName", e.target.value)} className={inputClass} /></Field><Field label="Lavozim"><input value={tr?.role || ""} onChange={(e) => updateTr(lang, "role", e.target.value)} className={inputClass} /></Field><Field label="Tarjimai hol"><RichEditor value={tr?.bio || ""} onChange={(val) => updateTr(lang, "bio", val)} /></Field></div>);
            })}
            <div className="flex gap-3 pt-4 border-t pt-4">
              <button onClick={save} className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800">{editing ? "Saqlash" : "Yaratish"}</button>
              <button onClick={() => setDrawerOpen(false)} className="px-4 py-2.5 border border-gray-200 text-sm rounded-xl hover:bg-gray-50">Bekor</button>
            </div>
          </div>
        )}
      </Drawer>
      <ConfirmModal open={confirmState.open} onClose={() => setConfirmState({ open: false, id: null })} onConfirm={doRemove} title="O'chirish" message="Haqiqatan ham o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi." />
    </div>
  );
}
