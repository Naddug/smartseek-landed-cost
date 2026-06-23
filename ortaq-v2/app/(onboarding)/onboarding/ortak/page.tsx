"use client";

import Link from "next/link";
import { WizardLayout } from "@/components/shared/WizardLayout";
import { WizardStepHeader } from "@/components/shared/WizardStepHeader";
import { ProgressHeader } from "@/components/shared/ProgressHeader";
import { SummarySidebar } from "@/components/shared/SummarySidebar";
import { MultiChoiceGrid } from "@/components/shared/MultiChoiceGrid";
import { Button } from "@/components/ui/button";
import { Coins, Cog, Code, TrendingUp, Factory, GraduationCap } from "lucide-react";

const steps = [
  { id: "profile", label: "Profil" },
  { id: "contribution", label: "Katkı" },
  { id: "preferences", label: "Tercihler" },
  { id: "review", label: "Önizleme" },
];

export default function OrtakOnboardingPage() {
  return (
    <WizardLayout
      header={
        <ProgressHeader title="Ortak Onboarding" steps={steps} currentStep={0} />
      }
      sidebar={
        <SummarySidebar
          items={[
            { label: "Rol", value: "Ortak" },
            { label: "Durum", value: "Taslak" },
          ]}
        />
      }
    >
      <WizardStepHeader
        step={1}
        totalSteps={steps.length}
        title="Ne tür katkı sunabilirsiniz?"
        description="Katkı türlerini seçin. Detaylı sorular bir sonraki sprintte eklenecek."
      />
      <MultiChoiceGrid
        options={[
          { value: "capital", title: "Sermaye", icon: <Coins className="h-5 w-5" /> },
          { value: "operations", title: "Operasyon", icon: <Cog className="h-5 w-5" /> },
          { value: "technical", title: "Teknik", icon: <Code className="h-5 w-5" /> },
          { value: "growth", title: "Büyüme", icon: <TrendingUp className="h-5 w-5" /> },
          { value: "production", title: "Üretim", icon: <Factory className="h-5 w-5" /> },
          {
            value: "industry",
            title: "Sektörel uzmanlık",
            icon: <GraduationCap className="h-5 w-5" />,
          },
        ]}
      />
      <div className="mt-8 flex justify-between">
        <Link href="/kayit/yol-secimi">
          <Button variant="outline">Geri</Button>
        </Link>
        <Button disabled>Devam</Button>
      </div>
      {/* TODO: Implement ortak onboarding steps and persistence */}
    </WizardLayout>
  );
}
