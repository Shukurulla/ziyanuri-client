import { useState } from "react";

const LANGS = ["kk_cyr", "uz", "ru", "en"];
const LANG_LABELS = {
  kk_cyr: "QQ Кир",
  uz: "O'zbekcha",
  ru: "Русский",
  en: "English",
};

export { LANGS, LANG_LABELS };

export default function LangTabs({ activeLang, onChange }) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
      {LANGS.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onChange(lang)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeLang === lang
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {LANG_LABELS[lang]}
        </button>
      ))}
    </div>
  );
}
