import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CampaignDetailView } from "@/components/views/CampaignDetailView";
import { getCampaign, getAllCampaignSlugs } from "@/lib/campaigns";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { site } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllCampaignSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const campaign = getCampaign(slug);
  if (!campaign) return { title: "Şirket bulunamadı" };

  return {
    title: campaign.seoTitle,
    description: campaign.seoDescription,
    robots: { index: true, follow: true },
    alternates: { canonical: `/sirket/${slug}` },
    openGraph: {
      title: campaign.seoTitle,
      description: campaign.seoDescription,
      url: `${site.url}/sirket/${slug}`,
    },
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
