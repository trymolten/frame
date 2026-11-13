import type { Metadata } from "next";

import HomePage from "@/app/(website)/page";

// Signed-in visitors get the dashboard at "/", so the marketing home also
// lives here, where it's reachable for everyone. "/" stays the canonical URL.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

export default HomePage;
