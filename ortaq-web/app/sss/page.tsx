import { buildMetadata } from "@/lib/metadata";
import { FaqPageView } from "@/components/views/FaqPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, faqPageSchema, webPageSchema } from "@/lib/seo/schema";
import { getRouteByKey } from "@/lib/seo/routes";

export const metadata = buildMetadata("sss");

export default function FaqPage() {
  const route = getRouteByKey("sss")!;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(route.title, route.description, route.path),
          breadcrumbSchema([
            { name: "Ana sayfa", path: "/" },
            { name: "SSS", path: "/sss" },
          ]),
          faqPageSchema(),
        ]}
      />
      <FaqPageView />
    </>
  );
}
