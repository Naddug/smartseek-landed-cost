import { ImageResponse } from "next/og";

export const alt = "ORTAQ";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1814",
          borderRadius: 36,
        }}
      >
        <div style={{ color: "#faf8f5", fontSize: 96, fontWeight: 700 }}>O</div>
      </div>
    ),
    { ...size },
  );
}
