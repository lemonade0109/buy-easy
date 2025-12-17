import { Skeleton } from "@/components/ui/skeleton";
import ProductCardLoading from "./product-card-loading";
import React from "react";

const SearchLoading = () => {
  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      {/* Sidebar Skeleton for md+ */}
      <div className="hidden md:block filter-links">
        {/* Department Section */}
        <div className="mt-3 mb-2">
          <Skeleton className="h-7 w-32 mb-2" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-24" />
            ))}
          </div>
        </div>

        {/* Price Section */}
        <div className="mt-8 mb-2">
          <Skeleton className="h-7 w-20 mb-2" />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-28" />
            ))}
          </div>
        </div>

        {/* Rating Section */}
        <div className="mt-8 mb-2">
          <Skeleton className="h-7 w-20 mb-2" />
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-28" />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Skeleton */}
      <div className="block md:hidden mb-4">
        <div className="flex gap-2 mb-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex gap-2 mb-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="md:col-span-4 space-y-4 w-full">
        {/* Filter/Sort Bar */}
        <div className="flex flex-col md:flex-row gap-2 my-4">
          <Skeleton className="h-6 w-32 md:w-48" />
          <Skeleton className="h-10 w-32 md:w-40" />
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <ProductCardLoading key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchLoading;
