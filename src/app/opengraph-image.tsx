import { ImageResponse } from "next/og";

export const alt = "CiteWatch - Detect Content Decay & Recover Search Rankings";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(249, 115, 22, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f97316",
              fontSize: "28px",
              fontWeight: 700,
            }}
          >
            CP
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            Cite
            <span style={{ color: "#f97316" }}>Watch</span>
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: 700,
            color: "#f1f5f9",
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "800px",
            marginBottom: "16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>Detect Content Decay.</span>
          <span style={{ color: "#f97316" }}>Recover Rankings.</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "22px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "600px",
            lineHeight: 1.5,
          }}
        >
          Monitor your pages with Google Search Console data and get AI-powered
          recovery plans.
        </div>

        {/* Stats bar */}
        <div
          style={{
            display: "flex",
            gap: "32px",
            marginTop: "40px",
            padding: "16px 32px",
            borderRadius: "12px",
            border: "1px solid rgba(51, 65, 85, 0.5)",
            background: "rgba(15, 23, 42, 0.6)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: "24px", fontWeight: 700, color: "#f97316" }}
            >
              4
            </span>
            <span
              style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}
            >
              Signals Tracked
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: "24px", fontWeight: 700, color: "#f97316" }}
            >
              0-100
            </span>
            <span
              style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}
            >
              Decay Scoring
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: "24px", fontWeight: 700, color: "#f97316" }}
            >
              GPT-4o
            </span>
            <span
              style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}
            >
              AI Analysis
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            fontSize: "14px",
            color: "#475569",
          }}
        >
          by DooDigital
        </div>
      </div>
    ),
    { ...size }
  );
}
