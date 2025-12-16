"use client";

import PasswordInput from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpUser } from "@/lib/actions/users/user-actions";
import { signUpDefaultValues } from "@/lib/constants";
import { asStringMessage } from "@/lib/utils";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { useFormStatus } from "react-dom";

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

const SignUpForm = () => {
  const [data, action] = React.useActionState(signUpUser, {
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

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignUpButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" variant="default" disabled={pending}>
        {pending ? "Submitting..." : "Sign Up"}
      </Button>
    );
  };

  return (
    <form className="space-y-6" action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm sm:text-base">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          name="name"
          autoComplete="name"
          defaultValue={signUpDefaultValues.name}
          required
          className="text-sm sm:text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm sm:text-base">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          defaultValue={signUpDefaultValues.email}
          required
          className="text-sm sm:text-base"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm sm:text-base">
          Password
        </Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setShowPasswordStrength(true)}
          onBlur={() => setShowPasswordStrength(false)}
          required
          className="text-sm sm:text-base"
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
                className={`text-xs sm:text-sm mt-1 ${
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
              <p className="text-sm sm:text-base text-red-500 mt-1">
                Please use at least 8 characters with lowercase, uppercase,
                number and a special character.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm sm:text-base">
          Confirm Password
        </Label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onFocus={() => setShowConfirmPassword(true)}
          onBlur={() => setShowConfirmPassword(false)}
          required
          className="text-sm sm:text-base"
        />

        {showConfirmPassword && confirmPassword.length > 0 && (
          <p
            className={`mt-1 text-xs sm:text-sm ${
              passwordMatch ? "text-green-500" : "text-red-500"
            }`}
          >
            {passwordMatch
              ? "Passwords match ✅ "
              : "Passwords do not match ❌"}
          </p>
        )}
      </div>
      <div>
        <SignUpButton />
      </div>

      {data && !data.success && (
        <div className="text-center text-destructive text-sm sm:text-base">
          {asStringMessage((data as { message?: unknown }).message)}
        </div>
      )}

      <div className="text-sm text-center text-muted-foreground sm:text-base">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </div>
    </form>
  );
};

export default SignUpForm;
