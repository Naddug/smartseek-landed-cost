import { TrustDashboardView } from "@/components/views/TrustDashboardView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alanınız | ORTAQ",
  description: "Okuma ilerlemeniz ve süreç durumu. Yatırım hesabı değil.",
  robots: { index: false, follow: true },
};

export default function MemberAreaPage() {
  return <TrustDashboardView />;
}
