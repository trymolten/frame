import { AlertCircleIcon, Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { ProjectCardData } from "@/modules/dashboard/types";

// Soft tint + saturated corner, picked per project so cards are easy to tell
// apart before real preview screenshots exist.
const PALETTES = [
  ["#e4ebff", "#6f8fff"],
  ["#ffe6f1", "#ff6fae"],
  ["#ffeddf", "#ff8f45"],
  ["#e2f6ec", "#3fbf83"],
  ["#efe8ff", "#9677ff"],
  ["#fff3d1", "#f2b31c"],
  ["#e0f3fc", "#2fa3e0"],
] as const;

function paletteFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return PALETTES[Math.abs(hash) % PALETTES.length];
}

interface ProjectThumbnailProps {
  project: Pick<ProjectCardData, "id" | "status">;
  className?: string;
}

export function ProjectThumbnail({
  project,
  className,
}: ProjectThumbnailProps) {
  const [tint, accent] = paletteFor(project.id);

  return (
    <AspectRatio
      ratio={16 / 10}
      className={cn("overflow-hidden rounded-xl border bg-muted", className)}
      style={{
        backgroundImage: `radial-gradient(120% 90% at 100% 100%, ${accent} 0%, transparent 62%), linear-gradient(${tint}, ${tint})`,
      }}
    >
      {/* A miniature page: nav, headline, two lines, a button. */}
      <div
        aria-hidden
        className="absolute inset-x-[12%] top-[16%] bottom-0 rounded-t-lg bg-white/70 p-[6%] shadow-[0_4px_24px_-8px_rgb(0_0_0/0.18)] backdrop-blur-sm dark:bg-white/55"
      >
        <div className="flex items-center justify-between">
          <div className="h-1.5 w-1/5 rounded-full bg-black/15" />
          <div className="flex gap-1">
            <div className="h-1.5 w-4 rounded-full bg-black/10" />
            <div className="h-1.5 w-4 rounded-full bg-black/10" />
          </div>
        </div>
        <div className="mt-[9%] h-2.5 w-3/5 rounded-full bg-black/20" />
        <div className="mt-2 h-1.5 w-4/5 rounded-full bg-black/10" />
        <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-black/10" />
        <div
          className="mt-[7%] h-3 w-1/4 rounded-full"
          style={{ backgroundColor: accent }}
        />
      </div>

      {project.status === "GENERATING" && (
        <Badge
          variant="secondary"
          className="absolute top-2.5 left-2.5 bg-background/90 shadow-sm backdrop-blur"
        >
          <Loader2Icon className="animate-spin" />
          Building
        </Badge>
      )}
      {project.status === "FAILED" && (
        <Badge
          variant="destructive"
          className="absolute top-2.5 left-2.5 shadow-sm"
        >
          <AlertCircleIcon />
          Build failed
        </Badge>
      )}
    </AspectRatio>
  );
}
