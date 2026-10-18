import { ImageResponse } from "next/og";

export const alt = "Noxora: Seu negócio evolui. A tecnologia acompanha.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "radial-gradient(circle at 85% 30%, #3f3f46 0%, #000000 55%)",
          color: "#f4f4f5",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 12, color: "#d4d8de" }}>
          NOXORA.
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, lineHeight: 1.05 }}>
          <span>Seu negócio evolui.</span>
          <span style={{ color: "#d4d8de" }}>A tecnologia acompanha.</span>
        </div>
        <div style={{ fontSize: 26, color: "#a1a1aa" }}>
          Sites · Sistemas · Integrações · Automações
        </div>
      </div>
    ),
    size,
  );
}
