import React from "react";

import { APP_DESCRIPTION } from "@/lib/constants";

import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/products/product-action";

export const metadata = {
  title: "Home",
  description: `${APP_DESCRIPTION}`,
};

export default async function Homepage() {
  const latestProducts = await getLatestProducts();
  return (
    <div className="">
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
    </div>
  );
}
