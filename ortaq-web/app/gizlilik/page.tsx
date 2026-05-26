import { buildMetadata } from "@/lib/metadata";
import { LegalPageView } from "@/components/views/LegalPageView";

export const metadata = buildMetadata("gizlilik");

export default function PrivacyPage() {
  return <LegalPageView type="privacy" />;
}
