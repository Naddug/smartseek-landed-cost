import { buildMetadata } from "@/lib/metadata";
import { NedenOrtaqView } from "@/components/views/NedenOrtaqView";

export const metadata = buildMetadata("nedenOrtaq");

export default function NedenOrtaqPage() {
  return <NedenOrtaqView />;
}
