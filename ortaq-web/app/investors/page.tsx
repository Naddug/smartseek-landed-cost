import { buildMetadata } from "@/lib/metadata";
import { InvestorsPageView } from "@/components/views/InvestorsPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schema";
import { getRouteByKey } from "@/lib/seo/routes";

export const metadata = buildMetadata("investors");

export default function InvestorsPage() {
  const route = getRouteByKey("investors")!;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(route.title, route.description, route.path),
          breadcrumbSchema([
            { name: "Ana sayfa", path: "/" },
            { name: "Yatırımcılar", path: "/investors" },
          ]),
        ]}
      />
      <InvestorsPageView />
    </>
  );
}
