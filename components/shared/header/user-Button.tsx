import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { signOutUser } from "@/lib/actions/users/user-actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";

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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative w-8 h-8 rounded-full ml-2  flex-center bg-gray-200"
          >
            {firstInitial}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none ml-2">
                {session?.user?.name}
              </div>
              <div className="text-muted-foreground leading-none ml-2">
                {session?.user?.email}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuItem>
            <Link href="/user/profile" className="w-full ml-2">
              User Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Link href="/user/orders" className="w-full ml-2">
              Order History
            </Link>
          </DropdownMenuItem>

          {session.user.role === "admin" && (
            <DropdownMenuItem>
              <Link href="/admin/overview" className="w-full ml-2">
                Admin
              </Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="p-0 mb-1">
            <form action={signOutUser} className="w-full">
              <Button
                type="submit"
                variant="ghost"
                className="w-full py-4 h-4 justify-start"
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserButton;
