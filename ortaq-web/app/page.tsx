import { buildMetadata } from "@/lib/metadata";
import { HomePageView } from "@/components/views/HomePageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { webPageSchema } from "@/lib/seo/schema";
import { getRouteByKey } from "@/lib/seo/routes";

export const metadata = buildMetadata("home");

export default function HomePage() {
  const route = getRouteByKey("home")!;

  return (
    <>
      <JsonLd data={[webPageSchema(route.title, route.description, route.path)]} />
      <HomePageView />
    </>
  );
}
