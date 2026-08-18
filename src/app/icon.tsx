import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Same mark as the PageLoader logo (src/components/page-loader.tsx) so the
// browser tab matches what the app shows while it boots.
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
          background: "#0A0A0A",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "#15151A",
            border: "2px solid rgba(34, 197, 94, 0.4)",
            boxShadow: "0 0 18px rgba(34, 197, 94, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 30, fontWeight: 700, color: "#22C55E" }}>L</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
