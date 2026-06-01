import { WorkspaceView } from "@/components/views/WorkspaceView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alanınız | ORTAQ",
  description: "İzleme listesi ve ilgi bildirimleri. Yatırım hesabı değil; araştırma çalışma alanı.",
  robots: { index: false, follow: true },
};

export default function WorkspacePage() {
  return <WorkspaceView />;
}
