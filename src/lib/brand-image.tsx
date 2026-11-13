import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { brandColors } from "@/config/site";

let logoDataUrl: Promise<string> | undefined;

// The chrome daisy as a data URL for next/og image routes (read once).
export function getLogoDataUrl() {
  logoDataUrl ??= readFile(join(process.cwd(), "public/logo.png")).then(
    (file) => `data:image/png;base64,${file.toString("base64")}`
  );
  return logoDataUrl;
}

// App-icon tile: the daisy on a graphite rounded square, readable at 16px.
export async function BrandTile({ size }: { size: number }) {
  const logo = await getLogoDataUrl();
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(160deg, #2c2c2e 0%, ${brandColors.black} 100%)`,
        borderRadius: size * 0.225,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} width={size * 0.82} height={size * 0.82} alt="" />
    </div>
  );
}
