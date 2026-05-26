import { buildMetadata } from "@/lib/metadata";
import { HomePageView } from "@/components/views/HomePageView";

export const metadata = buildMetadata("home");

export default function HomePage() {
  return <HomePageView />;
}
