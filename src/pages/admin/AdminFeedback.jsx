import { useEffect, useState } from "react";
import { HiMail, HiMailOpen } from "react-icons/hi";
import api from "../../api";

export default function AdminFeedback() {
  const [items, setItems] = useState([]);

  const load = () => api.get("/feedback").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await api.patch(`/feedback/${id}/read`);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Xabarlar</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className={`bg-white rounded-xl p-5 shadow-sm ${!item.read ? "border-l-4 border-primary-500" : ""}`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  {item.read ? <HiMailOpen className="text-gray-400" /> : <HiMail className="text-primary-500" />}
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500">{item.email} {item.phone && `| ${item.phone}`}</p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(item.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-3 text-gray-700">{item.message}</p>
            {!item.read && (
              <button onClick={() => markRead(item.id)} className="text-sm text-primary-500 hover:underline mt-3">
                O'qildi deb belgilash
              </button>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 text-gray-400">Xabarlar yo'q</div>
        )}
      </div>
    </div>
  );
}
