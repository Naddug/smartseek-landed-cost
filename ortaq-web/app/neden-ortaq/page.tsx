import type { Metadata } from "next";
import { NedenOrtaqView } from "@/components/views/NedenOrtaqView";

export const metadata: Metadata = {
  title: "Neden ORTAQ | ORTAQ",
  description:
    "Dış ticaret, satın alma ve üretim deneyimi olan insanlar neden bu sistemi yazdı. SGS, BL, LC, sözleşme — bir işlemin bilgisi neden beş ayrı yere dağılıyor ve ne yapıldı.",
};

export default function NedenOrtaqPage() {
  return <NedenOrtaqView />;
}
