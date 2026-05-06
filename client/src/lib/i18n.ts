import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// Production languages — full translation coverage guaranteed for all six
export const LANGUAGES = ["en", "es", "zh", "ja", "ru", "tr"] as const;
export type SupportedLang = (typeof LANGUAGES)[number];

// Display names for the language switcher
export const LANGUAGE_NAMES: Record<SupportedLang, string> = {
  en: "English",
  es: "Español",
  zh: "中文",
  ja: "日本語",
  ru: "Русский",
  tr: "Türkçe",
};

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    supportedLngs: [...LANGUAGES],
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

// Update html lang attribute when language changes
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  // RTL is not needed for the 5 production languages; keep hook for safety
  document.documentElement.dir = "ltr";
});

export default i18n;
