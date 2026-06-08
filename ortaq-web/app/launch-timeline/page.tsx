import { buildMetadata } from "@/lib/metadata";
import { TrustLayerPageView } from "@/components/trust/TrustLayerPageView";

export const metadata = buildMetadata("launchTimeline");

export default function LaunchTimelinePage() {
  return <TrustLayerPageView pageKey="launchTimeline" />;
}
