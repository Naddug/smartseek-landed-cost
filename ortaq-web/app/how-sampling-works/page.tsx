import { buildMetadata } from "@/lib/metadata";
import { TrustLayerPageView } from "@/components/trust/TrustLayerPageView";

export const metadata = buildMetadata("howSamplingWorks");

export default function HowSamplingWorksPage() {
  return <TrustLayerPageView pageKey="howSamplingWorks" />;
}
