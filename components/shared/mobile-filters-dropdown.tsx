"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MobileFiltersDropdownProps {
  categories: { category: string }[];
  prices: { name: string; value: string }[];
  ratings: number[];
  currentCategory: string;
  currentPrice: string;
  currentRating: string;
  currentSort: string;
  currentPage: string;
}

export default function MobileFiltersDropdown({
  categories,
  prices,
  ratings,
  currentCategory,
  currentPrice,
  currentRating,
  currentSort,
  currentPage,
}: MobileFiltersDropdownProps) {
  const getFilterUrl = ({
    c,
    p,
    r,
  }: {
    c?: string;
    p?: string;
    r?: string;
  }) => {
    const filter = {
      category: c || currentCategory,
      price: p || currentPrice,
      rating: r || currentRating,
      sort: currentSort,
      page: currentPage,
    };
    const queryString = Object.entries(filter)
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    return `/search?${new URLSearchParams(queryString).toString()}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <div className="px-2 py-1">
          <div className="font-bold text-sm mb-2">Department</div>
          <DropdownMenuItem asChild>
            <Link
              href={getFilterUrl({ c: "all" })}
              className={
                (currentCategory === "all" || currentCategory === ""
                  ? "font-bold"
                  : "") + " text-sm"
              }
            >
              Any
            </Link>
          </DropdownMenuItem>
          {categories.map((cat) => (
            <DropdownMenuItem asChild key={cat.category}>
              <Link
                href={getFilterUrl({ c: cat.category })}
                className={
                  (currentCategory === cat.category ? "font-bold" : "") +
                  " text-sm"
                }
              >
                {cat.category}
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
        <div className="px-2 py-1">
          <div className="font-bold text-sm mb-2">Price</div>
          <DropdownMenuItem asChild>
            <Link
              href={getFilterUrl({ p: "all" })}
              className={
                (currentPrice === "all" || currentPrice === ""
                  ? "font-bold"
                  : "") + " text-sm"
              }
            >
              Any
            </Link>
          </DropdownMenuItem>
          {prices.map((priceRange) => (
            <DropdownMenuItem asChild key={priceRange.value}>
              <Link
                href={getFilterUrl({ p: priceRange.value })}
                className={
                  (currentPrice === priceRange.value ? "font-bold" : "") +
                  " text-sm"
                }
              >
                {priceRange.name}
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
        <div className="px-2 py-1">
          <div className="font-bold text-sm mb-2">Rating</div>
          <DropdownMenuItem asChild>
            <Link
              href={getFilterUrl({ r: "all" })}
              className={
                (currentRating === "all" || currentRating === ""
                  ? "font-bold"
                  : "") + " text-sm"
              }
            >
              Any
            </Link>
          </DropdownMenuItem>
          {ratings.map((ratingValue) => (
            <DropdownMenuItem asChild key={ratingValue}>
              <Link
                href={getFilterUrl({ r: ratingValue.toString() })}
                className={
                  (currentRating === ratingValue.toString()
                    ? "font-bold"
                    : "") + " text-sm"
                }
              >
                {`${ratingValue} stars & up`}
              </Link>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
