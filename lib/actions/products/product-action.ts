"use server";

import { prisma } from "@/db/prisma";
import { ORDER_ITEMS_PER_PAGE } from "@/lib/constants";
import { convertToPlainObject, renderError } from "@/lib/utils";
import {
  productSchema,
  updateProductSchema,
  validateWithZodSchema,
} from "@/lib/validator";
import { Product } from "@/types";
import { revalidatePath } from "next/cache";
import z from "zod";

export const getLatestProducts = async () => {
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
};

//Get Single Product It's slug
export const getProductBySlug = async (slug: string) => {
  const p = await prisma.product.findFirst({ where: { slug: slug } });
  if (!p) return null;

  const mapped: Product = {
    ...p,
    price: p.price.toString(),
    rating: p.rating.toString(),
    stockCount: p.stockCount ?? 0,
  } as unknown as Product;

  return mapped;
};

// Get Single Product by ID
export const getProductById = async (productId: string) => {
  const p = await prisma.product.findFirst({ where: { id: productId } });
  if (!p) return null;

  const mapped: Product = {
    ...p,
    price: p.price.toString(),
    rating: p.rating.toString(),
    stockCount: p.stockCount ?? 0,
  } as unknown as Product;

  return convertToPlainObject(mapped);
};

// Get All Products
export const getAllProducts = async ({
  query,
  limit = ORDER_ITEMS_PER_PAGE,
  page,
  category,
}: {
  query?: string;
  limit?: number;
  page: number;
  category?: string;
}) => {
  const data = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count();

  return { data, totalPages: Math.ceil(dataCount / limit) };
};

// Delete a product
export const deleteProduct = async (id: string) => {
  try {
    const productExists = await prisma.product.findFirst({ where: { id } });
    if (!productExists) throw new Error("Product not found");

    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");

    return {
      success: true,
      message: { message: "Product deleted successfully" },
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error),
    };
  }
};

// Create a new product

export const createProduct = async (data: Product) => {
  try {
    const validatedProduct = validateWithZodSchema(productSchema, data);

    await prisma.product.create({ data: validatedProduct });
    revalidatePath("/admin/products");
    return {
      success: true,
      message: { message: "Product created successfully" },
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error),
    };
  }
};

// update a product
export const updateProduct = async (
  data: z.infer<typeof updateProductSchema>
) => {
  try {
    const validatedProduct = validateWithZodSchema(updateProductSchema, data);
    const productExists = await prisma.product.findFirst({
      where: { id: validatedProduct.id },
    });

    if (!productExists) throw new Error("Product not found");

    await prisma.product.update({
      where: { id: validatedProduct.id },
      data: validatedProduct,
    });

    revalidatePath("/admin/products");
    return {
      success: true,
      message: { message: "Product updated successfully" },
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error),
    };
  }
};
