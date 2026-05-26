import { CompaniesListView } from "@/components/views/CompaniesListView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Şirketler | ORTAQ",
  description: "Değerlendirme sürecindeki üretim şirketleri. Simüle edilmiş dosyalar — yatırım teklifi değildir.",
};

export default function CompaniesPage() {
  return <CompaniesListView />;
}
