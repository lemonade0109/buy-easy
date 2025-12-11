"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOutUser } from "@/lib/actions/users/user-actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const UserButtonClientSide = ({
  firstInitial,
  email,
  name,
  isAdmin,
}: {
  firstInitial: string;
  email: string;
  name: string;
  isAdmin: boolean;
}) => {
  const [open, setOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success("You have been signed out.");
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
    }
  };
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
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Link href="/user/orders" className="w-full ml-2">
            Order History
          </Link>
        </DropdownMenuItem>

        {isAdmin && (
          <DropdownMenuItem>
            <Link href="/admin/overview" className="w-full ml-2">
              Admin
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem>
          <Link href="/wishlist" className="w-full ml-2">
            Wishlist
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="p-0 mb-1">
          <Button
            variant="ghost"
            className="w-full py-4 h-4 justify-start text-red-500 hover:text-red-400"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButtonClientSide;
