"use client";
import React from "react";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <Image
        src="/logo.svg"
        width={48}
        height={48}
        alt={`${APP_NAME} logo`}
        priority={true}
      />
      <div className="p-6 rounded-lg shadow-md text-center w-1/3">
        <h2 className="text-lg font-bold mb-2">Page Not Found</h2>
        <p className="text-sm text-red-600">
          We&apos;re sorry, but the page you were looking for could not be
          found.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => (window.location.href = "/")}
        >
          Go Back Home
        </Button>
      </div>
    </div>
  );
}
