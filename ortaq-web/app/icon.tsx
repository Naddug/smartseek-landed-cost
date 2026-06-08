import { ImageResponse } from "next/og";
import { OgFaviconMark } from "@/lib/brand/OgFaviconMark";
import { brand } from "@/lib/brand/identity";

export const alt = "ORTAQ";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brand.green.deep,
        }}
      >
        <OgFaviconMark size={32} theme="dark" />
      </div>
    ),
    { ...size },
  );
}
