"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import Link from "next/link";

interface MobileFiltersProps {
  categories: { category: string }[];
  prices: { name: string; value: string }[];
  ratings: number[];
  currentCategory: string;
  currentPrice: string;
  currentRating: string;
  currentSort: string;
  currentPage: string;
}

export default function MobileFilters({
  categories,
  prices,
  ratings,
  currentCategory,
  currentPrice,
  currentRating,
  currentSort,
  currentPage,
}: MobileFiltersProps) {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-6 px-4">
          {/* Category links */}
          <div>
            <div className="text-base font-bold mb-3">Department</div>
            <ul className="space-y-2">
              <li>
                <SheetClose asChild>
                  <Link
                    className={`$${
                      (currentCategory === "all" || currentCategory === "") &&
                      "font-bold"
                    } hover:underline text-sm`}
                    href={getFilterUrl({ c: "all" })}
                  >
                    Any
                  </Link>
                </SheetClose>
              </li>
              {categories.map((cat) => (
                <li key={cat.category}>
                  <SheetClose asChild>
                    <Link
                      className={`$${
                        currentCategory === cat.category && "font-bold"
                      } hover:underline text-sm`}
                      href={getFilterUrl({ c: cat.category })}
                    >
                      {cat.category}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </div>

          {/* Price links */}
          <div>
            <div className="text-base font-bold mb-3">Price</div>
            <ul className="space-y-2">
              <li>
                <SheetClose asChild>
                  <Link
                    className={`$${
                      (currentPrice === "all" || currentPrice === "") &&
                      "font-bold"
                    } hover:underline text-sm`}
                    href={getFilterUrl({ p: "all" })}
                  >
                    Any
                  </Link>
                </SheetClose>
              </li>
              {prices.map((priceRange) => (
                <li key={priceRange.value}>
                  <SheetClose asChild>
                    <Link
                      className={`$${
                        currentPrice === priceRange.value && "font-bold"
                      } hover:underline text-sm`}
                      href={getFilterUrl({ p: priceRange.value })}
                    >
                      {priceRange.name}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </div>

          {/* Rating links */}
          <div>
            <div className="text-base font-bold mb-3">Rating</div>
            <ul className="space-y-2">
              <li>
                <SheetClose asChild>
                  <Link
                    className={`$${
                      (currentRating === "all" || currentRating === "") &&
                      "font-bold"
                    } hover:underline text-sm`}
                    href={getFilterUrl({ r: "all" })}
                  >
                    Any
                  </Link>
                </SheetClose>
              </li>
              {ratings.map((ratingValue) => (
                <li key={ratingValue}>
                  <SheetClose asChild>
                    <Link
                      className={`$${
                        currentRating === ratingValue.toString() && "font-bold"
                      } hover:underline text-sm`}
                      href={getFilterUrl({ r: ratingValue.toString() })}
                    >
                      {`${ratingValue} stars & up`}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
