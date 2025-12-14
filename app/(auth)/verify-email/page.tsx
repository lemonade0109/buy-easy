import VerificationPage from "@/components/shared/verification-page";
import { verifyEmailToken } from "@/lib/actions/auth/verify-email";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Verify Email - BuyEasy",
  description: "Verify your email address for BuyEasy account.",
};

type VerifyEmailPageProps = Readonly<{
  searchParams: Promise<{ token?: string }>;
}>;
export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams;

  let title = "Email Verification";
  let message = "Verifying your email...";
  let showSignInButton = false;

  if (!token) {
    title = "Invalid Verification Link";
    message = "No verification token was provided.";
  } else {
    const result = await verifyEmailToken(token);
    title = result.title;
    message = result.message;
    showSignInButton = result.success;
  }

  return (
    <VerificationPage
      title={title}
      message={message}
      showSignInButton={showSignInButton}
      text="Sign in"
    />
  );
}
