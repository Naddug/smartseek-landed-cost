import { buildMetadata } from "@/lib/metadata";
import { TeamPageView } from "@/components/views/TeamPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schema";
import { getRouteByKey } from "@/lib/seo/routes";

export const metadata = buildMetadata("ekip");

export default function TeamPage() {
  const route = getRouteByKey("ekip")!;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(route.title, route.description, route.path),
          breadcrumbSchema([
            { name: "Ana sayfa", path: "/" },
            { name: "Ekip", path: "/ekip" },
          ]),
        ]}
      />
      <TeamPageView />
    </>
  );
}
