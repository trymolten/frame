import { cn } from "@/lib/utils";
import { FrameLogo } from "@/components/frame-logo";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@/components/ui/empty";

interface StatusViewProps {
  title: string;
  description: React.ReactNode;
  /** Buttons or links that get the person moving again. */
  children?: React.ReactNode;
  className?: string;
}

// The one layout for 404s and errors: logo, a plain statement of what
// happened, and a way forward.
export function StatusView({
  title,
  description,
  children,
  className,
}: StatusViewProps) {
  return (
    <Empty className={cn("px-5", className)}>
      <EmptyHeader className="gap-3">
        <EmptyMedia className="mb-3">
          <FrameLogo size={36} />
        </EmptyMedia>
        <h1 className="text-2xl font-semibold tracking-[-0.02em] text-balance">
          {title}
        </h1>
        <EmptyDescription className="text-[15px] text-pretty">
          {description}
        </EmptyDescription>
      </EmptyHeader>
      {children && (
        <EmptyContent className="flex-row flex-wrap justify-center gap-2">
          {children}
        </EmptyContent>
      )}
    </Empty>
  );
}
