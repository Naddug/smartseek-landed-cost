import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

// Inline the English bundle so the first paint never waits on a network round-trip.
// Non-EN visitors get this as their fallback while their locale fetches in the background.
import enTranslation from "../../public/locales/en/translation.json";

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

const isDev = import.meta.env.DEV;

// Injected at build time — busts browser/CDN cache when locale JSON changes.
declare const __LOCALE_VERSION__: string;
const localeVersion = typeof __LOCALE_VERSION__ !== "undefined" ? __LOCALE_VERSION__ : "dev";

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // EN is pre-bundled; HttpBackend serves the remaining locales.
    // partialBundledLanguages tells i18next not to re-fetch what's already inlined
    // and to merge backend results with bundled resources for the same language.
    resources: {
      en: { translation: enTranslation },
    },
    partialBundledLanguages: true,
    fallbackLng: "en",
    supportedLngs: [...LANGUAGES],
    ns: ["translation"],
    defaultNS: "translation",
    backend: {
      loadPath: `/locales/{{lng}}/translation.json?v=${localeVersion}`,
    },
    interpolation: { escapeValue: false },
    detection: {
      order: ["querystring", "localStorage", "navigator", "htmlTag"],
      lookupQuerystring: "lang",
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
    react: {
      // Suspense is the contract. <Suspense> boundary in main.tsx catches the
      // (rare) case where even EN fails to load synchronously. With EN inlined,
      // t() resolves immediately for EN visitors and falls back to EN for non-EN
      // visitors during the background fetch, so the boundary is belt-and-suspenders.
      useSuspense: true,
    },
    // Observability for missing-key regressions. We still return the key (default
    // i18next behavior) to remain visible in QA, but every miss is logged.
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

// Update html lang attribute when language changes
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  // RTL is not needed for the 5 production languages; keep hook for safety
  document.documentElement.dir = "ltr";
});

export default i18n;
