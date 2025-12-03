import React from "react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductPrice from "./product-price";
import { Product } from "@/types";
import Rating from "./rating";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="w-full max-w-sm group ">
      <Link href={`/product/${product.slug}`}>
        <CardHeader>
          <div className="relative mb-2 overflow-hidden rounded-md h-[300px]">
            <Image
              src={product.image[0]}
              fill
              sizes="(max-width:768px) 100vw 50vw"
              alt={product.name}
              className="rounded-md object-cover transform group-hover:scale-110 transition-transform duration-500"
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
