import { buildMetadata } from "@/lib/metadata";
import { TrustLayerPageView } from "@/components/trust/TrustLayerPageView";

export const metadata = buildMetadata("qualityControl");

export default function QualityControlPage() {
  return <TrustLayerPageView pageKey="qualityControl" />;
}
