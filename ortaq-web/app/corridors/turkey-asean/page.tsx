import type { Metadata } from "next";
import { CorridorDetailView } from "@/components/views/CorridorDetailView";

export const metadata: Metadata = {
  title: "Türkiye ↔ ASEAN Koridoru — ORTAQ",
  description:
    "Türkiye'den Malezya, Singapur, Tayland, Endonezya ve Vietnam'a ihracat iş akışı. Belge gereksinimleri, süre tahminleri ve LOI→Ödeme adımları.",
};

export default function TurkeyAseanPage() {
  return <CorridorDetailView corridor="asean" />;
}
