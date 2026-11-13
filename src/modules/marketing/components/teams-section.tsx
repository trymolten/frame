import {
  ArrowLeftRightIcon,
  BuildingIcon,
  GaugeIcon,
  KeyRoundIcon,
  ShieldCheckIcon,
  CheckIcon,
  MinusIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FeatureList } from "@/modules/marketing/components/feature-list";

const FEATURES = [
  {
    icon: BuildingIcon,
    title: "Organizations",
    body: "Projects belong to the team, not to whoever happened to create them.",
  },
  {
    icon: ArrowLeftRightIcon,
    title: "Personal and team workspaces",
    body: "Switch between your own projects and each organization you're in.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Roles and permissions",
    body: "Admins, members and viewers each see and do exactly what they should.",
  },
  {
    icon: GaugeIcon,
    title: "Shared credits",
    body: "Usage is tracked per workspace, so the team draws from one balance.",
  },
  {
    icon: KeyRoundIcon,
    title: "Single sign-on",
    body: "Sign in through your company's identity provider.",
  },
];

const ROLES = ["Admin", "Member", "Viewer"] as const;

const PERMISSIONS: { action: string; allowed: readonly boolean[] }[] = [
  { action: "View projects", allowed: [true, true, true] },
  { action: "Create and edit projects", allowed: [true, true, false] },
  { action: "Delete any project", allowed: [true, false, false] },
  { action: "Invite and manage members", allowed: [true, false, false] },
  { action: "Manage billing and credits", allowed: [true, false, false] },
];

export function TeamsSection() {
  return (
    <section
      id="teams"
      aria-labelledby="teams-heading"
      className="scroll-mt-20 border-t bg-muted/40 py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-14 px-5 md:px-8 lg:grid-cols-2 lg:items-start lg:gap-20">
        <div className="lg:order-2">
          <p className="flex items-center gap-2 text-[15px] font-semibold text-brand">
            For teams
            <Badge variant="secondary" className="font-medium">
              Soon
            </Badge>
          </p>
          <h2
            id="teams-heading"
            className="mt-3 text-[34px] leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[48px]"
          >
            One workspace for the whole team.
          </h2>
          <p className="mt-5 max-w-lg text-[17px] leading-[1.55] text-muted-foreground">
            Create an organization, invite your team and decide who can do what.
            Nothing gets stuck in one person&apos;s account.
          </p>
          <div className="mt-10">
            <FeatureList features={FEATURES} />
          </div>
        </div>

        <figure className="overflow-hidden rounded-2xl border bg-card shadow-[0_24px_64px_-32px_rgb(0_0_0/0.3)] lg:sticky lg:top-28 lg:order-1 lg:mt-12">
          <figcaption className="border-b px-5 py-3.5 text-[13px] font-medium text-muted-foreground">
            What each role can do
          </figcaption>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-5">
                  <span className="sr-only">Permission</span>
                </TableHead>
                {ROLES.map((role) => (
                  <TableHead
                    key={role}
                    className="text-center text-[13px] font-semibold text-foreground"
                  >
                    {role}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {PERMISSIONS.map((row) => (
                <TableRow key={row.action} className="hover:bg-transparent">
                  <TableCell className="py-3.5 pl-5 text-[14px] whitespace-normal">
                    {row.action}
                  </TableCell>
                  {row.allowed.map((allowed, i) => (
                    <TableCell key={ROLES[i]} className="text-center">
                      {allowed ? (
                        <CheckIcon
                          className="mx-auto size-4 text-brand"
                          strokeWidth={2.5}
                          aria-label="Allowed"
                        />
                      ) : (
                        <MinusIcon
                          className="mx-auto size-4 text-muted-foreground/50"
                          aria-label="Not allowed"
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </figure>
      </div>
    </section>
  );
}
