import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProductCardLoading = () => {
  return (
    <div className="shadow-md rounded-md overflow-hidden w-full max-w-sm">
      {/* Image Skeleton */}
      <Skeleton className="h-[300px] w-full rounded-t-md" />

      {/* Card Content */}
      <div className="p-4 space-y-4">
        {/* Brand */}
        <Skeleton className="h-3 w-16" />

        {/* Product Name */}
        <Skeleton className="h-4 w-full" />

        {/* Rating and Price */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardLoading;
