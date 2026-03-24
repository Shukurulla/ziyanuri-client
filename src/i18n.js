import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import kk_lat from "./locales/kk_lat.json";
import kk_cyr from "./locales/kk_cyr.json";
import uz from "./locales/uz.json";
import ru from "./locales/ru.json";
import en from "./locales/en.json";

const savedLang = localStorage.getItem("lang") || "kk_cyr";

i18n.use(initReactI18next).init({
  resources: {
    kk_lat: { translation: kk_lat },
    kk_cyr: { translation: kk_cyr },
    uz: { translation: uz },
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: savedLang,
  fallbackLng: "kk_cyr",
  interpolation: { escapeValue: false },
});

export default i18n;
