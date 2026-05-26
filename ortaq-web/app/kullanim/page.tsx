import { buildMetadata } from "@/lib/metadata";
import { LegalPageView } from "@/components/views/LegalPageView";

export const metadata = buildMetadata("kullanim");

export default function TermsPage() {
  return <LegalPageView type="terms" />;
}
