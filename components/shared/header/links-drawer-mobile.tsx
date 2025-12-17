import { Button } from "@/components/ui/button";
import React from "react";

const links = [
  { name: "Profile", href: "/user/profile" },
  { name: "Order History", href: "/user/orders" },
  { name: "Admin", href: "/admin/overview" },
  { name: "Wishlist", href: "/wishlist" },
];

interface LinksDrawerMobileProps {
  onNavigate: (href: string) => void;
}

const LinksDrawerMobile = ({ onNavigate }: LinksDrawerMobileProps) => {
  return (
    <>
      {links.map((link) => (
        <Button
          key={link.name}
          variant="ghost"
          className="w-full"
          onClick={() => onNavigate(link.href)}
        >
          {link.name}
        </Button>
      ))}
    </>
  );
};

export default LinksDrawerMobile;
