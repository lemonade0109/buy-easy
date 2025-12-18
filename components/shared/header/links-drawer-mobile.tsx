import { Button } from "@/components/ui/button";
import React from "react";

const baseLinks = [
  { name: "Profile", href: "/user/profile" },
  { name: "Order History", href: "/user/orders" },
  { name: "Wishlist", href: "/wishlist" },
];

interface LinksDrawerMobileProps {
  onNavigate: (href: string) => void;
  isAdmin?: boolean;
}

const LinksDrawerMobile = ({ onNavigate, isAdmin }: LinksDrawerMobileProps) => {
  const links = isAdmin
    ? [
        ...baseLinks.slice(0, 2),
        { name: "Admin", href: "/admin/overview" },
        baseLinks[2],
      ]
    : baseLinks;
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
