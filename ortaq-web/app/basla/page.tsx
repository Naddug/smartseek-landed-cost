import { buildMetadata } from "@/lib/metadata";
import { OnboardingPageView } from "@/components/views/OnboardingPageView";

export const metadata = buildMetadata("basla");

export default function OnboardingPage() {
  return <OnboardingPageView />;
}
