import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-slate-900">{t("notFound.title")}</h1>
          </div>

          <p className="mt-4 text-sm text-slate-600">
            {t("notFound.body")}
          </p>
          <div className="mt-6 grid gap-2">
            <Link href="/" className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 text-center">
              {t("notFound.home")}
            </Link>
            <Link href="/search" className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 text-center">
              {t("notFound.search")}
            </Link>
            <Link href="/rfq/new" className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 text-center">
              {t("notFound.rfq")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
