import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = "Vijayaragavan — Aspiring Software Developer";
export const size = {
  width: 1200,
  height: 630,
};
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
          position: "relative",
          overflow: "hidden",
          background: "#07090d",
          padding: "68px 76px",
          fontFamily:
            'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: "rgba(45, 212, 191, 0.13)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -260,
            left: -120,
            width: 560,
            height: 560,
            borderRadius: 9999,
            background: "rgba(167, 139, 250, 0.09)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 24,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div
              style={{
                width: 58,
                height: 58,
                borderRadius: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(111,242,200,0.4)",
                background: "rgba(111,242,200,0.07)",
color: "#6ff2c8",
                fontSize: 21,
                fontWeight: 600,
                letterSpacing: -1,
              }}
            >
              VJ
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  letterSpacing: 5,
                  color: "rgba(255,255,255,0.5)",
                  textTransform: "uppercase",
                }}
              >
                Portfolio
              </div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.28)" }}>
                Tamil Nadu, India
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid rgba(111,242,200,0.25)",
              borderRadius: 9999,
              padding: "9px 18px",
              color: "rgba(153,246,228,0.9)",
              fontSize: 14,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: 9999,
                background: "#34d399",
                display: "flex",
              }}
            />
            Open to opportunities
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 92,
              lineHeight: 1,
              letterSpacing: -4,
              color: "#f3f6f5",
              fontWeight: 600,
            }}
          >
            {profile.name}
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 33,
              color: "#5eead4",
              letterSpacing: -0.4,
            }}
          >
            {profile.title}
          </div>
          <div
            style={{
              marginTop: 20,
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "rgba(255,255,255,0.44)",
              fontSize: 19,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            <span>Backend Development</span>
            <span style={{ color: "rgba(111,242,200,0.5)" }}>·</span>
            <span>AI / ML</span>
            <span style={{ color: "rgba(139,124,255,0.5)" }}>·</span>
            <span>Full Stack</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: 24,
            color: "rgba(255,255,255,0.35)",
            fontSize: 14,
            letterSpacing: 2.5,
            textTransform: "uppercase",
          }}
        >
          <span>Vijayaragavan · 2026</span>
          <span>github.com/vijayaragavan-dev</span>
        </div>
      </div>
    ),
    size,
  );
}
