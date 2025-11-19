"use client";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { Input } from "../ui/input";

const AdminSearch = () => {
  const pathname = usePathname();
  const formActionUrl = pathname.includes("/admin/orders")
    ? "/admin/orders"
    : pathname.includes("/admin/users")
    ? "/admin/users"
    : "/admin/products";

  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = React.useState(
    searchParams.get("query") || ""
  );

  React.useEffect(() => {
    setQueryValue(searchParams.get("query") || "");
  }, [searchParams]);

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        placeholder="Search..."
        className="md:w[100px] lg:w-[300px]"
      />

      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  );
};

export default AdminSearch;
