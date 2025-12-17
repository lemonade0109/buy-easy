import React from "react";
import ModeToggler from "./mode-toggler";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserButton from "./user-Button";
import { auth } from "@/auth";
import LogoutButton from "./logout-button";
import LinksDrawerMobile from "./links-drawer-mobile";

const MenuBar = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <div className="flex space-x-2">
          <ModeToggler />
          <Button asChild variant={"ghost"}>
            <Link href="/cart">
              <ShoppingCart /> Cart
            </Link>
          </Button>

          <UserButton />
        </div>
      </nav>

      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>

          <SheetContent className="flex flex-col items-start gap-4 p-4">
            <SheetTitle className="">
              <div className="flex flex-col space-y-1">
                <div className="text-sm font-medium leading-none ml-2">
                  {user?.name}
                </div>
                <div className="text-muted-foreground leading-none ml-2">
                  {user?.email}
                </div>
              </div>
            </SheetTitle>

            <div className="space-y-4 mt-6">
              <Button asChild variant={"ghost"} className="w-full">
                <Link href="/cart">Cart</Link>
              </Button>

              <LinksDrawerMobile />
              {user ? (
                <LogoutButton />
              ) : (
                <Button asChild className="w-full">
                  <Link href="/sign-in">
                    <UserIcon /> Sign In
                  </Link>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default MenuBar;
