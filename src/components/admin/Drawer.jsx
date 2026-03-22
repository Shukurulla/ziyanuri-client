import { useEffect } from "react";
import { HiX } from "react-icons/hi";

export default function Drawer({ open, onClose, title, children, wide }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-[5vh]">
        <div className={`bg-white rounded-2xl shadow-2xl w-full flex flex-col my-auto ${wide ? "max-w-4xl" : "max-w-2xl"}`}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
              <HiX className="w-5 h-5" />
            </button>
          </div>
          <div className="px-6 py-5 overflow-y-auto max-h-[75vh]">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
