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
    <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <Card>
        <CardHeader className="space-y-4 px-4 sm:px-6 pt-6 sm:pt-8">
          <Link href={"/"} className="flex-center">
            {icon ? (
              <div className="rounded-full bg-primary/10 p-2 sm:p-3">
                {icon}
              </div>
            ) : (
              <Image
                src="/logo.svg"
                alt={`${APP_NAME} logo`}
                width={60}
                height={60}
                priority={true}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-[60px] md:h-[60px]"
              />
            )}
          </Link>
          <CardTitle className="text-center text-lg sm:text-xl md:text-2xl font-bold">
            {title}
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            {message}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6 pb-6 sm:pb-8">
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
