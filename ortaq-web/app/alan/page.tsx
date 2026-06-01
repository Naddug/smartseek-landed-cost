import { WorkspaceView } from "@/components/views/WorkspaceView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Listem | ORTAQ",
  description: "Takip ettiğin şirketler ve bıraktığın notlar. Portföy hesabı değil.",
  robots: { index: false, follow: true },
};

export default function WorkspacePage() {
  return <WorkspaceView />;
}
