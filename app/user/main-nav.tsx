"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/user/profile", label: "Profile" },
  { href: "/user/orders", label: "Orders" },
];

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {links.map((link) => {
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === link.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default MainNav;
