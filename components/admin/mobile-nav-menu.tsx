"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/admin/overview", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/users", label: "Users" },
];

export default function MobileNavMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-4 py-2 rounded-md border bg-background text-sm font-medium">
        Admin Menu
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {navLinks.map((link) => (
          <DropdownMenuItem
            key={link.href}
            onClick={() => (window.location.href = link.href)}
          >
            {link.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
