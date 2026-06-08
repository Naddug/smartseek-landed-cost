import { buildMetadata } from "@/lib/metadata";
import { TrustLayerPageView } from "@/components/trust/TrustLayerPageView";

export const metadata = buildMetadata("whyNotDirectFactory");

export default function WhyNotDirectFactoryPage() {
  return <TrustLayerPageView pageKey="whyNotDirectFactory" />;
}
