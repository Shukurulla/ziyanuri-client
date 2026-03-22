import { createContext, useContext, useState, useCallback } from "react";
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiX } from "react-icons/hi";

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const toast = {
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    info: (msg) => addToast(msg, "info"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-lg border border-gray-100 min-w-[280px] animate-fade-in-up"
          >
            {t.type === "success" && <HiCheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />}
            {t.type === "error" && <HiXCircle className="w-5 h-5 text-red-500 shrink-0" />}
            {t.type === "info" && <HiInformationCircle className="w-5 h-5 text-blue-500 shrink-0" />}
            <p className="text-sm text-gray-700 flex-1">{t.message}</p>
            <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))} className="text-gray-400 hover:text-gray-600 shrink-0">
              <HiX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
