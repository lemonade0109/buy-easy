import TableLoading from "@/components/shared/loading/table-loading";
import React from "react";

export default function LoadingPage() {
  return (
    <TableLoading
      title="Orders"
      columns={["ID", "DATE", "TOTAL", "PAID", "DELIVERED", "ACTIONS"]}
      rowCount={5}
    />
  );
}
