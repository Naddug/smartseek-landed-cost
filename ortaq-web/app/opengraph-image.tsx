import { ImageResponse } from "next/og";

export const alt = "ORTAQ — Gerçek şirketlere ortak olun";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf8f5",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: "#1a1814",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#faf8f5",
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            O
          </div>
          <span style={{ fontSize: 36, fontWeight: 600, color: "#1a1814" }}>ORTAQ</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 900 }}>
          <div style={{ fontSize: 56, fontWeight: 600, color: "#1a1814", lineHeight: 1.1 }}>
            Gerçek şirketlere ortak olun.
          </div>
          <div style={{ fontSize: 28, color: "#5c5650", lineHeight: 1.4 }}>
            Paya dayalı ortaklık sürecini sade anlatır. Tavsiye vermez.
          </div>
        </div>
        <div style={{ fontSize: 22, color: "#8a837a" }}>ortaq.biz</div>
      </div>
    ),
    { ...size },
  );
}
