import TableLoading from "@/components/shared/loading/table-loading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function LoadingPage() {
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-40" />
      </div>
      <TableLoading
        columns={[
          "ID",
          "NAME",
          "PRICE",
          "CATEGORY",
          "STOCK",
          "RATING",
          "ACTIONS",
        ]}
        rowCount={10}
      />
    </div>
  );
}
