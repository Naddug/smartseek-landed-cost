import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// Top languages shown first in UI
export const TOP_LANGUAGES = ["en", "zh", "tr", "ru", "es", "fr"];

// All supported languages
const ALL_LANG_CODES = [
  ...TOP_LANGUAGES,
  "de", "ar", "ja", "pt", "ko", "it", "nl", "pl", "vi", "id", "hi", "bn", "uk", "cs", "el", "hu", "ro", "sv", "da", "fi", "no", "he", "fa",
  "ms", "ta", "te", "mr", "gu", "kn", "ml", "pa", "si", "my", "km", "lo", "ne", "ur", "sw",
  "am", "ha", "yo", "ig", "zu", "af", "sq", "hy", "az", "be", "bs", "bg", "hr", "ka", "mk",
  "sr", "sk", "sl", "et", "lv", "lt", "mt", "cy", "ga", "is", "lb",
];
export const LANGUAGES = Array.from(new Set(ALL_LANG_CODES));

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: LANGUAGES,
    ns: ["translation"],
    defaultNS: "translation",
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    interpolation: { escapeValue: false },
    detection: {
      order: ["querystring", "localStorage", "navigator", "htmlTag"],
      lookupQuerystring: "lang",
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
  });

// Update html lang and dir (RTL for Arabic) when language changes
i18n.on("languageChanged", (lng) => {
  const html = document.documentElement;
  const code = lng.split("-")[0];
  html.lang = lng;
  html.dir = code === "ar" ? "rtl" : "ltr";
});

export default i18n;
