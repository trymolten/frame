import { redirect } from "next/navigation";

import { routes } from "@/lib/routes";

// /settings has no page of its own yet; Account is the first section.
export default function SettingsPage() {
  redirect(routes.accountSettings);
}
