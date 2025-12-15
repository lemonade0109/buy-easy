import React from "react";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import Rating from "./rating";
import WishlistButton from "./wishlist-button";
import { isProductInWishlist } from "@/lib/actions/wishlists/wishlist";
import StockBadge from "./stock-badge";

const ProductCard = async ({ product }: { product: Product }) => {
  const isInWishlist = await isProductInWishlist({
    productId: product.id || "",
  });
  return (
    <article className="group relative shadow-md hover:shadow-lg transition-shadow duration-300 rounded-md overflow-hidden w-full max-w-sm">
      <Link href={`/product/${product.slug}`}>
        <div className="relative mb-2 overflow-hidden rounded-t-md h-[300px]">
          <Image
            src={product.image[0]}
            fill
            sizes="(max-width:768px) 100vw 50vw"
            alt={product.name}
            className="object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div className="p-4 flex flex-col gap-4">
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

          <StockBadge stockCount={product.stockCount ?? 0} />
        </div>
      </Link>

      <div className="absolute top-5 right-5 z-5">
        <WishlistButton
          productId={product.id || ""}
          initialInWishlist={isInWishlist}
        />
      </div>
    </article>
  );
};

export default ProductCard;
