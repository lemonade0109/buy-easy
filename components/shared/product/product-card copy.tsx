"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import Rating from "./rating";
import WishlistButton from "./wishlist-button";

const ProductCard = ({
  product,
  isInWishlist,
}: {
  product: Product;
  isInWishlist?: boolean;
}) => {
  return (
    <Card className="w-full max-w-sm group">
      <Link href={`/product/${product.slug}`}>
        <CardHeader className="relative pt-1 px-2">
          <div className="relative mb-2 overflow-hidden rounded-md h-[300px] w-full">
            <Image
              src={product.image[0]}
              fill
              sizes="(max-width:768px) 100vw 50vw"
              alt={product.name}
              className="rounded-md object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div
            className="absolute top-2 right-2 z-10"
            onClick={(e) => e.preventDefault()}
          >
            <WishlistButton
              productId={product.id || ""}
              initialInWishlist={isInWishlist}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 grid gap-4">
          <div className="text-xs">{product.brand}</div>

          <h2 className="text-sm font-semibold">{product.name}</h2>

          <div className="flex-between gap-4">
            <Rating value={Number(product.rating) || 0} />
            {(product.stockCount ?? 0) > 0 ? (
              <ProductPrice value={Number(product.price)} />
            ) : (
              <span className="text-destructive font-medium">Out of Stock</span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
