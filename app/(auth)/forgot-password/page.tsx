"use client";
import VerificationPage from "@/components/shared/verification-page";
import React from "react";
import ForgotPasswordForm from "./forgot-password-form";
import { CheckCircle2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = React.useState(false);

  return (
    <VerificationPage
      icon={
        isSuccess ? (
          <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
        ) : (
          <Mail className="h-8 w-8 text-primary" />
        )
      }
    >
      <ForgotPasswordForm onSuccess={() => setIsSuccess(true)} />
    </VerificationPage>
  );
}
