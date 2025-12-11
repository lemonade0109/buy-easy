"use server";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { renderError } from "@/lib/utils";
import { revalidatePath } from "next/cache";

// Add product to wishlist
export const toggleWishlist = async ({
  productId,
  pathname,
}: {
  productId: string;
  pathname: string;
}) => {
  try {
    const session = await auth();

    const userId = session?.user.id as string;
    if (!userId) {
      return {
        success: false,
        requiresAuth: true,
        message: "You must be signed in to add items to your wishlist",
      };
    }

    // Check if the product is already in the wishlist
    const existingWishlistItem = await prisma.wishlist.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (existingWishlistItem) {
      // If it exists, remove it from the wishlist
      await prisma.wishlist.delete({
        where: { id: existingWishlistItem.id },
      });
    } else {
      // If it doesn't exist, add it to the wishlist
      await prisma.wishlist.create({
        data: {
          userId: userId,
          productId: productId,
        },
      });
    }

    revalidatePath(pathname);
    return {
      success: true,
      inWishlist: !existingWishlistItem ? true : false,
      message: `${!existingWishlistItem ? "Added to wishlist" : "Removed from wishlist"}`,
    };
  } catch (error) {
    return {
      success: false,
      message: renderError(error),
    };
  }
};

// Get Wishlist From DB
export const getWishlistItems = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }

  const userId = session.user.id as string;
  const wishlistItems = await prisma.wishlist.findMany({
    where: { userId },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });
  return wishlistItems.map((item) => item.product);
};

// Check if product is in wishlist
export const isProductInWishlist = async ({
  productId,
}: {
  productId: string;
}) => {
  const session = await auth();
  const userId = session?.user?.id as string;
  if (!userId) {
    return false;
  }

  const existingWishlistItem = await prisma.wishlist.findFirst({
    where: { userId, productId },
    select: { id: true },
  });

  return !!existingWishlistItem;
};
