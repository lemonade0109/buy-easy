import React from "react";

import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import MenuBar from "./menu";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/logo.svg"
              alt={`${APP_NAME} Log`}
              width={48}
              height={48}
              priority={true}
            />
            <span className="hidden lg:block font-bold text-2xl ml-3"></span>
          </Link>
        </div>

        <MenuBar />
      </div>
    </header>
  );
};

export default Header;
