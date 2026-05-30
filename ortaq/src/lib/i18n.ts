import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import tr from "../locales/tr.json";
import en from "../locales/en.json";

export const defaultLocale = "tr";

i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: tr },
    en: { translation: en },
  },
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  interpolation: { escapeValue: false },
});

export default i18n;

export function setLocale(locale: "tr" | "en") {
  void i18n.changeLanguage(locale);
  document.documentElement.lang = locale;
}

export function toggleLocale() {
  const next = i18n.language === "tr" ? "en" : "tr";
  setLocale(next);
}
