"use client";

import React, { useState } from "react";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import SearchBarClient from "./search-client";

interface MobileSearchProps {
  categories: Array<{ category: string; _count: number }>;
}

const MobileSearch = ({ categories }: MobileSearchProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="top-0 translate-y-0 max-w-full w-full rounded-none border-0 border-b p-4 sm:p-6">
          <DialogTitle className="text-lg font-semibold mb-4">
            Search Products
          </DialogTitle>
          <SearchBarClient categories={categories} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileSearch;
