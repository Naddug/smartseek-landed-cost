import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// All six production locales are bundled at build time so deploys always ship
// matching copy — no stale HttpBackend /locales/*.json cache on clients.
import enTranslation from "../../public/locales/en/translation.json";
import trTranslation from "../../public/locales/tr/translation.json";
import esTranslation from "../../public/locales/es/translation.json";
import zhTranslation from "../../public/locales/zh/translation.json";
import jaTranslation from "../../public/locales/ja/translation.json";
import ruTranslation from "../../public/locales/ru/translation.json";

export const LANGUAGES = ["en", "es", "zh", "ja", "ru", "tr"] as const;
export type SupportedLang = (typeof LANGUAGES)[number];

export const LANGUAGE_NAMES: Record<SupportedLang, string> = {
  en: "English",
  es: "Español",
  zh: "中文",
  ja: "日本語",
  ru: "Русский",
  tr: "Türkçe",
};

const isDev = import.meta.env.DEV;

declare const __LOCALE_VERSION__: string;
const localeVersion = typeof __LOCALE_VERSION__ !== "undefined" ? __LOCALE_VERSION__ : "dev";

const LOCALE_VERSION_KEY = "smartseek_locale_bundle_version";
if (typeof window !== "undefined") {
  const prev = localStorage.getItem(LOCALE_VERSION_KEY);
  if (prev && prev !== localeVersion) {
    // New deploy — drop any cached i18next resource state from older builds.
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("i18next_res_")) localStorage.removeItem(key);
    });
  }
  localStorage.setItem(LOCALE_VERSION_KEY, localeVersion);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      tr: { translation: trTranslation },
      es: { translation: esTranslation },
      zh: { translation: zhTranslation },
      ja: { translation: jaTranslation },
      ru: { translation: ruTranslation },
    },
    fallbackLng: "en",
    supportedLngs: [...LANGUAGES],
    ns: ["translation"],
    defaultNS: "translation",
    interpolation: { escapeValue: false },
    detection: {
      order: ["querystring", "localStorage", "navigator", "htmlTag"],
      lookupQuerystring: "lang",
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
    react: {
      useSuspense: false,
    },
    parseMissingKeyHandler: (key, defaultValue) => {
      if (isDev) {
        // eslint-disable-next-line no-console
        console.warn(
          `[i18n] Missing key "${key}" for language "${i18n.language}" (fallback "${i18n.options.fallbackLng}")`,
        );
      } else {
        // eslint-disable-next-line no-console
        console.warn(`[i18n] missing key: ${key} (${i18n.language})`);
      }
      return defaultValue ?? key;
    },
  });

i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = "ltr";
});

export default i18n;
