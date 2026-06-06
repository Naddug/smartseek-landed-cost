import type { Metadata } from "next";
import { FiyatPageView } from "@/components/views/FiyatPageView";

export const metadata: Metadata = {
  title: "Fiyatlandırma — ORTAQ | Şeffaf Ücretlendirme",
  description:
    "ORTAQ nasıl fiyatlandırılır? Gizli ücret yok. İşlem başına ek maliyet yok. Şirketinize göre aylık sabit ücret. Demo görüşmesinde net rakam.",
};

export default function FiyatPage() {
  return <FiyatPageView />;
}
