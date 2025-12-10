export const runtime = "nodejs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/db/prisma";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href={"/"} className="flex-center">
            <Image
              src="/logo.svg"
              alt={`${APP_NAME} logo`}
              width={60}
              height={60}
              priority={true}
            />
          </Link>
          <CardTitle className="text-center">{title}</CardTitle>
          <CardDescription className="text-center">{message}</CardDescription>
        </CardHeader>

        <CardContent>
          {showSignInButton && (
            <div className="mt-4 flex justify-center">
              <Button asChild>
                <Link href={`/sign-in`}>Sign in</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
