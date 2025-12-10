import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type EmailSentProps = Readonly<{
  searchParams: Promise<{ email?: string }>;
}>;

export default async function EmailSentPage({ searchParams }: EmailSentProps) {
  const { email } = await searchParams;

  const title = "Account Created";
  const message = `Please check your email: ${email} to verify your account before signing in.`;
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
          <div className="mt-4 flex justify-center">
            <Button asChild>
              <Link href={`/sign-in`}>Sign in</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
