import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import tr from "@/locales/tr.json";

export const defaultLocale = "tr" as const;
export type Locale = "tr";

const resources = {
  tr: { translation: tr },
};

let initialized = false;

export function initI18n() {
  if (initialized || i18n.isInitialized) return i18n;

  void i18n.use(initReactI18next).init({
    resources,
    lng: defaultLocale,
    fallbackLng: defaultLocale,
    interpolation: { escapeValue: false },
  });

  initialized = true;
  return i18n;
}

export function setLocale(locale: Locale) {
  if (locale !== "tr") return;
  initI18n();
  void i18n.changeLanguage("tr");
  if (typeof document !== "undefined") {
    document.documentElement.lang = "tr";
  }
}

/** Locale switching disabled at launch — Turkish only. */
export function toggleLocale() {
  setLocale("tr");
}

export default i18n;
