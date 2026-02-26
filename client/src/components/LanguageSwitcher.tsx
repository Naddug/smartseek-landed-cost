import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LANGUAGES } from "@/lib/i18n";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English", tr: "Türkçe", es: "Español", ru: "Русский", zh: "中文", th: "ไทย",
  fr: "Français", ar: "العربية", de: "Deutsch", ja: "日本語", ko: "한국어", pt: "Português",
  it: "Italiano", nl: "Nederlands", pl: "Polski", vi: "Tiếng Việt", id: "Bahasa Indonesia",
  hi: "हिन्दी", bn: "বাংলা", uk: "Українська", he: "עברית", fa: "فارسی", ms: "Bahasa Melayu",
};

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{LANGUAGE_NAMES[i18n.language?.split("-")[0]] || i18n.language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[70vh] overflow-y-auto w-52">
        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Language
        </div>
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => i18n.changeLanguage(lang)}
            className={i18n.language?.startsWith(lang) ? "bg-accent" : ""}
          >
            {LANGUAGE_NAMES[lang] || lang}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
