import { buildMetadata } from "@/lib/metadata";
import { GlossaryPageView } from "@/components/views/GlossaryPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, definedTermSetSchema, webPageSchema } from "@/lib/seo/schema";
import { getRouteByKey } from "@/lib/seo/routes";

export const metadata = buildMetadata("sozluk");

export default function GlossaryPage() {
  const route = getRouteByKey("sozluk")!;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(route.title, route.description, route.path),
          breadcrumbSchema([
            { name: "Ana sayfa", path: "/" },
            { name: "Sözlük", path: "/sozluk" },
          ]),
          definedTermSetSchema(),
        ]}
      />
      <GlossaryPageView />
    </>
  );
}
