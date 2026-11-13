import { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign In - Frame AI",
  description:
    "Sign in to your Frame AI account to access your interactive web development workspace",
};

export default function SignInPage() {
  return <SignIn />;
}
