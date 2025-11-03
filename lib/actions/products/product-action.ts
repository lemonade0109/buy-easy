"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "@/lib/utils";
import { Product } from "@/types";

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  // Convert Decimal fields to strings to match frontend Product type
  const mapped: Product[] = data.map(
    (p) =>
      ({
        ...p,
        price: p.price.toString(),
        rating: p.rating.toString(),
        // ensure optional numeric fields are concrete values for the frontend
        stockCount: p.stockCount ?? 0,
      } as unknown as Product)
  );

  return convertToPlainObject(mapped);
}

//Get Single Product It's slug
export async function getProductBySlug(slug: string) {
  const p = await prisma.product.findFirst({ where: { slug: slug } });
  if (!p) return null;

  const mapped: Product = {
    ...p,
    price: p.price.toString(),
    rating: p.rating.toString(),
    stockCount: p.stockCount ?? 0,
  } as unknown as Product;

  return mapped;
}
