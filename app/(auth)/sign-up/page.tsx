import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import SignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default async function SignUpPage(props: {
  searchParams: Promise<{ callbackUrl: string }>;
}) {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();

  if (session) {
    redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <Card>
        <CardHeader className="space-y-4 px-4 sm:px-6 pt-6 sm:pt-8">
          <Link href={"/"} className="flex-center">
            <Image
              src="/logo.svg"
              alt={`${APP_NAME} logo`}
              width={90}
              height={90}
              priority={true}
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-[90px] md:h-[90px]"
            />
          </Link>
          <CardTitle className="text-center text-xl sm:text-2xl">
            Create Account
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Enter your information below to sign up
          </CardDescription>
        </CardHeader>

        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}
