import { getAllCategories } from "@/lib/actions/products/product-action";
import React from "react";
import CategoryDrawer from "./category-drawer";
import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
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

const SearchBar = async () => {
  const categories = await getAllCategories();
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
            {categories.map((categories) => (
              <SelectItem key={categories.category} value={categories.category}>
                {categories.category}
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

export default SearchBar;
