import { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign Up - Frame AI",
  description:
    "Sign up for Frame AI to start creating and sharing interactive web experiences and code-based frames",
};

export default function SignUpPage() {
  return <SignUp />;
}
