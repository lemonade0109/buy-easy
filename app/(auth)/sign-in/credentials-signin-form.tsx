"use client";
import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/shared/password-input";
import { signInDefaultValues } from "@/lib/constants";
import { asStringMessage } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { signInUserWithCredentials } from "@/lib/actions/users/user-actions";
import { useSearchParams } from "next/navigation";

const CredentialsSignInForm = () => {
  const [data, action] = React.useActionState(signInUserWithCredentials, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const SignInButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" variant="default" disabled={pending}>
        {pending ? "Signing In..." : "Sign In"}
      </Button>
    );
  };

  return (
    <form className="space-y-4 sm:space-y-6" action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm sm:text-base">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          name="email"
          autoComplete="email"
          defaultValue={signInDefaultValues.email}
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
          autoComplete="password"
          required
          defaultValue={signInDefaultValues.password}
          className="text-sm sm:text-base"
        />
      </div>
      <div>
        <SignInButton />
      </div>

      {data && !data.success && (
        <div className="text-center text-destructive text-xs sm:text-sm">
          {asStringMessage((data as { message?: unknown }).message)}
        </div>
      )}

      <div className="text-xs sm:text-sm text-center text-muted-foreground flex flex-col gap-2 justify-center">
        <span>
          <Link
            href="/forgot-password"
            className="hover:underline hover:text-blue-500 text-blue-500"
          >
            Forgot your password?
          </Link>
        </span>
        <span>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </span>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;
