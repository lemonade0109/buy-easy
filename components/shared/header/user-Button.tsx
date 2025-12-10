import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";

import { UserIcon } from "lucide-react";
import UserButtonClientSide from "./user-button-clientside";
import { isAdmin } from "@/lib/admin";

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

  const userIsAdmin = isAdmin(session.user.email);

  return (
    <div className="flex gap-2 items-center">
      <UserButtonClientSide
        firstInitial={firstInitial || "U"}
        name={session.user.name || ""}
        email={session.user.email || ""}
        isAdmin={userIsAdmin}
      />
    </div>
  );
};

export default UserButton;
