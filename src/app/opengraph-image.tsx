import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          color: "#FAFAFA",
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700, display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#22C55E" }}>Linqis</span>
        </div>
        <div style={{ fontSize: 32, color: "#A1A1AA", marginTop: 16 }}>Every meeting, decoded.</div>
      </div>
    ),
    { ...size }
  );
}
