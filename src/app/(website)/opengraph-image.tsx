import { ImageResponse } from "next/og";

import { brandColors, siteConfig } from "@/config/site";
import { getLogoDataUrl } from "@/lib/brand-image";

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await getLogoDataUrl();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: `radial-gradient(90% 120% at 100% 0%, #1c1c1e 0%, ${brandColors.black} 60%)`,
        color: "#f5f5f7",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {}
        <img src={logo} width={84} height={84} alt="" />
        <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: -1 }}>
          {siteConfig.name}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <span
          style={{
            fontSize: 84,
            fontWeight: 600,
            letterSpacing: -3,
            lineHeight: 1.02,
            maxWidth: 900,
          }}
        >
          {siteConfig.tagline}
        </span>
        <span style={{ fontSize: 30, color: "#98989d", maxWidth: 880 }}>
          Real Next.js code, running live. For developers and for teams.
        </span>
      </div>
    </div>,
    size
  );
}
