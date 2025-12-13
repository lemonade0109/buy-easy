import VerificationPage from "@/components/shared/verification-page";
import React from "react";
import ResetPasswordClient from "./reset-password-client";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <VerificationPage
        title="Invalid Reset Link"
        message="The password reset link is missing or invalid. Please request a new one."
        showSignInButton={true}
        text="Go to Sign In"
      />
    );
  }

  return <ResetPasswordClient token={token} />;
}
