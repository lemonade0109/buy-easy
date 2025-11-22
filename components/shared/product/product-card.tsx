import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import Rating from "./rating";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.image[0]}
            alt={product.name}
            width={300}
            height={300}
            priority={true}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs">{product.brand}</div>

        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-semibold">{product.name}</h2>
        </Link>

        <div className="flex-between gap-4">
          <Rating value={Number(product.rating) || 0} />
          {(product.stockCount ?? 0) > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <span className="text-destructive font-medium">Out of Stock</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
