import { useEffect, useState } from "react";
import { HiMail, HiMailOpen, HiPhone, HiClock } from "react-icons/hi";
import api from "../../api";
import Drawer from "../../components/admin/Drawer";

export default function AdminFeedback() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = () => api.get("/feedback").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const markRead = async (id) => { await api.patch(`/feedback/${id}/read`); load(); };

  const unreadCount = items.filter((i) => !i.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Xabarlar</h1>
        <p className="text-sm text-gray-500 mt-1">{items.length} ta xabar {unreadCount > 0 && <span className="text-primary-500">· {unreadCount} o'qilmagan</span>}</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {items.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <div key={item.id} onClick={() => { setSelected(item); if (!item.read) markRead(item.id); }} className={`flex items-start gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors ${!item.read ? "bg-primary-50/30" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${!item.read ? "bg-primary-100 text-primary-600" : "bg-gray-100 text-gray-400"}`}>
                  {!item.read ? <HiMail className="w-5 h-5" /> : <HiMailOpen className="w-5 h-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${!item.read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>{item.name}</p>
                    <span className="text-[11px] text-gray-400 shrink-0 ml-2">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{item.email}</p>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : <div className="py-16 text-center"><HiMail className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-gray-400 text-sm">Xabarlar yo'q</p></div>}
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title="Xabar">
        {selected && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg">
                {selected.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{selected.name}</h3>
                <p className="text-sm text-gray-500">{selected.email}</p>
              </div>
            </div>
            {selected.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600"><HiPhone className="w-4 h-4 text-gray-400" /> {selected.phone}</div>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-400"><HiClock className="w-3.5 h-3.5" /> {new Date(selected.createdAt).toLocaleString()}</div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
