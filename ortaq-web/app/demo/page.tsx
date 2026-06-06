import type { Metadata } from "next";
import { DemoPageView } from "@/components/views/DemoPageView";

export const metadata: Metadata = {
  title: "Demo Talep Et — ORTAQ",
  description:
    "ORTAQ İşlem Odası için demo talep edin. Ekibimiz 24 saat içinde size ulaşır.",
};

export default function DemoPage() {
  return <DemoPageView />;
}
