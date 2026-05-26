import { EvaluationPageView } from "@/components/views/EvaluationPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schema";
import { getRouteByKey } from "@/lib/seo/routes";

export const metadata = buildMetadata("degerlendirme");

export default function EvaluationPage() {
  const route = getRouteByKey("degerlendirme")!;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(route.title, route.description, route.path),
          breadcrumbSchema([
            { name: "Ana sayfa", path: "/" },
            { name: "Değerlendirme", path: "/degerlendirme" },
          ]),
        ]}
      />
      <EvaluationPageView />
    </>
  );
}
