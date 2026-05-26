import { ImageResponse } from "next/og";

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
          background: "#1a1814",
          borderRadius: 8,
        }}
      >
        <div
          style={{
            color: "#faf8f5",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          O
        </div>
      </div>
    ),
    { ...size },
  );
}
