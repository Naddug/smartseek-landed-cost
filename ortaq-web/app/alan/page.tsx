import { WorkspaceView } from "@/components/views/WorkspaceView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Takip listesi | ORTAQ",
  description: "Takip ettiğiniz şirketler ve tanışma talepleri. Yatırım hesabı değildir.",
  robots: { index: false, follow: true },
};

export default function WorkspacePage() {
  return <WorkspaceView />;
}
