"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { isAdmin } from "@/lib/admin";
import { signOutUser } from "@/lib/actions/users/user-actions";

const UserButtonClientSide = ({
  firstInitial,
  email,
  name,
}: {
  firstInitial: string;
  email: string;
  name: string;
}) => {
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative w-8 h-8 rounded-full ml-2  flex-center bg-gray-200"
        >
          {firstInitial}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
        onClick={() => setOpen(false)}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-medium leading-none ml-2">{name}</div>
            <div className="text-muted-foreground leading-none ml-2">
              {email}
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

        {isAdmin(email) && (
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
  );
};

export default UserButtonClientSide;
