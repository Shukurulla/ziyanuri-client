import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HiGlobeAlt } from "react-icons/hi";

const languages = [
  { code: "kk_cyr", label: "Қарақалпақша" },
  { code: "uz", label: "O'zbekcha" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
];

export default function LangSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current =
    languages.find((l) => l.code === i18n.language) || languages[0];

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
      >
        <HiGlobeAlt size={16} />
        <span className="hidden sm:inline">{current.label}</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => changeLang(l.code)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                l.code === i18n.language
                  ? "text-primary-500 font-medium"
                  : "text-gray-700"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
