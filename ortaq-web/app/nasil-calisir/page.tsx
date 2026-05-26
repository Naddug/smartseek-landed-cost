import { buildMetadata } from "@/lib/metadata";
import { ProcessPageView } from "@/components/views/ProcessPageView";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  howToSchema,
  webPageSchema,
} from "@/lib/seo/schema";
import { PROCESS_HOWTO_STEPS } from "@/lib/seo/process-steps";
import { getRouteByKey } from "@/lib/seo/routes";

export const metadata = buildMetadata("nasilCalisir");

export default function ProcessPage() {
  const route = getRouteByKey("nasil-calisir")!;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(route.title, route.description, route.path),
          breadcrumbSchema([
            { name: "Ana sayfa", path: "/" },
            { name: "Nasıl çalışır", path: "/nasil-calisir" },
          ]),
          howToSchema(
            "Paya dayalı ortaklık süreci",
            route.description,
            [...PROCESS_HOWTO_STEPS],
          ),
        ]}
      />
      <ProcessPageView />
    </>
  );
}
