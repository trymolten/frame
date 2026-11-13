import { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Create your account",
  description:
    "Create a Molten account and turn a sentence into a running app.",
};

export default function SignUpPage() {
  return <SignUp />;
}
