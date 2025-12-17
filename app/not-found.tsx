"use client";
import React from "react";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6">
      <Image
        src="/logo.svg"
        width={48}
        height={48}
        alt={`${APP_NAME} logo`}
        priority={true}
        className="w-12 h-12 sm:w-14 sm:h-14 md:w-[48px] md:h-[48px] mb-4"
      />
      <div className="p-4 sm:p-6 rounded-lg shadow-md text-center w-full max-w-md mx-auto">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
          Page Not Found
        </h2>
        <p className="text-sm sm:text-base text-red-600">
          We&apos;re sorry, but the page you were looking for could not be
          found.
        </p>
        <Button
          variant="outline"
          className="mt-4 w-full sm:w-auto"
          onClick={() => (window.location.href = "/")}
        >
          Go Back Home
        </Button>
      </div>
    </div>
  );
}
