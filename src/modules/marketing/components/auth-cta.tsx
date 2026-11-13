"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { pressable } from "@/modules/marketing/lib/motion";

interface AuthCtaProps {
  size?: "sm" | "lg";
  className?: string;
}

/**
 * Primary call to action. Renders the signed-out version straight away
 * (most visitors) and only switches once Clerk confirms a session, so the
 * button never disappears while Clerk is still loading.
 */
export function AuthCta({ size = "lg", className }: AuthCtaProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const signedIn = isLoaded && isSignedIn;

  return (
    <motion.div {...pressable} className="inline-flex">
      <Button
        asChild
        size={size}
        className={cn(
          "rounded-full",
          size === "lg" ? "h-12 px-7 text-[17px]" : "px-4",
          className
        )}
      >
        <Link href={signedIn ? "/" : "/sign-up"}>
          {signedIn ? "Open Molten" : "Start building"}
        </Link>
      </Button>
    </motion.div>
  );
}

export function SignInLink({ className }: { className?: string }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (isLoaded && isSignedIn) return null;

  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className={cn("rounded-full font-normal", className)}
    >
      <Link href="/sign-in">Sign in</Link>
    </Button>
  );
}
