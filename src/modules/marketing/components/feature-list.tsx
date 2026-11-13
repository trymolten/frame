import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
  soon?: boolean;
}

// Icon + title + one line, separated by hairlines rather than boxed in cards.
export function FeatureList({ features }: { features: Feature[] }) {
  return (
    <ul className="divide-y border-y">
      {features.map((feature) => (
        <li key={feature.title} className="flex gap-4 py-5">
          <feature.icon
            aria-hidden
            className="mt-0.5 size-5 shrink-0 text-muted-foreground"
            strokeWidth={1.75}
          />
          <div>
            <h3 className="flex items-center gap-2 text-[17px] font-semibold tracking-[-0.01em]">
              {feature.title}
              {feature.soon && (
                <Badge variant="secondary" className="font-medium">
                  Soon
                </Badge>
              )}
            </h3>
            <p className="mt-1 text-[15px] leading-[1.5] text-muted-foreground">
              {feature.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
