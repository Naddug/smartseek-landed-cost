import { buildMetadata } from "@/lib/metadata";
import { TrustLayerPageView } from "@/components/trust/TrustLayerPageView";

export const metadata = buildMetadata("paymentProtection");

export default function PaymentProtectionPage() {
  return <TrustLayerPageView pageKey="paymentProtection" />;
}
