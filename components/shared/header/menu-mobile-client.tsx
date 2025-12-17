"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, UserIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import LogoutButton from "./logout-button";
import LinksDrawerMobile from "./links-drawer-mobile";
import { useRouter } from "next/navigation";

interface MenuMobileClientProps {
  user:
    | {
        name?: string | null;
        email?: string | null;
      }
    | null
    | undefined;
}

const MenuMobileClient = ({ user }: MenuMobileClientProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleNavigation = (href: string) => {
    router.push(href);
    setTimeout(() => setOpen(false), 100);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="align-middle">
        <EllipsisVertical />
      </SheetTrigger>

      <SheetContent className="flex flex-col items-start gap-4 p-4">
        <SheetTitle className="">
          {user ? (
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none ml-2">
                {user?.name}
              </div>
              <div className="text-muted-foreground leading-none ml-2 text-[12px]">
                {user?.email}
              </div>
            </div>
          ) : (
            <UserIcon />
          )}
        </SheetTitle>

        <div className="space-y-4 mt-6 w-full">
          <Button
            variant={"ghost"}
            className="w-full"
            onClick={() => handleNavigation("/cart")}
          >
            Cart
          </Button>

          {user && <LinksDrawerMobile onNavigate={handleNavigation} />}
          {user ? (
            <LogoutButton />
          ) : (
            <Button
              className="w-full"
              onClick={() => handleNavigation("/sign-in")}
            >
              <UserIcon /> Sign In
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MenuMobileClient;
