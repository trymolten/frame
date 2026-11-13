"use client";

import Link from "next/link";
import { dark } from "@clerk/themes";
import { LiquidMetal } from "@paper-design/shaders-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import { useScroll } from "@/hooks/use-scroll";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

const Header = () => {
  const { isScrolled } = useScroll();
  const { theme } = useCurrentTheme();

  return (
    <header
      className={cn(
        "p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200 border-b border-transparent",
        isScrolled && "bg-background/50 backdrop-blur-sm border-b border-border"
      )}
    >
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <LiquidMetal
            width={32}
            height={32}
            className="rounded-full"
            // image="https://shaders.paper.design/images/logos/diamond.svg"
            colorBack="#000"
            colorTint="#ffffff"
            shape="daisy"
            repetition={2}
            softness={0.1}
            shiftRed={0.3}
            shiftBlue={0.3}
            distortion={0.07}
            contour={0.4}
            angle={70}
            speed={1}
            scale={0.8}
            fit="cover"
          />
          <span className="text-xl font-bold">Frame</span>
        </Link>
        <SignedOut>
          <div className="flex gap-2">
            <SignUpButton>
              <Button size="sm" variant="outline">
                Sign Up
              </Button>
            </SignUpButton>
            <SignInButton>
              <Button size="sm" variant="outline">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-3">
            <Button asChild size="sm">
              <Link href="/">Open dashboard</Link>
            </Button>
            <UserButton
              showName
              appearance={{
                elements: {
                  userButtonBox: "rounded-md!",
                  userButtonTrigger: "rounded-md!",
                  userButtonAvatarBox: "rounded-md! size-8!",
                },
                theme: theme === "dark" ? dark : undefined,
              }}
            />
          </div>
        </SignedIn>
      </div>
    </header>
  );
};

export { Header };
