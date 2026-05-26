import { EvaluationPageView } from "@/components/views/EvaluationPageView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Şirketler nasıl değerlendirilir? | ORTAQ",
  description:
    "ORTAQ şirket seçim süreci: operasyonel inceleme, saha ziyareti, finansal ve hukuk değerlendirmesi, komite onayı.",
};

export default function EvaluationPage() {
  return <EvaluationPageView />;
}
