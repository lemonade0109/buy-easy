"use client";
import { requestPasswordReset } from "@/lib/actions/auth/forgot-password";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { asStringMessage } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import Link from "next/link";

const ForgotPasswordForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [data, action] = React.useActionState(requestPasswordReset, {
    success: false,
    message: "",
  });

  React.useEffect(() => {
    if (data && data.success && onSuccess) {
      onSuccess();
    }
  }, [data, onSuccess]);

  const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" variant="default" disabled={pending}>
        {pending ? "Sending..." : "Send Reset Link"}
      </Button>
    );
  };

  // If email was sent successfully, show success message
  if (data && data.success) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Check Your Email</h2>
          <p className="text-muted-foreground">
            We&apos;ve sent a password reset link to your email address. Please
            check your inbox and follow the instructions to reset your password.
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-left">
          <p className="font-medium mb-2">📧 Didn&apos;t receive the email?</p>
          <ul className="space-y-1 text-muted-foreground">
            <li>• Check your spam or junk folder</li>
            <li>• Make sure you entered the correct email address</li>
            <li>• The email may take a few minutes to arrive</li>
          </ul>
        </div>

        <div className="pt-4">
          <Link
            href="/sign-in"
            className="text-sm text-blue-500 hover:underline"
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-6" action={action}>
      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold">Forgot Password?</h2>
        <p className="text-sm text-muted-foreground">
          No worries! Enter your email address and we&apos;ll send you a link to
          reset your password.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          autoComplete="email"
          required
        />
      </div>

      <div>
        <SubmitButton />
      </div>

      {data && !data.success && data.message && (
        <div className="text-center text-destructive text-sm">
          {asStringMessage((data as { message?: unknown }).message)}
        </div>
      )}

      <div className="text-sm text-center text-muted-foreground">
        Remember your password?{" "}
        <Link href="/sign-in" className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
