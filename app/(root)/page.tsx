import React from "react";

import { APP_DESCRIPTION } from "@/lib/constants";

import ProductList from "@/components/shared/product/product-list";
import {
  getLatestProducts,
  getFeaturedProducts,
} from "@/lib/actions/products/product-action";
import ProductCarousel from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";

export const metadata = {
  title: "Home",
  description: `${APP_DESCRIPTION}`,
};

export default async function Homepage() {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  // Format price and rating as strings
  const formattedFeaturedProducts = featuredProducts.map((product) => ({
    ...product,
    price: product.price.toString(),
    rating: product.rating.toString(),
  }));

  return (
    <div className="">
      {featuredProducts.length > 0 && (
        <ProductCarousel data={formattedFeaturedProducts} />
      )}
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />

      <ViewAllProductsButton />
    </div>
  );
}
