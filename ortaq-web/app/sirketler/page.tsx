import { CompaniesListView } from "@/components/views/CompaniesListView";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/metadata";
import { buildCompaniesPageDescription } from "@/lib/content/ecosystem-seo";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schema";
import { getRouteByKey } from "@/lib/seo/routes";

export const metadata = buildMetadata("sirketler", {
  description: buildCompaniesPageDescription(),
});

export default function CompaniesPage() {
  const route = getRouteByKey("sirketler")!;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema(route.title, buildCompaniesPageDescription(), route.path),
          breadcrumbSchema([
            { name: "Ana sayfa", path: "/" },
            { name: "Şirketler", path: "/sirketler" },
          ]),
        ]}
      />
      <CompaniesListView />
    </>
  );
}
