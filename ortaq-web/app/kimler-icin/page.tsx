import type { Metadata } from "next";
import { KimlerIcinView } from "@/components/views/KimlerIcinView";

export const metadata: Metadata = {
  title: "Kimler İçin | ORTAQ",
  description:
    "İhracatçılar, ithalatçılar, satın alma ekipleri, traderlar — aktif ticari işlem yöneten herkes için. Hangi profil sizi tanımlıyor?",
};

export default function KimlerIcinPage() {
  return <KimlerIcinView />;
}
