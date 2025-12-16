import React from "react";

import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import MenuBar from "./menu";
import CategoryDrawer from "./category-drawer";
import SearchBar from "./search";
import MobileSearchWrapper from "./mobile-search-wrapper";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <CategoryDrawer />
          <Link href="/" className="flex-start ml-4">
            <Image
              src="/logo.svg"
              alt={`${APP_NAME} Logo`}
              width={38}
              height={38}
              priority={true}
            />
            <span className="hidden lg:block font-bold text-2xl ml-3"></span>
          </Link>
        </div>
        <div className="hidden md:block w-full max-w-md">
          <SearchBar />
        </div>
        <div className="flex items-center gap-2">
          <MobileSearchWrapper />
          <MenuBar />
        </div>
      </div>
    </header>
  );
};

export default Header;
