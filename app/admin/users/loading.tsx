import TableLoading from "@/components/shared/loading/table-loading";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function LoadingPage() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-8 w-32" />
      <TableLoading
        columns={["ID", "NAME", "EMAIL", "ROLE", "ACTIONS"]}
        rowCount={10}
      />
    </div>
  );
}
