"use client";

import VerificationPage from "@/components/shared/verification-page";
import React from "react";
import ResetPasswordForm from "./reset-password-form";
import { CheckCircle2, KeyRound } from "lucide-react";

export default function ResetPasswordClient({ token }: { token: string }) {
  const [isSuccess, setIsSuccess] = React.useState(false);

  return (
    <VerificationPage
      icon={
        isSuccess ? (
          <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
        ) : (
          <KeyRound className="h-8 w-8 text-primary" />
        )
      }
    >
      <ResetPasswordForm token={token} onSuccess={() => setIsSuccess(true)} />
    </VerificationPage>
  );
}
