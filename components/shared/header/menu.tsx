import React from "react";
import ModeToggler from "./mode-toggler";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import UserButton from "./user-Button";
import { auth } from "@/auth";
import MenuMobileClient from "./menu-mobile-client";

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
        <MenuMobileClient user={user} />
      </nav>
    </div>
  );
};

export default MenuBar;
