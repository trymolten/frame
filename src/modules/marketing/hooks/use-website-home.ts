"use client";

import { useAuth } from "@clerk/nextjs";

// "/" shows the dashboard to signed-in users, so links meant for the website's
// home page point them at the /home alias instead.
export function useWebsiteHomeHref() {
  const { isLoaded, isSignedIn } = useAuth();
  return isLoaded && isSignedIn ? "/home" : "/";
}
