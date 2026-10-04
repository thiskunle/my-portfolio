import { ImageResponse } from "next/og";
import { company, services } from "@/lib/content";
import { themeColors } from "@/lib/theme";

/*
 * Typographic share card, generated at build time. Text only: no logo or photo is drawn.
 * Replace with a designed card (or the real logo) once brand assets are supplied.
 * Colours mirror the light-theme tokens in app/globals.css (ImageResponse cannot read CSS variables).
 */
const ink = "#18211d";
const ink2 = "#505c56";
const forest = "#2e6a4f";
const line = "rgba(24, 33, 29, 0.10)";

export const alt = `${company.name} — ${company.tagline}`;
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
          backgroundColor: themeColors.light,
          backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          color: ink,
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, color: forest }}>
          {company.domain.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05 }}>{company.name}</div>
          <div style={{ marginTop: 20, fontSize: 40, color: forest }}>{company.tagline}</div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: ink2, whiteSpace: "nowrap" }}>
          {services.map((service) => service.name).join(" · ")}
        </div>
      </div>
    ),
    size,
  );
}
