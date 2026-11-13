import Image from "next/image";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export function BrandLogo({ className, size = 24 }: BrandLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Molten"
      width={size}
      height={size}
      priority
      className={cn("shrink-0 select-none", className)}
    />
  );
}
