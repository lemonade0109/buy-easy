import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Unauthorized Access",
};

export default function UnauthorizedPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-[calc(100vh-200px)] space-y-4">
      <h1 className="h1-bold text-4xl">Unauthorized Access</h1>
      <p className="text-center text-lg text-muted-foreground max-w-md">
        You do not have the necessary permissions to view this page.
      </p>

      <Button asChild>
        <Link href="/" className="text-blue-500 hover:underline">
          Go back to Home
        </Link>
      </Button>
    </div>
  );
}
