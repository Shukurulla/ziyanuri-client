import { HiExclamation, HiX } from "react-icons/hi";

export default function ConfirmModal({ open, onClose, onConfirm, title, message, type = "danger" }) {
  if (!open) return null;

  const colors = {
    danger: { icon: "bg-red-100 text-red-600", btn: "bg-red-600 hover:bg-red-700" },
    warning: { icon: "bg-amber-100 text-amber-600", btn: "bg-amber-600 hover:bg-amber-700" },
    info: { icon: "bg-blue-100 text-blue-600", btn: "bg-blue-600 hover:bg-blue-700" },
  };
  const c = colors[type] || colors.danger;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[80]" onClick={onClose} />
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
              <HiExclamation className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900">{title || "Tasdiqlash"}</h3>
              <p className="text-sm text-gray-500 mt-1">{message || "Davom etmoqchimisiz?"}</p>
            </div>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 shrink-0">
              <HiX className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={onConfirm} className={`flex-1 px-4 py-2.5 text-white text-sm font-medium rounded-xl transition-colors ${c.btn}`}>
              Ha, davom etish
            </button>
            <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 text-sm font-medium rounded-xl hover:bg-gray-50 text-gray-700">
              Bekor qilish
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
