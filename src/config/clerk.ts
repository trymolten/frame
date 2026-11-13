import { shadcn } from "@clerk/themes";

// Shared ClerkProvider props. Keeping the URLs in code (not only env) means
// sign-in always uses the local /sign-in page instead of Clerk's hosted portal.
export const clerkProviderProps = {
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
  signInFallbackRedirectUrl: "/",
  signUpFallbackRedirectUrl: "/",
  afterSignOutUrl: "/",
  appearance: {
    // Reads the app's CSS variables, so it follows light/dark automatically.
    theme: shadcn,
    variables: {
      borderRadius: "0.75rem",
    },
  },
} as const;
