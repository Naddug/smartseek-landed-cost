import { Suspense } from "react";
import { CompaniesListView } from "@/components/views/CompaniesListView";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schema";
import { getRouteByKey } from "@/lib/seo/routes";

export const metadata = buildMetadata("kesfet");

export default function DiscoverPage() {
  const route = getRouteByKey("kesfet")!;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(route.title, route.description, route.path),
          breadcrumbSchema([
            { name: "Ana sayfa", path: "/" },
            { name: "Keşfet", path: "/kesfet" },
          ]),
        ]}
      />
      <Suspense fallback={null}>
        <CompaniesListView />
      </Suspense>
    </>
  );
}
