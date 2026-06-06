import type { Metadata } from "next";
import { DemoPageView } from "@/components/views/DemoPageView";

export const metadata: Metadata = {
  title: "Demo İsteyin — ORTAQ | Aktif İşleminizi Birlikte İnceleyelim",
  description:
    "30 dakikalık demo. Kendi aktif ticari işleminizi getirin. Karşı tarafı nasıl eklediğinizi, belge ve onay sürecini nasıl yönettiğinizi birlikte görün.",
};

export default function DemoPage() {
  return <DemoPageView />;
}
