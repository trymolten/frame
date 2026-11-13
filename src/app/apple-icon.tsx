import { ImageResponse } from "next/og";

import { brandColors } from "@/config/site";
import { getLogoDataUrl } from "@/lib/brand-image";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS masks its own corners, so the tile is a full square.
export default async function AppleIcon() {
  const logo = await getLogoDataUrl();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(160deg, #2c2c2e 0%, ${brandColors.black} 100%)`,
      }}
    >
      { }
      <img src={logo} width={148} height={148} alt="" />
    </div>,
    size
  );
}
