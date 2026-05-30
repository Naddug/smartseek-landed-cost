import { ImageResponse } from "next/og";
import { OgBrandMark } from "@/lib/brand/OgBrandMark";
import { brand } from "@/lib/brand/identity";

export const alt = "ORTAQ : Türkiye üretim ekonomisine doğrulanmış erişim";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: `linear-gradient(145deg, ${brand.green.deep} 0%, ${brand.graphite.ink} 55%, ${brand.green.primary} 100%)`, padding: "64px 72px", }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <OgBrandMark size={52} theme="dark" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span
              style={{
                fontSize: 38, fontWeight: 700, color: brand.cream.primary, letterSpacing: "-0.07em", }}
            >
              ORTAQ
            </span>
            <div style={{ width: 28, height: 2, backgroundColor: brand.gold, borderRadius: 1, marginTop: 4 }} />
            <span
              style={{
                fontSize: 13, fontWeight: 600, color: brand.gold, letterSpacing: "0.18em", textTransform: "uppercase", }}
            >
              Sanayi yatırım altyapısı
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 920 }}>
          <div
            style={{
              fontSize: 54, fontWeight: 700, color: brand.cream.primary, lineHeight: 1.08, letterSpacing: "-0.03em", }}
          >
            Türkiye&apos;nin üretim ekonomisine disiplinli erişim.
          </div>
          <div style={{ fontSize: 26, color: brand.cream.muted, lineHeight: 1.45, maxWidth: 780 }}>
            Saha incelemeli sanayi dosyaları · SPK düzenlemeli çerçeve · Yatırım tavsiyesi değildir.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 20, color: brand.cream.dim, letterSpacing: "0.06em" }}>{brand.domain}</div>
          <div
            style={{
              display: "flex", gap: 24, fontSize: 13, fontWeight: 600, color: brand.mint, letterSpacing: "0.12em", textTransform: "uppercase", }}
          >
            <span>Ortaklık</span>
            <span>Sermaye</span>
            <span>Güven</span>
          </div>
        </div>
      </div>
    ), { ...size }, );
}
