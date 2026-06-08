import { buildMetadata } from "@/lib/metadata";
import { WhatWeDoPageView } from "@/components/views/WhatWeDoPageView";

export const metadata = buildMetadata("neYapiyoruz");

export default function WhatWeDoPage() {
  return <WhatWeDoPageView />;
}
