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
import { Prisma } from "@prisma/client";
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
      }) as unknown as Product
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
  price,
  rating,
  sort,
}: {
  query?: string;
  limit?: number;
  page: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) => {
  const queryFilter: Prisma.ProductWhereInput = {};

  // Text search filter
  if (query && query !== "all" && query.trim() !== "") {
    queryFilter.name = {
      contains: query,
      mode: "insensitive",
    };
  }

  // Category filter
  if (category && category !== "all" && category.trim() !== "") {
    queryFilter.category = {
      equals: category,
      mode: "insensitive",
    };
  }

  // Price filter
  if (price && price !== "all" && price.trim() !== "") {
    const priceRange = price.split("-");
    if (priceRange.length === 2) {
      queryFilter.price = {
        gte: parseFloat(priceRange[0]),
        lte: parseFloat(priceRange[1]),
      };
    }
  }

  // Rating filter
  if (rating && rating !== "all" && rating.trim() !== "") {
    queryFilter.rating = {
      gte: parseFloat(rating),
    };
  }

  // Sort options
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (sort) {
    switch (sort) {
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "price-low-to-high":
        orderBy = { price: "asc" };
        break;
      case "price-high-to-low":
        orderBy = { price: "desc" };
        break;
      case "rating-high-to-low":
        orderBy = { rating: "desc" };
        break;
      case "name-a-to-z":
        orderBy = { name: "asc" };
        break;
      case "name-z-to-a":
        orderBy = { name: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }
  }

  const data = await prisma.product.findMany({
    where: queryFilter,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  // Get count with the same filters for accurate pagination
  const dataCount = await prisma.product.count({
    where: queryFilter,
  });

  // Convert Decimal fields to strings to match frontend Product type
  const mapped: Product[] = data.map(
    (p) =>
      ({
        ...p,
        price: p.price.toString(),
        rating: p.rating.toString(),
        stockCount: p.stockCount ?? 0,
      }) as unknown as Product
  );

  return {
    data: convertToPlainObject(mapped),
    totalPages: Math.ceil(dataCount / limit),
  };
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
    // Check for unique constraint violation on slug
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint failed on the fields: (`slug`)")
    ) {
      return {
        success: false,
        message: {
          message:
            "A product with this slug already exists. Please use a different slug or modify the product name.",
        },
      };
    }
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
    // Check for unique constraint violation on slug
    if (
      error instanceof Error &&
      error.message.includes("Unique constraint failed on the fields: (`slug`)")
    ) {
      return {
        success: false,
        message: {
          message:
            "A product with this slug already exists. Please use a different slug.",
        },
      };
    }
    return {
      success: false,
      message: renderError(error),
    };
  }
};

// Get all categories
export const getAllCategories = async () => {
  const data = await prisma.product.groupBy({
    by: ["category"],
    _count: true,
  });

  return data.map((item) => ({
    category: item.category,
    _count: item._count,
  }));
};

// Get featured products
export const getFeaturedProducts = async () => {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
  return convertToPlainObject(data);
};
