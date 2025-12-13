import VerificationPage from "@/components/shared/verification-page";
import React from "react";

type EmailSentProps = Readonly<{
  searchParams: Promise<{ email?: string }>;
}>;

export default async function EmailSentPage({ searchParams }: EmailSentProps) {
  const { email } = await searchParams;

  const title = "Account Created";
  const message = `Please check your email: ${email} to verify your account before signing in.`;
  return (
    <VerificationPage
      title={title}
      message={message}
      showSignInButton={true}
      text="Sign in"
    />
  );
}
