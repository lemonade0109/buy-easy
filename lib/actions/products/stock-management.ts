"use server";

import { prisma } from "@/db/prisma";
import { renderError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

// Check if product is in stock
export const checkProductStock = async (
  productId: string,
  quantity: number = 1
) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { stockCount: true, name: true },
    });

    if (!product) {
      return {
        available: false,
        message: "Product not found",
        stockCount: 0,
      };
    }

    return {
      available: product.stockCount >= quantity,
      message:
        product.stockCount >= quantity
          ? "In stock"
          : `Only ${product.stockCount} available`,
      stockCount: product.stockCount,
    };
  } catch (error) {
    return {
      available: false,
      message: renderError(error),
      stockCount: 0,
    };
  }
};

// Get low stock products (for admin dashboard)
export const getLowStockProducts = async (threshold: number = 10) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        stockCount: {
          lte: threshold,
          gt: 0,
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        stockCount: true,
        price: true,
        image: true,
      },
      orderBy: {
        stockCount: "asc",
      },
    });

    return {
      success: true,
      products: products.map((p) => ({
        ...p,
        price: p.price.toString(),
      })),
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error),
      products: [],
    };
  }
};

// Get out of stock products (for admin dashboard)
export const getOutOfStockProducts = async () => {
  try {
    const products = await prisma.product.findMany({
      where: {
        stockCount: 0,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        stockCount: true,
        price: true,
        image: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return {
      success: true,
      products: products.map((p) => ({
        ...p,
        price: p.price.toString(),
      })),
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error),
      products: [],
    };
  }
};

// Bulk update stock (for admin)
export const updateProductStock = async (
  productId: string,
  stockCount: number
) => {
  try {
    if (stockCount < 0) {
      throw new Error("Stock count cannot be negative");
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: { stockCount },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/product/${product.slug}`);

    return {
      success: true,
      message: "Stock updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error),
    };
  }
};

// Get stock history/analytics (could be enhanced with a StockHistory table)
export const getStockStats = async () => {
  try {
    const totalProducts = await prisma.product.count();
    const outOfStock = await prisma.product.count({
      where: { stockCount: 0 },
    });
    const lowStock = await prisma.product.count({
      where: {
        stockCount: {
          lte: 10,
          gt: 0,
        },
      },
    });
    const inStock = await prisma.product.count({
      where: {
        stockCount: {
          gt: 10,
        },
      },
    });

    return {
      success: true,
      stats: {
        totalProducts,
        outOfStock,
        lowStock,
        inStock,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error),
      stats: null,
    };
  }
};
