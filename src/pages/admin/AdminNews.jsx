import { useEffect, useState } from "react";
import { HiPlus, HiPencil, HiTrash, HiEye, HiSearch, HiNewspaper } from "react-icons/hi";
import api from "../../api";
import Drawer from "../../components/admin/Drawer";
import LangTabs, { LANGS } from "../../components/admin/LangTabs";
import { Field, inputClass } from "../../components/admin/FormField";
import ImageUpload from "../../components/admin/ImageUpload";
import RichEditor from "../../components/admin/RichEditor";
import { toSlug } from "../../components/admin/SlugField";
import ConfirmModal from "../../components/admin/ConfirmModal";
import { useToast } from "../../components/admin/Toast";

export default function AdminNews() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [activeLang, setActiveLang] = useState("kk_lat");
  const [preview, setPreview] = useState(null);
  const toast = useToast();
  const [confirmState, setConfirmState] = useState({ open: false, id: null });

  const load = () => api.get("/news/admin/all").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm({ slug: "", image: "", published: false, publishedAt: "", translations: LANGS.map((lang) => ({ lang, title: "", summary: "", content: "" })) });
    setEditing(null); setDrawerOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setForm({
      slug: item.slug, image: item.image || "", published: item.published,
      publishedAt: item.publishedAt ? item.publishedAt.slice(0, 10) : "",
      translations: LANGS.map((lang) => { const ex = item.translations.find((t) => t.lang === lang); return { lang, title: ex?.title || "", summary: ex?.summary || "", content: ex?.content || "" }; }),
    });
    setDrawerOpen(true);
  };

  const save = async () => {
    try {
      const data = { ...form, slug: form.slug || toSlug(form.translations?.find(t => t.lang === "kk_lat")?.title || form.translations?.[0]?.title || "") };
      if (editing) await api.put(`/news/${editing}`, data); else await api.post("/news", data);
      toast.success("Saqlandi"); setDrawerOpen(false); setForm(null); load();
    } catch (err) { toast.error(err.response?.data?.error || "Xatolik"); }
  };

  const askRemove = (id) => setConfirmState({ open: true, id });
  const doRemove = async () => {
    try { await api.delete(`/news/${confirmState.id}`); toast.success("O'chirildi"); load(); } catch { toast.error("O'chirishda xatolik"); }
    setConfirmState({ open: false, id: null });
  };

  const updateTr = (lang, field, value) => {
    setForm({ ...form, translations: form.translations.map((t) => t.lang === lang ? { ...t, [field]: value } : t) });
  };

  const filtered = items.filter((n) => !search || (n.translations?.[0]?.title?.toLowerCase() || "").includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Yangiliklar</h1><p className="text-sm text-gray-500 mt-1">{items.length} ta</p></div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800"><HiPlus className="w-4 h-4" /> Yangi</button>
      </div>

      <div className="relative">
        <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Qidirish..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gray-900/10" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {filtered.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filtered.map((item) => (
              <div key={item._id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 group">
                {item.image ? <img src={item.image} alt="" className="w-16 h-12 rounded-lg object-cover shrink-0 border" /> : <div className="w-16 h-12 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"><HiNewspaper className="w-5 h-5 text-gray-300" /></div>}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.translations?.[0]?.title || "—"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.slug} {item.publishedAt && `· ${new Date(item.publishedAt).toLocaleDateString()}`}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${item.published ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>{item.published ? "Nashr" : "Qoralama"}</span>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setPreview(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><HiEye className="w-4 h-4" /></button>
                  <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><HiPencil className="w-4 h-4" /></button>
                  <button onClick={() => askRemove(item._id)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600"><HiTrash className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center"><HiNewspaper className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-400 text-sm">{search ? "Natija topilmadi" : "Yangiliklar yo'q"}</p></div>
        )}
      </div>

      <Drawer open={!!preview} onClose={() => setPreview(null)} title="Ko'rish" wide>
        {preview && (
          <div className="space-y-4">
            {preview.image && <img src={preview.image} alt="" className="w-full rounded-xl max-h-64 object-cover" />}
            {preview.translations?.map((tr) => (
              <div key={tr.lang} className="p-4 bg-gray-50 rounded-xl">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{tr.lang}</span>
                <h3 className="font-semibold text-gray-900 mt-1">{tr.title || "—"}</h3>
                {tr.summary && <p className="text-sm text-gray-500 mt-1">{tr.summary}</p>}
                {tr.content && <div className="mt-2 text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: tr.content }} />}
              </div>
            ))}
          </div>
        )}
      </Drawer>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing ? "Tahrirlash" : "Yangi yangilik"} wide>
        {form && (
          <div className="space-y-5">
            <Field label="Sana"><input type="date" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} className={inputClass} /></Field>
            <ImageUpload value={form.image} onChange={(v) => setForm({ ...form, image: v })} />
            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary-500" />
              <div><span className="text-sm font-medium text-gray-700">Nashr qilish</span><p className="text-xs text-gray-400">Saytda ko'rsatish</p></div>
            </label>
            <div className="border-t pt-5"><LangTabs activeLang={activeLang} onChange={setActiveLang} /></div>
            {LANGS.filter((l) => l === activeLang).map((lang) => {
              const tr = form.translations.find((t) => t.lang === lang);
              return (
                <div key={lang} className="space-y-4">
                  <Field label="Sarlavha"><input value={tr?.title || ""} onChange={(e) => updateTr(lang, "title", e.target.value)} className={inputClass} /></Field>
                  <Field label="Qisqa tavsif"><textarea rows={2} value={tr?.summary || ""} onChange={(e) => updateTr(lang, "summary", e.target.value)} className={`${inputClass} resize-none`} /></Field>
                  <Field label="To'liq matn"><RichEditor value={tr?.content || ""} onChange={(val) => updateTr(lang, "content", val)} /></Field>
                </div>
              );
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
