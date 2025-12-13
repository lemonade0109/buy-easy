import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import { Button } from "../ui/button";

const VerificationPage = ({
  title,
  message,
  showSignInButton,
  text,
  children,
  icon,
}: {
  title?: string;
  message?: string;
  showSignInButton?: boolean;
  text?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-2">
          <Link href={"/"} className="flex-center">
            {icon ? (
              <div className="rounded-full bg-primary/10 p-3">{icon}</div>
            ) : (
              <Image
                src="/logo.svg"
                alt={`${APP_NAME} logo`}
                width={60}
                height={60}
                priority={true}
              />
            )}
          </Link>
          <CardTitle className="text-center text-lg font-bold">
            {title}
          </CardTitle>
          <CardDescription className="text-center">{message}</CardDescription>
        </CardHeader>

        <CardContent>
          {showSignInButton ? (
            <div className="mt-4 flex justify-center">
              <Button asChild>
                <Link href={`/sign-in`}>{text}</Link>
              </Button>
            </div>
          ) : (
            children
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationPage;
