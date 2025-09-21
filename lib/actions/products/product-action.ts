"use server";

import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "@/lib/utils";

export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: 4,
    orderBy: { createdAt: "desc" },
  });
  return convertToPlainObject(data);
}

//Get Single Product It's slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
