import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CampaignDetailView } from "@/components/views/CampaignDetailView";
import { getCampaign, getAllCampaignSlugs } from "@/lib/campaigns";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, illustrativeCampaignSchema } from "@/lib/seo/schema";
import { site } from "@/lib/metadata";
import { deprecatedRobots } from "@/lib/legacy-routes";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllCampaignSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const campaign = getCampaign(slug);
  if (!campaign) return { title: "Şirket bulunamadı" };

  const title = campaign.seoTitle;
  const description = campaign.seoDescription;
  const url = `${site.url}/sirket/${slug}`;

  return {
    title: { absolute: title },
    description,
    metadataBase: new URL(site.url),
    alternates: {
      canonical: `/sirket/${slug}`,
      languages: { "tr-TR": `/sirket/${slug}` },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: deprecatedRobots,
  };
}

export default async function CampaignPage({ params }: Props) {
  const { slug } = await params;
  const campaign = getCampaign(slug);
  if (!campaign) notFound();

  return (
    <>
      <JsonLd
        data={[
          illustrativeCampaignSchema(slug, campaign.seoTitle, campaign.seoDescription),
          breadcrumbSchema([
            { name: "Ana sayfa", path: "/" },
            { name: "Şirketler", path: "/sirketler" },
            { name: campaign.tradeName, path: `/sirket/${slug}` },
          ]),
        ]}
      />
      <CampaignDetailView campaign={campaign} />
    </>
  );
}
