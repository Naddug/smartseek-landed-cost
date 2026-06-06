import type { Metadata } from "next";
import { CorridorDetailView } from "@/components/views/CorridorDetailView";

export const metadata: Metadata = {
  title: "Türkiye ↔ Avrupa Koridoru — ORTAQ",
  description:
    "Türkiye'den Almanya, Hollanda, İtalya ve Polonya'ya ihracat iş akışı. EUR.1, A.TR, CE belgesi ve CMR gereksinimleri.",
};

export default function TurkeyEuropePage() {
  return <CorridorDetailView corridor="europe" />;
}
