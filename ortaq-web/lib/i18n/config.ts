import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import tr from "@/locales/tr.json";
import en from "@/locales/en.json";

export const defaultLocale = "tr" as const;
export type Locale = "tr" | "en";

const resources = {
  tr: { translation: tr },
  en: { translation: en },
};

let initialized = false;

export function initI18n() {
  if (initialized || i18n.isInitialized) return i18n;

  const saved =
    typeof window !== "undefined"
      ? (localStorage.getItem("ortaq-lang") as Locale | null)
      : null;

  void i18n.use(initReactI18next).init({
    resources,
    lng: saved ?? defaultLocale,
    fallbackLng: defaultLocale,
    interpolation: { escapeValue: false },
  });

  initialized = true;
  return i18n;
}

export function setLocale(locale: Locale) {
  initI18n();
  void i18n.changeLanguage(locale);
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
    localStorage.setItem("ortaq-lang", locale);
  }
}

export function toggleLocale() {
  const current = i18n.language as Locale;
  setLocale(current === "tr" ? "en" : "tr");
}

export function currentLocale(): Locale {
  return (i18n.language ?? defaultLocale) as Locale;
}

export default i18n;
