import { buildMetadata } from "@/lib/metadata";
import { QuotePageView } from "@/components/views/QuotePageView";

export const metadata = buildMetadata("teklif");

export default function QuotePage() {
  return <QuotePageView />;
}
