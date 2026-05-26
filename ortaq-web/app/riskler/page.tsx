import { buildMetadata } from "@/lib/metadata";
import { RiskPageView } from "@/components/views/RiskPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schema";
import { getRouteByKey } from "@/lib/seo/routes";

export const metadata = buildMetadata("riskler");

export default function RiskPage() {
  const route = getRouteByKey("riskler")!;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(route.title, route.description, route.path),
          breadcrumbSchema([
            { name: "Ana sayfa", path: "/" },
            { name: "Riskler", path: "/riskler" },
          ]),
        ]}
      />
      <RiskPageView />
    </>
  );
}
