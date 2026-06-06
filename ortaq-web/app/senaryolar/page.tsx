import type { Metadata } from "next";
import { SenaryolarView } from "@/components/views/SenaryolarView";

export const metadata: Metadata = {
  title: "Kullanım Senaryoları | ORTAQ",
  description:
    "SGS bekleniyor, sözleşme versiyonu çakışıyor, LC süreci uzuyor — ORTAQ tam olarak bu durumlarda kullanılır. 7 gerçek senaryo.",
};

export default function SenaryolarPage() {
  return <SenaryolarView />;
}
