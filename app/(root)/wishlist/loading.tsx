import ProductCardLoading from "@/components/shared/loading/product-card-loading";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function LoadingPage() {
  return (
    <div className="my-10">
      {/* Title */}
      <Skeleton className="h-8 w-48 mb-4" />

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductCardLoading key={i} />
        ))}
      </div>
    </div>
  );
}
