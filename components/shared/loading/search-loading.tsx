import { Skeleton } from "@/components/ui/skeleton";
import ProductCardLoading from "./product-card-loading";
import React from "react";

const SearchLoading = () => {
  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      {/* Sidebar Skeleton */}
      <div className="filter-links">
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

      {/* Main Content Skeleton */}
      <div className="md:col-span-4 space-y-4">
        {/* Filter/Sort Bar */}
        <div className="flex-between flex-col md:flex-row my-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <ProductCardLoading key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchLoading;
