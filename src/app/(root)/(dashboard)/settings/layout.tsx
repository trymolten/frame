import { routes } from "@/lib/routes";
import { PillNav } from "@/components/pill-nav";

const SETTINGS_LINKS = [
  { href: routes.accountSettings, label: "Account", includeChildren: true },
  { href: routes.usageSettings, label: "Usage" },
] as const;

export default function SettingsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto w-full max-w-4xl px-5 pt-16 pb-16 md:px-8">
      <h1 className="text-2xl font-semibold tracking-[-0.02em]">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Your profile, sign-in methods and credits.
      </p>
      <PillNav label="Settings" items={SETTINGS_LINKS} className="mt-6" />
      <div className="mt-8">{children}</div>
    </div>
  );
}
