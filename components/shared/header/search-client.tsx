"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

interface SearchBarClientProps {
  categories: Array<{ category: string }>;
}

const SearchBarClient = ({ categories }: SearchBarClientProps) => {
  return (
    <form action="/search" method="GET">
      <div className="flex w-full max-w-m items-center space-x-2">
        <Select name="category">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem key="All" value="all">
              All
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.category} value={cat.category}>
                {cat.category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="text"
          name="q"
          placeholder="Search products..."
          className="flex-grow"
        />
        <Button>
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
};

export default SearchBarClient;
