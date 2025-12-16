"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { UserIcon } from "lucide-react";
import { handleLogout } from "@/lib/utils";

const LogoutButton = () => {
  return (
    <Button onClick={handleLogout} className="w-full" variant="ghost">
      <UserIcon /> Sign Out
    </Button>
  );
};

export default LogoutButton;
