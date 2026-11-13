import type { Metadata } from "next";
import { UserProfile } from "@clerk/nextjs";

import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Account settings",
};

// Clerk's profile with path routing, so its own sections get real URLs
// (/settings/account/security). The catch-all segment serves them.
export default function AccountSettingsPage() {
  return (
    <UserProfile
      path={routes.accountSettings}
      routing="path"
      appearance={{
        elements: {
          rootBox: "w-full",
          cardBox: "w-full max-w-none rounded-xl border shadow-none",
        },
      }}
    />
  );
}
