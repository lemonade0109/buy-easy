import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

import { UserIcon } from "lucide-react";
import UserButtonClientSide from "./user-button-clientside";

const UserButton = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <Button asChild>
        <Link href="/sign-in">
          <UserIcon />
          Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = session.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : null;

  return (
    <div className="flex gap-2 items-center">
      <UserButtonClientSide
        firstInitial={firstInitial || "U"}
        name={session.user.name || ""}
        email={session.user.email || ""}
      />
    </div>
  );
};

export default UserButton;
