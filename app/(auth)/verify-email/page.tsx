export const runtime = "nodejs";
import VerificationPage from "@/components/shared/verification-page";
import { prisma } from "@/db/prisma";
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
    const record = await prisma.emailVerificationToken.findUnique({
      where: { token },
    });

    if (!record) {
      title = "Invalid or Expired link";
      message =
        "The verification link is invalid. You may need to request a new one.";
    } else if (record.expiresAt < new Date()) {
      title = "Expired Verification Link";
      message = "The verification link has expired. Please request a new one.";
    } else {
      // Mark the user's email as verified
      await prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: new Date() },
      });

      // Delete the used token
      await prisma.emailVerificationToken.deleteMany({
        where: { token },
      });

      title = "Email Verified Successfully";
      message =
        "Your email has been verified successfully. You can now sign in.";
      showSignInButton = true;
    }
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
