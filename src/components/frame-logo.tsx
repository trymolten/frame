import Image from "next/image";

import { cn } from "@/lib/utils";

interface FrameLogoProps {
  className?: string;
  size?: number;
}

export function FrameLogo({ className, size = 24 }: FrameLogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Frame"
      width={size}
      height={size}
      priority
      className={cn("shrink-0 select-none", className)}
    />
  );
}
