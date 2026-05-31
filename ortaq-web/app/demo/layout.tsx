import type { ReactNode } from "react";
import { DemoNav } from "@/components/demo/DemoNav";
import { DemoProvider } from "@/lib/demo/store";

export const metadata = { title: "ORTAQ · Ürün demosu", robots: { index: false, follow: false } };

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <DemoProvider>
      <div className="min-h-screen bg-ortaq-bg">
        <DemoNav />
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">{children}</main>
      </div>
    </DemoProvider>
  );
}
