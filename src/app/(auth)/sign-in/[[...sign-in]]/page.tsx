import { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to Molten to get back to your projects.",
};

export default function SignInPage() {
  return <SignIn />;
}
