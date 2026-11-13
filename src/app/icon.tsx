import { ImageResponse } from "next/og";

import { BrandTile } from "@/lib/brand-image";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  return new ImageResponse(await BrandTile({ size: size.width }), size);
}
