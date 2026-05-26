import { buildMetadata } from "@/lib/metadata";
import { TrustPageView } from "@/components/views/TrustPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schema";
import { getRouteByKey } from "@/lib/seo/routes";

export const metadata = buildMetadata("guven");

export default function TrustPage() {
  const route = getRouteByKey("guven")!;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(route.title, route.description, route.path),
          breadcrumbSchema([
            { name: "Ana sayfa", path: "/" },
            { name: "Güven", path: "/guven" },
          ]),
        ]}
      />
      <TrustPageView />
    </>
  );
}
