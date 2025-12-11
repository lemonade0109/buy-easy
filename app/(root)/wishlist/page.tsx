import EmptyList from "@/components/shared/empty-list";
import ProductList from "@/components/shared/product/product-list";
import { getWishlistItems } from "@/lib/actions/wishlists/wishlist";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Wishlist",
};

export default async function WishlistPage() {
  const wishlists = await getWishlistItems();

  if (wishlists.length === 0) return <EmptyList />;

  const formattedWishlists = wishlists.map((item) => ({
    ...item,
    price: item.price.toString(),
    rating: item.rating.toString(),
  }));

  return <ProductList data={formattedWishlists} title="My Wishlist" />;
}
