import { ImageResponse } from "next/og";

export const alt = "Ibrahima Wane — Data Scientist";
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
          padding: "72px 80px",
          backgroundColor: "#f6f0e6",
          backgroundImage:
            "radial-gradient(900px 480px at 8% -10%, rgba(11,107,95,0.22), transparent 60%), radial-gradient(800px 440px at 95% 8%, rgba(216,107,63,0.20), transparent 55%)",
          color: "#15130f",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 18,
              backgroundColor: "#0b6b5f",
              color: "#ffffff",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            IW
          </div>
          <div
            style={{
              fontSize: 24,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#5d5a53",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Ibrahima Wane
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            <span>Data scientist building ML</span>
            <span>systems end to end</span>
          </div>
          <div style={{ display: "flex", height: 6, width: 90, borderRadius: 999, backgroundColor: "#d86b3f" }} />
          <div style={{ fontSize: 30, color: "#5d5a53", fontFamily: "Arial, sans-serif" }}>
            From raw data to explainable models and deployed services
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            fontSize: 24,
            color: "#07473f",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <span>Explainable ML</span>
          <span style={{ color: "#c9bba6" }}>·</span>
          <span>MLOps</span>
          <span style={{ color: "#c9bba6" }}>·</span>
          <span>github.com/waneib22</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
