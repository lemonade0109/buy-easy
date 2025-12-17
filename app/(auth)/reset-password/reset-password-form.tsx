"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/shared/password-input";
import { resetPassword } from "@/lib/actions/auth/reset-password";
import React from "react";
import { useFormStatus } from "react-dom";
import { asStringMessage } from "@/lib/utils";
import Link from "next/link";

function getPasswordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

function getPasswordStrengthLabel(score: number) {
  switch (score) {
    case 0:
    case 1:
      return "Very Weak";
    case 2:
      return "Weak";
    case 3:
      return "Moderate";
    case 4:
      return "Strong";
    case 5:
      return "Very Strong";
    default:
      return "";
  }
}

const ResetPasswordForm = ({
  token,
  onSuccess,
}: {
  token: string;
  onSuccess?: () => void;
}) => {
  const [data, action] = React.useActionState(resetPassword, {
    success: false,
    message: "",
  });

  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const [showPasswordStrength, setShowPasswordStrength] = React.useState(false);
  const passwordScore = getPasswordScore(password);
  const passwordStrengthLabel = getPasswordStrengthLabel(passwordScore);

  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const passwordMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const isTooWeak = password.length > 0 && passwordScore < 3;

  React.useEffect(() => {
    if (data && data.success && onSuccess) {
      onSuccess();
    }
  }, [data, onSuccess]);

  const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button
        className="w-full"
        variant="default"
        disabled={pending || isTooWeak || !passwordMatch}
      >
        {pending ? "Resetting..." : "Reset Password"}
      </Button>
    );
  };

  // If password was reset successfully
  if (data && data.success) {
    return (
      <div className="space-y-4 sm:space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold">
            Password Reset Successful!
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Your password has been successfully reset. You can now sign in with
            your new password.
          </p>
        </div>

        <div className="pt-4">
          <Button asChild className="w-full">
            <Link href="/sign-in">Go to Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-4 sm:space-y-6" action={action}>
      <input type="hidden" name="token" value={token} />

      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <PasswordInput
          id="password"
          name="password"
          placeholder="Enter your new password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setShowPasswordStrength(true)}
          onBlur={() => setShowPasswordStrength(false)}
          required
        />
        {showPasswordStrength && (
          <div className="mt-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, index) => {
                let bgColor = "bg-gray-300";
                if (index < passwordScore) {
                  if (passwordScore <= 2) {
                    bgColor = "bg-red-500";
                  } else if (passwordScore === 3) {
                    bgColor = "bg-yellow-500";
                  } else {
                    bgColor = "bg-green-500";
                  }
                }
                return (
                  <div
                    key={index}
                    className={`h-1 flex-1 rounded ${bgColor}`}
                  ></div>
                );
              })}
            </div>
            {password && (
              <div
                className={`text-xs mt-1 ${
                  passwordScore <= 2
                    ? "text-red-600"
                    : passwordScore === 3
                      ? "text-yellow-600"
                      : "text-green-600"
                }`}
              >
                {password
                  ? `Strength: ${passwordStrengthLabel}`
                  : "Enter a password"}
              </div>
            )}

            {isTooWeak && (
              <p className="text-sm text-red-500 mt-1">
                Please use at least 8 characters with lowercase, uppercase,
                number and a special character.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirm your new password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onFocus={() => setShowConfirmPassword(true)}
          onBlur={() => setShowConfirmPassword(false)}
          required
        />

        {showConfirmPassword && confirmPassword.length > 0 && (
          <p
            className={`mt-1 text-xs ${
              passwordMatch ? "text-green-500" : "text-red-500"
            }`}
          >
            {passwordMatch ? "Passwords match ✅" : "Passwords do not match ❌"}
          </p>
        )}
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

export default ResetPasswordForm;
