import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const links = [
  { name: "Profile", href: "/user/profile" },
  { name: "Order History", href: "/user/orders" },
  { name: "Admin", href: "/admin/overview" },
  { name: "Wishlist", href: "/wishlist" },
];

const LinksDrawerMobile = () => {
  return (
    <>
      {links.map((link) => (
        <Button key={link.name} asChild variant="ghost" className="w-full">
          <Link href={link.href}>{link.name}</Link>
        </Button>
      ))}
    </>
  );
};

export default LinksDrawerMobile;
